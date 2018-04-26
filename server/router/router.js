var Until=require('../lib/Util/until.js');
var Config=require('../lib/config/config.js');
var log4js=require('../lib/log4js/logger.js');
const auth = require('../lib/auth/auth.service.js');
const config = require('../lib/config/config.js')
var sha1 = require('sha1');
var soap = require('soap');
var fs=require('fs');
const path=require('path');
const token = "Bearer "+auth.signToken(config.session.secret);
var oracledb = require('oracledb');
// routes/index.js
module.exports = function (app) {


    app.get('/c',function(req, res,next){
        oracledb.getConnection({
            user          : Config.oracle.user,
            password      : Config.oracle.password,
            connectString : Config.oracle.connectString
        },function(err, connection){
            if (err) {
                console.error(err.message);
                return;
              }
              connection.execute(
                  
                `SELECT mobile
                FROM t_sgm_user_1003
                WHERE FACID = :id`,
              
              [1003]
                  
                ,function(err, result){
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                      }
                      console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
                      console.log(result.rows);     // [ [ 180, 'Construction' ] ]
                      doRelease(connection);
                      return res.send(result.rows); 
   
              })


              // Note: connections should always be released when not needed
                function doRelease(connection) {
                    connection.close(
                    function(err) {
                        if (err) {
                        console.error(err.message);
                        }
                    });
                }
        })


 
    });

    

    app.post('/gettoken',function(req, res,next){
        res.writeHead(200,{
            'authorization':token
        });
        res.end(token);


        
    });

    
    app.post('/index',auth.isAuthenticated(),function(req, res,next){
        return res.send("index api"); 
    });


    app.post('/fw',function(req, res,next) {
        log4js.info("【action: /fw 】");
        return res.send("fw apissssssssssssss"); 
    });

    app.get('/fw',function(req, res,next) {
        log4js.info("【action: /fw 】");
        return res.send("fw apisssssssssssssssssssfffffffffffffffffffffff"); 
    });

    app.get('/gettoken',function(req, res,next){

       return  res.end("222222222222222222323232 ");
        
    });



    app.post('/SendAcVerifyInfo',function(req, res,next){
        log4js.info("【action: /SendAcVerifyInfo 】");
        return res.send("SendAcVerifyInfo api"); 
    });



    app.use(function(req, res, next) {

        //判断是主动导向404页面，还是传来的前端路由。
    　　 //如果是前端路由则如下处理'./server/index.html'
    
        fs.readFile(path.join(__dirname,'../index.html'),'utf-8', function(err, data){
            if(err){
                console.log(err);
                res.send('后台错误');
                return next();
            } else {
                res.writeHead(200,{
                    'Content-type': 'text/html',
                    'Connection':'keep-alive'
                });
                res.end(data);
                return next();
            }
        })
    });

};
