import { settled } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import BasicObject from 'dummy/objects/basic';
import TestConcern from 'dummy/concerns/test';
import sinon from 'sinon';

module('Unit | Concern', function(hooks) {
  setupTest(hooks);

  module('with class usage', function() {
    test('basic Ember object factory usage works as expected', function(assert) {
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

    test('basic Ember object class usage works as expected', function(assert) {
      let model = this.owner
        .factoryFor('object:basic-class')
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

  module('with inject usage', function() {
    test('works with Ember object factory', function(assert) {
      let factory = this.owner.factoryFor('object:basic-with-concern');
      let title = 'hello';
      let model = factory.create({ title });

      assert.ok(model.store, 'injected service is there');

      assert.ok(model.test, 'injected concern is there');
      assert.equal(model.test.prettyTitle, 'HELLO', 'concern works');

      assert.ok(model.test.test, 'injected service on concern is there');
      assert.ok(model.test.test.key, 'value', 'can do basic operation on injected service on concern');
    });

    test('works with Ember object class', function(assert) {
      let factory = this.owner.factoryFor('object:basic-class-with-concern');
      let title = 'hello';
      let model = factory.create({ title });

      assert.ok(model.store, 'injected service is there');

      assert.ok(model.test, 'injected concern is there');
      assert.equal(model.test.prettyTitle, 'HELLO', 'concern works');

      assert.ok(model.test.test, 'injected service on concern is there');
      assert.ok(model.test.test.key, 'value', 'can do basic operation on injected service on concern');
    });
  });
});
