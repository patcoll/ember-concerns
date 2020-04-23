import { computed } from '@ember/object';
import { _cleanupOnDestroy, getConcernFactory, isElementDescriptor } from 'ember-concerns/utils';
import { assert } from '@ember/debug';

export function inject(...args) {
  let calledAsDecorator = isElementDescriptor(args);
  let explicitName = calledAsDecorator ? undefined : args[0];

  let computedProperty = {
    get(propertyName) {
      let name = explicitName || propertyName;
      let model = this;
      let factory = getConcernFactory(model, name);

      let concern = factory.create({ model });
      return concern;
    }
  };

  let decorator = computed(computedProperty);

  if (calledAsDecorator) {
    return decorator(args[0], args[1], args[2]);
  } else {
    return decorator;
  }
}

class Concern {
  model;

  static create() {
    return new this(...arguments);
  }

  constructor({ model }) {
    assert('Concern needs an Ember object as model', model.willDestroy);

    this.model = model;

    _cleanupOnDestroy(this.model, this, 'destroy', 'the object it lives on was destroyed or unrendered');
  }

  destroy() {}
}

export default Concern;
