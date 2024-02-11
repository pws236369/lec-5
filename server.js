import http from 'http';
import { subscriptions } from './data.js';

const server = http.createServer((req, res) => {
  // Set the response header
  res.setHeader('Content-Type', 'application/json');

  // Extract the ID from the URL path
  const path = req.url.split('/'); // Split the URL path by '/'
  const id = path.length > 2 ? path[2] : null; // The ID is expected to be the third segment

  if (path[1] === 'subscription' && req.method === 'GET' && id) {
    const subscription = subscriptions.find((sub) => sub.id.toString() === id);
    if (subscription) {
      res.writeHead(200); // HTTP status code 200: OK
      res.end(JSON.stringify(subscription));
    } else {
      res.writeHead(404); // HTTP status code 404: Not Found
      res.end(JSON.stringify({ message: 'Subscription not found' }));
    }
  } else {
    // Handle not found or incorrect path
    res.writeHead(404); // HTTP status code 404: Not Found
    res.end(JSON.stringify({ message: 'Resource not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
