require('dotenv').config()

const accountSid = process.env.REACT_APP_ACCOUNT_SID;
const authToken = process.env.REACT_APP_AUTH_TOKEN;
const workspaceSid = process.env.REACT_APP_WORKSPACE_SID;

const client = require('twilio')(accountSid, authToken);

client.taskrouter.workspaces(workspaceSid)
    .tasks
    .list()
    .then(tasks => tasks.forEach(task => {
            client.taskrouter.workspaces(workspaceSid)
                .tasks(task.sid)
                .remove()
            console.log('Deleted task', task.sid)
        }
    ))
    .catch(e => console.log(e))
