import { getOwner } from '@ember/application';
import { computed, setProperties } from '@ember/object';
import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
const { keys } = Object;

export default Helper.extend({
  init() {
    this._super(...arguments);

    this.name = null;
    this.concerns = {};
  },

  concern: computed('name', 'model', function() {
    let { name, model } = this;

    if (!this.concerns[name]) {
      let owner = getOwner(this);
      let factory = owner.factoryFor(`concern:${name}`);

      assert(`A concern with name '${name}' was not found`, !!factory);

      this.concerns[name] = factory.create({ model });
    }

    return this.concerns[name];
  }),

  compute([name, model], props) {
    assert(
      `A concern must be a string but you passed ${typeof name}`,
      typeof name === 'string'
    );

    assert(
      `A concern must be an object but you passed ${typeof model}`,
      typeof model === 'object'
    );

    this.name = name;
    this.model = model;

    setProperties(this, { name, model }, props);

    let { concern } = this;

    return concern;
  },

  willDestroy() {
    keys(this.concerns).forEach(key => {
      let concern = this.concerns[key];
      if (concern && concern.destroy) {
        concern.destroy();
      }
    });
  }
});
