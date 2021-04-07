import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helpers | concern-action', function (hooks) {
  setupRenderingTest(hooks);

  test('it provides correct context', async function (assert) {
    let model = this.owner.factoryFor('object:key-value').create();

    this.set('model', model);

    await render(hbs`
        <div
          data-test-value
        >{{this.model.key}}</div>

        <button
          type="button"
          data-test-action
          {{on "click" (concern-action this.model.keyValue.testAction)}}
        ></button>

        <button
          type="button"
          data-test-newer-action
          {{on "click" this.model.keyValue.testNewerAction}}
        ></button>
      `);

    assert.dom('[data-test-value]').hasText('original value');

    await click('[data-test-action]');

    assert.dom('[data-test-value]').hasText('new value');

    await click('[data-test-newer-action]');

    assert.dom('[data-test-value]').hasText('newer value');
  });
});
