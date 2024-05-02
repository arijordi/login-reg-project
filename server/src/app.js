const http = require('http');
const {Client} = require('pg');
const fs = require('fs');
const lookup = require('mime-types').lookup;
const {parse} = require('url');
const {ctrlAPI} = require('../component/controller');

const db = (()=>{
    const dbClient = new Client({
        user:'ari',
        host:'127.0.0.1',
        database:'api',
        password:'ari',
        port:'5432',
    });

    dbClient.connect((err)=>{
        if(err) throw err;
    });

    return dbClient;
})();

const serverPage = http.createServer((req, res)=>{
    let url = parse(req.url,true);
    url = url.path.replace(/^\/+|\/+$/g, '');
    const urlSplited = url.split('/');
    let fileName = urlSplited[urlSplited.length - 1].trim();
    
    const filenames = 
    [
        '',
        'login',
        'register',
        'content',
        'edit',
        'delete',
    ];

    if(filenames.includes(fileName)) {
        fileName = 'index.html';
        url = fileName;
    }
        
    const fpath = `${__dirname}/../../client/dist/${url}`

    fs.readFile(fpath, (err, d)=>{
        if(err){
            res.writeHead(404);
            res.end()
        }else{
            const mime = lookup(fileName);
            res.writeHead(200, {'Content-Type':mime})
            res.end(d); 
        }
    })
})

const serverAPI = http.createServer((req, res)=>{
    let tLimit;

    tLimit = setTimeout(()=>{
        console.log(`DB connect took long... Fail!`);
        clearTimeout(tLimit);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify(
            {message:'something wrong'}
        ));
    }, 3000);
   
    if(db){
        clearTimeout(tLimit);
        const dbClient = db;
        
        ctrlAPI(req, res, dbClient);
    }
})

module.exports = {serverPage, serverAPI};