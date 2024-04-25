import {Worker} from '../model/Worker'
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core'
import {WorkerCard} from './WorkerCard'
import {makeStyles} from '@material-ui/core/styles'
import {TasksListBody} from './TasksListBody'
import {AssignedTask, ReservedTask, TaskStatus} from '../model/Task'
import {TaskRouterDemoToolState} from '../state/State'
import {sortedByStringAttribute} from '../helper/Utils'
import {connect} from 'react-redux'
import {Queue} from '../model/Queue'
import {Box, Stack} from '@twilio-paste/core'

const useStyles = makeStyles(() => ({
  cellStyle: {
    borderBottom: 'none',
  },
}))

const WorkersTableComponent = (props: {
  workers: Worker[],
  reservedTasks: ReservedTask[],
  assignedTasks: AssignedTask[]
}) => {

  const classes = useStyles()

  return <Table>
    <TableBody>
      {props.workers.map(worker =>
        <TableRow
          key={worker.sid}
          id={worker.sid}
        >
          <TableCell className={classes.cellStyle}>
            <Stack orientation='horizontal' spacing='space10'>
              <Box minWidth='60px'>
                <TasksListBody tasks={filterReservedTasksByWorkerSid(props.reservedTasks, worker.sid)}/>
              </Box>
            </Stack>
          </TableCell>
          <TableCell
            className={classes.cellStyle}
          >
            <WorkerCard
              worker={worker}
              tasks={filterAssignedTasksByWorkerSid(props.assignedTasks, worker.sid)}
            />
          </TableCell>
        </TableRow>,
      )}
    </TableBody>
  </Table>
}

const filterAssignedTasksByWorkerSid = (tasks: AssignedTask[], workerSid: string): AssignedTask[] =>
  tasks.filter(task => task.workerSid === workerSid)

const filterReservedTasksByWorkerSid = (tasks: ReservedTask[], workerSid: string): ReservedTask[] =>
  tasks.filter(task => task.workerSid === workerSid)

function getOrderedWorkers(queues: Queue[]): Worker[] {
  let sortedQueues = sortedByStringAttribute(queues, (queue) => queue.name)
  let keys = new Set<string>()
  let workers = new Array<Worker>()
  sortedQueues.flatMap(q => sortedByStringAttribute(q.workers, (worker) => worker.name))
    .forEach(worker => {
        if (!keys.has(worker.sid)) {
          keys.add(worker.sid)
          workers.push(worker)
        }
      },
    )
  return workers
}

const mapStateToProps = (state: TaskRouterDemoToolState) => {
  return {
    workers: getOrderedWorkers(state.queues),
    reservedTasks: Array.from(state.tasks.values())
      .filter(task => task.status === TaskStatus.Reserved)
      .map(task => task as ReservedTask),
    assignedTasks: Array.from(state.tasks.values())
      .filter(task => task.status === TaskStatus.Assigned)
      .map(task => task as AssignedTask),
  }
}

export const WorkersTable =
  connect(mapStateToProps)(WorkersTableComponent)
