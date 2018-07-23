import React, { Component } from 'react'
import './Search.less'
export default class Search extends Component {
  constructor(props){
      super(props)
      this.state={
          userInput:''
      }
  }
  render() {
    return (
      <div className="Search">
            <input placeholder="回车搜索" onChange={this.userInput.bind(this)} onKeyDown={this.keydown.bind(this)} type="text"/>
      </div>
    )
  }
  userInput(e){
      this.setState({
        userInput:e.target.value
      })
  }
  keydown(e){
    // 键盘事件监听
    if(e.key=='Enter'){
        window.location.href = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd="+this.state.userInput
    }
  }
}
