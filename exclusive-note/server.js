const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;
const source = 'https://raw.githubusercontent.com/naimozduman/us-maybe-hmm/028072a03ee15fd1da4b85e4f7356ae24f11088f/exclusive-note/index.html';
let cached = null;
function load(cb){
  if(cached) return cb(null,cached);
  https.get(source,res=>{
    let data='';
    res.setEncoding('utf8');
    res.on('data',chunk=>data+=chunk);
    res.on('end',()=>{
      if(res.statusCode<200 || res.statusCode>=300) return cb(new Error('source status '+res.statusCode));
      cached=data; cb(null,data);
    });
  }).on('error',cb);
}
http.createServer((req,res)=>{
  load((err,html)=>{
    if(err){res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Server error');}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
    res.end(html);
  });
}).listen(port,'0.0.0.0',()=>console.log(`listening on ${port}`));
