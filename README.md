# xero
 A simple node library for Xero Private Applications

## Install
<pre>
  npm install xero
</pre>
## Usage
### Request
```javascript
var Xero = require('xero');

var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);
xero.call('GET', '/Users', null, function(err, json) {
        if (err) {
            log.error(err);
            return res.json(400, {error: 'Unable to contact Xero'});
        }
        return res.json(200, json);
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

## Docs
http://developer.xero.com/api/

Enjoy! - thallium205 <https://github.com/thallium205>