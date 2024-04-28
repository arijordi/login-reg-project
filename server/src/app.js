const http = require('http');
const {Client} = require('pg');
const fs = require('fs');
const lookup = require('mime-types').lookup;
const {parse} = require('url');

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
        //if(dbClient)console.log(`dbConn : ${JSON.stringify(dbClient)}`);
    });

    return dbClient;
})();

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

    const body = await data;
    //console.log(`body : ${body}`);
    const {username, email, password} = JSON.parse(body);
    
    //console.log(`${username}, ${email}, ${password}`);
    const sql=`INSERT INTO users 
    (username, email, password) VALUES 
    ('${username}','${email}','${password}')`;

    dbClient.query(sql,(err, result)=>{
        try{
            if(err) throw err;
        
            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001'
            });

            res.end(JSON.stringify({
                data:{
                    username:`${username}`,
                    email:`${email}`
                }
            }));

            console.log(`Result : ${JSON.stringify(result)}`);
        }catch(err){
            console.log(`catch :: ${err}`);
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001'
            });
            res.end(JSON.stringify({
                errors:"something wrong please try again!"
            }));
        }
        
    });
}

async function accessUser(req, res, dbClient){
   
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

    const body = await data;
    const {email, password} = JSON.parse(body);

    const sql=`SELECT * FROM 
    users WHERE email='${email}'`;

    dbClient.query(sql,(err, result)=>{
        try{
            if(err | !result.rowCount) throw err;

            console.log(`Result : 
            ${JSON.stringify(result.rowCount)}`);

            const row = result.rows[0];

            if(row.password === password)
            {
                //prepare jwt

                //send token using httponly cookie
                res.writeHead(200,{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'http://localhost:3001',
                    'Access-Control-Allow-Credentials':'true',
                    'Set-Cookie':`myCookie=temp-token-${row.username};expires=${new Date(Date.now() + 600000).toUTCString()};HttpOnly;Path="/";SameSite=None;Secure`
                });
                
                //send jwt
                res.end(JSON.stringify({
                    data:{
                        token:`temp-token-${row.username}`,
                    }
                }));
            }else throw err;

        }catch(err){
            console.log(`catch :: ${err}`);
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001'
            });
            res.end(JSON.stringify({
                errors:"username or password wrong!"
            }));
        }
        
    });
}


async function getUser(req, res, dbClient){

    //validate token
    const token = req.headers.cookie;
    console.log(token);

    try{
        res.writeHead(200,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
        });
        
        //send jwt
        res.end(JSON.stringify({
            data:{
                success:`test only ${req.headers.cookie}`,
            }
        }));
    }catch(err){
        console.log(`catch :: ${err}`);
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
        });
        res.end(JSON.stringify({
            errors:"something went wrong!"
        }));
    }
   

    //query if t
    //err if f

    /*
    const sql=`SELECT * FROM 
    users WHERE email='${email}'`;

    dbClient.query(sql,(err, result)=>{
        try{
            if(err | !result.rowCount) throw err;

            console.log(`Result : 
            ${JSON.stringify(result.rowCount)}`);

            const row = result.rows[0];

            if(row.password === password)
            {
                //prepare jwt

                //send token using httponly cookie
                res.writeHead(200,{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'http://localhost:3001',
                    'Set-Cookie':`myCookie=temp-token-${row.username}; HttpOnly`
                });
                
                //send jwt
                res.end(JSON.stringify({
                    data:{
                        token:`temp-token-${row.username}`,
                    }
                }));
            }else throw err;

        }catch(err){
            console.log(`catch :: ${err}`);
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001'
            });
            res.end(JSON.stringify({
                errors:"username or password wrong!"
            }));
        }
        
        
    });
    */
}

function ctrlAPI(req, res, dbClient){
    console.log(`${req.url}, ${req.method}`);
    if(req.method === 'OPTIONS'){
        res.writeHead(200,{
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers':'Content-Type, Authorization, withCredentials',
            'Access-Control-Allow-Credentials':'true',
        });
        res.end();
    }else if(req.url === '/api/users' && req.method === 'POST'){
        //reg
        console.log('tst');
        createUser(req, res, dbClient);
    }
    else if(req.url === '/api/users/login' && req.method === 'POST'){
        //login
        accessUser(req, res, dbClient);
    }else if(req.url === '/api/users/current' && req.method === 'POST'){
        //get
        getUser(req, res, dbClient);
    }/*else if(req.url === '/api/users/current' && req.method === 'PATCH'){
        //update
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

const serverPage = http.createServer((req, res)=>{
    let url = parse(req.url,true);
    url = url.path.replace(/^\/+|\/+$/g, '');
    const urlSplited = url.split('/');
    let fileName = urlSplited[urlSplited.length - 1];
    
    if(fileName === '') {
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
        //console.log(`connected : ${JSON.stringify(dbClient)}`);
        
        ctrlAPI(req, res, dbClient);
    }
})

module.exports = {serverPage, serverAPI};