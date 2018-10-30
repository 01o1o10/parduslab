
const express = require('express')
const app = express()
const router = express.Router()
const sql = require('./../modules/sql')

router.get('/', (req, res) => {
  res.render('index', {
    error: null
  })
})

router.post('/portal', (req, res) => {
  var sqlStatement = "select * from users where user_uname='" + req.body.loginUname + "' and user_pass='" + req.body.loginPass + "'"
  sql.query(sqlStatement, function(users){
    if(users.length == 1){
      sqlStatement = "select * from tasks where task_id in (select ut_task_id from user_task where ut_user_id='" + users[0].user_id + "' and ut_task_status='active') order by task_pj_id"
      sql.query(sqlStatement, function(tasks){
        sqlStatement = "select * from projects order by project_begin_date desc limit 0, 20"
        sql.query(sqlStatement, function(projects){
          res.render('portal', {
            user: users[0],
            tasks: tasks,
            projects: projects
          })
        })
      })
    }
    else {
      res.render('index', {
        error: "Kullanıcı adı veya parola yanlış!"
      })
    }
  })
})

router.post('/project', (req, res) => {
  sql.query("select * from projects where project_id=" + req.body.projectId, function(projects){
    sql.query("select * from tasks where task_pj_id=" + req.body.projectId, function(tasks){
      res.render('project', {
        project: projects[0],
        tasks: tasks
      })
    })
  })
})

router.post('/task', (req, res) => {
  sql.query("select * from tasks where task_id=" + req.body.taskId, function(tasks){
    res.render('task', {
      task: tasks[0]
    })
  })
})

module.exports = router
