/**
 * An example setting for a toggle.
 *
 * The settings system provides a simple interface for registering, getting, and updating user preferences.
 * Settings are pairs of keys and their stored raw values.
 * Raw values are processed with a compute function, if provided, when retrieved from storage or updated.
 * Settings should provide a default value for first-time users.
 *
 * When a setting `fooBar` is registered, it becomes available in the following ways:
 * - `app.settings.computed.fooBar` - The current computed value of `fooBar`.
 * - `app.settings.defaults.fooBar` - The default value of `fooBar`.
 * - `app.settings.raw.fooBar` - The current raw value of `fooBar`.
 * - `app.settings.setFooBar(rawValue)` - The setter for `fooBar`, which accepts a `rawValue`.
 * - `const {fooBar} = app.storage.get('settings')` - The persisted raw value of `fooBar`, e.g. for updates.
 *
 * Beware that `app.settings.save()` must be called to persist changes to storage.
 */

/*
app.settings.register('example', {
  compute: (rawValue) => Boolean(rawValue),
  default: true,
  update: function (computedValue) {
    // TODO: Do something with computedValue, if needed
  },
})
*/
