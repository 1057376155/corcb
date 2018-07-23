// import * as actionType from './action-type';
import * as actionType from './action-type'
// test
export const setImageBrowser=(ImageBrowser)=>{
  //设置程序的信息
  return {
    type:actionType.setImageBrowser,
    ImageBrowser:ImageBrowser,
  }
}

