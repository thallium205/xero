# xero
 A simple node library for Xero Private Applications

## Install
<pre>
  npm install xero
</pre>
## Usage
### Request
```javascript
var express = require("express");
var Xero = require('xero');
var fs = require('fs');

var app = express();

var CONSUMER_KEY="my consumer key";
var CONSUMER_SECRET="my consumer secret";
var RSA_PRIVATE_KEY = fs.readFileSync(process.env.HOME + "/.ssh/id_rsa");
var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);

app.get('/', function (req, res) {
  xero.call('GET', '/Users', null, function(err, json) {
    if (err) {
      res.status(err.statusCode);
      res.write(JSON.stringify(err));
      res.end();
    } else {
      res.status(200);
      res.write(JSON.stringify(json));
      res.end();
    }
  });
});

app.listen(3000, function () {
  console.log("Listening...");
});
```
### Response
```javascript
{
   "Response":{
      "Id":"37286998-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "Status":"OK",
      "ProviderName":"My Account",
      "DateTimeUTC":"2013-04-22T17:13:31.2755569Z",
      "Users":{
         "User":{
            "UserID":"613fbf01-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "FirstName":"Chadd",
            "LastName":"Sexington",
            "UpdatedDateUTC":"2013-04-12T05:54:50.477",
            "IsSubscriber":"true",
            "OrganisationRole":"STANDARD"
         }
      }
   }
}
```
### Example POST Request
```javascript
...
// Adding contact(s)
var request;
// Single
request = {
    Name: 'Name1'
};
// Multiple
request = [{
    Name: 'Name1'
}, {
    Name: 'Name2'
}];
xero.call('POST', '/Contacts?SummarizeErrors=false', request, function(err, json) {
        ...
    });
```

### Download PDF
```javascript
var Xero = require('xero');
var fs = require('fs');

var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);
var invoiceId = 'invoice-identifier';
var req = xero.call('GET', '/Invoices/' + invoiceId);

req.setHeader('Accept', 'application/pdf');
req.on('response', function(response) {
  var file = fs.createWriteStream(invoiceId + '.pdf');
  response.pipe(file);
});
req.end();
```
## Constructor Parameters

| Parameter         | Purpose |
|:----------------- |:------- |
| key               | XERO OAuth Credentials Consumer Key  |
| secret            | XERO OAuth Credentials Consumer Secret |
| rsa_key           | X509 Private Key Certificate id_rsa or pem file |
| showXmlAttributes | shows the attributes on the xml elements |
| customHeaders     | Custom http headers |
| easyXmlConfig     | Overrides for JSON to XML parser [node-easyxml](https://github.com/tlhunter/node-easyxml) |
 
### easyXmlConfig

With this parameter you can override the behavior of easyXml. For example, if you needed to control the way Arrays are un-wrapped. Line Items in Invoices can have up to two TrackingCategory attached like this.

```xml
<Tracking>
    <TrackingCategory>
        <Name>Melbourne</Name>
        <Option>e44c3446-b741-4717-9710-057c1fc14603</Option>
        <TrackingCategoryID>bf8a9440-37bd-44fd-ab97-f207a2588ac1</TrackingCategoryID>
    </TrackingCategory>
    <TrackingCategory>
        <Name>Virtual Reality Design</Name>
        <Option>c712bb31-2d5e-470f-90da-70f2cc6fe595</Option>
        <TrackingCategoryID>2d002487-1540-442d-bb8a-b2d7d3ff11c7</TrackingCategoryID>
    </TrackingCategory>
</Tracking>
```
However, to get easyXml to do this you would need to pass ```{unwrappedArrays: true}``` as the easyXmlConfig parameter. Then you can then pass the following javascript to build the above xml.

```javascript
"Tracking": {
    "TrackingCategory": [
        {
            Name: {"_": "Melbourne"},
            Option: {"_": "e44c3446-b741-4717-9710-057c1fc14603"},
            TrackingCategoryID: {"_": "bf8a9440-37bd-44fd-ab97-f207a2588ac1"}
        },
        {
            Name: {"_": "Virtual Reality Design"},
            Option: {"_": "c712bb31-2d5e-470f-90da-70f2cc6fe595"},
            TrackingCategoryID: {"_": "2d002487-1540-442d-bb8a-b2d7d3ff11c7"}
        }
    ]
}
```

## Docs
http://developer.xero.com/documentation/

Enjoy! - thallium205 <https://github.com/thallium205>
