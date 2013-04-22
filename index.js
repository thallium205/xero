var crypto  = require("crypto");
var oauth   = require("oauth");
var easyxml = require('Easyxml');
var xml2js = require('xml2js');

function Xero(key, secret, rsa_key) {
    this.key = key;
    this.secret = secret;

    this.parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: showAttributes !== undefined ? (showAttributes ? false : true) : true, async: true});
    easyxml.configure({rootElement: 'Request', manifest: true});

    this.request = new oauth.OAuth(null, null, key, secret, '1.0', null, "PLAINTEXT");
    this.request._signatureMethod = "RSA-SHA1"
    this.request._createSignature = function(signatureBase, tokenSecret) {
        var signer = crypto.createSign("RSA-SHA1")
        signer.update(signatureBase);
        return signer.sign(rsa_key, output_format = "base64");
    }
}

Xero.prototype.call = function(method, path, body, callback) {
    var self = this;

    var xml = null;
    if (body) {
        xml = easyxml.render(body);
    }
    self.request._performSecureRequest(self.key, self.secret, method, path, null, xml, null, function(err, xml, res) {
        if (err) {
            return callback(err);
        }

        self.parser.parseString(xml, function(err, json) {
            if (err) return callback(err);
            if (json && json.Response && json.Response.Status !== 'OK') {
                return callback(json);
            } else {
                return callback(null, json);
            }
        });

    });
}

module.exports = Xero;