# Marketing Cloud Javascript SDK

A frontend library for calling the Marketing Cloud APIs

See `index.html` for an example of calling the marketing cloud APIs using javascript.

```bash
$ git clone git@github.com:Adobe-Marketing-Cloud/marketing-cloud-javascript-sdk.git
$ cd marketing-cloud-javascript-sdk/
$ open index.html
```

This provides you with a simple form to call the Marketing Cloud APIs.

Usage
-----

Include the `marketing_cloud.js` and `wsse.js` to utilize the methods below

Examples
--------

Call the APIs using the `MarketingCloud` object and `makeRequest` method (requires jQuery)

```javascript

/* requires wsse.js, marketing_cloud.js, and jQuery */
var username = 'YOUR_USERNAME';
var secret   = 'YOUR_SECRET';
var method   = 'Company.GetReportSuites'
var params   = {};
var endpoint = 'api.omniture.com';

MarketingCloud.makeRequest(username, secret, method, params, endpoint, function(response) {
    alert('API Response: ' + response.responseText);
});
```

Generate the auth headers to call the APIs using the `Wsse` object and `generateAuth` method (jQuery not required):

```javascript
/* requires wsse.js only */
var wsse = new Wsse();
var headers = wsse.generateAuth(username, secret);

// do your own API call here
make_api_call(headers);
```
