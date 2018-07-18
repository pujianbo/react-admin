import React, {Component} from 'react'
import {hashHistory, Link} from 'react-router'

import {
  Input,
  Icon,
  Button,
  Form,
  message,
  Select,
  Tabs,
  TabPane,
  Checkbox
} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

// import {ajax} from '../tools'

import imgLogo from '../img/icon/logo.png'

export default class login extends Component {
  constructor(props) {
    super(props);
    this.status = '1'
    this.state = {
      userName: '',
      password: '',
      loading: false,
      saveStus: localStorage.userpwd
        ? true
        : false
    };
  }
  componentWillMount() {
    localStorage.clear()
    localStorage.usertype = 1
    const {msg} = this.props.params
    if (msg)
      message.error(decodeURI(msg))
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
    this.setState({loading: true});
    const {userName, password} = this.state;
    if (userName == '' || password == '') {
      message.warning(
        `请输入${userName
        ? '密码'
        : '用户名'}`);
      setTimeout(() => {
        this.setState({loading: false});
      }, 1000)
      return
    }
    ajax({
      url: `${this.status == 1
        ? '/admin/login'
        : '/hospital/login'}`,
      type: 'POST',
      data: {
        phone: userName,
        password
      },
      success: (res) => {
        if (res.code == 0) {
          if (this.state.saveStus) {
            localStorage.userpwd = password
          } else {
            delete localStorage.userpwd
          }
          localStorage.username = res.result.nickname || userName;
          localStorage.userId = res.result.id;
          localStorage.token = res.result.token;
          localStorage.userinfo = JSON.stringify(res.result);
          let url = '/account/'
          let path = 'account'
          if (this.status == 2) {
            const {id} = res.result.hospital
            localStorage.hospitalId = id
            url = `account/hospdetail/${localStorage.userId}`
            path = 'team'
          }

          if (this.props.location.query.back) {
            hashHistory.go(-1)
            return
          }
          hashHistory.push(url)
          localStorage.syskeyPath = path
        } else {
          message.warning(res.message);
          this.setState({loading: false});
        }
      },
      error: res => {
        setTimeout(() => {
          this.setState({loading: false});
        }, 3000)
      }
    })
  }

  //记住密码
  savePwd(e) {
    this.setState({saveStus: e.target.checked})
  }

  sltStatus(value) {
    this.status = value
    localStorage.usertype = value
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 18
        }
      }
    };
    const {userName, password, loading, saveStus} = this.state;
    const suffixName = userName
      ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this, 'userName')}/>
      : null;
    const suffixPwd = password
      ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this, 'password')}/>
      : null;
    return (<div className='login clearfix'>
      <Form onSubmit={this.submit.bind(this)} className="loginbox">
        <div className='item logobox'>
          <img src={imgLogo}/>
          <span>康医生后端管理系统</span>
        </div>
        {/*<Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="系统管理员登录" key="1">1</Tabs.TabPane>
          <Tabs.TabPane tab="医院管理登录" key="2">2</Tabs.TabPane>
        </Tabs>*/
        }
        <FormItem {...formItemLayout} label="登录方式">
          <Select onChange={this.sltStatus.bind(this)} defaultValue={this.status} style={{
              width: 140
            }}>
            <Option value='1'>系统管理员</Option>
            <Option value='2'>医院管理员</Option>
          </Select>
        </FormItem>
        <div className='item'>
          <Input placeholder="输入账户名" prefix={<Icon type = "user" />} suffix={suffixName} name='userName' value={userName} onChange={this.onChange.bind(this)} ref={node => this.userNameInput = node}/></div>
        <div className='item'>
          <Input placeholder="输入密码" type='password' prefix={<Icon type = "lock" />} suffix={suffixPwd} name='password' value={password} onChange={this.onChange.bind(this)} ref={node => this.userNameInput = node}/>
        </div>
        <div className='item clearfix'>
          <Checkbox className='left' checked={saveStus} onChange={this.savePwd.bind(this)}>记住密码</Checkbox>
          <Link className='right' to='/pwdfind'>找回密码</Link>
        </div>
        <div className='item'>
          <Button type="primary" htmlType="submit" style={{
              width: '100%'
            }} disabled={loading}>登 录</Button>
        </div>
      </Form>
    </div>)
  }
}
