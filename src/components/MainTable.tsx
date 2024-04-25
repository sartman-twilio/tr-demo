import React from 'react'
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core'
import {WorkersTable} from './WorkersTable'
import {CreateTaskButton} from './CreateTaskButton'
import {QueuesTable} from './QueuesTable'
import {makeStyles} from '@material-ui/core/styles'
import {XArrows} from './XArrows'

const useStyles = makeStyles(() => ({
  containerStyle: {
    borderCollapse: 'separate',
    borderSpacing: '100px',
  },
  cellStyle: {
    padding: '10px 0',
    borderBottom: 'none',
  },
}))

export const MainTable = () => {

  const classes = useStyles()

  return (
    <div>
      <Table className={classes.containerStyle}>
        <TableBody>
          <TableRow>
            <TableCell id='create-button-col' className={classes.cellStyle}>
              <CreateTaskButton/>
            </TableCell>
            <TableCell id='queues-col' className={classes.cellStyle}>
              <QueuesTable/>
            </TableCell>
            <TableCell id='arrows-col' className={classes.cellStyle}>
              <div style={{width: 100}}/>
            </TableCell>
            <TableCell id='workers-col' className={classes.cellStyle}>
              <WorkersTable/>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <XArrows/>
    </div>
  )
}