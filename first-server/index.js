import { createServer } from 'node:http';

const server = createServer((req, res) => {

    const request_url = new URL(`http://${host}${req.url}`);
    const path = request_url.pathname;
    console.log(`Request: ${req.method} ${path}`);

    if (path === "/" && req.method === 'GET') {
       if (req.method !== "GET") {
         res.writeHead(405, { "Content-Type": "text/plain" });
         res.end("Method not allowed\n");
    } 
       else {
         res.writeHead(200, { "Content-Type": "text/html" });
         res.end(index_html);
    }
  }

    if (!res.writableEnded) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('page not found!\n');
  }

});

const port = 9000;
const host = "localhost";
server.listen(port, host, () => {
    console.log('Server is running on https//$(host):$(port)');
});