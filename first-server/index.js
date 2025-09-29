import { createServer } from 'node:http';

const server = createServer((req, res) => {
    res.writeHead(200,{"content-type" : "text/plain"});
    res.end("Hello World");
});

const port = 9000;
const host = "localhost";
server.listen(port, host, () => {
    console.log('nigga')
});