import React, { Component } from 'react'
import './AdjustBar.less';
export default class AdjustBar extends Component {
  constructor(){
      super();
  }
  AdjustBarEvent(eventType,e){
    // this.props.AdjustBarEvent()
    var o={eventType:"AdjustBar"+eventType,e:e,direction:this.props.direction}
    this.props.eventFN(o)
  }
  render() {
    return (
      <div
       onDragStart={this.AdjustBarEvent.bind(this,'DragStart')}
       onDrag={this.AdjustBarEvent.bind(this,'Drag')}
       onDragEnd={this.AdjustBarEvent.bind(this,'DragEnd')}
       draggable="true"
       className={['AdjustBar',this.props.direction].join(" ")}>
        
      </div>
    )
  }
}
