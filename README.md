# proxymesh
Node module to use ProxyMesh rotating proxy servers.

### Example
```
var ProxyMesh = require('proxymesh');

// Initialize with your ProxyMesh account username and passwod.
var proxy = new ProxyMesh('username', 'password');

// Select which proxy server to use (as in ProxyMesh dashbaord).
proxy.entryNode = 'us.proxymesh.com:1234'

// Optionally, specify the IP address of exit node (using prefer method).
proxy.exitNode = '123.123.123.123'

// Setup the proxy request. Used exit node is passed in the callback.
var ops = url.parse('http://example.com');
var proxyRequest = proxy.request(opts, function(exitNode) {
    console.log(exitNode);
});

// And fire!
proxyRequest.end();
```

Returned `proxyRequest` is a `http.ClientRequest` object, so the response can be handled like the following:
```
proxyRequest.on('response', callback);
```
