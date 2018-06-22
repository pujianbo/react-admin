'user strict';
import React, {Component} from 'react';
import {hashHistory, Link} from 'react-router'
import {
  Menu,
  Dropdown,
  Icon,
  Form,
  Modal,
  Alert,
  Input,
  message,
  Button
} from 'antd';
import imgLogo from '../../img/icon/logo.png'

const FormItem = Form.Item;
import './index.scss'

//网站头部条
export default class header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false
    }
    this.menu = (<Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={this.pwdEdit.bind(this)}>修改密码</a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={this.loginOut.bind(this)}>退出登录</a>
      </Menu.Item>
    </Menu>);
  }
  //提交修改
  handleOk() {
    const oldPWd = $('#pwdold').val();
    const newPwd = $('#pwdnew').val();
    if (oldPWd == '' || newPwd == '') {
      message.warning('请填写原密码和新密码')
      return
    }
    this.setState({loading: true});
    ajax({
      url: `${localStorage.usertype == 1
        ? '/admin/modifyPwd'
        : '/hospital/modifyPwd'}`,
      type: 'POST',
      data: {
        id: localStorage.usertype == 1
          ? localStorage.userId
          : localStorage.hospitalId,
        newPwd,
        oldPWd
      },
      success: res => {
        this.setState({loading: false});
        if (res.code == 0) {
          message.success(res.message)
          hashHistory.push('/login')
        } else {
          message.error(res.message)
        }
      }
    })

  }
  handleCancel() {
    this.setState({visible: false})
  }

  //密码修改
  pwdEdit() {
    this.setState({visible: true})
  }
  //退出登录
  loginOut() {
    hashHistory.push('/login')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
    const {visible, loading, msg} = this.state
    return (<header className="header">
      <div className='logobox'>
        <span>康医生后端管理系统</span>
      </div>
      <div className='userinfo'>
        <Dropdown overlay={this.menu}>
          <a className="ant-dropdown-link">
            {localStorage.username}
            <Icon type="down"/>
          </a>
        </Dropdown>
      </div>
      <Modal visible={visible} title="修改密码" onCancel={this.handleCancel.bind(this)} footer={[
          <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk.bind(this)}>
            确定
          </Button>
        ]}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem {...formItemLayout} label="原密码">
            <Input placeholder="输入原密码" type='password' id='pwdold'/>
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            <Input placeholder="输入新密码" type='password' id='pwdnew'/>
          </FormItem>
        </Form>
      </Modal>
    </header>)
  }
}
