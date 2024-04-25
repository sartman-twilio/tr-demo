import {useState} from 'react'
import {CreateTaskDialog} from './CreateTaskDialog'
import {Button} from '@twilio-paste/core'
import {PlusIcon} from '@twilio-paste/icons/esm/PlusIcon'

export const CreateTaskButton = () => {

  const [show, setShow] = useState(false)

  return <div>
    <Button variant='primary' size='icon' onClick={() => setShow(true)}>
      <PlusIcon decorative={false} title='Add to cart'/>
      Create task
    </Button>

    <CreateTaskDialog show={show} setShow={setShow}/>
  </div>


}