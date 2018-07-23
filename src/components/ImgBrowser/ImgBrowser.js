import React, { Component } from 'react'
import Window from '../Window/Window'
import { connect } from 'react-redux'
import * as WindowAction  from '../../store/window/action';
import './ImgBrowser.less';
import Msg from '../../publicComponents/Msg/Msg'
import localforage from 'localforage';
 class ImgBrowser extends Component {
  constructor(props){
    super(props)
    this.state={
      pic:{},
      msgConfig:{
        show:false,
        text:'正在加载中'
      }
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.state.pic.currentPic!=nextProps.pic.pic.currentPic){
      this.setState({
        msgConfig:{
          show:true,
          text:'正在加载中'
        },
        pic:nextProps.pic.pic
      })
    }
  }
  componentWillUpdate(){
  }
  setBgImg(){
    //设置背景
    // localStorage.setItem("base64Bgimg","")
    localforage.setItem("base64Bgimg","")
    this.props.setBgImg(this.state.pic.currentPic)
  }
  imgLoadError(){
    //图片加载出错
    this.setState({
      msgConfig:{
        show:true,
        text:'图片加载出错'
      }
    })
  }
  isLoad(){
    this.setState({
      msgConfig:{
        show:false,
        text:'正在加载中'
      }
    })
  }
  render() {
    return (
      <div className="ImgBrowser">
            <Msg config={this.state.msgConfig}></Msg>
            <img onLoad={this.isLoad.bind(this)} onError={this.imgLoadError.bind(this)} src={this.state.pic.currentPic} alt=""/>
            <div className="ImgBrowser_FN">
              <div className="ImgBrowser_FN_item" onClick={this.setBgImg.bind(this)}>
                <img src={require("../../config/img/photo.svg")} alt=""/>
              </div>
            </div>
      </div>
    )
  }
}
function getState(state) {
  return {
      state: state,
      pic:state.pic.reducer
  }
}
ImgBrowser = connect(getState,WindowAction)(ImgBrowser)
ImgBrowser=Window({title:"图片"})(ImgBrowser);
export default ImgBrowser