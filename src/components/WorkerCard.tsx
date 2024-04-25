import {Worker} from '../model/Worker'
import {AssignedTask} from '../model/Task'
import {Table, TBody, Td, Th, THead, Tr, Text, Stack, Box} from '@twilio-paste/core'
import {AgentIcon} from '@twilio-paste/icons/esm/AgentIcon'
import {TasksListWithPlaceholders} from './TasksListWithPlaceholders'
import {IOSSwitch} from './IOSSwitch'
import {setWorkerActivity} from '../helper/TwilioClientHelper'
import {bindActionCreators, Dispatch} from 'redux'
import {Action, ActionType} from '../state/Actions'
import {connect} from 'react-redux'
import {TaskRouterDemoToolState} from '../state/State'
import {Activity} from '../model/Activity'


const WorkerCardComponent = (props: {
  worker: Worker,
  tasks: AssignedTask[],
  availableActivity: Activity,
  unavailableActivity: Activity,
  requestAgentActivityChange: (workerSid: string, available: boolean) => void,
}) => {

  const handleSwitch = () => {
    console.log("HERE!!!")
    props.requestAgentActivityChange(props.worker.sid, !props.worker.available)
    setWorkerActivity(props.worker.sid, props.worker.available ? props.unavailableActivity : props.availableActivity)
  }

  let borderColorResolved = props.worker.available ? 'colorBorderSuccessWeak' : 'colorBorder'

  return <Box
    borderRadius='borderRadius20'
    borderStyle='solid'
    borderWidth='borderWidth30'
    // @ts-ignore
    borderColor={borderColorResolved}
    boxShadow='shadow'
  >
    <Table>
      <THead>
        <Tr>
          <Th>
            <Stack orientation='horizontal' spacing='space60'>
              <AgentIcon decorative={false} title={`Agent ${props.worker.name}`} size='sizeIcon80'/>
              <Text as='p' fontSize='fontSize40'>{`Agent: ${props.worker.name}`}</Text>
              <IOSSwitch
                disabled={props.worker.availabilityUpdateRequested}
                checked={props.worker.available && !props.worker.availabilityUpdateRequested}
                onChange={handleSwitch}
                name='workerAvailability'
              />
            </Stack>
          </Th>
        </Tr>
      </THead>
      <TBody>
        <Tr>
          <Td>
            {JSON.stringify(props.worker.attributes, null, 2)}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <TasksListWithPlaceholders capacity={props.worker.capacity} tasks={props.tasks}
                                       placeholderColor='colorTextWeaker'/>
          </Td>
        </Tr>
      </TBody>
    </Table>
  </Box>
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    requestAgentActivityChange: bindActionCreators((workerSid: string, available: boolean) => dispatch({
      type: ActionType.WORKER_ACTIVITY_UPDATE_REQUESTED,
      workerSid: workerSid,
      available: available
    }), dispatch),
  }
}

const mapStateToProps = (state: TaskRouterDemoToolState) => {
  return {
    availableActivity: state.availableActivity.get(),
    unavailableActivity: state.unavailableActivity.get(),
  }
}

export const WorkerCard =
  connect(mapStateToProps, mapDispatchToProps)(WorkerCardComponent)