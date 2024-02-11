import http from 'http';
import { subscriptions } from './data.js';

const server = http.createServer((req, res) => {
  // Set the response header
  res.setHeader('Content-Type', 'application/json');

  // Manual parsing of URL and query parameters.
  // URL constructor directly, which is a global Node.js API
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  // Check for the route, method, and query parameters
  if (reqUrl.pathname === '/subscription' && req.method === 'GET') {
    const id = reqUrl.searchParams.get('id'); // Extract 'id' query parameter
    const subscription = subscriptions.find((sub) => sub.id.toString() === id);

    if (subscription) {
      res.writeHead(200); // HTTP status code 200: OK
      res.end(JSON.stringify(subscription));
    } else {
      res.writeHead(404); // HTTP status code 404: Not Found
      res.end(JSON.stringify({ message: 'Subscription not found' }));
    }
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
