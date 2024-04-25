import {Queue} from '../model/Queue'
import Xarrow from 'react-xarrows'
import React from 'react'
import {TaskRouterDemoToolState} from '../state/State'
import {connect} from 'react-redux'

const XArrowsComponents = (props: { queues: Queue[] }) => {
  return (<div>
      {/*<Xarrow start='create-button-col' end='taskrouter-col' color='black' showHead={false} curveness={0}/>*/}
      {
        props.queues.map(queue =>
          <div key={'arrow-tr-queue-' + queue.sid}>
            <Xarrow start='create-button-col' end={queue.sid} color='black' showHead={false} curveness={0}/>
            <QueueWorkersArrows queue={queue}/>
          </div>,
        )
      }
    </div>
  )
}

const QueueWorkersArrows = (props: { queue: Queue }) => <div>
  {props.queue.workers.map(worker =>
    <Xarrow
      key={'arrow' + props.queue.sid + worker.sid}
      start={props.queue.sid} end={worker.sid}
      color='black'
      showHead={false}
      curveness={0}
    />,
  )}
</div>

export const mapStateToProps = (state: TaskRouterDemoToolState) => {
  return {
    queues: state.queues,
  }
}

export const XArrows =
  connect(mapStateToProps)(XArrowsComponents)