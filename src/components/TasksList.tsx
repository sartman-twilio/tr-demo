import {Task} from '../model/Task'
import {TasksListBody} from './TasksListBody'
import {Stack, Text} from '@twilio-paste/core'

export const TasksList = (props: { name: string, tasks: Task[] }) => {

  return <Stack orientation='horizontal' spacing='space60'>
    <Text as='text'>{props.name}</Text>
    <TasksListBody tasks={props.tasks}/>
  </Stack>
}