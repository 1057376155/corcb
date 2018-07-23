import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux' // 利用Provider可以使我们的 store 能为下面的组件所用
import './index.less';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store'
ReactDOM.render(
    <Provider store={store}>
             <App/>
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
