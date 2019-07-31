# `ember-concerns`

DRY up your Ember code without mixins.

Use wherever you want to have reusable view-model/presenter-like derived data in your Ember code, or wherever repeated Ember code is driving you nuts.

### Description

One big benefit of using Ember effectively is using *computed properties*. You can compute, aggregate, or mix-and-match data from multiple sources and keep them in sync.

One thing I found with larger Ember apps is that sometimes the same computed properties would need to be used in multiple places, which would lead to code that is copy/pasted. In a lot of circumstances, it's appropriate to extract that code into a single place that can then be re-used.

With concerns, you can encapsulate related derived data together.

*It's a great way to plan a transition away from using Ember controllers.* Encapsulate the data and logic you need to abstract away from the controller into a concern, then move that to a component later by simply moving where the concern is used.

### A basic example

In its most basic form, a concern can act as a "view model" -- taking an object as input and extending it with computed properties that are appropriate for rendering a view. Think components that need to access the same derived data. If multiple components share the need for the same data, that concern can simply be used in multiple components. If you feel that data is more appropriate closer to the model layer, the concern can be moved to the model itself. In this scenario, the Ember Handlebars API makes this nice and decoupled.

```js
// app/concerns/project/prettify.js
import Concern from 'ember-concerns';
import { computed } from '@ember/object';

export default Concern.extend({
  title: computed('model.{title,year}', function() {
    let { title, year } = this.model;
    return `${title} (${year})`;
  })
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
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Concern.extend({
  notifications: service(),

  // In this case the model is the component itself, so create an alias to the thing we need.
  project: alias('model.project'),

  // Re-use prettify from above using the JS API.
  pretty: concern('project/prettify', { model: 'project' }),

  closeTitle: computed('pretty.title', function() {
    let { title } = this.pretty;
    return `Close ${title}`;
  }),

  openTitle: computed('pretty.title', function() {
    let { title } = this.pretty;
    return `Open ${title}`;
  }),

  close() {
    let { title } = this.pretty;
    this.project.isClosed = true;
    return this.project.save().then(() => {
      this.notifications.success(`Successfully closed ${title}.`);
    });
  },

  open() {
    let { title } = this.pretty;
    this.project.isClosed = false;
    return this.project.save().then(() => {
      this.notifications.success(`Successfully opened ${title}.`);
    });
  }
});
```

```hbs
{{!-- app/templates/project.hbs --}}
{{project/action-panel project=project}}

{{!-- app/templates/components/project/action-panel.hbs --}}
<div class="actions">
  {{#with (concern 'project/actions' this) as |projectActions|}}
    {{!-- `concern-action` makes sure scope for function is `projectActions` --}}
    <button {{action (concern-action projectActions.close)}}>{{projectActions.closeTitle}}</button>
    <button {{action (concern-action projectActions.open)}}>{{projectActions.openTitle}}</button>
  {{/with}}
</div>
```

Using the `concern-action` helper, the closure actions `close` and `open` are bound in scope to `projectActions`. This gives the most flexibility, since the concern has access to (1) the component object (`model`), (2) the project model (`model.project`), and (3) any other data or logic on the concern it needs. Only using the `action` helper would scope the functions to the component itself, which would likely be unexpected and lead to lack of access to pertinent data.


### More JS API variations

A concern can be injected into any Ember object. In this scenario, a concern acts as a sort of "view model" -- it takes an object as input and extends  That object is used as the concern's `model`, but the object doesn't have to be a model.

```js
/**
  * Minimal.
  * In this case the name of the variable can be used to look up the view model.
  * In this case the `model` passed in is assumed to be `this`.
  */
dateControlNavigation: concern()

/**
  * Explicitly supply path to view model.
  * In this case the `model` passed in is assumed to be `this`.
  */
navigation: concern('date-control-navigation')

/**
  * If a variable name passed in, that variable is used as the model.
  * In this case the `model` passed in is explicitly set to be `anyVariable`.
  */
navigation: concern('date-control-navigation', {
  model: 'anyVariable'
})

/**
  * Can also explicitly set properties that the behind-the-scenes computed property depends on:
  */
navigation: concern('date-control-navigation', {
  dependsOn: ['anyVariable.prop1', 'anyVariable.prop2.{subPropA,subPropB}'],
  model: 'anyVariable'
})
```

### Inspiration

- https://api.rubyonrails.org/classes/ActiveSupport/Concern.html
- https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html
- https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-new-mixins.md
- https://jtway.co/cleaning-up-your-rails-views-with-view-objects-42cf048ea491
- https://github.com/drapergem/draper
- https://github.com/trailblazer/cells
- https://github.com/mmun/ember-presenters