import Model, { attr } from '@ember-data/model';
import { inject as concern } from 'ember-concerns';

export default class BasicModel extends Model {
  @attr('string') title;

  @concern test;
}
