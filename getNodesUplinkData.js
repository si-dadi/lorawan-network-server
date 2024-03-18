const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.writeHead(200);
            res.end();

            const query = url.parse(req.url, true).query;

            if (query.event === 'up') {
                console.log(`Uplink received with payload: ${body}`);
            } else {
                console.log(`handler for event ${query.event} is not implemented`);
            }
        });
    }
});

server.listen(8090);
