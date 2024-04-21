# Token Spec

Header :
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload :

```json
{

    "name":"ari jordi",
    "admin":false
}
```

Signature :

```json
{
    "secretkey":"key123",
}
```