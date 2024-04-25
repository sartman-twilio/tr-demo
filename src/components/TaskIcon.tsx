import React from 'react'
import {Theme} from '@material-ui/core/styles'
import {Task} from '../model/Task'
import {TaskInfoTable} from './TaskInfoTable'
import {Tooltip, withStyles} from '@material-ui/core'
import {ProductMessagingIcon} from '@twilio-paste/icons/esm/ProductMessagingIcon'

export default function TaskIcon(props: { task: Task }) {

  const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: '#fff',
      maxWidth: 500,
      width: 'fit-content',
      fontSize: theme.typography.pxToRem(20),
      border: '2px solid #000',
      borderColor: 'rgb(150, 150, 150)',
      borderRadius: '4px',
      borderStyle: 'solid',
      borderWidth: '1px',
    },
  }))(Tooltip)

  return (
    <div>
      <HtmlTooltip
        arrow
        interactive
        title={
          <React.Fragment>
            <TaskInfoTable task={props.task}/>
          </React.Fragment>
        }
      >
        <div>
          <ProductMessagingIcon
            color='colorTextError'
            decorative={false}
            size='sizeIcon80'
            title={`Task #${JSON.parse(props.task.attributes)['ordinal']}`}/>
        </div>
      </HtmlTooltip>
    </div>
  )
}