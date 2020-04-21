import Concern from 'ember-concerns';
import { action, set } from '@ember/object';

export default class KeyValueConcern extends Concern {
  testAction() {
    set(this.model, 'key', 'new value');
  }

  @action
  testNewerAction() {
    this.model.set('key', 'newer value');
  }
}
