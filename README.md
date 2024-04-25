# TaskRouter Demo App

## About the project

### Idea

This application is intended to make life easier to whoever wants to demo TaskRouter as a standalone product.
It provides a basic UI to visualise Queues, Workers and Tasks as well as interface to interact with these entities.

The application is purely front-end one.
It is designed to be running on localhost.
In the current implementation it should NOT be hosted anywhere except localhost as it stores API TOKEN in memory.
As result anybody who has access to the UI can get your TOKEN, so please be careful :)

### Language and Frameworks

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It is written using [Typescript](https://www.typescriptlang.org), using [React](https://reactjs.org) for UI and uses [Redux](https://redux.js.org) as its state container.
Most of the UI components are from [Paste](https://paste.twilio.design), the rest are from [Material UI](https://material-ui.com).

### Architecture

The project structure is following

| Package      | Description |
| -----------  | ----------- |
| components   | React UI components |
| event        | Source of the events, it exposes and observable and keeps track of already consumed events |
| helper       | Twilio helper function to work with TaskRouter API |
| model        | Domain and API models used in the app |
| state        | Redux related entities like State, Actions and Reducers |

When you start the app it takes configured Account SID, Token, Workspace and Workflow setting and stores it into the session.
Once the session initialised initial fetching of resources (Queues and Workers) will start.
The next step will be initialisation of Event Source. The Event Source does following: 
- queries TaskRouter API every second and gets events within last minute
- stores processed event ids into a set
- converts event from API to Domain model
- emits domain events to observable

EventSourceComponent is subscribed to the EventSource and is responsible for updating the application state.
The state keeps track of all the events for task and evaluates actual state of task based on the list of events for this task.

### Used TaskRouter endpoints

- `/v1/Workspaces/${workspaceSid}/Activities`
- `/v1/Workspaces/${workspaceSid}/Events`
- `/v1/Workspaces/${workspaceSid}/Tasks`
- `/v1/Workspaces/${workspaceSid}/TaskQueues`
- `/v1/Workspaces/${workspaceSid}/TaskChannels`
- `/v1/Workspaces/${workspaceSid}/Tasks/${taskSid}`
- `/v1/Workspaces/${workspaceSid}/Tasks/${taskSid}/Reservations/${reservationSid}`
- `/v1/Workspaces/${workspaceSid}/Workers`
- `/v1/Workspaces/${workspaceSid}/Workers/${workerSid}`
- `/v1/Workspaces/${workspaceSid}/Workers/${workerSid}/Channels`

### Capabilities

For now demo tool is capable of:

- creating with priority and attributes
- showing task details and ordinal
- changing workers availability
- accepting or rejecting reservation
- completing task

### Limitation

Here are some known limitations of the tool:

- UI limitations:
  - UI is still a bit rough and might not show layout correctly in smaller windows
  - queue size is limited to 4 tasks
  - reservation area is designed to show only 1 task, it will show overlap with arrows if there is more than 1 task
  
### Considerations

Please consider following while using the tool:
- Since the tool is based on the information from Events end point it takes a couple of seconds after you submit action and until it is reflected in the UI.
  On the other hand some events can arrive in the same batch (i.e., task in queue and reservation created) and thus the task will jump directly to the reservation area skipping queue.
- Changing worker status to Unavailable will reject all pending reservations
- The tool will automatically add "ordinal" attribute to the attributes of the task on its creation
- Refreshing the page will most likely result in UI and TaskRouter be out of sync.
  This happens due to the way tool gets events: only events within last 60 seconds will make it into the system.
  Meaning that if you have a task in TaskRouter that has no relevant events for the last 60 seconds UI will not show it.
  My recommendation here is to use `deleteAllTasks` script to clean up the workspace on starting UI.
- The tool uses `default` Task Channel and looks it up by name

## Initial setup

Here are key steps to configure the tool.

### Env configuration

There is an [.env.example](.env.example) file that you can copy and use to quickly access the tool.
It will enable you to click Submit button on the initial screen without entering eny details.

### Task router entities

I provide JSONs/details for the setup that I have and was playing with all the time while developing the tool, but I encourage you to experiment with the setup.
At the bottom of this section you will find twilio-cli commands to create these entities.

#### Workflow

Make sure to set big enough reservation timeout (600 seconds at least) to make sure that reservation will not expire and cause worker to go Unavailable while you are speaking.

```json
{
  "task_routing": {
    "filters": [
      {
        "filter_friendly_name": "Filter_DE",
        "expression": "language == 'DE'",
        "targets": [
          {
            "queue": "$DE_QUEUE_SID"
          }
        ]
      },
      {
        "filter_friendly_name": "Filter_EN",
        "expression": "language == 'EN'",
        "targets": [
          {
            "queue": "$EN_QUEUE_SID"
          }
        ]
      }
    ],
    "default_filter": {
      "queue": "$EN_QUEUE_SID"
    }
  }
}
```

#### Queues

| Queue Name      | Queue Expression |
| --------------- | ---------------- |
| EN | `languages HAS 'EN'` |
| DE | `languages HAS 'DE'` |

#### Workers

| Worker Name      | Worker Attributes |
| --------------- | ---------------- |
| Alice | `{"skill":"cards","languages":["EN","DE"]}` |
| Bob | `{"skill":"cards","languages":["DE"]}` |
| Chris | `{"skill":"cards","languages":["EN"]}` |

#### To make your life easier here are twilio-cli commands (it is not yet an automated script you can run)

```
# Create workspace
twilio api:taskrouter:v1:workspaces:create --friendly-name="Task Router Demo Tool"

# Set workspace variable using output from the previous command
export WORKSPACE_SID=WSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Create queues
twilio api:taskrouter:v1:workspaces:task-queues:create --friendly-name=EN --target-workers="languages HAS 'EN'" --workspace-sid=$WORKSPACE_SID
twilio api:taskrouter:v1:workspaces:task-queues:create --friendly-name=DE --target-workers="languages HAS 'DE'" --workspace-sid=$WORKSPACE_SID

# Set queue variables using output from the previous commands
export EN_QUEUE_SID=WQXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export DE_QUEUE_SID=WQXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export WORKFLOW_CONFIGURATION="{\"task_routing\":{\"filters\":[{\"filter_friendly_name\":\"Filter_DE\",\"expression\":\"language == 'DE'\",\"targets\":[{\"queue\":\"$DE_QUEUE_SID\"}]},{\"filter_friendly_name\":\"Filter_EN\",\"expression\":\"language == 'EN'\",\"targets\":[{\"queue\":\"$EN_QUEUE_SID\"}]}],\"default_filter\":{\"queue\":\"$EN_QUEUE_SID\"}}}"

#Create workflow
twilio api:taskrouter:v1:workspaces:workflows:create --friendly-name="Task Router Demo Tool Workflow" --task-reservation-timeout=600 --configuration=$WORKFLOW_CONFIGURATION --workspace-sid=$WORKSPACE_SID

# Create workers
twilio api:taskrouter:v1:workspaces:workers:create --friendly-name=Alice --attributes="{\"skill\":\"cards\",\"languages\":[\"EN\",\"DE\"]}" --workspace-sid=$WORKSPACE_SID
twilio api:taskrouter:v1:workspaces:workers:create --friendly-name=Bob --attributes="{\"skill\":\"cards\",\"languages\":[\"DE\"]}" --workspace-sid=$WORKSPACE_SID
twilio api:taskrouter:v1:workspaces:workers:create --friendly-name=Chris --attributes="{\"skill\":\"cards\",\"languages\":[\"EN\"]}" --workspace-sid=$WORKSPACE_SID
```

If needed update `default` channel capacity manually for each worker.

## UI layout

![UI layout](docs/UI_layout.png)

UI elemetns explained:

1. **Create task button** on click shows Create task popup
2. **Queues area** with **Queue cards** shows tasks in each queue
3. **Arrows area** shows relationship between workers and queues. It uses Queue Expression to connect together Queues and Workers
4. **Reservations area** shows current reservations. Task Card in this area shows buttons to Accept or Reject reservation.
5. **Workers area** shows Worker Cards. 
   Worker Card shows:
   - Worker attributes
   - Capacity (total number of task icons)
   - Taken Capacity (red task icons)
   - Switch to change Worker Availability
   - Changes its border based on Availability (green - available, gray - unavailable)
   - Task Card in this area shows button to Complete task.
6. **Task Card** shows:
   - Task ordinal
   - Task SID
   - Task Priority
   - Task Attributes
   - Action buttons (if any available)

## How to use

The usage is quite intuitive (I hope so :) and does not require any specific knowledge of TaskRouter besides basic concepts.
The basic script for the demo would be (assuming you have created initial setup as described above):
1. Have all workers offline
2. Create a task (ordinal 1) with DE language and priority 0
3. Show the task 1 in the queue
4. Create a task (ordinal 2) with DE language and priority 10
5. Show the task 1 and 2 in the queue, speak about priority
6. Make worker Bob (`{ "skill": "cards", "languages": [ "DE" ] }`) available
7. Task 2 is now in reservation area for Bob, explain why it is task 2 that went first (because of priority)
8. Accept task 2 on Bob
9. Complete task 2
10. Complete task 2 and watch task 1 go to reservation area
11. Go ahead and talk about things that are relevant

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run deleteAllTasks`

Cleans up the workspace by deleting all tasks.

## Contributions

Any contributions to the project are welcome. You help in different ways:
- create and issue or improvement ticket in the project repository (github)
- fix/implement
    - issues/features from the [TODO.md](TODO.md)
    - issues/features from the project repository (github)
    
You are always welcome to reach out to me in Slack @akushch

## TODO

TODO list you can find in [TODO.md](TODO.md)
