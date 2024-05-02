const {
    createUser,
    accessUser,
    updateUser,
    getUser,
    logoutUser,
    deleteUser
} = require ('../component/ctrlModule');


function ctrlAPI(req, res, dbClient){
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
        updateUser(req, res, dbClient);
    }else if(req.url === '/api/users/logout' && req.method === 'DELETE'){
        logoutUser(req, res);
    }else if(req.url === '/api/users/current' && req.method === 'DELETE'){
        deleteUser(req, res, dbClient);
    }
    else {
        res.writeHead(404, {'Content-Type':'application/json'});
        
        res.end(JSON.stringify(
            {message:'Route Not Found'}
        ));
    }
}

module.exports = {ctrlAPI}