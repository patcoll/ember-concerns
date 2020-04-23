import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { countFor } from 'ember-concerns/helpers/concern';

module('Integration | Helpers | concern', function(hooks) {
  setupRenderingTest(hooks);

  test('basic concern helper usage works as expected', async function(assert) {
    let model = this.owner
      .factoryFor('object:basic-class')
      .create({
        title: 'hello there',
      });

    this.set('model', model);

    await render(hbs`
        {{#with (concern 'test' this.model) as |test|}}
          <div data-test-pretty-title>{{test.prettyTitle}}</div>
        {{/with}}
      `);

    assert
      .dom('[data-test-pretty-title]')
      .hasText('HELLO THERE');

    model.set('title', 'hi there');
    await settled();

    assert
      .dom('[data-test-pretty-title]')
      .hasText('HI THERE');

    model.set('title', 'hi again');
    await settled();

    assert
      .dom('[data-test-pretty-title]')
      .hasText('HI AGAIN');
  });

  test('concern helper cleans up after itself if template is destroyed', async function(assert) {
    let model = this.owner
      .factoryFor('object:basic')
      .create({
        title: 'hello there',
      });

    this.set('show', true);
    this.set('model', model);

    assert.equal(countFor({ name: 'test', model }), 0);

    await render(hbs`
        <div>
          {{get (concern 'test' this.model) "prettyTitle"}}
        </div>

        {{#if this.show}}
          {{#with (concern 'test' this.model) as |test|}}
            <div data-test-pretty-title>{{test.prettyTitle}}</div>
          {{/with}}
        {{/if}}
      `);

    assert.equal(countFor({ name: 'test', model }), 2);

    this.set('show', false);
    await settled();

    assert.equal(countFor({ name: 'test', model }), 1);
  });
});
