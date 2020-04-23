import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BasicClass extends EmberObject {
  @tracked title;
}
