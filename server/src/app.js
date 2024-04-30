const http = require('http');
const {Client} = require('pg');
const fs = require('fs');
const lookup = require('mime-types').lookup;
const {parse} = require('url');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

    //bycrpt password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`hash:: ${hashedPassword}`);
    
    //console.log(`${username}, ${email}, ${password}`);
    const sql=`INSERT INTO users 
    (username, email, password) VALUES 
    ('${username}','${email}','${hashedPassword}')`;

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

            const passMatch = bcrypt.compare(password, row.password);

            if(!passMatch) throw err;

            //prepare refresh and access token
            const token = jwt.sign(
                {"username":`${row.username}`,
                "email":`${row.email}`},
                "TEMP-SECRET-KEY",
                {expiresIn:'600s'}
            )

            const cookies = {
                accessToken:
                `accessToken=${token};`+
                `expires=${new Date(Date.now() + 600000).toUTCString()};`+
                `HttpOnly;`+
                `Path="/";`+
                `SameSite=None;`+
                `Secure;`
                ,
                refreshToken:
                `refreshToken=refresh-=temp-token-${row.username};`+
                `expires=${new Date(Date.now() + 600000).toUTCString()};`+
                `HttpOnly;`+
                `Path="/";`+
                `SameSite=None;`+
                `Secure;`
            }

            //send refresh token using httponly
            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
                'Set-Cookie':[cookies.accessToken,cookies.refreshToken]
            });
            
            //send access token
            res.end(JSON.stringify({
                data:{
                    success:true,
                }
            }));

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
    
    let decoded;

    try{
        //token parse and verify
        const cookie = req.headers.cookie;
        if(!cookie) throw err;

        console.log(`header cookie :: ${cookie}`);

        let cookies = cookie.split(";");

        let index, token; 
        let key = []; 
        let value = [];

        for (i = 0; i < cookies.length; i++ ){
            cookies[i] = cookies[i].trim();
            index = cookies[i].indexOf("=");
            key[i] = cookies[i].slice(0, index);
            value[i] = cookies[i].slice(index + 1);

            console.log(`${cookies},${index}`);
            console.log(`parse :: ${key[i]}:${value[i]} , index:${i}`);

            if(key[i] === 'accessToken')token = value[i];
        }

        decoded = jwt.verify(token,"TEMP-SECRET-KEY");
        if(!decoded) throw err;

    }catch(err){
        console.log(`token verify err :: ${err}`);
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001'
        });
        res.end(JSON.stringify({
            errors:"Unauthorized"
        }));
    }

    const email = decoded.email;
    
    console.log(`jwt :: ${decoded}, ${decoded.email}`);

    //sql 
    const sql=`SELECT * FROM 
    users WHERE email='${email}'`;

    //query
    dbClient.query(sql,(err, result)=>{
        try{
            //validate token
            if(err | !result.rowCount) throw err;

            console.log(`Result : 
            ${JSON.stringify(result.rowCount)},
            ${JSON.stringify(result.rows[0])}`);

            const row = result.rows[0];
            
            //token decode
            //get token username & email credential

            //send token using httponly cookie
            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });
            
            //send jwt
            res.end(JSON.stringify({
                data:{
                    username:`${row.username}`,
                    email:`${row.email}`,
                }
            }));

        }catch(err){
            console.log(`catch :: ${err}`);
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001'
            });
            res.end(JSON.stringify({
                errors:"Unauthorized"
            }));
        }
    })
}



async function updateUser(req, res, dbClient){
   
    let decoded;

    try{
        //token parse and verify
        const cookie = req.headers.cookie;
        if(!cookie) throw err;

        console.log(`header cookie :: ${cookie}`);

        let cookies = cookie.split(";");

        let index, token; 
        let key = []; 
        let value = [];

        for (i = 0; i < cookies.length; i++ ){
            cookies[i] = cookies[i].trim();
            index = cookies[i].indexOf("=");
            key[i] = cookies[i].slice(0, index);
            value[i] = cookies[i].slice(index + 1);

            console.log(`${cookies},${index}`);
            console.log(`parse :: ${key[i]}:${value[i]} , index:${i}`);

            if(key[i] === 'accessToken')token = value[i];
        }

        decoded = jwt.verify(token,"TEMP-SECRET-KEY");
        if(!decoded) throw err;

    }catch(err){
        console.log(`token verify err :: ${err}`);
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001'
        });
        res.end(JSON.stringify({
            errors:"Unauthorized"
        }));
    }


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
    const {username} = JSON.parse(body);


    const email = decoded.email;
    
    console.log(`jwt :: ${decoded}, ${decoded.email}`);

    //sql insert new username where email is decoded email
    const sql=`UPDATE users SET username='${username}' 
    WHERE email='${email}'`;

    //query
    dbClient.query(sql,(err, result)=>{
        try{
            if(err | !result.rowCount) throw err;

            console.log(`Result :${JSON.stringify(result)}`);
            
            //send token using httponly cookie
            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });
            
            //send jwt
            res.end(JSON.stringify({
                data:{
                    username:username
                }
            }));

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
    })
}


function ctrlAPI(req, res, dbClient){
    console.log(`${req.url}, ${req.method}`);
    if(req.method === 'OPTIONS'){
        res.writeHead(200,{
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Methods':'GET, POST, OPTIONS, PATCH, DELETE',
            'Access-Control-Allow-Headers':'Content-Type, Authorization, withCredentials',
            'Access-Control-Allow-Credentials':'true',
        });
        res.end();
    }else if(req.url === '/api/users' && req.method === 'POST'){
        createUser(req, res, dbClient);
    }else if(req.url === '/api/users/login' && req.method === 'POST'){
        accessUser(req, res, dbClient);
    }else if(req.url === '/api/users/current' && req.method === 'GET'){
        getUser(req, res, dbClient);
    }else if(req.url === '/api/users/current' && req.method === 'PATCH'){
        //update
        updateUser(req, res, dbClient);
    }/*else if(req.url === '/api/users/logout' && req.method === 'DELETE'){
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
    let fileName = urlSplited[urlSplited.length - 1].trim();

    console.log(`url :: ${req.url}, filename :: ${fileName}`);
    
    const filenames = 
    [
        '',
        'login',
        'register',
        'content',
        'edit',
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
        //console.log(`connected : ${JSON.stringify(dbClient)}`);
        
        ctrlAPI(req, res, dbClient);
    }
})

module.exports = {serverPage, serverAPI};