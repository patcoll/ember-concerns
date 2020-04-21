import EmberObject from '@ember/object';
import { click, render, settled } from '@ember/test-helpers';
import { setupTest, setupRenderingTest } from 'ember-qunit';
import { inject as concern } from 'ember-concerns';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import BasicObject from 'dummy/objects/basic';
import TestConcern from 'dummy/concerns/test';
import { countFor } from 'ember-concerns/helpers/concern';
import sinon from 'sinon';

module('Unit | Concern', function() {
  module('with class usage', function(hooks) {
    setupTest(hooks);

    test('basic usage works as expected', function(assert) {
      let model = this.owner
        .factoryFor('object:basic')
        .create();

      let concern = this.owner
        .factoryFor('concern:test')
        .create({ model });

      assert.notOk(concern.prettyTitle);

      model.set('title', 'hello there');

      assert.equal(concern.prettyTitle, 'HELLO THERE');
    });

    test('basic class usage works as expected', function(assert) {
      let model = this.owner
        .factoryFor('object:basic')
        .create();

      let concern = this.owner
        .factoryFor('concern:test')
        .create({ model });

      assert.notOk(concern.prettyTitle);

      model.set('title', 'hello there');

      assert.equal(concern.prettyTitle, 'HELLO THERE');
    });

    test('usage with Ember Data model works as expected', function(assert) {
      let store = this.owner.lookup('service:store');
      let model = store.createRecord('basic', { title: 'initialized' });

      let concern = this.owner
        .factoryFor('concern:test')
        .create({ model });

      assert.equal(concern.prettyTitle, 'INITIALIZED');

      model.set('title', 'hello there');

      assert.equal(concern.prettyTitle, 'HELLO THERE');
    });

    test('cleans up concern if model is destroyed', async function(assert) {
      let modelSpy = sinon.spy();
      let concernSpy = sinon.spy();

      this.owner.register('object:basic', BasicObject.extend({
        willDestroy: modelSpy
      }));

      let model = this.owner
        .factoryFor('object:basic')
        .create();

      this.owner.register('concern:test', class extends TestConcern {
        destroy = concernSpy;
      });

      this.owner
        .factoryFor('concern:test')
        .create({ model });

      model.destroy();
      await settled();

      assert.ok(modelSpy.called, 'modelSpy was called');
      assert.ok(concernSpy.called, 'concernSpy was called');
    });
  });

  module('with inject usage', function(hooks) {
    setupTest(hooks);

    test('basic inject usage works as expected with plain Ember object', function(assert) {
      this.owner.register('model:basic', EmberObject.extend({
        title: 'hello',
        test: concern(),
      }));

      let factory = this.owner.factoryFor('model:basic');
      let model = factory.create();

      assert.ok(model.test, 'concern is there');
      assert.equal(model.test.prettyTitle, 'HELLO', 'concern works');
    });
  });

  module('with template usage', function(hooks) {
    setupRenderingTest(hooks);

    test('basic computed property usage works as expected', async function(assert) {
      let model = this.owner
        .factoryFor('object:basic-with-concern')
        .create({
          title: 'basic with concern',
        });

      this.set('model', model);

      await render(hbs`
        <div data-test-pretty-title>{{this.model.test.prettyTitle}}</div>
      `);

      assert
        .dom('[data-test-pretty-title]')
        .hasText('BASIC WITH CONCERN');

      model.set('title', 'hi there');
      await settled();

      assert
        .dom('[data-test-pretty-title]')
        .hasText('HI THERE');
    });

    test('basic concern helper usage works as expected', async function(assert) {
      let model = this.owner
        .factoryFor('object:basic')
        .create({
          title: 'hello there',
        });

      this.set('model', model);

      await render(hbs`
        {{#with (concern 'test' this.model) as |test|}}
          <div data-test-pretty-title>{{test.prettyTitle}}</div>
        {{/with}}
      `);

      assert
        .dom('[data-test-pretty-title]')
        .hasText('HELLO THERE');

      model.set('title', 'hi there');
      await settled();

      assert
        .dom('[data-test-pretty-title]')
        .hasText('HI THERE');

      model.set('title', 'hi again');
      await settled();

      assert
        .dom('[data-test-pretty-title]')
        .hasText('HI AGAIN');
    });

    test('concern helper cleans up after itself if template is destroyed', async function(assert) {
      let model = this.owner
        .factoryFor('object:basic')
        .create({
          title: 'hello there',
        });

      this.set('show', true);
      this.set('model', model);

      assert.equal(countFor({ name: 'test', model }), 0);

      await render(hbs`
        <div>
          {{get (concern 'test' this.model) "prettyTitle"}}
        </div>

        {{#if this.show}}
          {{#with (concern 'test' this.model) as |test|}}
            <div data-test-pretty-title>{{test.prettyTitle}}</div>
          {{/with}}
        {{/if}}
      `);

      assert.equal(countFor({ name: 'test', model }), 2);

      this.set('show', false);
      await settled();

      assert.equal(countFor({ name: 'test', model }), 1);
    });

    test('concern-action provides correct context', async function(assert) {
      let model = this.owner
        .factoryFor('object:key-value')
        .create();

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

      assert
        .dom('[data-test-value]')
        .hasText('original value');

      await click('[data-test-action]');

      assert
        .dom('[data-test-value]')
        .hasText('new value');

      await click('[data-test-newer-action]');

      assert
        .dom('[data-test-value]')
        .hasText('newer value');
    });
  });
});
