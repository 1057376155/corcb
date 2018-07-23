import React, { Component} from 'react'
import './Waterfall.less';
export default class Waterfall extends Component {
  constructor(){
    super();
    this.state={
        WaterfallChilds:0,
        gap:5,
        columns:4,
    }
    this.refsArray=[]
  }
  componentDidMount(){
      this.setState({
        columns:this.props.columns?this.props.columns:this.state.columns,
      })
  }
  componentWillReceiveProps(){
    //   this.init();
  }
  componentDidUpdate(){
  }
  init(){
     var WaterfallWidth=this.refs.Waterfall.scrollWidth;//获取窗口的大小
     var items=document.querySelectorAll(".pics_item_pic_item");
     var gap=this.state.gap
     var columns=this.state.columns;//获取列数
     WaterfallWidth=WaterfallWidth-(gap*(columns-1))
     var itemWidth=WaterfallWidth/columns;
    var arr=[];
    for (var i = 0; i < items.length; i++) {
        if (i < columns) {
            items[i].style.width = itemWidth + 'px';
            items[i].style.top = 0;
            items[i].style.left = (itemWidth + gap) * i + 'px';
            arr.push(items[i].offsetHeight);
        } else {
            var minHeight = arr[0]; //默认第一个是最小高度
            var index = 0;
            for (var j = 0; j < arr.length; j++) {
                if (minHeight > arr[j]) {
                    minHeight = arr[j];
                    index = j;
                }
            }
            items[i].style.top = arr[index] + gap + 'px';
            items[i].style.width = itemWidth + 'px';
            items[i].style.left = items[index].offsetLeft + 'px';
            arr[index] = arr[index] + items[i].offsetHeight + gap;
        }
    }
    
  }
  render() {
    return (
      <div onReset={this.init.bind(this)} className="Waterfall" ref="Waterfall">
        {this.props.children}
      </div>
    )
  }
}
