# freshbooks-node
 A simple node library for Freshbooks that does not require libxmljs

## Install
<pre>
  npm install freshbooks-node
</pre>
## Usage
### Request
```javascript
var Freshbooks = require('freshbooks-node');
var freshbooks = new Freshbooks(APPLICATION_NAME, APPLICATION_TOKEN, USER_AGENT)
freshbooks.call('invoice.create',
    {
        invoice:
        {   client_id: 32,
            status: 'draft',
            lines: {
                line:
                {
                    name: 'Tulips',
                    description: 'A type of flower',
                    unit_cost: 10,
                    quantity: 2
                }
            }
        }
    }, function(err, json) {
        if (err) {
            console.error(err);
        }
        console.log(JSON.stringify(json, null, 4));
    });
```
### Response
```javascript
{
    "response": {
        "invoice_id": "73869"
    }
}
```
## Docs
http://developers.freshbooks.com/

Enjoy! - thallium205 <https://github.com/thallium205>