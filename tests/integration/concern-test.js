import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | concern', function (hooks) {
  setupRenderingTest(hooks);

  test('basic computed property usage works as expected', async function (assert) {
    let model = this.owner.factoryFor('object:basic-with-concern').create({
      title: 'basic with concern',
    });

    this.set('model', model);

    await render(hbs`
        <div data-test-pretty-title>{{this.model.test.prettyTitle}}</div>
      `);

    assert.dom('[data-test-pretty-title]').hasText('BASIC WITH CONCERN');

    model.set('title', 'hi there');
    await settled();

    assert.dom('[data-test-pretty-title]').hasText('HI THERE');
  });

  test('computed property usage with model works as expected', async function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('basic', { title: 'initialized' });

    this.set('model', model);

    await render(hbs`
        <div data-test-pretty-title>{{this.model.test.prettyTitle}}</div>
      `);

    assert.dom('[data-test-pretty-title]').hasText('INITIALIZED');

    model.set('title', 'hi there');
    await settled();

    assert.dom('[data-test-pretty-title]').hasText('HI THERE');
  });
});
