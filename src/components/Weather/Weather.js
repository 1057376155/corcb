import React, { Component } from 'react'
import http from '../../api/http'
import { connect } from 'react-redux'
import './Weather.less'
import localforage from 'localforage'
// import gb from '../../config/gb2312code'
import cityCode from '../../config/cityCode'
import chrome from '../../config/chromeOp';

class Weather extends Component {
    constructor(props){
        super(props);
        this.state={
            weatherList:[],
            city:''
        }
    }
  componentWillReceiveProps(nextProp){
      if(!nextProp.Weather.city)nextProp.Weather.city="广州"
      this.init(nextProp.Weather.city);
    
  }
  componentDidMount(){
    var city=this.props.Weather.city;
    if(!city)city='广州'
    this.init(city);
  }
  async init(city){
      var time=await localforage.getItem("time")
      var nowTime=new Date().getTime();
      
      if(nowTime-time<60*60*1000&&nowTime-time>300){
        this.setState({
          weatherList:await localforage.getItem("weatherList")
        })
        return;
      }
      localforage.setItem('time',new Date().getTime())
      var url="http://www.weather.com.cn/weather/"+cityCode[city]+".shtml";
      if(chrome.noChrome){
        url="weather/"+cityCode[city]+".shtml"
      }
      http.getFN({
          url:url
      }).then((r)=>{
        var cityWeather=r.data.match(/hour3data=(.*)/i)[1];
        var weatherList=[]
        JSON.parse(cityWeather)['1d'].forEach((item,index)=> {
            weatherList.push({
              time:item.split(",")[0],
              weather:item.split(",")[2],
              temperature:item.split(",")[3],
            })
        });
        localforage.setItem('weatherList',weatherList)
        this.setState({
          city:city,
          weatherList:weatherList
        })
      })

      
  }
  render() {
    if(!this.state.weatherList)return null;
    return (
      <div className="Weather">
        {
          this.state.weatherList.map((item,index)=>{
            return(
              <div className="Weather_item" key={index}>
                <p>{item.time}</p>
                <p>{item.temperature}</p>
                <p>{item.weather}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}
function getState (state){
  return {
    state: state,
    Weather:state.weather.reducer
  }
} 
Weather =connect(getState)(Weather)
export default Weather;