const http = require('http');

const port = 3000;

const server = createServer((req, res) => {
  console.log('requestListener was called');
});

server.listen(port, () => {
  console.log('Server is listening on port = ${port}');
});