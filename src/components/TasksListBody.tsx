import {Task} from '../model/Task'
import TaskIcon from './TaskIcon'
import {Stack} from '@twilio-paste/core'

export const TasksListBody = (props: { tasks: Task[] }) => {

  return <Stack orientation='horizontal' spacing='space60'>
    {props.tasks.map(task =>
      <TaskIcon key={task.sid} task={task}/>,
    )}
  </Stack>
}