import EmberObject, { computed } from '@ember/object';
import { settled } from '@ember/test-helpers';
import Concern from 'ember-concerns';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Concern', function() {
  test('basic usage works as expected', function(assert) {
    let model = EmberObject.create();

    let concern = Concern.extend({
      prettyTitle: computed('model.title', function() {
        return this.model.title && this.model.title.toUpperCase();
      }),
    }).create({
      model,
    });

    assert.notOk(concern.get('prettyTitle'));

    model.set('title', 'hello there');

    assert.equal(concern.get('prettyTitle'), 'HELLO THERE');
  });

  test('cleans up concern if model is destroyed', async function(assert) {
    let modelSpy = sinon.spy();
    let concernSpy = sinon.spy();

    let model = EmberObject.extend({
      willDestroy: modelSpy,
    }).create();

    Concern.extend({
      willDestroy: concernSpy,
    }).create({ model });

    model.destroy();
    await settled();

    assert.ok(modelSpy.called, 'modelSpy was called');
    assert.ok(concernSpy.called, 'concernSpy was called');
  });
});
