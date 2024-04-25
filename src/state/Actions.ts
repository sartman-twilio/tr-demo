import {Action as ReduxAction} from 'redux'
import {Queue} from '../model/Queue'
import {TaskEvent} from '../model/TaskRouterEvent'
import {Activity} from '../model/Activity'

export enum ActionType {
  TASK_RESERVATION_UPDATE_REQUESTED = 'TASK_RESERVATION_UPDATE_REQUESTED',
  TASK_COMPLETION_REQUESTED = 'TASK_COMPLETION_REQUESTED',
  QUEUES_UPDATED = 'QUEUES_UPDATED',
  ACTIVITIES_UPDATED = 'ACTIVITIES_UPDATED',
  SESSION_INITIALIZED = 'SESSION_INITIALIZED',
  RESOURCES_FETCHED = 'RESOURCES_FETCHED',
  WORKER_ACTIVITY_UPDATED = 'WORKER_ACTIVITY_UPDATED',
  TASK_EVENT_ADDED = 'TASK_EVENT_ADDED',
  WORKER_ACTIVITY_UPDATE_REQUESTED = 'WORKER_ACTIVITY_UPDATE_REQUESTED'
}

export interface TaskReservationUpdateRequestedAction extends ReduxAction<ActionType> {
  type: ActionType.TASK_RESERVATION_UPDATE_REQUESTED
  taskSid: string
}

export interface TaskCompletionRequestedAction extends ReduxAction<ActionType> {
  type: ActionType.TASK_COMPLETION_REQUESTED
  taskSid: string
}

export interface QueuesUpdatedAction extends ReduxAction<ActionType> {
  type: ActionType.QUEUES_UPDATED
  queues: Queue[]
}

export interface ActivitiesUpdatedAction extends ReduxAction<ActionType> {
  type: ActionType.ACTIVITIES_UPDATED,
  availableActivity: Activity,
  unavailableActivity: Activity
}

export interface SessionInitializedAction extends ReduxAction<ActionType> {
  type: ActionType.SESSION_INITIALIZED
}

export interface ResourcesFetchedAction extends ReduxAction<ActionType> {
  type: ActionType.RESOURCES_FETCHED
}

export interface WorkerActivityUpdatedAction extends ReduxAction<ActionType> {
  type: ActionType.WORKER_ACTIVITY_UPDATED,
  sid: string
  eventDateMs: number,
  workerSid: string,
  available: boolean
}

export interface TaskEventAddedAction extends ReduxAction<ActionType> {
  type: ActionType.TASK_EVENT_ADDED,
  event: TaskEvent
}

export interface WorkerActivityUpdateRequestedAction extends ReduxAction<ActionType> {
  type: ActionType.WORKER_ACTIVITY_UPDATE_REQUESTED
  workerSid: string
  available: boolean
}

export type Action = TaskReservationUpdateRequestedAction
  | TaskCompletionRequestedAction
  | QueuesUpdatedAction
  | ActivitiesUpdatedAction
  | SessionInitializedAction
  | ResourcesFetchedAction
  | WorkerActivityUpdatedAction
  | TaskEventAddedAction
  | WorkerActivityUpdateRequestedAction