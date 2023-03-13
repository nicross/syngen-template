/**
 * An example v1.1.1 update.
 *
 * Occasionally the save format may change between app versions.
 * This provides a simple mechanism to migrate existing saves to a specific version.
 *
 * Updates are executed when the app version does not exist within the set of versioned saves.
 * They execute in order by semantic version, from the best-last storage version, until compatible with the app version.
 *
 * The typical update will...
 * - Get somethings from storage
 * - Migrate to the current version
 * - Set the migrated somethings to storage
 */

/*
app.updates.register('1.1.1', () => {
  migrateSomething()

  function migrateSomething() {
    const something = app.storage.get('something')

    // TODO: Migrate something

    app.storage.set('something', something)
  }
})
*/
