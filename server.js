import http from 'http';
import { subscriptions } from './data.js';

const server = http.createServer((req, res) => {
  // Set the response header
  res.setHeader('Content-Type', 'application/json');

  // Check for the route and method
  if (req.url === '/subscription' && req.method === 'GET') {
    res.writeHead(200); // HTTP status code 200: OK
    res.end(JSON.stringify(subscriptions[0]));
  } else {
    // Handle not found
    res.writeHead(404); // HTTP status code 404: Not Found
    res.end(JSON.stringify({ message: 'Resource not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
