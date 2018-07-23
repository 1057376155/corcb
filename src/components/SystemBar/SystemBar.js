import React, { Component } from 'react'
import './SystemBar.less'
 class CloseBtn extends Component {
  closeFN(){
    this.props.eventFN('close');
  }
  render() {
    return (
      <div className="closeBtn" onClick={this.closeFN.bind(this)}>
            <div className="circleHBtn">
                <span className="circle"></span>
                {/* <span className="Transverse closeBtnImg_item"></span> */}
                {/* <span className="longitudinal closeBtnImg_item"></span> */}
            </div>
      </div>
    )
  }
}

class MiniBtn extends Component {
    miniFN(){
      this.props.eventFN('mini');
    }
    render() {
      return (
        <div className="MiniBtn" onClick={this.miniFN.bind(this)}>
              <div className="circleHBtn">
                  <span className="circle"></span>
                  {/* <span className="Transverse MiniBtnImg_item"></span> */}
              </div>
        </div>
      )
    }
}

class FullBtn extends Component {
    fullFN(){
      this.props.eventFN('full');
    }
    render() {
      return (
        <div className="FullBtn" onClick={this.fullFN.bind(this)}>
              <div className="circleHBtn">
                  <span className="circle"></span>
              </div>
        </div>
      )
    }
}

export default class SystemBar extends Component {
  constructor(props){
    super(props)
    this.state={
      draggable:true,
      title:'',
      dragImg:new Image()
    }
  }
  componentWillMount(){
  }
  componentDidMount(){
    // console.dir(ReactDOM.findDOMNode(this.refs.test)) 
    this.setState({
      title:this.props.SystemBarConfig.title
    })
  }
  SystemBarEvent(eventType,e){
    //事件触发
    if(e&&e.dataTransfer&&e.dataTransfer.setDragImage){
      e.dataTransfer.setDragImage(this.state.dragImg,0,0);
    }
    var o={eventType:eventType,e:e}
    // if(e.offsetX<0||e.offsetY<0){
    //   o.eventType='DragEnd'
    //   this.setState({
    //     draggable:false
    //   })
    // }
    this.props.eventFN(o)
  }
  render() {
    return (
      <div 
      // onMouseDown={this.SystemBarEvent.bind(this,'MouseDown')}
      // onMouseLeave={this.SystemBarEvent.bind(this,'MouseLeave')} 
      // onMouseMove={this.SystemBarEvent.bind(this,'MouseMove')} 
      onClick={this.SystemBarEvent.bind(this,'click')}
      onDragStart={this.SystemBarEvent.bind(this,'DragStart')}
      onDrag={this.SystemBarEvent.bind(this,'Drag')}
      onDragEnd={this.SystemBarEvent.bind(this,'DragEnd')}
      onMouseUp={this.SystemBarEvent.bind(this,'MouseUp')}
      className="SystemBar" 
      draggable={this.state.draggable}>
        <CloseBtn eventFN={this.SystemBarEvent.bind(this)}></CloseBtn>
        <MiniBtn eventFN={this.SystemBarEvent.bind(this)}></MiniBtn>
        <FullBtn eventFN={this.SystemBarEvent.bind(this)}></FullBtn>
        <span className="title" draggable="false">{this.state.title}</span>
      </div>
    )
  }
}

