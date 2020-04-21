/* eslint-disable ember/no-observers */
import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { _cleanupOnDestroy, getConcernFactory } from 'ember-concerns/utils';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';
import { registerDisposable, runDisposables } from 'ember-lifeline';
import { addObserver, removeObserver } from '@ember/object/observers';

const TRACK_PROPERTIES = false;

export function inject(explicitName = null) {
  let computedProperty = {
    get(propertyName) {
      let name = explicitName || propertyName;
      let model = this;
      let factory = getConcernFactory(model, name);

      let concern = factory.create({ model });
      return concern;
    }
  };

  return computed(computedProperty);
}

class Concern {
  // Will be used when properties need to be tracked manually.
  // dependsOn;

  @tracked model;

  static create() {
    return new this(...arguments);
  }

  constructor({ model }) {
    assert('Concern needs an Ember object as model', model.willDestroy);

    this.model = model;

    if (TRACK_PROPERTIES) {
      next(() => {
        if (model.isDestroyed) {
          return;
        }

        let properties = Array(this.dependsOn).filter(Boolean).flat();

        for (let property of properties) {
          addObserver(model, property, this, 'setModel');
          registerDisposable(this, () => removeObserver(model, property, this, 'setModel'));
        }
      });
    }

    _cleanupOnDestroy(this.model, this, 'destroy', 'the object it lives on was destroyed or unrendered');
  }

  setModel() {
    if (TRACK_PROPERTIES) {
      /* eslint-disable-next-line no-self-assign */
      this.model = this.model;
    }
  }

  destroy() {
    if (TRACK_PROPERTIES) {
      runDisposables(this);
    }
  }
}

export default Concern;
