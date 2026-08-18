const http = require('http');

const data = JSON.stringify({
  email: 'admin@stayr.com',
  password: 'password'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log(json.token);
  });
});

req.write(data);
req.end();
