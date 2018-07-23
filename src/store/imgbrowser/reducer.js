import * as actionType from './action-type';

let defaultState = {
    imageBrowser:{}
}
export const reducer = (state = defaultState, action) => {
    
  switch (action.type) {  
      case actionType.setImageBrowser:
          return {...state,...{imageBrowser:action.imageBrowser}};
      default:  
          return state;  
  }  
}
