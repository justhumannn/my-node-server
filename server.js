const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
var authCheck = require('./lib_login/authCheck.js');
var template = require('./lib_login/template.js');
var fs = require('fs');
const path = require('path');
const cors = require('cors');

var authRouter = require('./lib_login/auth.js')
const app = express()
app.use(cors());
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  store:new FileStore(),
}))
app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
    // process.chdir();
})

app.get('/',(요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/board',(req,res) => {
    if (!authCheck.isOwner(req,res)){
        res.redirect('/auth/login');
        return false;
    } else {
        res.redirect('/board/main');
        return false;
    }
})

app.use('/auth',authRouter);
app.get('/board/main',(req,res) => {
    if (!authCheck.isOwner(req,res)){
        res.redirect('/auth/login');
        return false;
    }
    res.sendFile(__dirname + '/board.html')
})
app.get('/num',(req,res) => [
    res.sendFile(__dirname + '/num.html')
])
app.get('/rps',(req,res) => [
    res.sendFile(__dirname + '/rsp.html')
])
