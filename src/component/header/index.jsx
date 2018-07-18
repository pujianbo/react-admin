'user strict';
import React, {Component} from 'react';
import {Link} from 'react-router'
import {Menu, Dropdown, Icon} from 'antd';
import imgLogo from '../../img/icon/logo.png'

import './index.scss'

//网站头部条
export default class header extends Component {

  render() {
    const menu = (<Menu>
      <Menu.Item>
        <Link to='/person/'>修改资料</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/login'>退出登录</Link>
      </Menu.Item>
    </Menu>);
    return (<header className="header">
      <div className='logobox'>
        <span>康医生后端管理系统</span>
      </div>
      <div className='userinfo'>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link">
            {localStorage.username}
            <Icon type="down"/>
          </a>
        </Dropdown>
      </div>
    </header>)
  }
}
