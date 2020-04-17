import Model, { attr } from '@ember-data/model';

export default class BasicModel extends Model {
  @attr('string') title;
}
