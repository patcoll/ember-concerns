/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default EmberObject.extend({
  title: tracked(),
});
