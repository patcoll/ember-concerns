/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import { inject as concern } from 'ember-concerns';

export default EmberObject.extend({
  key: 'original value',

  keyValue: concern(),
});
