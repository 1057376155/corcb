// import * as actionType from './action-type';
import * as actionType from './action-type'
// test
export const setMouseDowmXY=(coordinate)=>{
  //设置鼠标按下的坐标
  return {
    type:actionType.setMouseDowmXY,
    coordinate:coordinate
  }
}
export const setMouseMoveXY=(coordinate)=>{
  //设置鼠标移动的坐标
  return {
    type:actionType.setMouseMoveXY,
    coordinate:coordinate
  }
}

export const setMouseUpXY=(coordinate)=>{
  //设置鼠标松手的坐标
  return {
    type:actionType.setMouseUpXY,
    coordinate:coordinate
  }
}

export const addWindowId=(id)=>{
  //添加windowid
  return {
    type:actionType.addWindowId,
    id:id
  }
}
export const setActiveWindowId=(id)=>{
  //设置焦点窗口
  return {
    type:actionType.setActiveWindowId,
    id:id
  }
}
export const setWindowState=(o)=>{
  //设置窗口的状态
  return {
    type:actionType.setWindowState,
    windowState:o
  }
}
export const setWindowIds=(windowIds)=>{
  //设置整个windowids
  return {
    type:actionType.setWindowIds,
    windowIds:windowIds
  }
}
export const setRootFontSize=(RootFontSize)=>{
  //设置根部字体大小
  return {
    type:actionType.setRootFontSize,
    RootFontSize:RootFontSize
  }
}
export const setWinState=(winState)=>{
  //设置根部字体大小
  return {
    type:actionType.setWinState,
    winState:winState
  }
}

export const setBgImg=(img)=>{
  //设置背景
  return {
    type:actionType.setBgImg,
    img:img
  }
}
export const setWindows=(windows)=>{
  //设置整个windows
  return {
    type:actionType.setWindows,
    windows:windows
  }
}
export const getState2=(state)=>{
  //获取信息
  console.log(state,'state')
  return {
    type:'getState'
  }

}


