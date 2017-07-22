var http = require('http');
var https = require('https');
var httpProxyAgent = require('http-proxy-agent');
var httpsProxyAgent = require('https-proxy-agent');

const GET_IP_HEADER = 'x-proxymesh-ip';
const SET_IP_HEADER = 'x-proxymesh-prefer-ip';

var ProxyMesh = function(username, password) {
  this.username = username;
  this.password = password;
}

Object.defineProperty(ProxyMesh.prototype, 'entryNode', {
  set: function(addr) {
    this.host = addr.split(':')[0];
    this.port = addr.split(':')[1];
  }
});

ProxyMesh.prototype.request = function(opts, callback) {
  var protocol = opts.protocol.slice(0, -1);
  var agent = eval(protocol + 'ProxyAgent')({
    host: this.host,
    port: this.port,
    auth: [this.username, this.password].join(':'),
    headers: {
      [SET_IP_HEADER]: this.exitNode || '',
    },
  });
  opts['agent'] = agent;
  if (this.exitNode) {
    opts['headers'] = Object.assign(opts['headers'] || {}, {
      [SET_IP_HEADER]: this.exitNode || '',
    });
  }
  var proxiedReq = eval(protocol).request(opts);
  proxiedReq.on('response', function(res) {
    callback(res.headers[GET_IP_HEADER]);
  });
  return proxiedReq;
}

module.exports = ProxyMesh;
