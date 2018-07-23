// import * as actionType from './action-type';
import * as actionType from './action-type'
// test
export const test = (state,text) => {
  state.text=text
}
export const setProcedureInfo=(procedureInfo)=>{
  //设置程序的信息
  return {
    type:actionType.setProcedureInfo,
    procedureInfo:procedureInfo,
  }
}

