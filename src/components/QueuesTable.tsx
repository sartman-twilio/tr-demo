import {Table, TableBody, TableCell, TableRow} from '@material-ui/core'
import {Queue} from '../model/Queue'
import {QueueCard} from './QueueCard'
import {makeStyles} from '@material-ui/core/styles'
import {InQueueTask, TaskStatus} from '../model/Task'
import {TaskRouterDemoToolState} from '../state/State'
import {connect} from 'react-redux'
import {sortedByStringAttribute} from '../helper/Utils'

const useStyles = makeStyles(() => ({
  cellStyle: {
    borderBottom: 'none',
  },
}))

const QueuesTableComponent = (props: { queues: Queue[], inQueueTasks: InQueueTask[] }) => {

  const classes = useStyles()

  return <Table>
    <TableBody>
      {props.queues.map(queue =>
        <TableRow key={queue.sid}>
          <TableCell className={classes.cellStyle} id={queue.sid}>
            <QueueCard name={queue.name} tasks={filterTasksByQueueSid(props.inQueueTasks, queue.sid)}/>
          </TableCell>
        </TableRow>,
      )}
    </TableBody>
  </Table>
}

const filterTasksByQueueSid = (tasks: InQueueTask[], queueSid: string) =>
  tasks.filter(task => task.queueSid === queueSid)

const mapStateToProps = (state: TaskRouterDemoToolState) => {
  return {
    queues: sortedByStringAttribute(state.queues, (queue) => queue.name),
    inQueueTasks: Array.from(state.tasks.values())
      .filter(task => task.status === TaskStatus.InQueue)
      .map(task => task as InQueueTask),
  }
}

export const QueuesTable =
  connect(mapStateToProps)(QueuesTableComponent)