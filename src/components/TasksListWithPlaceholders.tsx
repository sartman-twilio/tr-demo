import {Task} from '../model/Task'
import {Stack} from '@twilio-paste/core'
import TaskIcon from './TaskIcon'
import {ProductMessagingIcon} from '@twilio-paste/icons/esm/ProductMessagingIcon'
import React from 'react'
import _ from 'lodash'
import {TextColor} from '@twilio-paste/style-props/dist/types/typography'

export const TasksListWithPlaceholders = (props: { capacity: number, tasks: Task[], placeholderColor: TextColor }) => {

  let remainingCapacity = props.capacity - props.tasks.length
  let placeholders: any[] = []

  _.times(remainingCapacity, (index: number) => {
    placeholders.push(
      <ProductMessagingIcon
        key={index}
        color={props.placeholderColor}
        decorative={false}
        size='sizeIcon80'
        title='Task placeholder'/>,
    )
  })

  return <Stack orientation='horizontal' spacing='space60'>
    {props.tasks.map(task =>
      <TaskIcon key={task.sid} task={task}/>,
    )}
    {placeholders}
  </Stack>
}