module.exports = {
  write: function(req, res, statusCode, body) {
    res.writeHead(statusCode, responseHeaders);
    res.end(body);
  }
};

var responseHeaders = function() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
  };
};