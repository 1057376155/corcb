// import * as actionType from './action-type';
import * as actionType from './action-type'

export const setWeatherCity=(city)=>{
  //设置程序的状态
  return {
    type:actionType.setWeatherCity,
    city:city
  }
}

