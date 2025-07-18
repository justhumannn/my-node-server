var express = require('express');
var router = express.Router();

var template = require('./template.js');
var db = require('./db');

router.get('/login', function(request,response) {
    var title = '로그인';
    var html = template.HTML(title,`
            <h2>로그인</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="username" placeholder="아이디"></p>
            <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>            
            <p>계정이 없으신가요?  <a href="/auth/register">회원가입</a></p> 
        `, '');
    response.send(html);
});

router.post('/login_process', function (request,response){
    var username = request.body.username;
    var password = request.body.pwd;
    if (username && password){
        db.query ('select * from users where username = ? and password = ?', [username,password],function(error, results, fields){
            if (error) throw error;
            if (results.length > 0){
                request.session.is_logined = true;
                request.session.nickname = username;
                request.session.save(function(){
                    response.redirect(`https://clientnode.netlify.app/board.html`);
                });
            } else {
                response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/auth/login";</script>`);
            }
        });
    }else{
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/auth/login";</script>`);
    }
});

router.post('/logout',function(request,response){
    request.session.destroy(function (err){
        if (err) {
            console.error('세션 삭제 오류:', err);
            // 오류 발생 시 에러 페이지 대신 메인으로 강제 이동
            return response.redirect('/');
        }
        response.clearCookie('connect.sid');
        response.redirect('/');
    });
});

router.get('/register', function(request,response){
    var title = '회원가입';
    var html = template.HTML(title, `
    <h2>회원가입</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="username" placeholder="아이디"></p>
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="btn" type="submit" value="제출"></p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});

router.post('/register_process', function(request,response){
    var username = request.body.username;
    var password = request.body.pwd;
    var password2 = request.body.pwd2;

    if (username && password && password2){
        db.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO users (username, password) VALUES(?,?)', [username, password], function (error, data) {
                    if (error) throw error;
                    response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/auth/login";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/auth/register";</script>`);    
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);    
            }            
        });
    } else {        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
});
module.exports = router;