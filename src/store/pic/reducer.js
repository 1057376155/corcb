import * as actionType from './action-type';

let defaultState = {
    pic:{},
}
export const reducer = (state = defaultState, action) => {
  switch (action.type) {  
      case actionType.setPic:
          return {...state,...{pic:action.pic}}
      default:  
          return state;  
  }  
}
