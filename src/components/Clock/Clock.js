import React, { Component } from 'react'
import './Clock.less';
export default class Clock extends Component {
  constructor(){
      super();
      this.state={
        hour:'00',
        min:'00',
        second:'00',
      }
  }
  componentDidMount(){
        this.init();
  }
  init(){
      setInterval(()=>{
        this.setState({
            hour:new Date().getHours(),
            min:new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes(),
            second:new Date().getSeconds()<10?"0"+new Date().getSeconds():new Date().getSeconds(),
        })
      },1000)
  }
  render() {
    return (
      <div className="Clock">
            <span>{this.state.hour}:</span>
            <span>{this.state.min}:</span>
            <span>{this.state.second}</span>
      </div>
    )
  }
}
