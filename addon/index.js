import EmberObject, { computed, get } from '@ember/object';
import { getOwner } from '@ember/application';
import { copy } from '@ember/object/internals';
import { _cleanupOnDestroy } from 'ember-concerns/utils';
const { assign } = Object;

export function inject(name = null, options = {}) {
  options = assign(
    {
      dependsOn: [],
      model: null
    },
    options
  );

  // If a property, add model name to list of properties to depend on.
  if (typeof options.model === 'string') {
    if (!options.dependsOn.includes(options.model)) {
      options.dependsOn.push(options.model);
    }
  }

  let computedProperty = {
    get(propertyName) {
      let getName = name || propertyName;

      let owner = getOwner(this);
      let factory = owner.factoryFor(`concern:${getName}`);

      if (!factory) {
        return factory;
      }

      let model = this;

      if (typeof options.model === 'string') {
        model = get(this, options.model);
      }

      let concern = factory.create({ model });
      return concern;
    }
  };

  let computedArgs = copy(options.dependsOn);
  computedArgs.push(computedProperty);

  return computed(...computedArgs);
}

const Concern = EmberObject.extend({
  init({ model }) {
    this._super(...arguments);
    _cleanupOnDestroy(model, this, 'destroy', 'the object it lives on was destroyed or unrendered');
  }
});

export default Concern;
