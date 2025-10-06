import { createServer } from 'node:http';
import path from 'node:path';
import { handlePath } from './src/path_handlers.js';



const server = createServer((req, res) => {

    const request_url = new URL(`http://${host}${req.url}`);
    const path = request_url.pathname;
    console.log(`Request: ${req.method} ${path}`);
  
    handlePath(path, req, res)

    if (!res.writableEnded) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('page not found!\n');
  }

});

const port = 9000;
const host = "localhost";
server.listen(port, host, () => {
    console.log(`server running on http://${host}${port}`);
});