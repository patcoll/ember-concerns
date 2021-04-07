import * as utils from 'ember-concerns/utils';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | Utility | utils', function () {
  module('_cleanupOnDestroy', function () {
    test('it exists', function (assert) {
      assert.ok(typeof utils._cleanupOnDestroy === 'function');
    });
  });

  module('getConcernFactory', function (hooks) {
    setupTest(hooks);

    test('should throw when owner not found', function (assert) {
      let obj = EmberObject.create();
      assert.throws(() => {
        utils.getConcernFactory(obj, 'bogusxyz');
      }, /An owner is necessary/);
    });

    test('should throw when concern not found', function (assert) {
      let obj = EmberObject.create(this.owner.ownerInjection());
      assert.throws(() => {
        utils.getConcernFactory(obj, 'bogusxyz');
      }, /was not found/);
    });

    test('basic usage works as expected', function (assert) {
      let obj = EmberObject.create(this.owner.ownerInjection());
      let concern = utils.getConcernFactory(obj, 'test');
      assert.ok(concern, 'concern should be found and initialized');
    });
  });

  module('getPropertyNames', function () {
    test('it exists', function (assert) {
      assert.ok(typeof utils.getPropertyNames === 'function');
    });
  });
});
