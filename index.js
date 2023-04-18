const express = require('express');
const http = require('http');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
server.listen(port, () => {
  console.log('listening on *:' + port);
});
