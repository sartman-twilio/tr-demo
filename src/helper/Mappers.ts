import {Queue} from '../model/Queue'
import {TrActivity, TrEvent, TrQueue, TrWorker} from './TwilioModel'
import {Worker} from '../model/Worker'
import {EventType, TaskEvent, TaskRouterEvent} from '../model/TaskRouterEvent'
import {AssignedTask, CompletedTask, InQueueTask, ReservedTask, Task} from '../model/Task'
import {Activity} from '../model/Activity'

export const queueMapper = (taskQueue: TrQueue, workers: Worker[]): Queue =>
  ({
    sid: taskQueue.sid,
    workers: workers,
    name: taskQueue.friendly_name,
  })

export const workerMapper = (worker: TrWorker, capacity: number): Worker =>
  ({
    sid: worker.sid,
    name: worker.friendly_name,
    capacity: capacity,
    attributes: JSON.parse(worker.attributes),
    available: worker.available,
    availabilityUpdateRequested: false,
  })

export const eventMapper = (event: TrEvent): TaskRouterEvent | null => {
  switch (event.event_type) {
    // case 'task.created':
    //   return new TaskCreated(
    //     event.sid,
    //     event.event_date_ms,
    //     event.event_data['task_sid'],
    //     event.event_data['task_priority']
    //   )
    case 'task-queue.entered':
      return {
        type: EventType.TASK_IN_QUEUE,
        sid: event.sid,
        eventDateMs: event.event_date_ms,
        taskSid: event.event_data['task_sid'],
        queueSid: event.event_data['task_queue_sid'],
        priority: event.event_data['task_priority'],
        attributes: event.event_data['task_attributes'],
      }
    case 'reservation.created':
      return {
        type: EventType.TASK_RESERVED,
        sid: event.sid,
        eventDateMs: event.event_date_ms,
        taskSid: event.event_data['task_sid'],
        reservationSid: event.event_data['reservation_sid'],
        workerSid: event.event_data['worker_sid'],
        priority: event.event_data['task_priority'],
        attributes: event.event_data['task_attributes'],
      }
    case 'reservation.accepted':
      return {
        type: EventType.TASK_ASSIGNED,
        sid: event.sid,
        eventDateMs: event.event_date_ms,
        taskSid: event.event_data['task_sid'],
        workerSid: event.event_data['worker_sid'],
        priority: event.event_data['task_priority'],
        attributes: event.event_data['task_attributes'],
      }
    case 'reservation.rejected':
    case 'reservation.timeout':
      return {
        type: EventType.TASK_IN_QUEUE,
        sid: event.sid,
        eventDateMs: event.event_date_ms,
        taskSid: event.event_data['task_sid'],
        queueSid: event.event_data['task_queue_sid'],
        priority: event.event_data['task_priority'],
        attributes: event.event_data['task_attributes'],
      }
    case 'task.completed':
      return {
        type: EventType.TASK_COMPLETED,
        sid: event.sid,
        eventDateMs: event.event_date_ms,
        taskSid: event.event_data['task_sid'],
        workerSid: event.event_data['worker_sid'],
        priority: event.event_data['task_priority'],
        attributes: event.event_data['task_attributes'],
      }
    case 'worker.activity.update':
      return {
        type: EventType.WORKER_ACTIVITY_UPDATED,
        sid: event.sid,
        eventDateMs: event.event_date_ms,
        workerSid: event.event_data['worker_sid'],
        // TODO: Do not rely on activity name, but 1) fetch and store activities in state 2) use state to check if available or not
        available: event.event_data['worker_activity_name'] === 'Available',
      }
  }
  return null
}

export const activityMapper = (trActivity: TrActivity): Activity => ({
  sid: trActivity.sid,
  name: trActivity.friendly_name,
  available: trActivity.available
})

export const eventsToTaskMapper = (taskEvents: ReadonlyArray<TaskEvent>): Task =>
  eventToTaskMapper(sortEventsByTimeAndStatus(taskEvents).pop()!!)

export const sortEventsByTimeAndStatus = (events: ReadonlyArray<TaskEvent>): TaskEvent[] =>
  events.slice().sort((a, b) =>
    a.eventDateMs - b.eventDateMs
    || eventTypeToOrdinalMapper(a.type) - eventTypeToOrdinalMapper(b.type),
  )

export const eventToTaskMapper = (taskEvent: TaskEvent): Task => {
  console.log('Converting task event', taskEvent)
  switch (taskEvent.type) {
    // case EventType.TASK_CREATED:
    //   return new NewTask(
    //     taskEvent.taskSid,
    //     taskEvent.priority,
    //     taskEvent.attributes
    //   )
    case EventType.TASK_IN_QUEUE:
      return new InQueueTask(
        taskEvent.taskSid,
        taskEvent.priority,
        taskEvent.attributes,
        taskEvent.queueSid,
      )
    case EventType.TASK_RESERVED:
      return new ReservedTask(
        taskEvent.taskSid,
        taskEvent.priority,
        taskEvent.attributes,
        taskEvent.reservationSid,
        taskEvent.workerSid,
      )
    case EventType.TASK_ASSIGNED:
      return new AssignedTask(
        taskEvent.taskSid,
        taskEvent.priority,
        taskEvent.attributes,
        taskEvent.workerSid,
      )
    case EventType.TASK_COMPLETED:
      return new CompletedTask(
        taskEvent.taskSid,
        taskEvent.priority,
        taskEvent.attributes,
        taskEvent.workerSid,
      )
    default:
      throw Error(`Should never happen, all task event types should be handled. Event ${taskEvent}`)
  }
}

export const eventTypeToOrdinalMapper = (eventType: EventType): number => {
  switch (eventType) {
    case EventType.TASK_CREATED:
      return 1
    case EventType.TASK_IN_QUEUE:
      return 2
    case EventType.TASK_RESERVED:
      return 3
    case EventType.TASK_ASSIGNED:
      return 4
    case EventType.TASK_COMPLETED:
      return 5
  }
  return 100
}