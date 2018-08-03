import React, { Component } from 'react'
import SystemBar from '../SystemBar/SystemBar'
import { connect } from 'react-redux'
import * as windowActive from '../../store/window/action';
import AdjustBar from '../AdjustBar/AdjustBar'
import html2canvas from 'html2canvas';
import './WindowFrame.less';
 class WindowFrame extends Component {
  constructor(props){
    var windowsObj=props.windowsObj
    super(props);
    this.windowState={
      screenH:props.windowids.screen.screenH,
      screenW:props.windowids.screen.screenW,
      windowid:windowsObj.id,
      xs:[],
      ys:[],
      left:windowsObj.left,
      top:windowsObj.top,
      width:windowsObj.width,
      height:windowsObj.height,
      isAdjustBarDragStart:false,//是否开始拖拉以缩放宽度
      isDrag:false,//此字段说明是在拖拽 该属性将没有动画
      windowsObj:windowsObj,
    }
    this.state={
      style:{},
      windowScr:''
    }
    this.WindowDOM=""
    this.windowChildren=""
  }
  componentWillReceiveProps(nextProps){
    //this.props 指当前值 | nextProps 指下一个props值
    var setproperty={
      left:'left',
      top:'top',
      width:'width',
      height:'height',
    }
    var windowsObj=nextProps.windowids.windowIds[this.windowState.windowid]
    this.windowState.windowsObj=windowsObj
    for(var property in windowsObj){
      if(setproperty[property]&&windowsObj[property]!=this.windowState[property]){
        this.windowState[property]=windowsObj[property]
      }
    }
    this.setStateValue(windowsObj);
    if(nextProps.windowids.adjustBarDragId!=''&&nextProps.windowids.adjustBarDragId!=this.windowState.windowid){
      this.isAdjustBarDragStart=true;
    }else{
      this.isAdjustBarDragStart=false;
    }
  }
  componentWillMount(){
    this.windowState.isDrag=true;
    
  }
  componentDidMount(){  
    
    var windowsObj=this.windowState.windowsObj
    this.props.setWindowState(windowsObj);
    
    this.WindowDOM=this.refs.Window
    this.windowChildren=document.querySelector(".windowChildren")

    setTimeout(() => {
      this.windowState.isDrag=false;
      
    }, 1000);
  }
  getWindowScreen(){
    html2canvas(this.props.children).then(canvas => {
      this.setState({
        windowScr:canvas.toDataURL()
      })
      // console.log(,'canvas')
      // document.body.appendChild(canvas)
    });
  }
  eventFN(e){
    //事件触发
    // console.log(e.eventType,'e.eventType')
    var xs=this.windowState.xs?this.windowState.xs:[];//用于计算x轴距离
    var ys=this.windowState.ys?this.windowState.ys:[];;//用于计算y轴距离
    var mousemoveX=e.e&&e.e.pageX?e.e.pageX:xs[0];//获取鼠标的X
    var mousemoveY=e.e&&e.e.pageY?e.e.pageY:ys[0];//获取鼠标的Y
    var wComponentX=this.windowState.left;//获取DOM的左边距离
    var wComponentY=this.windowState.top;//获取DOM的上边距离
    xs.push(mousemoveX)
    ys.push(mousemoveY)
    if(xs.length>=3){xs.splice(0,1)}
    if(ys.length>=3){ys.splice(0,1)}
    this.windowState.xs=xs;
    this.windowState.ys=ys;

    switch (e.eventType) {
      case "Drag":
          //拖拉
          if(xs.length<2||ys.length<2)return;
          var left=wComponentX+(xs[1]-xs[0]);
          var top=wComponentY+(ys[1]-ys[0]);
          this.windowState.left=left;
          this.windowState.top=top;
          delete this.windowState.windowsObj.oldTop
          delete this.windowState.windowsObj.oldLeft
          this.setStateValue(this.windowState)
          break;
      case "close":
          //如果是关闭事件
        // if(!closeWindowIds.close)return;
        var screenH=this.windowState.screenH;
        this.windowState.windowsObj.close=true;
        this.windowState.windowsObj.mini=false;
        this.windowState.windowsObj.full=false;
        this.windowState.windowsObj.left=this.windowState.left;
        this.windowState.windowsObj.top=this.windowState.top>=screenH?parseInt(this.windowState.top)- parseInt(screenH*2):this.windowState.top+parseInt(screenH*2);
        this.props.setWindowState(this.windowState.windowsObj)
        break;
      case "mini":
        //如果是最小化事件
        var screenH=this.windowState.screenH;
        if(this.windowState.windowsObj.mini){
          //如果已经是最小化了，再次点击则是隐藏窗口
          this.windowState.windowsObj.close=true;
          this.windowState.windowsObj.mini=false;
          this.windowState.windowsObj.left=this.windowState.windowsObj.oldLeft?this.windowState.windowsObj.oldLeft:this.windowState.windowsObj.left;
          this.windowState.windowsObj.top=this.windowState.top>=screenH?parseInt(this.windowState.top)- parseInt(screenH*2):this.windowState.top+parseInt(screenH*2);
        }else{
          this.windowState.windowsObj.close=false;
          this.windowState.windowsObj.mini=true;
          this.windowState.windowsObj.left=this.windowState.windowsObj.oldLeft?this.windowState.windowsObj.oldLeft:this.windowState.left;
          this.windowState.windowsObj.top=this.windowState.windowsObj.oldTop?this.windowState.windowsObj.oldTop:this.windowState.top;
        }
        this.windowState.windowsObj.full=false;
        this.windowState.windowsObj.resize=true
        this.props.setWindowState(this.windowState.windowsObj)
        setTimeout(()=>{
          this.windowState.windowsObj.resize=false
          this.props.setWindowState(this.windowState.windowsObj)
        },1000)
        
        break;
      case "full":
        //如果全屏事件
        if(this.windowState.windowsObj.full){
          //如果已经是全屏，则变为最小化
          this.windowState.windowsObj.full=false;
          this.windowState.windowsObj.mini=true;
          this.windowState.windowsObj.left=this.windowState.windowsObj.oldLeft?this.windowState.windowsObj.oldLeft:this.windowState.windowsObj.left;
          this.windowState.windowsObj.top=this.windowState.windowsObj.oldTop?this.windowState.windowsObj.oldTop:this.windowState.windowsObj.top;
        }else{
          this.windowState.windowsObj.full=true;
          this.windowState.windowsObj.mini=false;
          this.windowState.windowsObj.left=0;
          this.windowState.windowsObj.top=0;
          this.windowState.windowsObj.oldLeft=this.windowState.left;
          this.windowState.windowsObj.oldTop=this.windowState.top;
        }
        this.windowState.windowsObj.close=false;
        this.windowState.windowsObj.resize=true
        this.props.setWindowState(this.windowState.windowsObj)
        setTimeout(()=>{
          this.windowState.windowsObj.resize=false
          this.props.setWindowState(this.windowState.windowsObj)
        },1000)
        break;
      case "click":
        //如果点击事件
        this.props.setActiveWindowId(this.windowState.windowid)
        break;
      case "DragStart":
        //如果开始拖拽事件
        
        this.WindowDOM.style.willChange = 'transform'
        this.windowState.isDrag=true;
        this.props.setActiveWindowId(this.windowState.windowid)
        
        break;
      case "DragEnd":
        //如果结束拖拽事件
        this.WindowDOM.style.willChange = ''
        this.windowState.isDrag=false;
        this.props.setWindowState(this.windowState.windowsObj)
        break;
      case "AdjustBarDrag":
        //如果开始拖拽以调整窗口大小
        
        if(xs.length<2||ys.length<2)return;
        var left=wComponentX+(xs[1]-xs[0]);
        var top=wComponentY+(ys[1]-ys[0]);
        
        if(e.direction=="left"){
          //如果是左边的拖拉
          if(e.e.pageX>left+10)return;
          this.windowState.width=this.windowState.width+this.windowState.left-left;
          this.windowState.left=left
        }
        if(e.direction=="right"){
          //如果是右边的拖拉  
          this.windowState.width=e.e.pageX-this.windowState.left;
        }
        if(e.direction=="bottom"){
          //如果是下边的拖拉
          this.windowState.height=e.e.pageY-this.windowState.top;
        }
        if(this.windowState.width<300||this.windowState.height<300){
          //如果小于最小宽度或者最小高度
          return;
        }
        this.setStateValue(this.windowState)
        break;
      case "AdjustBarDragStart":
        //如果开始窗口带下事件
        // this.WindowDOM.style.willChange = 'transform,width,height'
        this.windowState.windowsObj.full=false;
        this.windowState.windowsObj.mini=true;
        this.windowState.windowsObj.resize=true
        this.windowState.isDrag=true;
        this.props.setActiveWindowId(this.windowState.windowid)
        this.props.setAdjustBarDragId(this.windowState.windowid)
        break;
      case "AdjustBarDragEnd":
        //如果结束拖放窗口大小事件
        
        this.WindowDOM.style.willChange=""
        this.windowState.windowsObj.resize=true;
        this.props.setWindowState(this.windowState.windowsObj)
        this.props.setAdjustBarDragId("")
        this.windowState.isDrag=false;
        setTimeout(()=>{
          this.windowState.windowsObj.resize=false;
          this.props.setWindowState(this.windowState.windowsObj)
        },1000)
        break;
      default:
        break;
    }
  }
  setActive(){
    //设置焦点
    this.props.setActiveWindowId(this.windowState.windowid)
  }
  setStateValue(windowsObj){
    //设置state中的值
    if(!windowsObj){
      return;
    }
    this.windowState.windowsObj.left=windowsObj.left;
    this.windowState.windowsObj.top=windowsObj.top;
    this.windowState.windowsObj.width=windowsObj.width;
    this.windowState.windowsObj.height=windowsObj.height;

    this.WindowDOM.style.cssText=`
    transform:translate3d(${windowsObj.left}px,${windowsObj.top}px, 0px);
    width:${windowsObj.width}px;
    height:${windowsObj.height}px;
    `
    // console.log(windowsObj.width,this.windowState.windowsObj.width)
    // this.WindowDOM.style.cssText=`
    //   transform:translate3d(${windowsObj.left}px,${windowsObj.top}px, 0px) scale(${windowsObj.width/this.windowState.windowsObj.width},${windowsObj.height/this.windowState.windowsObj.height});
    // `



    // this.setState({
    //   style:{
    //     transform:`translate3d(${windowsObj.left}px,${windowsObj.top}px, 0px)`,
    //     width:`${windowsObj.width}px`,
    //     height:`${windowsObj.height}px`,
    //   }
    // })

  }
  render() {
    var windowsObj=this.windowState.windowsObj
    return (
      <div
        style={this.state.style}
        onClick={this.setActive.bind(this)}
        draggable="false"
        className={
          [
            'window',
            windowsObj&&windowsObj.close?'close':'',
            windowsObj&&windowsObj.full?'full':'',
            windowsObj&&windowsObj.mini?'mini':'',
            this.isAdjustBarDragStart?'AdjustBarDrag':'',
            this.windowState.isDrag?'isDrag':'NoDrag',
            this.props.windowids.activeWindId==this.windowState.windowid?'active':'Noactive'
          ].join(" ")
        }
        ref="Window">
        <SystemBar eventFN={this.eventFN.bind(this)} SystemBarConfig={{title:this.props.windowConfig.title}}></SystemBar>
        <AdjustBar eventFN={this.eventFN.bind(this)} direction="left"></AdjustBar>
        <AdjustBar eventFN={this.eventFN.bind(this)} direction="right"></AdjustBar>
        <AdjustBar eventFN={this.eventFN.bind(this)} direction="bottom"></AdjustBar>
        <div className="windowChildren">
            {this.props.children}
        </div>
        <img src={this.state.windowScr} alt=""/>
      </div>
    )
  }
}

function getState(windowState) {
  return {
      windowState: windowState,
      windowids:windowState.windowinfo.reducer
  }
}

export default WindowFrame=connect(getState,windowActive)(WindowFrame);