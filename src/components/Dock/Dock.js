import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as windowActive from '../../store/window/action';
import * as dockAction from '../../store/dock/action';

import './Dock.less';
class Dock extends Component {
  constructor(props){ 
    super(props)
    this.state={
      routine:this.routineInit(props.state.procedure.reducer.procedureInfo),
      windowIds:{},
      dragElement:{},//正在被拖拽的元素
    }
  }
  routineInit(procedureInfo){
    //初始化routine
    if(this.props.dock.procedures&&this.props.dock.procedures.length>0){
      return this.props.dock.procedures
    }
    var arr=[]
    for(var item in procedureInfo){
      if(!procedureInfo[item].noPushDock){
        arr.push(procedureInfo[item])
      }
    }
    this.props.setProcedures(arr);//
    return arr 
  }
  componentWillReceiveProps(nextProp){
    //
    this.setState({
      routine:nextProp.dock.procedures
    })
    // console.log(nextProp.dock,'nextProp')
  }
  setDockState(item,e){
    //设置哪些程序开启或者关闭
    var windowinfo=this.props.state.windowinfo.reducer
    var windowIds=windowinfo.windowIds;
    var screenH=windowinfo.screen.screenH;
    windowIds[item.id].close=!windowIds[item.id].close;
    windowIds[item.id].top=windowIds[item.id].top>=screenH?parseInt(windowIds[item.id].top)- parseInt(screenH*2):windowIds[item.id].top+parseInt(screenH*2);
    if(!windowIds[item.id].close&&windowIds[item.id].oldTop){
      windowIds[item.id].top=windowIds[item.id].oldTop
      windowIds[item.id].left=windowIds[item.id].oldLeft
    }
    windowIds[item.id].mini=true;
    windowIds[item.id].full=false;
    this.props.setWindowIds(windowIds);
    this.props.setActiveWindowId(item.id);
    this.props.getState2();
  }
  DockEvent(eventType,e){
    //事件总代理
    // console.log(eventType,'eventType')
    switch (eventType) {
      case "DragEnter":
        //拖拽进入哪个元素上面
        // console.log('DragEnter')
        var routine=JSON.parse(JSON.stringify(this.state.routine));
        if(!this.state.dragElement.index)return;
        var dragElement=routine[this.state.dragElement.index];
        routine.splice(this.state.dragElement.index,1)
        routine.splice(parseInt(e.target.attributes.index.value),0,dragElement)
        this.setState({
          dragElement:{index:parseInt(e.target.attributes.index.value)},
          routine:routine
        })
        break;
      case "DragOver":
        //拖拽在哪个元素上面移动
        break;
      case "DragLeave":
        //拖拽离开哪个元素上面
        // console.log("DragLeave")
        break;
      case "DragStart":
        //开始拖拽        
        this.setState({
          dragElement:{
            index:e.target.attributes.index.value
          }
        })
        break;
      case "Drag":
        //拖拽中
        break;
      case "DragEnd":
        //拖拽结束
        this.props.setProcedures(this.state.routine)
        // console.log("DragEnd")
        break;
      default:
        break;
    }
  }
  render() {
    return (
      <div className="Dock">
        <div className="Dock_item" draggable="false">
            {this.state.routine.map((item,index)=>{
              return (
                    <div 
                      draggable="true"
                      onDragEnter={this.DockEvent.bind(this,'DragEnter')}
                      onDragOver={this.DockEvent.bind(this,'DragOver')}
                      onDragLeave={this.DockEvent.bind(this,'DragLeave')}
                      onDragStart={this.DockEvent.bind(this,'DragStart')}
                      onDrag={this.DockEvent.bind(this,'Drag')}
                      onDragEnd={this.DockEvent.bind(this,'DragEnd')}
                      onClick={this.setDockState.bind(this,item)} 
                      index={index} 
                      name={item.name}
                      className="Dock_item_Icon" 
                      key={index}
                      >
                        <img draggable="false" index={index} name={item.name} src={item.icon} alt=""/>
                      {/* <p>{item.name}</p> */}
                    </div>
                )
            })}
        </div>
      </div>
    )
  }
}
function getState (state){
  return {
    state: state,
    dock:state.dock.reducer
  }
} 
Dock =connect(getState,{...windowActive,...dockAction})(Dock)
export default Dock;
