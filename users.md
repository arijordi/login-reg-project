# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body : 

```json
{

    "username":"ari",
    "email":"ari@mail.com",
    "password":"pass123"
}
```

Response Body Success:

```json
{
    "data":{
        "username":"ari",
        "email":"ari@mail.com"
    }
}
```

Response Body Error:

```json
{
    "errors":"something wrong please try again!"
}
```

## Login User API

Endpoint : POST /api/users/login

Headers: 
- Authorization : token

Request Body:

```json
{
    "email":"ari@mail.com",
    "password":"pass123"
}
```

Response Body Success:

```json
{
    "data":{
        "token":"unique token"
    }
}

Response Body Error:

```json
{
    "errors":"username or password wrong!"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers: 
- Authorization : token

Request Body:
```json
{
    "username":"new",//optional
    "password":"newpass123"//optional
}
```

Response Body Success:
```json
{
    "username":"new"
}
```

Response Body Error:
```json
{
    "errors":"something wrong please try again!"
}
```

## Get User API

Endpoint: /api/users/current

Headers: 
- Authorization : token


Response Body Success:
```json
{
    "data":{
        "username":"new"
    }
    
}
```

Response Body Error:
```json
{
    "errors":"Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/user/logout


Response Body Success:
```json
{
    "data":"Logout success"
}
```

Response Body Error:
```json
{
    "errors":"Unauthorized"
}
```

## Delete User Api

Endpoint : DELETE /api/users/current

Headers : 
- Authorization : token

Response Body Success:
```json
{
    "data":"Delete success"
}
```

Response Body Error:
```json
{
    "errors":"Unauthorized"
}
```