import {LateInit} from './Utils'
import {activityMapper, queueMapper, workerMapper} from './Mappers'
import {
  ChannelsResponse,
  EventsResponse, TaskChannelsResponse,
  TaskQueuesResponse,
  TaskResponse, TrActivitiesResponse,
  TrEvent, TrWorker,
  WorkersResponse,
} from './TwilioModel'
import {ajax} from 'rxjs/ajax'
import {map, mergeAll, mergeMap, toArray} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {Queue} from '../model/Queue'
import {Worker} from '../model/Worker'
import {ReservationStatus} from '../model/ReservationStatus'
import {Activity} from '../model/Activity'

type TaskRouterContext = {
  accountSid: string,
  authToken: string,
  workspaceSid: string,
  workflowSid: string,
  authHeaderValue: string
}

let taskRouterContext: LateInit<TaskRouterContext> = new LateInit(
  () => new Error('TaskRouter context is not initialised'),
)

export const initializeTwilioClient = (
  accountSid: string,
  authToken: string,
  workspaceSid: string,
  workflowSid: string,
) => {
  taskRouterContext.set({
    accountSid: accountSid,
    authToken: authToken,
    workspaceSid: workspaceSid,
    workflowSid: workflowSid,
    authHeaderValue: authHeaderValue(accountSid, authToken),
  })
}

const authHeaderValue = (accountSid: string, authToken: string): string => {
  const token = btoa(`${accountSid}:${authToken}`)
  return `Basic ${token}`
}

export const getQueues = (defaultChannelSid: string, limit?: number): Observable<Queue[]> => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()

  return ajax.getJSON<TaskQueuesResponse>(
    `/v1/Workspaces/${workspaceSid}/TaskQueues?PageSize=${limit ? limit : 10}`,
    {
      Authorization: authHeaderValue,
    },
  ).pipe(
    map(response => response.task_queues),
    mergeAll(),
    mergeMap(taskQueue => getWorkers(taskQueue.target_workers, defaultChannelSid).pipe(
      map(workers => queueMapper(taskQueue, workers)),
    )),
    toArray(),
  )
}

const getWorkerCapacityForChannel = (workerSid: string, channelSid: string): Observable<number> => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.getJSON<ChannelsResponse>(
    `/v1/Workspaces/${workspaceSid}/Workers/${workerSid}/Channels`,
    {
      Authorization: authHeaderValue,
    },
  ).pipe(
    map(response => {
        console.log('(Worker)ChannelsResponse:', response)
        return response.channels
          .filter(channel => channel.available && channel.task_channel_sid === channelSid)
          [0]
          .configured_capacity
      },
    ),
  )
}

export const getDefaultChannelSid = (): Observable<string> => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.getJSON<TaskChannelsResponse>(
    `/v1/Workspaces/${workspaceSid}/TaskChannels`,
    {
      Authorization: authHeaderValue,
    },
  ).pipe(
    map(response => {
        console.log('TaskChannelsResponse:', response)
        return response.channels
          .filter(channel => channel.unique_name === 'default')
          [0]
          .sid
      },
    ),
  )
}

export const setWorkerActivity = (workerSid: string, activity: Activity) => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()

  console.log(`Updating worker ${workerSid} to activity ${activity.name}, sid: ${activity.sid}`)

  return ajax.post<TrWorker>(
    `/v1/Workspaces/${workspaceSid}/Workers/${workerSid}`,
    `ActivitySid=${activity.sid}&RejectPendingReservations=${!activity.available}`,
    {
      Authorization: authHeaderValue,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ).pipe(
    map(response => response.response),
  ).subscribe(worker =>
    console.log(`Updated worker ${worker.sid} to activity ${worker.activity_name}, sid: ${worker.activity_sid}`),
  )
  // TODO: Return result and if it is an error set requested flag back
}

export const getActivities = (): Observable<Activity[]> => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.getJSON<TrActivitiesResponse>(
    `/v1/Workspaces/${workspaceSid}/Activities`,
    {
      Authorization: authHeaderValue,
    },
  ).pipe(
    map(response => response.activities),
    map(trActivities => trActivities.map(activityMapper)),
  )
}

const getWorkers = (targetWorkersExpression: string, defaultChannelSid: string): Observable<Worker[]> => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.getJSON<WorkersResponse>(
    `/v1/Workspaces/${workspaceSid}/Workers?TargetWorkersExpression=${targetWorkersExpression}`,
    {
      Authorization: authHeaderValue,
    },
  )
    .pipe(
      map(response => response.workers),
      mergeAll(),
      mergeMap(worker => getWorkerCapacityForChannel(worker.sid, defaultChannelSid).pipe(
        map(capacity => workerMapper(worker, capacity)),
      )),
      toArray(),
    )
}

export const createTask = (priority: number, attributes: string) => {
  const {workspaceSid, authHeaderValue, workflowSid} = taskRouterContext.get()

  let newAttributes = addOrdinal(attributes)

  return ajax.post<TaskResponse>(
    `/v1/Workspaces/${workspaceSid}/Tasks`,
    `Priority=${priority}&Attributes=${newAttributes}&WorkflowSid=${workflowSid}`,
    {
      Authorization: authHeaderValue,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ).subscribe(response =>
    console.log(`Created task with sid: ${response.response.sid}`),
  )
}

let taskOrdinal = 1

// Uses variable above to store ordinal state
const addOrdinal = (attributes: string): string => {
  let attrJson = JSON.parse(attributes)
  let newAttr = JSON.stringify(
    {
      ...attrJson,
      ordinal: taskOrdinal,
    },
  )
  taskOrdinal++
  return newAttr
}

export const getEvents = (): Observable<TrEvent[]> => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.getJSON<EventsResponse>(
    `/v1/Workspaces/${workspaceSid}/Events?Minutes=1`,
    {
      Authorization: authHeaderValue,
    },
  ).pipe(
    map(response => response.events),
  )
}

export const updateReservation = (taskSid: string, reservationSid: string, reservationStatus: ReservationStatus) => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.post(
    `/v1/Workspaces/${workspaceSid}/Tasks/${taskSid}/Reservations/${reservationSid}`,
    `ReservationStatus=${reservationStatus}`,
    {
      Authorization: authHeaderValue,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ).subscribe(response =>
    console.log(`Reservation ${reservationSid} updated status:${response.status}`),
  )
}

export const completeTask = (taskSid: string) => {
  const {workspaceSid, authHeaderValue} = taskRouterContext.get()
  return ajax.post(
    `/v1/Workspaces/${workspaceSid}/Tasks/${taskSid}`,
    'AssignmentStatus=completed',
    {
      Authorization: authHeaderValue,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ).subscribe(response =>
    console.log(`Task ${taskSid} completed with status:${response.status}`),
  )
}