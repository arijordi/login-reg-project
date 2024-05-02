
function getBodyData(req){
    return new Promise((res, rej)=>{
        try{
            let body='';
            
            req.on('data', (d)=>{
                body += d.toString();
            });
    
            req.on('end',()=>{
                return res(body);
            });
        }catch(err){
            return rej(err);
        }
    });
}

module.exports = {getBodyData}