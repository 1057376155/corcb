import React, { Component } from 'react'
import echarts from 'echarts'
import './SystemPanel.less';
import chrome from '../../config/chromeOp'
export default class SystemPanel extends Component {
  constructor(){
    super();
    this.state={
        usageRate:"0.00%",
        memoryRate:{}
    }
  }
  componentDidMount(){
      this.init();
  }
  init(){
      // 基于准备好的dom，初始化echarts实例
      var ec = echarts.init(document.getElementById('SystemPanel_canvas'));
      // 指定图表的配置项和数据
      var data=[]
      
      for(var i=0;i<60;i++){
        data.push({
            name:Math.random(),
            value:[new Date().getTime()+1,5]
         }
       )
      }
      var option = {
        grid: {
            top:'95%',
            bottom:0,
            left:0,
            right:0,
        },
        // xAxis: {show:false,type: 'category',data:[]},
        // yAxis: {show:false,type: 'category',data:[]},
        xAxis: {
            type: 'time',
            show:false,
        },
        yAxis: {
            type: 'value',
            show:false,
        },
        color: {
            type: 'linear',
            colorStops: [{
                offset: 0, color: '#2384ff' // 0% 处的颜色
            }, {
                offset: 1, color: '#ff6223' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        },
        animation:true,
        series: [{
            data: data,
            type: 'line',
            smooth: true,
            symbolSize:0,
            // areaStyle: {
                // color:'#ffffff6b'
            // },
            animationDelay: function (idx) {
                return idx * 1000;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };
    // 使用刚指定的配置项和数据显示图表。
    var cpuOldValue={};//用于存储上一次的旧值
    var cpuAllValue={};//当前的值
    var usageRate=0;//使用率
    ec.setOption(option);
    setInterval(()=>{
        usageRate=0;
        chrome.system.cpu.getInfo((cpus)=>{
            cpus.processors.forEach((item,index)=>{
                if(!cpuOldValue[index])cpuOldValue[index]=item.usage.user+item.usage.kernel;
                cpuAllValue[index]=((item.usage.user+item.usage.kernel-cpuOldValue[index])/10000000)*100
                cpuOldValue[index]=item.usage.user+item.usage.kernel;//更新旧值
            })
            for(var i in cpuAllValue){
                usageRate+=cpuAllValue[i]
            }
            this.setState({
                usageRate:(usageRate/cpus.processors.length).toFixed(2)+"%"
            })
            option.series[0].data.shift();
            option.series[0].data.push({
                name:Math.random(),
                value:[new Date().getTime(),usageRate/cpus.processors.length]
            });
            ec.setOption({
                series: [{
                    data: option.series[0].data
                }]
            });
        }) 
        chrome.system.memory.getInfo((memorys)=>{
            this.setState({
                memoryRate:memorys
            })
        })
    },1000)

    window.onresize=function(){
        ec.resize();
    }
    
  }
  render() {
    return (
    <div id="SystemPanel">
        <div className="SystemPanel_info">
            <p>cpu {this.state.usageRate}</p> 
            <p>memory {((this.state.memoryRate.capacity-this.state.memoryRate.availableCapacity)/1024/1024).toFixed(2)+"M"}</p>
        </div>
        <div id="SystemPanel_canvas"></div>
    </div>
    )
  }
}
