// 历史标签记录
import React, { Component } from 'react'
import Window from '../Window/Window'
import './HistoryList.less'
import chrome from '../../config/chromeOp'
 class HistoryList extends Component {
  constructor(){
      super()
      this.state={
          list:[
              {title:'wqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklklwqosdflsdaakfjdasklfjklsdfjsdljklkl',id:1},
              {title:'chen2'},
              {title:'chen3'}
            ]
      }
  }

  render() {
    return (
      <div className="HistoryList">
        <ul>
            {this.state.list.map((item,index)=>{
                return (
                    <li className={[item.active?'active':'']} onClick={this.goLink.bind(this,item)} key={index}>
                         <p> <img className="favIconUrl" src={item.favIconUrl} alt=""/> {item.title}</p> 
                        <span className="closeTab">
                            <img onClick={this.closeTab.bind(this,item)} src={require('./img/no.svg')} alt=""/>
                        </span>
                    </li>         
                )
            })}
        </ul>
      </div>
    )
  }
  componentWillMount(){
    //即将挂载 组件
    this.init()
    // console.log(chrome,'-')
    chrome.tabs.onCreated.addListener(()=>{this.init()});
    chrome.tabs.onUpdated.addListener(()=>{this.init()});
    chrome.tabs.onRemoved.addListener(()=>{this.init()});
    chrome.tabs.onSelectionChanged.addListener(()=>{this.init()});
  }
  init(){
    chrome.tabs.getAllInWindow(null,(arr)=>{
        this.setState({
            list:arr
        })
    })
    
        //监听 标签页关闭的时候 
  }
  goLink(item,e){
    //去到这一页
    chrome.tabs.update(item.id, {selected:true,pinned:false}, function (r){
        console.log(r)
    })
  }
  closeTab(item,e){
    //关闭页面
    e.stopPropagation();
    chrome.tabs.remove(item.id, function (r){
        console.log(r)
    })
  }
}

HistoryList=Window({title:'标签'})(HistoryList);
export default HistoryList