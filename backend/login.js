import http from 'http';

const email = process.argv[2] || 'admin@stayr.com';
const password = process.argv[3] || 'password123';

const data = JSON.stringify({
  email,
  password
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log('Login Response:', json);
      if (json.token) {
        console.log('Token:', json.token);
      }
    } catch (e) {
      console.error('Failed to parse response:', body);
    }
  });
});

req.on('error', (err) => {
  console.error('Login request error:', err.message);
});

req.write(data);
req.end();

