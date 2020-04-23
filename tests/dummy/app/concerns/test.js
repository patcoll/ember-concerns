import Concern from 'ember-concerns';
import { computed } from '@ember/object';
import { VERSION } from '@ember/version';
import semver from 'semver';

class TestNewStyleConcern extends Concern {
  get prettyTitle() {
    return this.model && this.model.title && this.model.title.toUpperCase();
  }
}

class TestConcern extends Concern {
  @computed('model.title')
  get prettyTitle() {
    return this.model && this.model.title && this.model.title.toUpperCase();
  }
}

let klass = TestConcern;

if (semver.gte(VERSION, '3.13.0')) {
  klass = TestNewStyleConcern;
}

export default klass
