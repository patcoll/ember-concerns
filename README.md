# `ember-concerns`
[![Build Status](https://travis-ci.org/patcoll/ember-concerns.svg?branch=master)](https://travis-ci.org/patcoll/ember-concerns)

Wrap and extend your objects. DRY up your Ember code without mixins.

Use wherever you want to have reusable view-model/presenter-like derived data in your Ember code, or wherever repeated Ember code is driving you nuts.

### Description

One big benefit of using Ember effectively is using *computed properties*. You can compute, aggregate, or mix-and-match data from multiple sources and keep them in sync.

One thing I found with larger Ember apps is that sometimes the same computed properties would need to be used in multiple places, which would lead to code that is copy/pasted. In a lot of circumstances, it's appropriate to extract that code into a single place that can then be re-used.

With concerns, you can encapsulate related derived data together. You can also bundle related actions.

### A basic example

In its most basic form, a concern can act as a "view model" -- taking an object as input and extending it with computed properties that are appropriate for rendering a view. Think components that need to access the same derived data. If multiple components share the need for the same data, that concern can simply be used in multiple components. If you feel that data is more appropriate closer to the model layer, the concern can be moved to the model itself. In this scenario, the Ember Handlebars API makes this nice and decoupled.

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

### An advanced example

In more advanced usage, a concern can offer tools to intercept and pass along user actions, acting as a sort of "presenter" with slightly more responsibility. Both the Handlebars and the JS APIs are great to use here.

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

#### `concern-action`

We include the `concern-action` helper for better developer ergonomics for users of older versions of Ember. The helper implements what the `@action` decorator or `ember-bind-helper` accomplish. In fact, the `concern-action` helper uses `bind` in the background. `ember-concerns` is pre-1.0 software, so this is likely to change. We will remove this helper -- it's just a matter of when.

See [this article](https://www.pzuraq.com/ember-octane-update-action/) for a great summary of the modern take on actions in Ember.

### JS API variations

A concern can be injected into any Ember object. That object is known as the concern's `model`, but the object doesn't have to be an Ember Data model. It *does* have to be an object that calls `willDestroy` when it's destroyed, so the concern can clean up after itself. (In other words, any object that inherits from `EmberObject`.)

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

### Compatibility

Supports Ember 3+

### Inspiration

- https://api.rubyonrails.org/classes/ActiveSupport/Concern.html
- https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html
- https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-new-mixins.md
- https://jtway.co/cleaning-up-your-rails-views-with-view-objects-42cf048ea491
- https://github.com/drapergem/draper
- https://github.com/trailblazer/cells
- https://github.com/mmun/ember-presenters
