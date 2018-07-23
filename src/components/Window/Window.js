import React, { Component } from 'react'
import Msg from '../../publicComponents/Msg/Msg';
import { connect } from 'react-redux'
import * as windowActive from '../../store/window/action';
import WindowFrame from '../WindowFrame/WindowFrame';
import './Window.less';


 function WindowFN (windowConfig){
  return function Window(WContent){
    class WindowComponent extends Component {
      constructor(props){
        super(props);
        var windowsObj=props.windowids.windowIds[props.id]//获取当前窗口对象
        if(!windowsObj){
          //如果不存在 则设置默认值
          windowsObj={
            textName:props.textName,
            name:props.eName,
            id:props.id,
            close:false,
            mini:true,
            full:false,
            left: parseInt(props.windowids.screen.screenW/3+this.rnd(50,100)),//初始化窗口的左边坐标,,
            top:parseInt(props.windowids.screen.screenH*2+this.rnd(50,200)),//初始化窗口的上面坐标,
            // top:parseInt(props.windowids.screen.screenH*2),//初始化窗口的上面坐标,
            width:500,
            height:500,
            resize:false,//窗口是否发生大小变化
          }
          for(var property in windowsObj){
            if(props[property]){
              //如果props中存在windowsObj中的属性的话,
              //把props中的默认值赋值给windowsObj
              windowsObj[property]=props[property]
            }
          }
        }
        windowsObj.windowConfig=windowConfig;
        this.state={
          windowid:props.id,
          SystemBarSate:'',
          isDrag:false,
          windowsObj:windowsObj,
          msgConfig:{
            show:false,
            text:'',
          }
        }

      }
      rnd(n,m){
        //返回区间函数
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
      }
      
      Msg(o){
        this.setState({
          msgConfig:o
        })
      }
      componentWillReceiveProps(nextProps){
        //this.props 指当前值 | nextProps 指下一个props值
        var windowsObj=nextProps.windowids.windowIds[this.state.windowid]
        this.setState({
          windowsObj:windowsObj
        })
      }
      componentDidMount(){
        var windowsObj=this.state.windowsObj
        this.props.setWindowState(windowsObj);
      }
      render() {
        return (
          <WindowFrame windowsObj={this.state.windowsObj}>
                <Msg config={this.state.msgConfig}></Msg>
                <WContent winFN={{ Msg:this.Msg.bind(this) }} {...this.props} />
          </WindowFrame>
        )
      }
    }
    return connect(getState,windowActive)(WindowComponent);
  }
} 
function getState(state) {
  return {
      state: state,
      windowids:state.windowinfo.reducer
  }
}
export default WindowFN