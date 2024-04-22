const http = require('http');
const {Client} = require('pg');

function dbConn(){
    const client = new Client({
        user:'ari',
        host:'127.0.0.1',
        database:'api',
        password:'ari',
        port:'5432',
    });

    const sql='SELECT * FROM users';
    /*`INSERT INTO users (username, email, password) 
    VALUES ('user2', 'user2@mail.com', 'user123')`;*/

    client.connect((err)=>{
        if(err) throw err;
        console.log('connected');

        client.query(sql,(err, res)=>{
            if(err) throw err;
            console.log(`Result : ${JSON.stringify(res)}`);
        });
    })
}

async function createUser(req, res){
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
        const user={
            username,
            email,
            password
        }
    }catch(err){
        console.log(err);
    }
}

const server = http.createServer((req, res)=>{

    dbConn();

    if(req.url === '/api/users' && req.method === 'POST'){
        //reg
        createUser(req,res);
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

    
})

module.exports = {server};