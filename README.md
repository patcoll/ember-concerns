# `ember-concerns`

### Description

DRY up your Ember code without mixins.

Use wherever you want to have reusable view-model/presenter-like derived data in Ember JavaScript code, or wherever repeated Ember code is driving you nuts.

Really useful for sharing logic between component JS code.

### Ember JS API

A concern can be injected into any Ember object. That object is used as the concern's `model`, but the object doesn't have to be a model.

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

### Ember Handlebars API

#### `concern`

Use the `concern` helper to wrap objects. Example:

    

#### `concern-action`

Use functions defined on concerns as closure actions with automatic binding:

    


### Inspiration

- https://api.rubyonrails.org/classes/ActiveSupport/Concern.html
- https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html
- https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-new-mixins.md
- https://jtway.co/cleaning-up-your-rails-views-with-view-objects-42cf048ea491
- https://github.com/drapergem/draper
- https://github.com/trailblazer/cells
- https://github.com/mmun/ember-presenters