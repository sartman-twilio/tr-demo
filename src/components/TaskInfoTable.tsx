import React from 'react'
import {AssignedTask, ReservedTask, Task, TaskStatus} from '../model/Task'
import {completeTask, updateReservation} from '../helper/TwilioClientHelper'
import {bindActionCreators, Dispatch} from 'redux'
import {Action, ActionType} from '../state/Actions'
import {connect} from 'react-redux'
import {Box, Button, Stack, Table, TBody, Td, Th, THead, Tr} from '@twilio-paste/core'
import {Theme} from '@twilio-paste/core/theme'

export const TaskInfoTable = (props: {
  task: Task
}) => {

  console.log('TaskInfoTable render()')


  return <Theme.Provider theme='default'>
    <Box margin='space30'>
      <Box marginLeft='space20'>
        <h3>Task #{JSON.parse(props.task.attributes)['ordinal']}</h3>
      </Box>
      <Table>
        <TaskInfoHeader header='Task SID' value={props.task.sid}/>
        <TBody>
          <TaskInfoTableRow header='Priority' value={props.task.priority.toString()}/>
          <TaskInfoTableRow header='Attributes' value={props.task.attributes}/>
        </TBody>
      </Table>
      <ReservationButtons task={props.task}/>
      <CompleteTaskButton task={props.task}/>
    </Box>
  </Theme.Provider>
}

const TaskInfoHeader = (props: { header: string, value: string }) => {
  return <THead>
    <Tr>
      <Th>
        {props.header}
      </Th>
      <Th>
        {props.value}
      </Th>
    </Tr>
  </THead>
}

const TaskInfoTableRow = (props: { header: string, value: string }) => {

  return <Tr>
    <Td>
      {props.header}
    </Td>
    <Td>
      {props.value}
    </Td>
  </Tr>
}

const ReservationButtonsComponent = (props: {
  task: Task,
  requestReservationAction: (taskSid: string) => void
}) => {

  console.log('ReservationButtonsRow render()')

  if (props.task.status === TaskStatus.Reserved) {

    let reservedTask = props.task as ReservedTask

    const rejectTask = () => {
      props.requestReservationAction(reservedTask.sid)
      updateReservation(reservedTask.sid, reservedTask.reservationSid, 'rejected')
    }
    const acceptTask = () => {
      props.requestReservationAction(reservedTask.sid)
      updateReservation(reservedTask.sid, reservedTask.reservationSid, 'accepted')
    }
    return <Box marginTop='space40'>
      <Stack orientation='horizontal' spacing='space60'>
        <Button
          variant='primary'
          onClick={acceptTask}
          disabled={reservedTask.reservationActionRequested}
        >
          Accept
        </Button>
        <Button
          variant='primary'
          onClick={rejectTask}
          disabled={reservedTask.reservationActionRequested}
        >
          Reject
        </Button>
      </Stack>
    </Box>
  } else {
    return null
  }
}

const CompleteTaskButtonComponent = (props: {
  task: Task,
  requestTaskCompletion: (taskSid: string) => void
}) => {

  if (props.task.status === TaskStatus.Assigned) {
    let assignedTask = props.task as AssignedTask

    const handleSubmit = () => {
      props.requestTaskCompletion(assignedTask.sid)
      completeTask(assignedTask.sid)
    }

    return <Box marginTop='space40'>
      <Button
        variant='primary'
        onClick={handleSubmit}
        disabled={assignedTask.completionRequested}
      >
        Complete
      </Button>
    </Box>
  } else {
    return null
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    requestTaskCompletion: bindActionCreators((taskSid: string) => dispatch({
      type: ActionType.TASK_COMPLETION_REQUESTED,
      taskSid: taskSid,
    }), dispatch),
    requestReservationAction: bindActionCreators((taskSid: string) =>
      dispatch({
        type: ActionType.TASK_RESERVATION_UPDATE_REQUESTED,
        taskSid: taskSid,
      }), dispatch),
  }
}

const CompleteTaskButton =
  connect(null, mapDispatchToProps)(CompleteTaskButtonComponent)
const ReservationButtons =
  connect(null, mapDispatchToProps)(ReservationButtonsComponent)
