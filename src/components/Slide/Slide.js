import React, { Component } from 'react'
import './Slide.less'
export default class Slide extends Component {
    constructor(props){
        super(props);
        this.state={
            left:0,
            xs:[],
            style:{
                transform:'translate3d(0px,0px,0px)',
            },
            dragImg:new Image(),
            isDraggable:true,
            max:props.max?props.max:100,
            min:props.min?props.min:0,
            defaultValue:props.defaultValue?props.defaultValue:0,
            Slide:'',
            SlideDragNum:''
        }
    }
    componentWillReceiveProps(nextProp){
    }
    componentDidMount(){
        var Slide=this.refs.Slide
        this.setState({
            Slide:Slide,
            defaultValue:this.props.defaultValue
        })
        this.defaultValueFN(this.props.defaultValue)
    }
    defaultValueFN(defaultValue){
        if(!defaultValue||defaultValue=='')return;
        var step=(this.refs.Slide.offsetWidth-10)/(this.state.max-this.state.min)
        var left=parseInt(defaultValue-this.state.min)*step
        this.setState({
            left:left,
            style:{
                transform:'translate3d('+left+'px,0px,0px)',
            }
        })
    }
    SlideDrag(e){
        var Slide=this.state.Slide
        var step=(Slide.offsetWidth-10)/(this.state.max-this.state.min)
        var DOMXY=Slide.getBoundingClientRect()
        if(e.pageX==0&&e.pageY==0)return;
        if(e.pageX<DOMXY.left){
            this.setState({
                left:0,
                SlideDragNum:this.state.min,
                style:{
                    transform:'translate3d('+0+'px,0px,0px)',
                }
            })
            return
        }
        if(e.pageX>DOMXY.right){
            this.setState({
                left:Slide.offsetWidth-10,
                SlideDragNum:this.state.max,
                style:{
                    transform:'translate3d('+Slide.offsetWidth-10+'px,0px,0px)',
                }
            })
            return
        }
        var xs=this.state.xs;
        xs.push(e.pageX)
        if(xs.length>3)xs.splice(0,1);
        var left=(this.state.left+(xs[1]-xs[0]))
        if(xs.length<2||left<0||left>Slide.offsetWidth-10){
            return;
        }
        // debugger
        var SlideDragNum=Math.round((left+step*this.state.min)/step)
        if(this.props.SlideDrag){
            this.props.SlideDrag({num:SlideDragNum})
        }
        this.setState({
            left:left,
            SlideDragNum:SlideDragNum,
            style:{
                transform:'translate3d('+left+'px,0px,0px)',
            }
        })
    }
    SlideDragStart(e){
        e.dataTransfer.setDragImage(this.state.dragImg,0,0);
    }
    SlideDragEnd(e){
        if(this.props.SlideDragEnd){
            this.props.SlideDragEnd({num:this.state.SlideDragNum})
        }
    }
  render() {
    return (
      <div className="Slide" draggable="false"  ref="Slide" >
            <div className="SlideBar"></div>
            <span 
            style={this.state.style}
            onDrag={this.SlideDrag.bind(this)} 
            onDragEnd={this.SlideDragEnd.bind(this)}
            onDragStart={this.SlideDragStart.bind(this)}
            className='SlideCircle' draggable="true"></span>
      </div>
    )
  }
}
