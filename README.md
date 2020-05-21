# `ember-concerns`
[![Build Status](https://travis-ci.org/patcoll/ember-concerns.svg?branch=master)](https://travis-ci.org/patcoll/ember-concerns)
[![Ember Observer Score](https://emberobserver.com/badges/ember-concerns.svg)](https://emberobserver.com/addons/ember-concerns)

Wrap and extend your Ember objects. DRY up your Ember code without mixins.

A concern can be used with any Ember object. Use wherever you want to have reusable view-model/presenter-like derived data in your Ember code, or wherever repeated Ember code is driving you nuts.

## Description

One big benefit of using Ember effectively is using *derived data*. Using tools like computed properties and autotracking, you can compute, aggregate, or mix-and-match data from multiple sources and keep them in sync.

One thing I found with larger Ember apps is that the same derived data would sometimes need to be used in multiple places, which would lead to a bunch of code that is copy/pasted. This can get pretty frustrating. In a lot of circumstances, it's appropriate to extract that shared code into a single place that can then be re-used.

With concerns, you can encapsulate that related derived data together, and even bundle related actions with it if you need to.

## Examples

We will show examples using classes, but using concerns using the `Object.extend({})` syntax is perfectly valid too.

### A basic example

In its most basic form, a concern can act as a "view model" -- taking an object as input and extending it with derived data appropriate for rendering. If multiple components share the need for the same data, that concern can simply be used in multiple components. In this scenario, the Ember Handlebars API makes this nice and decoupled.

A concern can extend any Ember object. That object is known as the concern's `model`, but the object doesn't have to be an Ember Data model.

```js
// app/concerns/project/prettify.js
import Concern from 'ember-concerns';
import { computed } from '@ember/object';

export default class ProjectPrettifyConcern extends Concern {
  @computed('model.{title,year}')
  get title() {
    let { title, year } = this.model;
    return `${title} (${year})`;
  }
});
```

```hbs
{{!-- project.hbs --}}
{{#with (concern 'project/prettify' project) as |pretty|}}
  <h1>{{pretty.title}}</h1>
{{/with}}
```

### A more complex example

In more advanced usage, a concern can offer tools to intercept and pass along user actions, which gives it slightly more responsibility. Both the Handlebars and the JS APIs are great to use here.

```js
// app/concerns/project/actions.js
import { inject as service } from '@ember/service';
import Concern, { inject as concern } from 'ember-concerns';
import { action, computed } from '@ember/object';

export default class ProjectActionsConcern extends Concern {
  @service notifications;

  // Re-use prettify from above using the JS API.
  @concern('project/prettify')
  pretty;

  @computed('pretty.title')
  get closeTitle() {
    let { title } = this.pretty;
    return `Close ${title}`;
  }

  @computed('pretty.title')
  get openTitle() {
    let { title } = this.pretty;
    return `Open ${title}`;
  }

  @action
  close() {
    let { title } = this.pretty;
    this.model.project.isClosed = true;
    return this.model.project.save().then(() => {
      this.notifications.success(`Successfully closed ${title}.`);
    });
  },

  @action
  open() {
    let { title } = this.pretty;
    this.model.project.isClosed = false;
    return this.model.project.save().then(() => {
      this.notifications.success(`Successfully opened ${title}.`);
    });
  }
}
```

```hbs
{{!-- app/templates/project.hbs --}}
{{project/action-panel project=project}}

{{!-- app/templates/components/project/action-panel.hbs --}}
<div class="actions">
  {{#with (concern 'project/actions' this) as |actions|}}
    <button {{on "click" actions.close}}>{{actions.closeTitle}}</button>
    <button {{on "click" actions.open}}>{{actions.openTitle}}</button>
  {{/with}}
</div>
```

## A note on computed properties and autotracking

Concerns track and use the same features that Ember itself uses. One of those features is called [*autotracking*](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/), and it's already in recent versions of Ember, back to version 3.13.0.

There is a long story behind autotracking and why it exists. Read [this post](https://www.pzuraq.com/how-autotracking-works/) for a great comprehensive story on the design behind the feature and how it fulfills important principles for good reactive systems.

Concerns can take advantage of autotracking in the same way the objects in your app can. That is, you can:

1. Wrap native class getters in concerns with the `@computed` decorator if you want it to act like a traditional Ember computed property, or
2. Add `@tracked` to all properties you care about tracking, and remove `@computed` from the native getter

## JS API variations

```js
// ...
import { inject as concern } from 'ember-concerns';

export default class extends Component {
  /**
    * Minimal.
    * In this case the name of the variable will be used to look up the view model.
    */
  @concern projectActions;

  /**
    * Explicitly supply path to the concern to inject.
    */
  @concern('project/actions') actions;
}
```

## `concern-action`

We include the `concern-action` helper for better developer ergonomics for users of older versions of Ember. The helper implements what the `@action` decorator or `ember-bind-helper` accomplish. In fact, the `concern-action` helper uses `bind` in the background.

We will likely remove this helper when Ember LTS 3.12 becomes unsupported.

See [this article](https://www.pzuraq.com/ember-octane-update-action/) for a great summary of the modern take on actions in Ember.

## Compatibility

Supports Ember 3.12+

## Inspiration

- https://api.rubyonrails.org/classes/ActiveSupport/Concern.html
- https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html
- https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-new-mixins.md
- https://jtway.co/cleaning-up-your-rails-views-with-view-objects-42cf048ea491
- https://github.com/drapergem/draper
- https://github.com/trailblazer/cells
- https://github.com/mmun/ember-presenters
