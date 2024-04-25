import {initialState, TaskRouterDemoToolState} from './State'
import {
  Action,
  ActionType,
  ActivitiesUpdatedAction,
  QueuesUpdatedAction,
  TaskCompletionRequestedAction,
  TaskEventAddedAction,
  TaskReservationUpdateRequestedAction,
  WorkerActivityUpdatedAction,
  WorkerActivityUpdateRequestedAction,
} from './Actions'
import {AssignedTask, ReservedTask, Task} from '../model/Task'
import {Queue} from '../model/Queue'
import {Worker} from '../model/Worker'
import {EventType, TaskEvent} from '../model/TaskRouterEvent'
import {eventsToTaskMapper} from '../helper/Mappers'
import {compute, lateInitOf} from '../helper/Utils'

export function reduce(state: TaskRouterDemoToolState = initialState, action: Action): TaskRouterDemoToolState {
  console.log('Entering reducer, state:', state, action)
  switch (action.type) {
    case ActionType.TASK_COMPLETION_REQUESTED:
      return handleCompletionRequested(state, action)
    case ActionType.TASK_RESERVATION_UPDATE_REQUESTED:
      return handleReservationUpdateRequested(state, action)
    case ActionType.QUEUES_UPDATED:
      return handleQueuesUpdate(state, action)
    case ActionType.ACTIVITIES_UPDATED:
      return handleActivitiesUpdate(state, action)
    case ActionType.SESSION_INITIALIZED:
      return handleSessionInitialized(state)
    case ActionType.RESOURCES_FETCHED:
      return handleResourcesFetched(state)
    case ActionType.WORKER_ACTIVITY_UPDATED:
      return handleWorkerActivityUpdated(state, action)
    case ActionType.TASK_EVENT_ADDED:
      return handleTaskEventAdded(state, action)
    case ActionType.WORKER_ACTIVITY_UPDATE_REQUESTED:
      return handleWorkerActivityUpdateRequested(state, action)
    default:
      return state
  }
}

const getTasks = (taskEvents: ReadonlyMap<string, TaskEvent[]>): Task[] => {
  console.log('Getting tasks from:', taskEvents)
  return Array.from(taskEvents.values())
    .map(eventsToTaskMapper)
}

const addEventToEventsMap = (events: ReadonlyMap<string, TaskEvent[]>, event: TaskEvent): Map<string, TaskEvent[]> => {
  let taskEvents: Map<string, TaskEvent[]> = new Map(events)
  compute(taskEvents, event.taskSid, (k, v) => !!v ? v.concat(event) : [event])
  return taskEvents
}

const handleTaskEventAdded = (state: TaskRouterDemoToolState, action: TaskEventAddedAction) => {
  console.log('==============================State before', state)
  console.log('==============================Event', EventType[action.event.type], action.event)
  let taskEvents = addEventToEventsMap(state.taskEvents, action.event)
  let tasks: Map<string, Task> = getTasks(taskEvents)
    // associateBy
    .reduce((acc, task) => acc.set(task.sid, task), new Map<string, Task>())
  let newState = {
    ...state,
    tasks: tasks,
    taskEvents: taskEvents,
  }
  console.log('==============================State after', newState)
  return newState
}

const handleSessionInitialized = (state: TaskRouterDemoToolState): TaskRouterDemoToolState => {
  return {
    ...state,
    sessionInitialized: true,
  }
}

const handleResourcesFetched = (state: TaskRouterDemoToolState): TaskRouterDemoToolState => {
  return {
    ...state,
    resourcesFetched: true,
  }
}

const handleQueuesUpdate = (state: TaskRouterDemoToolState, action: QueuesUpdatedAction): TaskRouterDemoToolState => {
  return {
    ...state,
    queues: action.queues,
  }
}

const handleActivitiesUpdate = (state: TaskRouterDemoToolState, action: ActivitiesUpdatedAction): TaskRouterDemoToolState => {
  return {
    ...state,
    availableActivity: lateInitOf(action.availableActivity),
    unavailableActivity: lateInitOf(action.unavailableActivity),
  }
}

const handleWorkerActivityUpdated = (state: TaskRouterDemoToolState, action: WorkerActivityUpdatedAction): TaskRouterDemoToolState => {
  // Here should be a lens
  let newQueues: Queue[] = state.queues.map(queue => {
      let newWorkers: Worker[] = queue.workers.map(worker => {
        if (worker.sid === action.workerSid) {
          return {
            ...worker,
            available: action.available,
            availabilityUpdateRequested: false,
          }
        } else return worker
      })
      return {
        ...queue,
        workers: newWorkers,
      }
    },
  )
  return {
    ...state,
    queues: newQueues,
  }
}

const handleCompletionRequested = (
  state: TaskRouterDemoToolState,
  action: TaskCompletionRequestedAction,
): TaskRouterDemoToolState => {
  if (state.tasks.has(action.taskSid)) {
    // TODO: Here task status should be checked. Ideally domain Task should be converted from interface to union type
    let task = state.tasks.get(action.taskSid) as AssignedTask
    let newState = new Map(state.tasks)
    newState.set(action.taskSid,
      new AssignedTask(
        task.sid,
        task.priority,
        task.attributes,
        task.workerSid,
        true,
      ))
    return {
      ...state,
      tasks: newState,
    }
  } else {
    return state
  }
}

const handleReservationUpdateRequested = (
  state: TaskRouterDemoToolState,
  action: TaskReservationUpdateRequestedAction,
): TaskRouterDemoToolState => {
  if (state.tasks.has(action.taskSid)) {
    // TODO: Here task status should be checked. Ideally domain Task should be converted from interface to union type
    let task = state.tasks.get(action.taskSid) as ReservedTask
    let newState = new Map(state.tasks)
    newState.set(action.taskSid,
      new ReservedTask(
        task.sid,
        task.priority,
        task.attributes,
        task.workerSid,
        task.workerSid,
        true,
      ))
    return {
      ...state,
      tasks: newState,
    }
  } else {
    return state
  }
}

const handleWorkerActivityUpdateRequested = (
  state: TaskRouterDemoToolState,
  action: WorkerActivityUpdateRequestedAction,
): TaskRouterDemoToolState => {
  let newQueues: Queue[] = state.queues.map(queue => {
      let newWorkers: Worker[] = queue.workers.map(worker => {
        if (worker.sid === action.workerSid) {
          return {
            ...worker,
            availabilityUpdateRequested: true,
            available: action.available,
          }
        } else return worker
      })
      return {
        ...queue,
        workers: newWorkers,
      }
    },
  )
  return {
    ...state,
    queues: newQueues,
  }
}