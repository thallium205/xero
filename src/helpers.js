'use strict';
var str = require('string');

module.exports = {

  dateToXeroDateTimeString: function(date) {
    var dates = {
      y: date.getUTCFullYear(),
      m: date.getUTCMonth() + 1,
      d: date.getUTCDate()
    };
    return str('DateTime({{y}}-{{m}}-{{d}})').template(dates);
  }

};
