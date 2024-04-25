import {InQueueTask} from '../model/Task'
import {Box, Stack, Table, TBody, Td, Text, Th, THead, Tr} from '@twilio-paste/core'
import {TasksListWithPlaceholders} from './TasksListWithPlaceholders'
import {ProductTaskRouterIcon} from '@twilio-paste/icons/esm/ProductTaskRouterIcon'

export const QueueCard = (props: { name: string, tasks: InQueueTask[] }) => {

  return <Box
    borderRadius='borderRadius20'
    borderStyle='solid'
    borderWidth='borderWidth30'
    borderColor='colorBorder'
    boxShadow='shadow'
  >
    <Table>
      <THead>
        <Tr>
          <Th>
            <Stack orientation='horizontal' spacing='space60'>
              <ProductTaskRouterIcon decorative={false} title={`Queue ${props.name}`} size='sizeIcon80'/>
              <Text as='p' fontSize='fontSize40'>{`Queue: ${props.name}`}</Text>
            </Stack>
          </Th>
        </Tr>
      </THead>
      <TBody>
        <Tr>
          <Td>
            <TasksListWithPlaceholders capacity={5} tasks={props.tasks} placeholderColor='colorTextInverse'/>
          </Td>
        </Tr>
      </TBody>
    </Table>
  </Box>
}