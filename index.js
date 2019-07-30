/* eslint-env node */
'use strict';

module.exports = {
  name: require('./package').name,

  setupPreprocessorRegistry(type, registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'concern-action',
      plugin: require('./lib/concern-action-transform'),
      baseDir() {
        return __dirname;
      }
    });
  },

  isDevelopingAddon() {
    return true;
  }
};
