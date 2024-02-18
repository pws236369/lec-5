import http from 'http';
import fs from 'fs';
import { subscriptions } from './data.js';

const server = http.createServer((req, res) => {
  // Determine the action based on URL and method using switch-case
  switch (true) {
    case req.url.startsWith('/subscription/') && req.method === 'GET':
      console.log('>>>', req.headers.cookie);
      handleGetSubscription(req, res);
      break;
    case req.url === '/subscription' && req.method === 'POST':
      handlePostSubscription(req, res);
      break;
    case req.url === '/' && req.method === 'GET':
      serveIndexHtml(res);
      break;
    case req.url === '/script.js' && req.method === 'GET':
      serveScriptJs(res);
      break;
    default:
      // Handle not found or incorrect method
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Resource not found' }));
  }
});

const handleGetSubscription = (req, res) => {
  const id = req.url.split('/')[2];
  const subscription = subscriptions.find((sub) => sub.id.toString() === id);
  res.setHeader('Content-Type', 'application/json');
  if (subscription) {
    res.writeHead(200);
    res.end(JSON.stringify(subscription));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Subscription not found' }));
  }
};

const handlePostSubscription = (req, res) => {
  let chunks = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });
  req.on('end', () => {
    let body = Buffer.concat(chunks).toString();
    const newSubscription = JSON.parse(body);
    newSubscription.id = subscriptions.length + 1;
    subscriptions.push(newSubscription);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newSubscription));
  });
};

const serveIndexHtml = (res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Set-Cookie', [
      'titleColor=green; path=/; max-age=86400', // Expires in 1 day
      'userPreference=darkMode; path=/; max-age=432000', // Another example cookie
    ]);
    res.setHeader(
      'Set-Cookie',
      'id=abc123; Domain=localhost; Path=/; HttpOnly'
    );
    res.setHeader('Set-Cookie', 'yo=abc123; secure; Path=/; HttpOnly');

    res.end(data);
  });
};

const serveScriptJs = (res) => {
  fs.readFile('script.js', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('script.js not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(data);
  });
};

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
