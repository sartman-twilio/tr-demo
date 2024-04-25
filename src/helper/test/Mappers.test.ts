import {sortEventsByTimeAndStatus} from '../Mappers'
import {EventType, TaskEvent} from '../../model/TaskRouterEvent'


it('orders correctly empty', () => {
  expect(sortEventsByTimeAndStatus([])).toEqual([])
})

it('orders correctly timestamp only', () => {
  expect(sortEventsByTimeAndStatus(unsortedTimestampOnly).map(e => e.sid))
    .toEqual(sortedTimestampOnly)
})

it('orders correctly timestamp and ordinal', () => {
  expect(sortEventsByTimeAndStatus(unsortedTimestampAndOrdinal).map(e => e.sid))
    .toEqual(sortedTimestampAndOrdinal)
})

const unsortedTimestampOnly: TaskEvent[] = [
  {
    type: EventType.TASK_RESERVED,
    sid: '1',
    eventDateMs: 125,
    taskSid: '1',
    reservationSid: '1',
    workerSid: '1',
    priority: 0,
    attributes: '{}',
  },
  {
    type: EventType.TASK_IN_QUEUE,
    sid: '2',
    eventDateMs: 124,
    taskSid: '1',
    queueSid: '1',
    priority: 0,
    attributes: '{}',
  },
  {
    type: EventType.TASK_ASSIGNED,
    sid: '3',
    eventDateMs: 123,
    taskSid: '1',
    workerSid: '1',
    priority: 0,
    attributes: '{}',
  },
  {
    type: EventType.TASK_COMPLETED,
    sid: '4',
    eventDateMs: 126,
    taskSid: '1',
    workerSid: '1',
    priority: 0,
    attributes: '{}',
  },
]

const sortedTimestampOnly = ['3', '2', '1', '4']

const unsortedTimestampAndOrdinal: TaskEvent[] = [
  {
    type: EventType.TASK_RESERVED,
    sid: '1',
    eventDateMs: 123,
    taskSid: '1',
    reservationSid: '1',
    workerSid: '1',
    priority: 0,
    attributes: '{}',
  },
  {
    type: EventType.TASK_IN_QUEUE,
    sid: '2',
    eventDateMs: 123,
    taskSid: '1',
    queueSid: '1',
    priority: 0,
    attributes: '{}',
  },
  {
    type: EventType.TASK_COMPLETED,
    sid: '4',
    eventDateMs: 122,
    taskSid: '1',
    workerSid: '1',
    priority: 0,
    attributes: '{}',
  },
  {
    type: EventType.TASK_ASSIGNED,
    sid: '3',
    eventDateMs: 123,
    taskSid: '1',
    workerSid: '1',
    priority: 0,
    attributes: '{}',
  },
]

const sortedTimestampAndOrdinal = ['4', '2', '1', '3']