import React, { Component } from 'react'
import './Msg.less'
export default class Msg extends Component {
  constructor(props){
    super(props)
    this.state={
      show:false,
      text:''
    }
  }
  componentWillReceiveProps(nextProp){
    this.setState({
      show:nextProp.config.show,
      text:nextProp.config.text
    })
    if(nextProp.config.timeout){
      setTimeout(()=>{
        this.setState({
          show:false
        })
      },nextProp.config.timeout)
    }
  }
  render() {
    return (
      <div className={['Msg',this.state.show?'active':'none'].join(" ")}>
          <div className="Msg_content">
              {this.state.text}
          </div>
      </div>
    )
  }
}
