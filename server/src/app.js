const http = require('http');
const {Client} = require('pg');
const fs = require('fs');
const lookup = require('mime-types').lookup;
const {parse} = require('url');

function dbConn(){
    const dbClient = new Client({
        user:'ari',
        host:'127.0.0.1',
        database:'api',
        password:'ari',
        port:'5432',
    });

    dbClient.connect((err)=>{
        if(err) throw err;
        console.log('conn');
        return dbClient;
    })
}

async function createUser(req, res, dbClient){
    const data = new Promise((res, rej)=>{
        try{
            let body='';
            
            req.on('data', (d)=>{
                body += d.toString();
            });

            req.on('end',()=>{
                res(body);
            });
        }catch(err){
            rej(err);
        }
    });

    try{
        const body = await data;
        const {username, email, password} = JSON.parse(body);
        
        const sql=`INSERT INTO users 
        (username, email, password) VALUES 
        (${username}, ${email}, ${password})`;

        dbClient.query(sql,(err, result)=>{
            if(err) throw err;
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({username:`${username}`}));
            //console.log(`Result : ${JSON.stringify(result)}`);
        });
    }catch(err){
        console.log(err);
    }
}

function ctrlAPI(req, res){
    if(req.url === '/api/users' && req.method === 'POST'){
        //reg
        createUser(req,res, dbClient);
    }
    /*else if(req.url === '/api/users/login' && req.method === 'POST'){
        //login
    }else if(req.url === '/api/users/current' && req.method === 'PATCH'){
        //update
    }else if(req.url === '/api/users/current' && req.method === 'GET'){
        //get
    }else if(req.url === '/api/users/logout' && req.method === 'DELETE'){
        //logout
    }else if(req.url === '/api/users/current' && req.method === 'DELETE'){
        //delete
    }*/
    else {
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify(
            {message:'Route Not Found'}
        ));
    }
}

const server = http.createServer((req, res)=>{
        //looks like read client file need work
        //handle mime type for any dir file it directed to
        let url = parse(req.url,true);
        url = url.path.replace(/^\/+|\/+$/g, '');
        const urlSplited = url.split('/');
        let fileName = urlSplited[urlSplited.length - 1];
        
        if(fileName === '') {
            fileName = 'index.html';
            url = fileName;
        }
         

        const fpath = `${__dirname}/../../client/dist/${url}`
        console.log(url);
        fs.readFile(fpath, (err, d)=>{
            if(err){
                res.writeHead(404);
                res.end()
            }else{
                const mime = lookup(fileName);
                console.log(`mime : ${mime}`);
                res.writeHead(200, {'Content-Type':mime})
                res.end(d); 
            }
        })

        console.log(`res :: ${fileName}, ${fpath}`);
    
    /*
    const dbClient = dbConn();

    if(dbClient){
        ctrlAPI(req, res, dbClient);
    }*/
})

module.exports = {server};