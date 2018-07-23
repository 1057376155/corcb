import * as actionType from './action-type';

let defaultState = {
    city:'',
}
export const reducer = (state = defaultState, action) => {
  switch (action.type) {  
      case actionType.setWeatherCity:
          return {...state,...{city:action.city}}
      default:  
          return state;  
  }
}
