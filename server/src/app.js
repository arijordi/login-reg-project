const http = require('http');

const server = http.createServer((req, res)=>{
    if(req.url === '/api/users' && req.method === 'POST'){
        //reg
    }else if(req.url === '/api/users/login' && req.method === 'POST'){
        //login
    }else if(req.url === '/api/users/current' && req.method === 'PATCH'){
        //update
    }else if(req.url === '/api/users/current' && req.method === 'GET'){
        //get
    }else if(req.url === '/api/users/logout' && req.method === 'DELETE'){
        //logout
    }else if(req.url === '/api/users/current' && req.method === 'DELETE'){
        //delete
    }else {
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify(
            {message:'Route Not Found'}
        ));
    }

    
})

module.exports = {server};