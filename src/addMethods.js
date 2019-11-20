'use strict';
var _ = require('lodash');

function pathWithId(id, resource) {
  return '/' + resource + '/' + id;
}

function addMethods(Xero, resources) {

  var methods = {

    // provide Xero.prototype.call to to any instance
    _call: Xero.call,

    _withId: function(id, method, callback) {
      var path = pathWithId(id, this.resource);
      return Xero.call(method, path, null, callback);
    },

    findOne: function(id, callback) {
      return this._withId(id, 'GET', callback);
    },

    find: function(filter, callback) {
      var path = '/' + this.resource;

      if (_.isFunction(filter)) {
        callback = filter;
      } else {
        path += '?where=' + encodeURIComponent(filter);
      }

      return Xero.call('GET', path, null, callback);
    }

  };

  resources.forEach(function(resource) {
    Xero[resource] = _.create(methods, {resource: resource});
  });

}

module.exports = addMethods;
