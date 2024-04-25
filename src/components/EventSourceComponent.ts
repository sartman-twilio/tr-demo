import {EventType, TaskEvent, TaskRouterEvent} from '../model/TaskRouterEvent'
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators, Dispatch} from 'redux'
import {
  Action,
  ActionType,
  TaskEventAddedAction,
  WorkerActivityUpdatedAction,
} from '../state/Actions'
import {eventSource} from '../event/EventSource'

const EventSource = (props: {
  setWorkerActivity: (
    sid: string,
    eventDateMs: number,
    workerSid: string,
    available: boolean,
  ) => void,
  taskEventAdded: (event: TaskEvent) => void
}) => {

  React.useEffect(() => {
    let isMounted = true
    eventSource().subscribe((e) => {
        if (isMounted) updateState(e)
      },
    )
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateState = (taskRouterEvent: TaskRouterEvent) => {
    switch (taskRouterEvent.type) {
      // case EventType.TASK_CREATED:
      case EventType.TASK_IN_QUEUE:
      case EventType.TASK_RESERVED:
      case EventType.TASK_ASSIGNED:
      case EventType.TASK_COMPLETED:
        props.taskEventAdded(taskRouterEvent)
        break
      case EventType.WORKER_ACTIVITY_UPDATED:
        props.setWorkerActivity(taskRouterEvent.sid, taskRouterEvent.eventDateMs, taskRouterEvent.workerSid, taskRouterEvent.available)
    }
  }

  return null
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    setWorkerActivity: bindActionCreators(workerActivityUpdatedCreator, dispatch),
    taskEventAdded: bindActionCreators(taskEventAddedCreator, dispatch),
  }
}

const taskEventAddedCreator = (event: TaskEvent): TaskEventAddedAction => ({
  type: ActionType.TASK_EVENT_ADDED,
  event: event,
})

const workerActivityUpdatedCreator = (
  sid: string,
  eventDateMs: number,
  workerSid: string,
  available: boolean,
): WorkerActivityUpdatedAction => ({
  type: ActionType.WORKER_ACTIVITY_UPDATED,
  sid: sid,
  eventDateMs: eventDateMs,
  workerSid: workerSid,
  available: available,
})

export const EventSourceComponent =
  connect(null, mapDispatchToProps)(EventSource)