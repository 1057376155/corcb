import React, { Component } from 'react'
import Window from '../Window/Window';
import { connect } from 'react-redux';
import './MemoUrl.less';
import localforage from 'localforage';
class MemoUrl extends Component {
  constructor(){
    super();
    this.state={
        panelShow:false,
        tip:'',
        urlList:[],
        urlName:'',
        url:''
    }
    this.data={
        urlName:'',
        url:''
    }
  }
  componentWillReceiveProps(){
    this.init();
  }
  componentDidMount(){
    this.init();
  }
  async init(){
    var urlList=await localforage.getItem('urlList')
    this.setState({
      urlList:urlList
    })
  }
  async addUrl(){
    for(var i in this.data){
      if(this.state[this.data[i]]==''){
        this.setState({
          tip:"请填写网址"
        })
        return;
      }
    }
    var urlList=await localforage.getItem('urlList')
    if(!urlList)urlList=[]
    urlList.push({
      id:new Date().getTime(),
      urlName:this.state.urlName,
      url:this.state.url,
      clickNum:0
    })
    localforage.setItem('urlList',urlList).then((r)=>{
      this.closePanel();
      this.init();
    })
  }
  getText(type,e){
    var op={}
    op[type]=e.target.value
    this.setState(op)
  }
  closePanel(){
    this.setState({
      tip:'',
      urlName:'',
      url:'',
      panelShow:false,
    })
  }
  async goLink(item){
    //
    window.open(item.url)
    var urlList=await localforage.getItem('urlList')
    urlList.forEach((item2,index)=> {
        if(item.id==item2.id){
          item2.clickNum+=1;
        }
    });
    localforage.setItem('urlList',urlList).then(()=>{
      this.init();
    })
    
  }
  async delUrl(item,e){
    e.stopPropagation();
    var urlList=await localforage.getItem('urlList')
    urlList.forEach((item2,index)=>{
      if(item.id==item2.id){
        urlList.splice(index,1)
      }
    })
    localforage.setItem('urlList',urlList).then(()=>{
      this.init();
    })
  }

  urlListInit(){
    if(!this.state.urlList||this.state.urlList.length==0){
      return null
    }
    var arr=[];
    this.state.urlList.forEach((item,index)=>{
      arr.push(
        <div className="url" onClick={this.goLink.bind(this,item)} key={index}> 
          <div className="urlNameAndClickNum"> 
            <p className="urlName">{item.urlName}</p>
            <p className="urlClickNum">点击{item.clickNum}次</p>
          </div>  
          <p className="urlText">{item.url}</p>
          <div className="urlFn">
            <span className="delBtn" onClick={this.delUrl.bind(this,item)}>删除</span>
          </div>
          
        </div>
      )
    })
    return ([arr])
  }
  render() {

    return (
      <div className="MemoUrl">
          <div className="MemoUrl_list">
          {this.urlListInit()}
          </div>
          <div className={["MemoUrl_Management",this.state.panelShow?'active':''].join(" ")}>
              <input type="text" value={this.state.urlName} onChange={this.getText.bind(this,'urlName')} placeholder="请输入常用网址的名称" />
              <input type="text" value={this.state.url} onChange={this.getText.bind(this,'url')} placeholder="请输入常用网址，如http://www.abcd.com" />
              <div className="MemoUrl_Management_btn">
                <span className="addUrl"  onClick={this.addUrl.bind(this)}>增加</span>
                <span className="close" onClick={this.closePanel.bind(this)}>关闭</span>
              </div>
              <p className="tip">{this.state.tip}</p>
          </div>
          <span className="openPane" onClick={()=>{this.setState({panelShow:true})}}>添加网址</span>
      </div>
    )
  }
}
function getState(state) {
  return {
      state: state
  }
}
MemoUrl = connect(getState)(MemoUrl)
MemoUrl=Window({title:"常用网址"})(MemoUrl);
export default MemoUrl
