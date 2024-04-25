export enum EventType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_IN_QUEUE = 'TASK_IN_QUEUE',
  TASK_RESERVED = 'TASK_RESERVED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  WORKER_ACTIVITY_UPDATED = 'WORKER_ACTIVITY_UPDATED'
}

// export interface TaskCreatedEvent {
//   type: EventType.TASK_CREATED
//   sid: string
//   eventDateMs: number
//   taskSid: string
//   priority: number
// }

export interface TaskInQueueEvent {
  type: EventType.TASK_IN_QUEUE
  sid: string
  eventDateMs: number
  taskSid: string
  queueSid: string
  priority: number
  attributes: string
}

export interface TaskReservedEvent {
  type: EventType.TASK_RESERVED,
  sid: string
  eventDateMs: number
  taskSid: string
  reservationSid: string
  workerSid: string
  priority: number
  attributes: string
}

export interface TaskAssignedEvent {
  type: EventType.TASK_ASSIGNED
  sid: string
  eventDateMs: number
  taskSid: string
  workerSid: string
  priority: number
  attributes: string
}

export interface TaskCompletedEvent {
  type: EventType.TASK_COMPLETED
  sid: string
  eventDateMs: number
  taskSid: string
  workerSid: string
  priority: number
  attributes: string
}

export interface WorkerActivityUpdated {
  type: EventType.WORKER_ACTIVITY_UPDATED
  sid: string
  eventDateMs: number
  workerSid: string
  available: boolean
}

export type TaskRouterEvent =
// TaskCreatedEvent |
  TaskInQueueEvent
  | TaskReservedEvent
  | TaskAssignedEvent
  | TaskCompletedEvent
  | WorkerActivityUpdated

export type TaskEvent =
  TaskInQueueEvent
  | TaskReservedEvent
  | TaskAssignedEvent
  | TaskCompletedEvent
