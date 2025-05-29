const http = require('http');

// 新增連線逾時設定
const options = {
  hostname: 'localhost',
  port: 3006,
  path: '/sse',
  method: 'GET',
  timeout: 5000 // 5秒逾時
};

const req = http.request(options, (res) => {
  console.log(`HTTP狀態碼: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => console.log('響應內容:', chunk));
});

req.on('error', (e) => {
  console.error('錯誤類型:', e.constructor.name);
  console.error('錯誤訊息:', e.message);
});

req.on('timeout', () => {
  console.error('連線逾時');
  req.destroy();
});

req.end();