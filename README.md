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

### Extra methods and helpers
```javascript
var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);

// for use in constructing filters
xero.helpers.dateToXeroDateTimeString(new Date(0)) // => DateTime(1970-1-1)
```

Each of the resources listed below has a #find and #findOne method accessible via it's named property (e.g. `xero.Invoices`, `xero.BankTransactions` etc) on the Xero instance. E.g.:
```javascript
xero.Invoices.find(function(err, data) {
  // data.Response.Invoices.Invoice => array of invoices
});
xero.Invoices.findOne('foobarId', function(err, data) {
  // data.Response.Invoices.Invoice === foobarId invoice
});
```
The find method also optionally accepts a filter string
```javascript
xero.Invoices.find('AmountDue > 1000000000', function(err, data) {
  // data.Status === OK
  // data.Response.Invoices === undefined
});
```
- Accounts
- BankTransactions
- BankTransfers
- BrandingThemes
- Contacts
- ContactGroups
- CreditNotes
- Currencies
- Employees
- ExpenseClaims
- Invoices
- Items
- Journals
- ManualJournals
- Organisation
- OverPayments
- Payments
- Prepayments
- Receipts
- RepeatingInvoices
- TaxRates
- TrackingCategories
- Users

## Docs
http://developer.xero.com/documentation/

Enjoy! - thallium205 <https://github.com/thallium205>
