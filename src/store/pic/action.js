// import * as actionType from './action-type';
import * as actionType from './action-type'
// test
export const test = (state,text) => {
  state.text=text
}

export const getState = (state,test) => {
  //返回值
  // return {type:'getState'}
  return {type:"getState"}
}
export const setPic=(pic)=>{
  //设置程序的状态
  return {
    type:actionType.setPic,
    pic:pic
  }
}

