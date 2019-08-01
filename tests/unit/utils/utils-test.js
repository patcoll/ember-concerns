import * as utils from 'ember-concerns/utils';
import { module, test } from 'qunit';

module('Unit | Utility | utils', function() {
  test('it works', function(assert) {
    assert.ok(typeof utils._cleanupOnDestroy === 'function');
  });
});
