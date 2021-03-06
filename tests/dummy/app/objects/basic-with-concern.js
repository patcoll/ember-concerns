import EmberObject from '@ember/object';
import { inject as concern } from 'ember-concerns';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default EmberObject.extend({
  title: tracked(),

  test: concern(),

  store: service(),
});
