const {serverPage, serverAPI} = require('./src/app');

serverPage.listen(3001, ()=>{console.log(`Server serve page run at ${3001}`)});
serverAPI.listen(1234, ()=>{console.log(`Server serve API run at ${1234}`)});