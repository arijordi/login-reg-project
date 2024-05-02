
function cookieParser(cookie){
    const cookiesMap = new Map();
    
    let cookies;
    let index;
    let key = []; 
    let value = [];

    cookies = cookie.split(";");

    for (i = 0; i < cookies.length; i++ ){
        cookies[i] = cookies[i].trim();
        index = cookies[i].indexOf("=");
        key[i] = cookies[i].slice(0, index);
        value[i] = cookies[i].slice(index + 1);
        cookiesMap.set(key[i],value[i]);
    }

    return cookiesMap;
}

module.exports = {cookieParser}