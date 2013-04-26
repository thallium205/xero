var crypto  = require("crypto");
var oauth   = require("oauth");
var easyxml = require('easyxml');
var xml2js = require('xml2js');

var XERO_BASE_URL = 'https://api.xero.com';
var XERO_API_URL = XERO_BASE_URL + '/api.xro/2.0';

function Xero(key, secret, rsa_key, showXmlAttributes) {
    this.key = key;
    this.secret = secret;

    this.parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: showXmlAttributes !== undefined ? (showXmlAttributes ? false : true) : true, async: true});
    easyxml.configure({rootElement: 'Request', manifest: true});

    this.oa = new oauth.OAuth(null, null, key, secret, '1.0', null, "PLAINTEXT");
    this.oa._signatureMethod = "RSA-SHA1"
    this.oa._createSignature = function(signatureBase, tokenSecret) {
        return crypto.createSign("RSA-SHA1").update(signatureBase).sign(rsa_key, output_format = "base64");
    }
}

Xero.prototype.call = function(method, path, body, callback) {
    var self = this;

    var xml = null;
    if (method && method !== 'GET' && body) {
        xml = easyxml.render(body);
    }

    self.oa._performSecureRequest(self.key, self.secret, method, XERO_API_URL + path, null, xml, 'application/xml', function(err, xml, res) {
        if (err) {
            return callback(err);
        }

        self.parser.parseString(xml, function(err, json) {
            if (err) return callback(err);
            if (json && json.Response && json.Response.Status !== 'OK') {
                return callback(json, res);
            } else {
                return callback(null, json, res);
            }
        });
    });
}

module.exports = Xero;