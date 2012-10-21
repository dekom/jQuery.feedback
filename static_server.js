// **Static Server** is just a plain nodejs server capable of serving
// html, javascript, css, and plain text files with the correct mime
// definition.
//
// Default URL: http://localhost:8888/

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      // Content-type to be returned
      // This is determined using a simple switch statement.  This should
      // really be abstracted to another module that can determine the
      // content-type based on the basename(filename).
      var content_type;

      switch ( path.extname(filename) ) {
        case ('.js'):
          content_type = 'application/javascript';
          break;
        case ('.css'):
          content_type = 'text/css';
          break;
        case ('.html'):
          content_type = 'text/html';
          break;
        default:
          content_type = 'text/plain';
      }

      response.writeHead(200, {"Content-Type": content_type});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n=> http://localhost:" + port + "/\n=> CTRL + C to shutdown");
