import prisma from './config/prisma.js';

async function run() {
  const admin = await prisma.user.findFirst({ where: { role: 'Admin' } });
  console.log(admin);

  if (admin) {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: admin.email, password: 'password' }) // assumes 'password' works
    });
    const data = await res.json();
    console.log('Token:', data.token);

    if (data.token) {
      // Create a small 1px PNG buffer
      const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      
      const formData = new FormData();
      formData.append('image', new Blob([buf], { type: 'image/png' }), 'test.png');
      
      const uploadRes = await fetch('http://localhost:5000/api/admin/pages/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.token}`
        },
        body: formData
      });
      console.log('Upload status:', uploadRes.status);
      console.log('Upload response:', await uploadRes.json().catch(e => uploadRes.text()));
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
