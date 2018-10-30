var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const sql = require('../modules/sql')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const session = require('express-session');

app.use(session({
  secret: 'Özel-Anahtar',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/view'))

server.listen(1453)

var den

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/ali', function (req, res) {
  res.send('tamam lan')
})

app.get('/portal', function (req, res) {
  res.sendFile(__dirname + '/portal.html')
})

io.on('connection', function (socket) {

  socket.on('get-project-tasks', function(projectId){
    sqlStatement = "select * from tasks where task_pj_id=" + projectId
    sql.query(sqlStatement, function(results){
      socket.emit('set-project-tasks', results)
    })
  })

  socket.on('login-event', function(loginData){
    var sqlStatement = "select * from users where user_uname='" + loginData.uname + "' and user_pass='" + loginData.pass + "'"
    sql.query(sqlStatement, function(result){
      replayData = {}
      if(result.length == 1){
        replayData.succes = true
        var sqlStatement = "select * from tasks where task_id in (select ut_task_id from user_task where ut_user_id='" + result[0].user_id + "' and ut_task_status='active') order by task_pj_id"
        sql.query(sqlStatement, function(taskResults){
          sqlStatement = "select * from projects order by project_begin_date desc limit 0, 20"
          sql.query(sqlStatement, function(projectResults){
            replayData.userInfo = result[0]
            replayData.taskResults = taskResults
            replayData.projectResults = projectResults
            socket.emit('login-replay', replayData)
          })
        })
      }
      else{
        replayData.message = 'Username or password incorrect!'
        replayData.succes = false
        socket.emit('login-replay', replayData)
      }
    })
  })

  socket.on('register-event', function(registerData){
    var sqlStatement = "insert into users(user_name, user_lname, user_uname, user_pass, user_city, user_level) values('" + registerData.fname + "', '" + registerData.lname + "', '" + registerData.uname + "', '" + registerData.pass + "', " + registerData.city + ", 1)"
    sql.query(sqlStatement, function(result){
      replayData = {}
      if(result.insertId){
        replayData.succes = true
        replayData.message = "Your registration has been received."
      }
      else if(result.errno == 1062){
        replayData.succes = false
        replayData.message = "Username already exists!"
      }
      socket.emit('register-replay', replayData)
    })
  })

})