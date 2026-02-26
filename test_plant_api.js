const fs = require('fs');
const payload = JSON.parse(fs.readFileSync('payload_test.json','utf8'));

(async () => {
  try {
    const res = await fetch('https://plant.id/api/v3/health_assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': 'FjhTew9YYqcdEWqCI9nJzxk1uUPELtSiKx0foHRtmdZwhWbxam'
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('HTTP', res.status, res.statusText);
    console.log(text);
  } catch (err) {
    console.error('Request error:', err);
  }
})();
