import * as actionType from './action-type';

let defaultState = {
    screen:{
        mousedowm:{ //鼠标点击时候的xy坐标
            x:0,
            y:0
        },
        mousemove:{ //鼠标移动时候的xy坐标
            x:0,
            y:0
        },
        mouseup:{//鼠标松开的时候的xy坐标
            x:0,
            y:0
        },
        screenW:window.outerWidth,
        screenH:window.outerHeight,
    },
    bgImg:require("../../img/wallhaven-244786.png"),
    windowIds:{},
    activeWindId:'',//获取焦点的window
    rootFontSize:8,//初始化根字体大小
}
export const reducer = (state = defaultState, action) => {
  
  switch (action.type) {   
      case actionType.setMouseDowmXY:
        //设置鼠标的按下的xy(作废) 
        var screenInfo={screen:{...state.screen,mousedowm:action.coordinate}}
        return {...state,...screenInfo}
      case actionType.setMouseMoveXY:
       //设置鼠标的当前的xy(作废)
        var screenInfo={screen:{...state.screen,mousemove:action.coordinate}}
        return {...state,...screenInfo}
      case actionType.setMouseUpXY:
        //设置鼠标的松开的xy (作废)
        var screenInfo={screen:{...state.screen,mouseup:action.coordinate}}
        return {...state,...screenInfo}
      case actionType.addWindowId:
        //添加窗口id
        var windowIsdItem={[action.id]:{id:action.id}}
        var windowIds={...state.windowIds,...windowIsdItem};
        return {...state,...{windowIds}}
      case actionType.setActiveWindowId:
        //设置获取焦点的窗口
       return {...state,...{activeWindId:action.id}}
      case actionType.setWindowState:
        //设置窗口的状态
        var windowIsdItem={[action.windowState.id]:action.windowState}
        if(state.windowIds[undefined]){
          var windowIds={...windowIsdItem};
        }else{
          var windowIds={...state.windowIds,...windowIsdItem};
        }
        return {...state,...{windowIds}}
      case actionType.setWindowIds :
        return {...state,...{windowIds:action.windowIds}}
      case actionType.setRootFontSize :
        return {...state,...{rootFontSize:action.RootFontSize}}
      case actionType.setWinState :

      for(var windowIdsItem in state.windowIds){
        if(state.windowIds[windowIdsItem].name==action.winState.windowName){
            for(var windowStateitem in action.winState.windowState){
              state.windowIds[windowIdsItem][windowStateitem]=action.winState.windowState[windowStateitem]
              if(state.windowIds[windowIdsItem].close){
                state.windowIds[windowIdsItem].mini=true;
                // console.log(state.windowIds[windowIdsItem].id,'state.windowIds[windowIdsItem].id;')
                state.windowIds[windowIdsItem].top=state.windowIds[windowIdsItem].top>state.screen.screenH?state.windowIds[windowIdsItem].top-parseInt(state.screen.screenH*2):state.windowIds[windowIdsItem].top;
              }else{
                state.windowIds[windowIdsItem].top=state.windowIds[windowIdsItem].top<state.screen.screenH?state.windowIds[windowIdsItem].top+parseInt(state.screen.screenH*2):state.windowIds[windowIdsItem].top;
              }
            }
        }
      }
      // console.log(state)
      // console.log(action.winState)
        return state
      case actionType.setBgImg:
        //设置背景
        return {...state,...{bgImg:action.img}}
      case actionType.setWindows:
        //设置背景
        return action.windows
      default:  
          return state;  
  }  
}
