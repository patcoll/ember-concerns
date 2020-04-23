import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
const { keys } = Object;

const SEPARATOR = '__';

export function guidForConcern({ name, model }) {
  return [name, guidFor(model)].join(SEPARATOR);
}

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

export function getConcernFactory(parent, name) {
  let owner = getOwner(parent) || parent.container;
  assert('An owner is necessary to create a concern instance', owner);

  let factory = owner.factoryFor(`concern:${name}`);
  assert(`A concern with name '${name}' was not found`, factory);

  return factory;
}

export function getPropertyNames(model) {
  if (typeOf(model.eachAttribute) === 'function') {
    let keys = [];
    model.eachAttribute(key => keys.push(key));
    return keys;
  }

  return keys(model);
}

// Taken from `@ember/-internals/metal`.
export function isElementDescriptor(args) {
  let [maybeTarget, maybeKey, maybeDesc] = args;
  return (// Ensure we have the right number of args
    args.length === 3 && ( // Make sure the target is a class or object (prototype)
    typeof maybeTarget === 'function' || typeof maybeTarget === 'object' && maybeTarget !== null) && // Make sure the key is a string
    typeof maybeKey === 'string' && ( // Make sure the descriptor is the right shape
    typeof maybeDesc === 'object' && maybeDesc !== null && 'enumerable' in maybeDesc && 'configurable' in maybeDesc || // TS compatibility
    maybeDesc === undefined)
  );
}

