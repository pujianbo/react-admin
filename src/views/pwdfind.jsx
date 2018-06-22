import React, {Component} from 'react'
import {hashHistory, Link} from 'react-router'

import {Input, Icon, Button, Form, message} from 'antd';

import imgLogo from '../img/icon/logo.png'
import {timeDown, validStr} from '../tools'
export default class pwdFind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      loading: false,
      validStr: '验证码',
      saveStus: localStorage.userpwd
        ? true
        : false
    };
  }

  emitEmpty(name, e) {
    const vName = {};
    vName[name] = '';
    this.setState(vName);
    document.getElementsByName(name)[0].focus()
  }
  onChange(e) {
    const vName = {};
    vName[e.target.name] = e.target.value.replace(/\s/g, '');
    this.setState(vName);
  }
  //登录
  submit(e) {
    e.preventDefault();
    const telphone = $('#phone').val();
    const telCode = $('#validCode').val();
    const password = $('#pwd').val();
    if (telphone == '' || telCode == '' || password == '') {
      message.warning('请填写完整信息')
      return
    }
    ajax({
      url: `${localStorage.usertype == 1
        ? '/admin/forgetPwd'
        : '/hospital/forgetPwd'}`,
      type: 'POST',
      data: {
        password,
        telCode,
        telphone
      },
      success: res => {
        if (res.code == 0) {
          hashHistory.push('/login')
        } else {
          message.warning(res.message)
        }
      }
    })
  }

  //发送验证码
  sendCode(e) {
    const phone = $('#phone').val()
    this.setState({sendStatus: true})
    if (!validStr('phone', phone)) {
      message.warning('请填写正确手机号')
      setTimeout(() => {
        this.setState({sendStatus: false})
      }, 1000)
      return
    }
    ajax({
      url: `/access/pub-telcode?telphone=${phone}`,
      success: res => {
        if (res.code == 0) {
          timeDown(59, (validStr) => {
            this.setState({validStr})
            if (validStr == '验证码') {
              this.setState({sendStatus: false})
            }
          })
        } else {
          message.warning(res.message)
          this.setState({sendStatus: false})
        }
      }
    })
  }

  render() {
    const {sendStatus, loading, validStr} = this.state;
    return (<div className='login clearfix'>
      <Form onSubmit={this.submit.bind(this)} className="loginbox">
        <div className='item logobox'>
          <span>找回密码</span>
        </div>
        <div className='item'>
          <Input placeholder="输入手机号" id='phone' maxLength='11'/>
        </div>
        <div className='item'>
          <Input placeholder="输入验证码" id='validCode' style={{
              width: '180px',
              marginRight: '10px'
            }}/>
          <Button disabled={sendStatus} onClick={this.sendCode.bind(this)} style={{
              width: '70px'
            }}>{validStr}</Button>
        </div>
        <div className='item'>
          <Input placeholder="输入新密码" type='password' id='pwd'/>
        </div>
        <div className='item clearfix'>
          <Link className='left' to='/login'>返回登录</Link>
        </div>
        <div className='item'>
          <Button type="primary" htmlType="submit" style={{
              width: '100%'
            }} disabled={loading}>确 定</Button>
        </div>
      </Form>
    </div>)
  }
}
