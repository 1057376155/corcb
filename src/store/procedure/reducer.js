import * as actionType from './action-type';

let defaultState = {
    procedureInfo:{}
}
export const reducer = (state = defaultState, action) => {
    
  switch (action.type) {  
      case actionType.setProcedureInfo:
          return {...state,...{procedureInfo:action.procedureInfo}};
      default:  
          return state;  
  }  
}
