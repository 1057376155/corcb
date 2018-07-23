import React, { Component } from 'react'
import SystemBar from '../SystemBar/SystemBar'
import './Window.less';
import { connect } from 'react-redux'
import * as windowActive from '../../store/window/action';
import AdjustBar from '../AdjustBar/AdjustBar'
import Msg from '../../publicComponents/Msg/Msg';
import chrome from '../../config/chromeOp'
 function WindowFN (windowConfig){
  return function Window(WContent){
     class WindowComponent extends Component {
      constructor(props){
        super(props);
        var windowsObj=this.props.windowids.windowIds[props.id]//获取当前窗口对象
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
          console.log(windowsObj,'windowsObj')
          for(var property in windowsObj){
            if(props[property]){
              //如果props中存在windowsObj中的属性的话,
              //把props中的默认值赋值给windowsObj
              windowsObj[property]=props[property]
            }
          }
        }
        this.state={
          screenH:props.windowids.screen.screenH,
          screenW:props.windowids.screen.screenW,
          windowid:props.id,
          SystemBarSate:'',
          xs:[],
          ys:[],
          DOMXY:{
            left:windowsObj.left,
            top:windowsObj.top,
          },
          style:{
            transform: "translate3d("+windowsObj.left+"px,"+windowsObj.top+"px, 0px)",
            width:windowsObj.width+"px",
            height:windowsObj.height+"px",
          },
          closeStyle:{},
          isDrag:false,
          windowsObj:windowsObj,
          msgConfig:{
            show:false,
            text:'',
          }
        }
        this.propsing=true //是否想子组件传值
        this.AdjustBarDragNum=0;//减少拖拉的次数

      }
      componentWillReceiveProps(nextProps){
        //this.props 指当前值 | nextProps 指下一个props值
        var windowsObj=nextProps.windowids.windowIds[this.state.windowid]
        this.setStateValue(windowsObj)
      }
      componentDidMount(){
        var windowsObj=this.state.windowsObj
        this.props.setWindowState(windowsObj);
        this.chromeInit();
      }
      
      chromeInit(){
        
        chrome.tabs.onSelectionChanged.addListener(()=>{
          // 当标签页发生点击的时候更新页面
          var reduxlocalStorage= JSON.parse(localStorage.getItem("redux"))
          var windowinfoReducer=reduxlocalStorage.windowinfo.reducer
          var localStorageWindowIds=windowinfoReducer.windowIds
          var localStorageActiveWindId=windowinfoReducer.activeWindId
          var imgBg=windowinfoReducer.bgImg
          localStorageWindowIds[this.state.windowid].resize=true
          this.setStateValue(localStorageWindowIds[this.state.windowid])

          setTimeout(()=>{
            //模拟窗口变化
            localStorageWindowIds[this.state.windowid].resize=false 
            this.setStateValue(localStorageWindowIds[this.state.windowid])
          },1000)

          this.props.setWindowIds(localStorageWindowIds);
          if(imgBg!=this.props.windowids.bgImg){
            this.props.setBgImg(imgBg);
          }
          this.props.setActiveWindowId(localStorageActiveWindId)
        });
      }
      rnd(n,m){
        //返回区间函数
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
      }
      eventFN(e){
        //事件触发
        // console.log(e.eventType,'e.eventType')
        var xs=this.state.xs;//用于计算x轴距离
        var ys=this.state.ys;//用于计算y轴距离
        var mousemoveX=e.e&&e.e.pageX?e.e.pageX:xs[0];//获取鼠标的X
        var mousemoveY=e.e&&e.e.pageY?e.e.pageY:ys[0];//获取鼠标的Y
        var wComponentX=parseInt(this.state.DOMXY.left);//获取DOM的左边距离
        var wComponentY=parseInt(this.state.DOMXY.top);//获取DOM的上边距离
        xs.push(mousemoveX)
        ys.push(mousemoveY)
        if(xs.length>=3){xs.splice(0,1)}
        if(ys.length>=3){ys.splice(0,1)}
        

        switch (e.eventType) {
          case "Drag":
              //拖拉
              this.refs.Window.style.willChange = 'transform'
              if(xs.length<2||ys.length<2)return;
              var left=wComponentX+(xs[1]-xs[0]);
              var top=wComponentY+(ys[1]-ys[0]);
              let DragtWindowsObj=this.state.windowsObj;
              DragtWindowsObj.left=left;
              DragtWindowsObj.top=top;
              delete DragtWindowsObj.oldTop
              delete DragtWindowsObj.oldLeft
              this.setStateValue(DragtWindowsObj)
              this.setState({
                xs:xs,
                ys:ys,
                isDrag:true,
              })
              break;
          case "close":
              //如果是关闭事件
            // if(!closeWindowIds.close)return;
            var screenH=this.state.screenH;
            var closeWindowIds=this.props.windowids.windowIds[this.state.windowid];
            closeWindowIds.close=true;
            closeWindowIds.mini=false;
            closeWindowIds.full=false;
            closeWindowIds.left=this.state.DOMXY.left;
            closeWindowIds.top=closeWindowIds.top>=screenH?parseInt(closeWindowIds.top)- parseInt(screenH*2):closeWindowIds.top+parseInt(screenH*2);
            this.props.setWindowState(closeWindowIds)
            break;
          case "mini":
            //如果是最小化事件
            var screenH=this.state.screenH;
            var miniWindowIds=this.props.windowids.windowIds[this.state.windowid];
            if(miniWindowIds.mini){
              //如果已经是最小化了，再次点击则是隐藏窗口
              miniWindowIds.close=true;
              miniWindowIds.mini=false;
              miniWindowIds.left=miniWindowIds.oldLeft?miniWindowIds.oldLeft:miniWindowIds.left;
              miniWindowIds.top=miniWindowIds.top>=screenH?parseInt(miniWindowIds.top)- parseInt(screenH*2):miniWindowIds.top+parseInt(screenH*2);
            }else{
              miniWindowIds.close=false;
              miniWindowIds.mini=true;
              miniWindowIds.left=miniWindowIds.oldLeft?miniWindowIds.oldLeft:miniWindowIds.left;
              miniWindowIds.top=miniWindowIds.oldTop?miniWindowIds.oldTop:miniWindowIds.top;
            }
            miniWindowIds.full=false;
            miniWindowIds.resize=true
            this.props.setWindowState(miniWindowIds)
            setTimeout(()=>{
              miniWindowIds.resize=false
              this.props.setWindowState(miniWindowIds)
            },1000)
            
            break;
          case "full":
            //如果全屏事件
            var fullWindowIds=this.props.windowids.windowIds[this.state.windowid];
            if(fullWindowIds.full){
              //如果已经是全屏，则变为最小化
              fullWindowIds.full=false;
              fullWindowIds.mini=true;
              fullWindowIds.left=fullWindowIds.oldLeft?fullWindowIds.oldLeft:fullWindowIds.left;
              fullWindowIds.top=fullWindowIds.oldTop?fullWindowIds.oldTop:fullWindowIds.left;
            }else{
              fullWindowIds.full=true;
              fullWindowIds.mini=false;
              fullWindowIds.left=0;
              fullWindowIds.top=0;
              fullWindowIds.oldLeft=this.state.DOMXY.left;
              fullWindowIds.oldTop=this.state.DOMXY.top;
            }
            fullWindowIds.close=false;
            fullWindowIds.resize=true
            this.props.setWindowState(fullWindowIds)
            setTimeout(()=>{
              fullWindowIds.resize=false
              this.props.setWindowState(fullWindowIds)
            },1000)
            break;
          case "click":
            //如果点击事件
            this.props.setActiveWindowId(this.state.windowid)
            break;
          case "DragStart":
            //如果开始拖拽事件
            
            let DragStartWindowsObj=this.props.windowids.windowIds[this.state.windowid]
            this.setState({
              windowsObj:DragStartWindowsObj
            })
            this.props.setActiveWindowId(this.state.windowid)
            break;
          case "DragEnd":
            //如果结束拖拽事件
            this.refs.Window.style.willChange = ''
            let DragEndWindowsObj=this.state.windowsObj;
            this.props.setWindowState(DragEndWindowsObj)
            this.setState({
              isDrag:false,
              windowsObj:DragEndWindowsObj
            })
            break;
          case "AdjustBarDrag":
            //如果开始拖拽以调整窗口大小
            this.refs.Window.style.willChange = 'transform,width,height'
            if(xs.length<2||ys.length<2)return;
            var left=wComponentX+(xs[1]-xs[0]);
            var top=wComponentY+(ys[1]-ys[0]);
            let AdjustBarDragttWindowsObj=this.state.windowsObj;//窗口对象
            var AdjustBarDragWidth=AdjustBarDragttWindowsObj.width;//窗口的宽度
            var AdjustBarDragHeight=AdjustBarDragttWindowsObj.height;//窗口的高度
            var AdjustBarDragLeft=AdjustBarDragttWindowsObj.left;//窗口的左坐标
            var AdjustBarDragTop=AdjustBarDragttWindowsObj.top;//窗口的y坐标
            
              if(e.direction=="left"){
                //如果是左边的拖拉
                if(e.e.pageX>left+10)return;
                AdjustBarDragWidth=AdjustBarDragttWindowsObj.width+AdjustBarDragttWindowsObj.left-left;
                AdjustBarDragLeft=left
              }
              if(e.direction=="right"){
                //如果是右边的拖拉
                AdjustBarDragWidth=e.e.pageX-AdjustBarDragttWindowsObj.left;
                AdjustBarDragLeft=AdjustBarDragttWindowsObj.left;
              }
              if(e.direction=="bottom"){
                //如果是下边的拖拉
                // 这里面的x2 是因为 鼠标获取的是
                AdjustBarDragHeight=e.e.pageY-AdjustBarDragttWindowsObj.top;
                AdjustBarDragTop=AdjustBarDragttWindowsObj.top;
              }
              if(AdjustBarDragWidth<300||AdjustBarDragHeight<300){
                //如果小于最小宽度或者最小高度
                return;
              }
              AdjustBarDragttWindowsObj.left=AdjustBarDragLeft;
              AdjustBarDragttWindowsObj.top=AdjustBarDragTop;
              AdjustBarDragttWindowsObj.width=AdjustBarDragWidth
              AdjustBarDragttWindowsObj.height=AdjustBarDragHeight
              AdjustBarDragttWindowsObj.resize=true
              // this.props.setWindowState(AdjustBarDragttWindowsObj)
              this.setStateValue(AdjustBarDragttWindowsObj)
              this.setState({
                xs:xs,
                ys:ys,
                isDrag:true,
              })
            break;
          case "AdjustBarDragStart":
            //如果开始窗口带下事件
            let AdjustBarDragStartWindowsObj=this.props.windowids.windowIds[this.state.windowid]
            AdjustBarDragStartWindowsObj.full=false;
            AdjustBarDragStartWindowsObj.mini=true;
            this.setState({
              windowsObj:AdjustBarDragStartWindowsObj
            })
            this.props.setActiveWindowId(this.state.windowid)
            break;
          case "AdjustBarDragEnd":
            //如果结束拖放窗口大小事件
            this.refs.Window.style.willChange=""
            let AdjustBarDragEndWindowsObj=this.state.windowsObj;
            AdjustBarDragEndWindowsObj.resize=false;
            this.props.setWindowState(AdjustBarDragEndWindowsObj)
            this.setState({
              isDrag:false,
              windowsObj:AdjustBarDragEndWindowsObj
            })
            break;
          default:
            break;
        }
      }
      setActive(){
        //设置焦点
        this.props.setActiveWindowId(this.state.windowid)
      }
      Msg(o){
        this.setState({
          msgConfig:o
        })
      }
      setStateValue(windowsObj){
        //设置state中的值
        this.setState({
          DOMXY:{
            left:windowsObj.left,
            top:windowsObj.top,
          },
          style:{
            transform: "translate3d("+windowsObj.left+"px,"+windowsObj.top+"px, 0px)",
            width:windowsObj.width+"px", 
            height:windowsObj.height+"px",
          },
          windowsObj:windowsObj,  //
        })
      }
      getProp(){
        // return {...this.props}
        if(this.propsing){
          return(
            <WContent winFN={{ Msg:this.Msg.bind(this) }} {...this.props} />
          )
        }else{
          return null
          
        }
      }
      render() {
        var windowsObj=this.props.windowids.windowIds[this.state.windowid]
        return (
          <div 
          style={this.state.style}
          onClick={this.setActive.bind(this)}
          className={
            [
              'window',
              windowsObj&&windowsObj.close?'close':'',
              windowsObj&&windowsObj.full?'full':'',
              windowsObj&&windowsObj.mini?'mini':'',
              this.state.isDrag?'isDrag':'',
              this.props.windowids.activeWindId==this.state.windowid?'active':''
            ].join(" ")
          }
          ref="Window">
                <SystemBar eventFN={this.eventFN.bind(this)} SystemBarConfig={{title:windowConfig.title}}></SystemBar>
                <AdjustBar eventFN={this.eventFN.bind(this)} direction="left"></AdjustBar>
                <AdjustBar eventFN={this.eventFN.bind(this)} direction="right"></AdjustBar>
                <AdjustBar eventFN={this.eventFN.bind(this)} direction="bottom"></AdjustBar>
                <Msg config={this.state.msgConfig}></Msg>
                {/* {this.getProp()} */}
                <WContent winFN={{ Msg:this.Msg.bind(this) }} {...this.props} />
          </div>
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