import React, { Component,createElement } from 'react';
import './App.css';
import { connect } from 'react-redux'
import * as procedureActive from './store/procedure/action'
import * as windowActive from './store/window/action';
import procedureConfig from './config/procedure'
import localforage from 'localforage'
import chrome from './config/chromeOp'
import { compose } from 'redux';
class App extends Component {
  constructor(){
    super()
    this.state={
      procedureOP:this.initProcedureConfig(procedureConfig),
      bgImg:'',
      style:{
        background:''
      }
    }
  }
  async componentWillReceiveProps(nextProps){
    var reduxlocalStorage= JSON.parse(localStorage.getItem("redux"))
    var windowinfoReducer=reduxlocalStorage.windowinfo.reducer
    var imgBg=windowinfoReducer.bgImg
    var bgImg=nextProps.state.windowinfo.reducer.bgImg;
    var type='url';
    if(bgImg=="base64Bgimg"){
      type='base64'
      bgImg=await localforage.getItem(bgImg)
    }
    this.setState({
      bgImg:bgImg,
      style:{
        backgroundImage:"url("+bgImg+")"
      }
    })
    
    
  }
  componentDidMount(){
    var procedureOP=this.state.procedureOP
    if(JSON.stringify(this.props.state.procedure.reducer.procedureInfo)!='{}'){
      //如果有本地存储，则使用本地储存
      procedureOP=this.props.state.procedure.reducer.procedureInfo
    }
    this.props.setProcedureInfo(procedureOP)

    var procedure=this.initRender()
    this.setState({
      procedure:procedure
    })
    var rootFontSize=this.props.state.windowinfo.reducer.rootFontSize
    if(rootFontSize){
      document.getElementsByTagName('html')[0].style.fontSize=rootFontSize+'px';
    }
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

      // for(var item in localStorageWindowIds){
      //   localStorageWindowIds[item].resize=true
      //   this.props.setWindowState(localStorageWindowIds[item])
      // }
      
      // setTimeout(()=>{
      //   //模拟窗口变化
      //   for(var item in localStorageWindowIds){
      //     localStorageWindowIds[item].resize=false
      //     this.props.setWindowState(localStorageWindowIds[item])
      //   }
      // },300)

      // this.props.setWindowIds(localStorageWindowIds);
      // if(JSON.stringify(this.props.state.windowinfo.reducer.windowIds)!=JSON.stringify(localStorageWindowIds)){
        this.props.setWindows(localStorageWindowIds)
        if(imgBg!=this.state.bgImg){
          console.log('更换背景')
          this.props.setBgImg(imgBg);
        }
        this.props.setActiveWindowId(localStorageActiveWindId)
      // }
      
    });
  }
  initProcedureConfig(procedureConfig){
    //给配置文件加上一些字段
    for(var item in procedureConfig){
      procedureConfig[item].id=new Date().getTime()+ parseInt(Math.random()*100000000).toString();
    }
    return procedureConfig;
  }
  initRender(){
    //批量将组件注入DOM
    console.log("批量将组件注入DOM")
    let procedureInfo=this.props.state.procedure.reducer.procedureInfo
    var procedure=this.initFN();
    var procedureArr=[];
    procedure.forEach((item,index)=>{
      procedureArr.push(
        createElement(
          item.e,
            {
              key:index,id:procedureInfo&&procedureInfo[item.eName]&&procedureInfo[item.eName].id?procedureInfo[item.eName].id:item.id,
              name:item.eName,
              width:item.width,//宽度
              height:item.height,
              data:item.data,//自定义数据
              textName:item.textName,
            }
          )
        )
    })
    return procedureArr
  }

  initFN(){
    //初始化程序 根据配置文件加载组件
    console.log("初始化程序 根据配置文件加载组件")
    var procedures=[]
    var procedureOP=this.state.procedureOP;
    for(var item in procedureOP){
      procedures.push(
        {
          eName:item,
          textName:procedureOP[item].name,
          id:procedureOP[item].id,
          e:procedureOP[item].element.default,
          width:procedureOP[item].width,
          height:procedureOP[item].height,
          noPushDock:procedureOP[item].noPushDock?procedureOP[item].noPushDock:false,
          data:procedureOP[item].data?procedureOP[item].data:{}
        }
      )
    }
    return procedures;
  }
  render() {
    return (
      <div className="App" ref="App" style={this.state.style}>
          {this.state.procedure}
      </div>
    );
  }
}
function getState (state){
  return {
    state:state,
  }
} 
App=connect(getState,{...windowActive,...procedureActive})(App)
export default App;
