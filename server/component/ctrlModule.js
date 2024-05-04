
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {getBodyData} = require('../util/getBodyData');
const {cookieParser} = require('../util/cookieParser');

async function createUser(req, res, dbClient){
    const body = await getBodyData(req);
    const {username, email, password} = JSON.parse(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql=`INSERT INTO users 
    (username, email, password) VALUES 
    ('${username}','${email}','${hashedPassword}')`;

    dbClient.query(sql,(err)=>{
        try{
            if(err) throw(new Error('username or email already exist!'));

            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });

            res.end(JSON.stringify({
                data:{
                    username:`${username}`,
                    email:`${email}`
                }
            }));
        }catch(err){
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });

            res.end(JSON.stringify({
                errors:"username or email already exist!"
            }));
        }
        
    });
}

async function accessUser(req, res, dbClient){
    const body = await getBodyData(req);
    const {email, password} = JSON.parse(body);
    const sql=`SELECT * FROM 
    users WHERE email='${email}'`;

    dbClient.query(sql,async(err, result)=>{
        try{
            if(err || !result.rowCount) throw(new Error('user email not exist!'));

            const row = result.rows[0];
            const passMatch = await bcrypt.compare(password, row.password);
            
            if(!passMatch) throw(new Error('password not match!'));

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
                `refreshToken=refresh-=temp-token;`+
                `expires=${new Date(Date.now() + 600000).toUTCString()};`+
                `HttpOnly;`+
                `Path="/";`+
                `SameSite=None;`+
                `Secure;`
            }

            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
                'Set-Cookie':[cookies.accessToken,cookies.refreshToken]
            });
            
            res.end(JSON.stringify({
                data:{
                    login:true,
                }
            }));
        }catch(err){
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
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
        const cookie = req.headers.cookie;
       
        if(!cookie) throw(new Error('cookie not found!'));

        const token = cookieParser(cookie).get("accessToken");

        decoded = jwt.verify(token,"TEMP-SECRET-KEY");

        if(!decoded) throw(new Error('cookie not valid!'));
    }catch(err){
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
        });

        res.end(JSON.stringify({
            errors:"Unauthorized"
        }));
    }

    const email = decoded.email;
    const sql=`SELECT * FROM 
    users WHERE email='${email}'`;

    dbClient.query(sql,(err, result)=>{
        try{
            if(err || !result.rowCount) throw(new Error('user email not exist!'));

            const row = result.rows[0];

            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });
            
            res.end(JSON.stringify({
                data:{
                    username:`${row.username}`,
                    email:`${row.email}`,
                }
            }));
        }catch(err){
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
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
        const cookie = req.headers.cookie;
       
        if(!cookie) throw(new Error('cookie not found!'));

        const token = cookieParser(cookie).get("accessToken");

        decoded = jwt.verify(token,"TEMP-SECRET-KEY");

        if(!decoded) throw(new Error('cookie not valid!'));
    }catch(err){
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
        });

        res.end(JSON.stringify({
            errors:"Unauthorized"
        }));
    }

    const body = await getBodyData(req);
    const {username} = JSON.parse(body);
    const email = decoded.email;
    const sql=`UPDATE users SET username='${username}' 
    WHERE email='${email}'`;

    dbClient.query(sql,(err, result)=>{
        try{
            if(err || !result.rowCount) throw(new Error('username already exist'));

            res.writeHead(200,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });
            
            res.end(JSON.stringify({
                data:{
                    username:username
                }
            }));
        }catch(err){
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });

            res.end(JSON.stringify({
                errors:"something wrong please try again!"
            }));
        }
    })
}

async function logoutUser(req, res){
    let decoded;

    try{
        const cookie = req.headers.cookie;
       
        if(!cookie) throw(new Error('cookie not found!'));

        const token = cookieParser(cookie).get("accessToken");

        decoded = jwt.verify(token,"TEMP-SECRET-KEY");

        if(!decoded) throw(new Error('cookie not valid!'));

        const delCookies = {
            accessToken:
            `accessToken=${token};`+
            `expires=Thu, 01 jan 1970 00:00:00 GMT;`+
            `HttpOnly;`+
            `Path="/";`+
            `SameSite=None;`+
            `Secure;`+
            `MaxAge=-1;`
            ,
            refreshToken:
            `refreshToken=refresh-=temp-token;`+
            `expires=Thu, 01 jan 1970 00:00:00 GMT;`+
            `HttpOnly;`+
            `Path="/";`+
            `SameSite=None;`+
            `Secure;`+
            `MaxAge=-1;`
        }

        res.writeHead(200,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
            'Set-Cookie':[delCookies.accessToken,delCookies.refreshToken]
        });
        
        res.end(JSON.stringify({
            data:{
                logout:true
            }
        }));

    }catch(err){
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
        });

        res.end(JSON.stringify({
            errors:"Unauthorized"
        }));
    }
}

async function deleteUser(req, res, dbClient){
    let decoded,token;
    
    try{
        const cookie = req.headers.cookie;
       
        if(!cookie) throw(new Error('cookie not found!'));

        const token = cookieParser(cookie).get("accessToken");

        decoded = jwt.verify(token,"TEMP-SECRET-KEY");

        if(!decoded) throw(new Error('cookie not valid!'));
    }catch(err){
        res.writeHead(400,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001',
            'Access-Control-Allow-Credentials':'true',
        });

        res.end(JSON.stringify({
            errors:"Unauthorized"
        }));
    }

    const email = decoded.email;
    const body = await getBodyData(req);
    const {password} = JSON.parse(body);
    const sqlpass=`SELECT * FROM 
    users WHERE email='${email}'`;

    dbClient.query(sqlpass,async(err, result)=>{
        try{
            if(err || !result.rowCount) throw(new Error('email not found!'));

            const row = result.rows[0];
            const passMatch = await bcrypt.compare(password, row.password);

            if(!passMatch) throw(new Error('password not match!'));
            
            const sql=`DELETE FROM users 
            WHERE email='${email}'`;

            dbClient.query(sql,(err)=>{
                if(err)throw(new Error('user email not exist!'));

                const delCookies = {
                    accessToken:
                    `accessToken=${token};`+
                    `expires=Thu, 01 jan 1970 00:00:00 GMT;`+
                    `HttpOnly;`+
                    `Path="/";`+
                    `SameSite=None;`+
                    `Secure;`+
                    `MaxAge=-1;`
                    ,
                    refreshToken:
                    `refreshToken=refresh-=temp-token;`+
                    `expires=Thu, 01 jan 1970 00:00:00 GMT;`+
                    `HttpOnly;`+
                    `Path="/";`+
                    `SameSite=None;`+
                    `Secure;`+
                    `MaxAge=-1;`
                }
        
                res.writeHead(200,{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'http://localhost:3001',
                    'Access-Control-Allow-Credentials':'true',
                    'Set-Cookie':[delCookies.accessToken,delCookies.refreshToken]
                });

                res.end(JSON.stringify({
                    data:{
                        delete:true
                    }
                }));
            })
        }catch(err){
            console.log(err);
            res.writeHead(400,{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3001',
                'Access-Control-Allow-Credentials':'true',
            });

            res.end(JSON.stringify({
                errors:"Unauthorized"
            }));
        }
    })
}

module.exports = {
    createUser,
    accessUser,
    updateUser,
    getUser,
    logoutUser,
    deleteUser
}