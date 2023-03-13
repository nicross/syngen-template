app.storage.api = (() => {
  const dbStoreName = 'data',
    dbVersion = 1,
    debounceHandlers = {},
    isSupported = 'indexedDB' in window,
    proxy = {},
    ready = open()

  let db

  function deleteDb(version, key) {
    db.transaction([dbStoreName], 'readwrite').objectStore(dbStoreName).delete([version, key])
  }

  function deleteFn(version, key) {
    delete proxy[version][key]

    if (!isSupported) {
      return
    }

    deleteDbDebounced(version, key)
  }

  function deleteDbDebounced(version, key) {
    if (!debounceHandlers[version]) {
      debounceHandlers[version] = {}
    }

    clearTimeout(debounceHandlers[version][key])

    debounceHandlers[version][key] = setTimeout(() => {
      deleteDb(version, key)
    }, 0)
  }

  function get(version, key) {
    return key ? proxy[version][key] : proxy[version]
  }

  function open() {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        return resolve()
      }

      const dbName = app.name(),
        request = indexedDB.open(dbName, dbVersion)

      request.onerror = reject

      request.onsuccess = async () => {
        db = request.result
        await populate()
        resolve()
      }

      request.onupgradeneeded = () => {
        request.result.createObjectStore(dbStoreName, {
          keyPath: ['version', 'key'],
        })
      }
    })
  }

  function populate() {
    if (!isSupported) {
      return
    }

    return new Promise((resolve, reject) => {
      const request = db.transaction([dbStoreName]).objectStore(dbStoreName).getAll()

      request.onerror = reject

      request.onsuccess = () => {
        const results = request.result

        for (const {data, key, version} of results) {
          if (!proxy[version]) {
            proxy[version] = {}
          }

          proxy[version][key] = data
        }

        resolve()
      }
    })
  }

  function set(version, key, data) {
    if (!proxy[version]) {
      proxy[version] = {}
    }

    proxy[version][key] = data

    if (!isSupported) {
      return
    }

    setDbDebounced(version, key, data)
  }

  function setDb(version, key, data) {
    const item = {
      data,
      key,
      version,
    }

    db.transaction([dbStoreName], 'readwrite').objectStore(dbStoreName).put(item)
  }

  function setDbDebounced(version, key, data) {
    if (!debounceHandlers[version]) {
      debounceHandlers[version] = {}
    }

    clearTimeout(debounceHandlers[version][key])

    debounceHandlers[version][key] = setTimeout(() => {
      setDb(version, key, data)
    }, 0)
  }

  return {
    delete: (version, key) => {
      deleteFn(version, key)
      return this
    },
    get: (version, key) => {
      return get(version, key)
    },
    ready: () => ready,
    set: (version, key, value) => {
      set(version, key, value)
      return this
    },
    versions: () => [...Object.keys(proxy)],
  }
})()
