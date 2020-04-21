import Concern from 'ember-concerns';
import { computed } from '@ember/object';

export default class TestConcern extends Concern {
  @computed('model.title')
  get prettyTitle() {
    return this.model && this.model.title && this.model.title.toUpperCase();
  }
}
