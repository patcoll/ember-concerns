/* eslint-env node */
'use strict';

const BindTransform = require('ember-bind-helper/lib/bind-transform');

module.exports = class ConcernActionTransform extends BindTransform {
  get helperName() {
    return 'concern-action';
  }

  addTarget(node) {
    if (node.path.original === this.helperName && node.params.length > 0) {
      let hasTarget = node.hash.pairs.some(p => p.key === 'target');

      if (!hasTarget) {
        let target = this.getDefaultTarget(node.params[0]);

        node.hash.pairs.push(this.builders.pair('target', target));
      }
    }
  }
};
