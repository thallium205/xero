/*eslint handle-callback-err:0 */
'use strict';

var assert = require('chai').assert;
var Xero = require('../index');

Xero.prototype.call = function(method, path, body, callback) {
  callback(null, {
    path: 'api' + path,
    method: method,
    body: body
  });
};

var xero = new Xero();

describe('methods', function() {

  describe('#_withId', function() {
    it('should execute xero.call with id and method', function(done) {
      xero.Contacts.findOne('foo', function(err, res) {
        assert.equal(res.path, 'api/Contacts/foo');
        assert.equal(res.method, 'GET');
        done();
      });
    });
  });

  describe('#find', function() {
    it('should optionally accept a plain filter string', function(done) {
      var filter = 'Date > ' + xero.helpers.dateToXeroDateTimeString(new Date(0));
      xero.Invoices.find(filter, function(err, res) {
        assert.equal(res.path, 'api/Invoices?where=Date%20%3E%20DateTime(1970-1-1)');
      });
      xero.Invoices.find(function(err, res) {
        assert.equal(res.path, 'api/Invoices');
        assert.equal(res.method, 'GET');
      });
      // allow multiple async executions
      setTimeout(done, 20);
    });
  });

});
