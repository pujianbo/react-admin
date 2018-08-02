import React, {Component, PropTypes} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Provider} from 'react-redux';
import route from './router';
import store from './Redux/store';

//引用样式
import './scss/common/reset.scss'
import './scss/common/media.scss'
import './scss/common/public.scss'
import './scss/main.scss'

//引入插件全部样式
import 'antd/dist/antd.less';

//引入vconsole调试
// import './plugins/js/vconsole.js'

store.subscribe(() => { //监听state变化
  //console.log(store.getState())
});

render(<Provider store={store}>
  {route}
</Provider>, document.getElementById('main'));
