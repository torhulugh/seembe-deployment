const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Seembe Deployment - Application is running!\n');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
