const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const file = path.join(__dirname, 'index.html');
http.createServer((req,res)=>{
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(500);return res.end('Server error');}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
    res.end(data);
  });
}).listen(port,'0.0.0.0',()=>console.log(`listening on ${port}`));
