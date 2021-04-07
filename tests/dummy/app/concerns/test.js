/* eslint-disable ember/no-computed-properties-in-native-classes */
import Concern from 'ember-concerns';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { VERSION } from '@ember/version';
import semver from 'semver';

class TestNewStyleConcern extends Concern {
  get prettyTitle() {
    return this.model && this.model.title && this.model.title.toUpperCase();
  }

  @service store;
  @service test;
}

class TestConcern extends TestNewStyleConcern {
  @computed('model.title')
  get prettyTitle() {
    return this.model && this.model.title && this.model.title.toUpperCase();
  }
}

let klass = TestConcern;

if (semver.gte(VERSION, '3.13.0')) {
  klass = TestNewStyleConcern;
}

export default klass;
