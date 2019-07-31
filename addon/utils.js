// Taken from `ember-concurrency`.
export function _cleanupOnDestroy(owner, object, cleanupMethodName, ...args) {
  // TODO: find a non-mutate-y, non-hacky way of doing this.

  if (!owner.willDestroy)
  {
    // we're running in non Ember object (possibly in a test mock)
    return;
  }

  if (!owner.willDestroy.__ember_processes_destroyers__) {
    let oldWillDestroy = owner.willDestroy;
    let disposers = [];

    owner.willDestroy = function() {
      for (let i = 0, l = disposers.length; i < l; i ++) {
        disposers[i]();
      }
      oldWillDestroy.apply(owner, arguments);
    };
    owner.willDestroy.__ember_processes_destroyers__ = disposers;
  }

  owner.willDestroy.__ember_processes_destroyers__.push(() => {
    object[cleanupMethodName](...args);
  });
}
