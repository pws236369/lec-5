import http from 'http';
import { subscriptions } from './data.js';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // Handling GET request to fetch a subscription by ID
  if (req.url.startsWith('/subscription/') && req.method === 'GET') {
    const id = req.url.split('/')[2];
    const subscription = subscriptions.find((sub) => sub.id.toString() === id);
    if (subscription) {
      res.writeHead(200);
      res.end(JSON.stringify(subscription));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Subscription not found' }));
    }
  }

  // Handling POST request to add a new subscription
  else if (req.url === '/subscription' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
      const newSubscription = JSON.parse(body); // Parse the JSON string
      newSubscription.id = subscriptions.length + 1; // Assign a new ID; simplistic approach!
      subscriptions.push(newSubscription); // Add the new subscription to the array

      res.writeHead(201);
      res.end(JSON.stringify(newSubscription));
    });
  } else {
    // Handle not found or incorrect method
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Resource not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
When a POST request (or any request with a body) is sent to a Node.js server, the data isn't received all at once. 
Instead, it arrives in pieces or "chunks". This is due to the way data is transmitted over networks, in packets, 
to efficiently use bandwidth and ensure data integrity, especially when dealing with large amounts of data. 
*/
