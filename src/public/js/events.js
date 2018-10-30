var userInfo = {}

$(document).ready(function(){
    //// IMPORTS
    const socket = io.connect('http://localhost:1453')
    
    //// VARIABLES
    var projects = []

    //// START

    //// EVENTS
    $(document).on('click', '.project-details', function(){
        $('#portal-body').hide()
        $('#project-body').show()
        $('#project-title').text(projects[this.id].project_name)
        $('#project-description').text(projects[this.id].project_dscr)
        document.getElementById('project-plan').href = projects[this.id].project_plan
        document.getElementById('project-plan').innerText = projects[this.id].project_name
        document.getElementById('project-repo').href = projects[this.id].project_repo
        document.getElementById('project-status').innerText = projects[this.id].project_status
        document.getElementById('project-owner').innerText = projects[this.id].project_owner
        document.getElementById('project-bd').innerText = projects[this.id].project_begin_date.slice(0, 10)
        document.getElementById('project-ed').innerText = projects[this.id].project_end_date.slice(0, 10)

        socket.emit('get-project-tasks', this.id)
        socket.on('set-project-tasks', function(tasks){
            var div = $('#project-tasks')
            for(i = 0; i < tasks.length; i++){
                if(tasks[i].task_status == 'complated'){
                    div.append('<a id="' + tasks[i].task_id + '" href="#" class="list-group-item list-group-item-action"><div class="circle green"></div>' + tasks[i].task_name + '</a>')
                }
                else if(tasks[i].task_status == 'in process'){
                    div.append('<a id="' + tasks[i].task_id + '" href="#" class="list-group-item list-group-item-action"><div class="circle yellow"></div>' + tasks[i].task_name + '</a>')
                }
                else {
                    div.append('<a id="' + tasks[i].task_id + '" href="#" class="list-group-item list-group-item-action"><div class="circle red"></div>' + tasks[i].task_name + '</a>')
                }
            }
        })
        $('#project-body').show()
    })

    $(document).on('click', '#login-submit-button', function(){
        readLoginModal(function(loginData){
            socket.emit('login-event', loginData)
            socket.on('login-replay', function(replayData){
                if(replayData.succes){

                    $('#login-modal').modal('hide')
                    $('#home-page').hide()
                    $('#portal').show()

                    projects = replayData.projectResults

                    //setting user info to portal head
                    $('#fullname').text(replayData.userInfo.user_name + ' ' + replayData.userInfo.user_lname)
                    
                    //setting tasks to portal
                    var div = $('#user-tasks')
                    for(i = 0; i < replayData.taskResults.length; i++){
                        div.append('<a href="#" class="list-group-item list-group-item-action">' + replayData.taskResults[i].task_name + '</a>')
                    }

                    //setting new projects to results window
                    div = $('#filter-results-row')
                    for(i = 0; i < replayData.projectResults.length; i++){
                        div.append('<div class="card"><h5 class="card-header">' + replayData.projectResults[i].project_name + '</h5><div class="card-body"><h5 class="card-title">Proje açıklaması: '  + replayData.projectResults[i].project_dscr + '</h5><p class="card-text">Proje deposu: ' + replayData.projectResults[i].project_repo + '</p><button id="' + i + '" class="project-details btn btn-primary">Proje Detayları</button></div></div>')
                    }
                }
                else {
                    info('#login', replayData.message, replayData.succes)
                }
            })
        })
    })

    $(document).on('click', '#register-submit-button', function(){
        readRegisterModal(function(registerData){
            socket.emit('register-event', registerData)
            socket.on('register-replay', function(replayData){
                info('#register', replayData.message, replayData.succes)
            })
        })
    })
})