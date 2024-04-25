import {Task} from '../model/Task'
import {Queue} from '../model/Queue'
import {TaskEvent} from '../model/TaskRouterEvent'
import {Activity} from '../model/Activity'
import {LateInit} from '../helper/Utils'

export interface TaskRouterDemoToolState {
  sessionInitialized: boolean,
  resourcesFetched: boolean,
  queues: Queue[],
  tasks: Map<string, Task>,
  taskEvents: Map<string, TaskEvent[]>
  availableActivity: LateInit<Activity>,
  unavailableActivity: LateInit<Activity>,
}

export const initialState: TaskRouterDemoToolState = {
  sessionInitialized: false,
  resourcesFetched: false,
  queues: [],
  tasks: new Map<string, Task>(),
  taskEvents: new Map<string, TaskEvent[]>(),
  availableActivity: new LateInit(() => new Error('Available activity is not initialised')),
  unavailableActivity: new LateInit(() => new Error('Unavailable activity is not initialised')),
}