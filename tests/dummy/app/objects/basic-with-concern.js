import EmberObject from '@ember/object';
import { inject as concern } from 'ember-concerns';

export default EmberObject.extend({
  test: concern(),

  testCp: concern('test-with-cp'),
});
