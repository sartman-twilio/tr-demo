import React from 'react'
import {createTask} from '../helper/TwilioClientHelper'
import {
  Button,
  HelpText,
  Input,
  Label,
  Modal,
  ModalBody, ModalFooter,
  ModalFooterActions,
  ModalHeader,
  ModalHeading,
  TextArea,
} from '@twilio-paste/core'
import {InputContainer} from './Containers'

export function CreateTaskDialog(
  props: {
    show: boolean,
    setShow: ((value: (((prevState: boolean) => boolean) | boolean)) => void),
  },
) {

  const initialFormData = Object.freeze({
    priority: '0',
    attributes: '{\n    "language": "EN"\n}',
  })

  const [formData, updateFormData] = React.useState(initialFormData)
  const [errorPriority, setErrorPriority] = React.useState(false)
  const [errorAttributes, setErrorAttributes] = React.useState(false)

  const handleChange = (e: any) => {
    updateFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    })
  }

  const handleSubmit = () => {
    let error = false
    if (!isValidPriority(formData.priority)) {
      setErrorPriority(true)
      error = error || true
    } else {
      setErrorPriority(false)
    }
    if (!isValidJson(formData.attributes)) {
      setErrorAttributes(true)
      error = error || true
    } else {
      setErrorAttributes(false)
    }
    if (error) return
    createTask(Number(formData.priority), formData.attributes)
    handleClose()
  }

  const handleClose = () => {
    props.setShow(false)
  }

  return (
    <div>
      <Modal
        ariaLabelledby={'modalHeadingID'}
        isOpen={props.show}
        aria-labelledby='edit-apartment'
        onDismiss={handleClose}
        size='default'
      >
        <ModalHeader id='edit-apartment'>
          <ModalHeading as='h1' id='modalHeadingID'>
            Create task
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <InputContainer>
            <Label htmlFor='priority' required>Priority</Label>
            <Input
              aria-describedby='priority_help_text'
              autoFocus
              id='priority'
              type='text'
              value={formData.priority}
              onChange={handleChange}
              hasError={errorPriority}
            />
            {errorPriority &&
            <HelpText id='priority_help_text' variant='error'>Should be an integer in range 0 - 100</HelpText>
            }
          </InputContainer>
          <Label htmlFor='attributes' required>Attributes</Label>
          <TextArea
            id='attributes'
            rows={3}
            value={formData.attributes}
            onChange={handleChange}
            hasError={errorAttributes}
          />
          {errorAttributes &&
          <HelpText id='priority_help_text' variant='error'>Should be a valid JSON</HelpText>
          }
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button onClick={handleSubmit} variant='primary'>
              Submit
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const isValidPriority = (priority: string) => {
  let priorityInt = Number(priority)
  return priority !== '' && Number.isInteger(priorityInt) && priorityInt >= 0 && priorityInt <= 100
}

const isValidJson = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}