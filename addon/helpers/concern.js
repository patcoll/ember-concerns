/* eslint-disable ember/no-classic-classes */
import Helper from '@ember/component/helper';
import { registerDisposable, runDisposables } from 'ember-lifeline';
import { getConcernFactory, guidForConcern } from 'ember-concerns/utils';
import { assert } from '@ember/debug';

export default Helper.extend({
  concernFor({ name, model }) {
    let factory = getConcernFactory(model, name);
    return this.createConcern({ factory, name, model });
  },

  createConcern({ factory, name, model }) {
    let concern = factory.create({ model });
    incrementCountFor({ name, model });

    registerDisposable(this, () => {
      concern.destroy();
      decrementCountFor({ name, model });
    });

    return concern;
  },

  compute([name, model]) {
    assert(
      `A concern must be a string but you passed ${typeof name}`,
      typeof name === 'string'
    );

    assert(
      `A concern must be an object but you passed ${typeof model}`,
      typeof model === 'object'
    );

    let context = { name, model };

    let concern = this.concernFor(context);

    return concern;
  },

  willDestroy() {
    runDisposables(this);
  },
});

let COUNT = {};

export function countFor({ name, model }) {
  let guid = guidForConcern({ name, model });
  return COUNT[guid] || 0;
}

function incrementCountFor({ name, model }) {
  let guid = guidForConcern({ name, model });

  if (!COUNT[guid]) {
    COUNT[guid] = 0;
  }

  COUNT[guid]++;
}

function decrementCountFor({ name, model }) {
  let guid = guidForConcern({ name, model });

  COUNT[guid]--;
}
