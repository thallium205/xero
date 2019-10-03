var crypto  = require("crypto");
var oauth   = require("oauth");
var EasyXml = require('easyxml');
var xml2js = require('xml2js');
var inflect = require('inflect');

var XERO_BASE_URL = 'https://api.xero.com';
var XERO_API_URL = XERO_BASE_URL + '/api.xro/2.0';

function Xero(key, secret, rsa_key, showXmlAttributes, customHeaders, version) {
    this.key = key;
    this.secret = secret;

    this.parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: showXmlAttributes !== undefined ? (showXmlAttributes ? false : true) : true, async: true});

    this.oa = new oauth.OAuth(null, null, key, secret, '1.0', null, "PLAINTEXT", null, customHeaders);
    this.oa._signatureMethod = "RSA-SHA1"
    this.oa._createSignature = function(signatureBase, tokenSecret) {
        return crypto.createSign("RSA-SHA1").update(signatureBase).sign(rsa_key, output_format = "base64");
    }
}

Xero.prototype.call = function(method, endpoint, path, body, callback) {
    var self = this;
    switch (endpoint) {
        case 'accounting':
            endpoint = '/api.xro/2.0';
            break;
        case 'payroll':
            endpoint = '/payroll.xro/1.0';
            break;
        case 'assets':
            endpoint = '/assets.xro/1.0';
            break;
        case 'files':
            endpoint = '/files.xro/1.0';
            break;
        default:
            endpoint = '/api.xro/2.0';
    }
    XERO_API_URL = XERO_BASE_URL + endpoint;

    var post_body = null;
    var content_type = null;
    if (method && method !== 'GET' && body) {
        if (Buffer.isBuffer(body)) {
            post_body = body;
            content_type = body.content_type;
        } else {
            var root = path.match(/([^\/\?]+)/)[1];
            post_body = new EasyXml({rootElement: inflect.singularize(root), rootArray: root, manifest: true}).render(body);
            content_type = 'application/xml';
        }
    }
    var process = function(err, xml, res) {
        if (err) {
            return callback(err);
        }
        try {
            var json = JSON.parse(xml);
            if (json && json.Response && json.Response.Status !== 'OK') {
                return callback(json, res);
            } else {
                return callback(null, json, res);
            }
        } catch (e) {
            self.parser.parseString(xml, function(err, json) {
                if (err) return callback(err);
                if (json && json.Response && json.Response.Status !== 'OK') {
                    return callback(json, res);
                } else {
                    return callback(null, json, res);
                }
            });
        }
    };
    return self.oa._performSecureRequest(self.key, self.secret, method, XERO_API_URL + path, null, post_body, content_type, callback ? process : null);
}

module.exports = Xero;
