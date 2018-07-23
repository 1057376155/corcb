import { createStore,combineReducers, applyMiddleware, compose } from 'redux' // 引入redux createStore、中间件及compose 
import persistState from 'redux-localstorage'
import { composeWithDevTools } from 'redux-devtools-extension'


import * as dock from './dock/reducer';
import * as windowinfo from './window/reducer';
import * as procedure from './procedure/reducer'
import * as pic from './pic/reducer'
import * as weather from './weather/reducer'


var rootReducer = combineReducers(
  {
    dock: combineReducers({...dock}),
    windowinfo: combineReducers({...windowinfo}),
    procedure:combineReducers({...procedure}),
    pic:combineReducers({...pic}),
    weather:combineReducers({...weather}),
  })


  const enhancer = compose(
    persistState("",""),
  )
  
const store = createStore(rootReducer,composeWithDevTools(),enhancer,)

export default store;