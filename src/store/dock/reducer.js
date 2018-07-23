import * as actionType from './action-type';

let defaultState = {
    procedures:[],
}
export const reducer = (state = defaultState, action) => {
  switch (action.type) {  
      case actionType.setProcedures:
          return {...state,...{procedures:action.procedures}}
      default:  
          return state;  
  }  
}
