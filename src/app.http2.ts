import fs from 'fs';
import http2 from 'http2';

const server = http2.createSecureServer(
  {
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
  },
  (req, resp) => {
    console.log(req.url);

    // resp.writeHead(200, { 'Content-Type': 'text/html' });
    // resp.write('<h1>Hello World</h1>');
    // resp.end();

    // const data = { name: 'John Doe', age: 30, city: 'Mexico city' };
    // resp.writeHead(200, { 'Content-Type': 'application/json' });
    // resp.end(JSON.stringify(data));

    if (req.url === '/') {
      const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');

      resp.writeHead(200, { 'Content-Type': 'text/html' });
      resp.end(htmlFile);
      return;
    }

    if (req.url?.endsWith('.js')) {
      resp.writeHead(200, { 'Content-Type': 'text/javascript' });
    } else if (req.url?.endsWith('.css')) {
      resp.writeHead(200, { 'Content-Type': 'text/css' });
    }

    try {
      const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8');
      resp.end(responseContent);
    } catch (error) {
      resp.writeHead(404, { 'Content-Type': 'text/html' });
      resp.end();
    }
  }
);

server.listen(8080, () => {
  console.log('server is running on port 8080');
});
