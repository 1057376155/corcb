import React, { Component } from 'react'
import Window from '../Window/Window'
import Slide from '../Slide/Slide'
import { connect } from 'react-redux'
import * as windowActive from '../../store/window/action';
import * as weatherActive from '../../store/weather/action';
import city from '../../config/city'
import localforage from 'localforage'
import api from '../../api/http';
import chrome from '../../config/chromeOp';
import './Set.less';
class Set extends Component {
  constructor(props){
    super(props);
    this.state={
      fontSize:8,
      defaultValue:props.windowids.rootFontSize?props.windowids.rootFontSize:8,
      cityNames:[],
      selectCity:'',//天气城市
      newVersion:'',
    }
  }
  componentWillReceiveProps(nextProp){
    if(nextProp.windowids.rootFontSize==this.state.fontSize)return;
    if(nextProp.windowids.selectCity==this.state.selectCity)return;
   
    this.setState({
      fontSize:nextProp.windowids.rootFontSize,
      defaultValue:nextProp.windowids.rootFontSize,
      selectCity:nextProp.Weather.city
    })
  }
  componentDidMount(){
    this.setState({
      selectCity:this.props.Weather.city
    })
    this.getVersion();
  }
  getNum(e){
    this.setState({
      fontSize:e.num
    })
    document.getElementsByTagName('html')[0].style.fontSize=e.num+'px';
  }
  SlideDragEnd(e){
    this.props.setRootFontSize(e.num)
  }
  getBgPic(e){
    //获取用户自定义壁纸
    // console.dir();
    this.getBase64(e).then((r)=>{
      localforage.setItem("base64Bgimg",r)
      // localStorage.setItem("base64Bgimg",r)
      this.props.setBgImg("base64Bgimg")
    })
    
  }
  getBase64=async (e)=>{
    //e 指的是file文件
    //该方法指的是将file文件转为base64
    return new Promise((resolve, reject)=>{
        var reader = new FileReader();
        var img=new Image();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload=(e)=>{
            resolve(e.target.result);
        }
    })
 }
 getSearchCity(e){
   //搜索城市
   var arr=[]
    city.forEach((item,index)=>{
      if(e.target.value!=''&&item.indexOf(e.target.value)>=0){
        arr.push(item)
      }
   })
   if(e.target.value=="")arr=[];
   this.setState({
    cityNames:arr
   })
 }
 async setCity(item){
   //设置城市
   localforage.setItem('time',new Date().getTime()).then((r)=>{
    this.setState({
      selectCity:item
     })
     this.props.setWeatherCity(item)
   })
   
 }
 getVersion(){
  //获取最新版本
  var url="https://github.com/1057376155/corcb/blob/master/package.json";
  if(chrome.noChrome){
    url="/github/1057376155/corcb/blob/master/package.json"
  }
  api.getFN({
      url:url
  }).then((r)=>{
      this.setState({
        newVersion:r.data.match(/version.*>(\d\.\d.\d)</i)[1]
      })
      
  })
  }
  getNewVersion(){
    //去下载最新版本
    window.open("https://github.com/1057376155/corcb/blob/master/build.rar")
  }
  clearSystemConfig(e){
    //重置配置文件
    // console.log('---')
    e.stopPropagation();
    localStorage.setItem("redux","{}")
    window.location.href=window.location.href
    
  }
  render() {
    return (
      <div className="Set">
          <div className="cell">
            <p>窗口设置</p>
            <Slide max="15" min="8" defaultValue={this.state.defaultValue} SlideDragEnd={this.SlideDragEnd.bind(this)} SlideDrag={this.getNum.bind(this)}></Slide>
          </div>
          <div className="cell">
            <p>壁纸设置</p>
            <div className="getBgPic">
              <input type="file" onChange={this.getBgPic.bind(this)} />
              <p>选择壁纸</p>
            </div>
          </div>
          <div className="cell">
            <p>天气设置 {this.state.selectCity}</p>
            <div className="searchCity">
              <input className="searchCity_input" onInput={this.getSearchCity.bind(this)} type="text" placeholder="搜索你的城市" />
              {
                this.state.cityNames.map((item,index)=>{
                  return (
                    <span onClick={this.setCity.bind(this,item)} key={index}>{item}</span>
                  )
                })
              }
            </div>
          </div>
          <div className="cell">
            <p>系统管理</p>
            <div className="clearSystemConfig">
              <button onClick={this.clearSystemConfig.bind(this)}>重置系统配置文件</button>
              <p>仅仅会清空系统配置文件,不会清空程序的缓存</p>
            </div>
          </div>
          <div className="cell">
            <p>版本</p>
            <p>v1.2.0 <strong onClick={this.getNewVersion}>{this.state.newVersion?"最新版本"+this.state.newVersion:""}</strong></p>
            
          </div>
          <div className="cell">
            <p>关于作者</p>
            <div className="author">
              <p className="author_name">cor</p>
              <p className="author_describe">
                作者简介: 拥有丰富经验的UI设计师、摄影师、全栈工程师、(以上都是假的)、意图成为不掉头发的开发工程师(这是真的、目前没有秃)
                喜欢尝试新的技术(不专一的程序员)、喜欢造轮子(只给自己用，因为写的不好)
              </p>
              <p className="donate">
                因为作者月入百万(假的),又穷又无助,要是你有钱可以捐的钱给我(真的)
                <img src={require("../../img/money.png")} alt=""/>
              </p>
            </div>
          </div>
      </div>
    )
  }
}
function getState (state){
  return {
    state: state,
    windowids:state.windowids,
    Weather:state.weather.reducer
  }
} 

Set=Window({title:'设置'})(Set);
Set =connect(getState,{...windowActive,...weatherActive})(Set)
export default Set