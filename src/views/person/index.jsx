import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  Tag,
  message,
  Modal
} from 'antd';
import {timeDown, validStr} from '../../tools'
const createForm = Form.create;
const FormItem = Form.Item;

let Demo = React.createClass({
  getInitialState() {
    return {};
  },
  handleSubmit(e) {
    e.preventDefault();
    if (this.props.children) {
      // console.log(this.props.children[0].props.updateName);
      const nickname = document.getElementById('newName').value
      if (nickname == '') {
        message.warn('请填写昵称')
      } else {
        ajax({
          url: `/${localStorage.usertype == 1
            ? 'admin'
            : 'hospital'}/modifyNickname?nickname=${nickname}`,
          type: 'POST',
          success: res => {
            if (res.code == 0) {
              localStorage.username = nickname
              let userinfo = JSON.parse(localStorage.userinfo)
              userinfo.nickname = nickname
              localStorage.userinfo = JSON.stringify(userinfo)
              location.reload()
            } else {
              message.error(res.message)
            }
          }
        })
      }
      return
    }

    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return

      let data = this.props.form.getFieldsValue();

      let url = `${localStorage.usertype == 1
        ? '/admin/modifyPwd'
        : '/hospital/modifyPwd'}`
      if (this.props.title.indexOf('支付') > -1) {
        url = '/wallet/putpwd'
      }
      data.id = localStorage.userId
      ajax({
        url,
        type: 'POST',
        data,
        success: res => {
          if (res.code == 0) {
            message.success(res.message)
            if (this.props.title.indexOf('登录') > -1) {
              hashHistory.push('/login')
            }
          } else {
            message.error(res.message)
          }
        }
      })
    })
  },
  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPwd')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  },

  render() {
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 16
      }
    };
    const formTailLayout = {
      wrapperCol: {
        span: 16,
        offset: 5
      }
    };
    const {title} = this.props
    const {getFieldDecorator} = this.props.form
    return (<Form onSubmit={this.handleSubmit}>
      <FormItem>
        <div className='tbbar'>{title}</div>
      </FormItem>
      {
        this.props.children
          ? this.props.children
          : <div style={{
                width: '400px'
              }}>
              <FormItem {...formItemLayout} label="原密码">
                {
                  getFieldDecorator('oldPWd', {
                    rules: [
                      {
                        required: true,
                        message: '请输入原密码'
                      }
                    ]
                  })(<Input type="password" placeholder='请输入原密码'/>)
                }
              </FormItem>
              <FormItem {...formItemLayout} label="新密码">
                {
                  getFieldDecorator('newPwd', {
                    rules: [
                      {
                        required: true,
                        message: '请输入新密码'
                      }
                    ]
                  })(<Input type="password" placeholder='请输入新密码'/>)
                }
              </FormItem>
              <FormItem {...formItemLayout} label="确认密码">
                {
                  getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: '请输入确认密码'
                      }, {
                        validator: this.compareToFirstPassword
                      }
                    ]
                  })(<Input type="password" placeholder='请输入确认密码'/>)
                }
              </FormItem>
              <FormItem {...formTailLayout}>
                <Button type="primary" htmlType='submit' onClick={this.check}>
                  确认修改
                </Button>
              </FormItem>
            </div>
      }
    </Form>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  constructor() {
    super()
    this.oldphone = localStorage.userinfo
      ? JSON.parse(localStorage.userinfo).phone
      : null
    this.oldphoneOk = false
    this.newphoneOk = false
    this.urlBefore = localStorage.hospitalId
      ? 'hospital'
      : 'admin'
    this.state = {
      sendStatus: false,
      sendStatus2: false,
      visible: false,
      updateName: false,
      loading: false,
      validStr: '验证码',
      validStr2: '验证码'
    }
  }

  tabUpdateName() {
    this.setState({
      updateName: !this.state.updateName
    })
  }

  updatePhone(visible) {
    this.setState({visible})
  }

  checkPhone() {
    return new Promise((resolve, reject) => {
      if (!this.oldphoneOk) {
        reject('请先给原手机发送验证码')
        return
      }
      const telCode = document.getElementById('code').value
      if (telCode == '') {
        reject('请填写原手机验证码')
      } else {
        ajax({
          url: `/${this.urlBefore}/checkPhone`,
          type: 'POST',
          data: {
            telCode,
            telphone: this.oldphone
          },
          success: res => {
            if (res.code == 0) {
              resolve()
            } else {
              reject(res.message)
            }
          }
        })
      }
    })
  }

  handleOk() {
    if (!this.newphoneOk) {
      message.warning('请发送验证码，且填写完整')
      return
    }
    this.setState({loading: true})
    const telphone = $('#phone').val()
    const telCode = $('#validCode').val()
    ajax({
      url: `/${this.urlBefore}/modifyPhone`,
      type: 'POST',
      data: {
        telCode,
        telphone
      },
      success: res => {
        this.setState({loading: false})
        if (res.code == 0) {
          hashHistory.push('/login/' + encodeURI('修改手机号成功，重新登录！'))
        } else {
          message.warning(res.message)

        }
      }
    })
  }
  //发送验证码（原手机）
  sendCode(e) {
    this.setState({sendStatus: true})
    ajax({
      url: `/access/pub-telcode?telphone=${this.oldphone}`,
      success: res => {
        if (res.code == 0) {
          this.oldphoneOk = true
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
  //发送验证码（新手机）
  sendCode2(e) {
    this.checkPhone().then(() => {
      const phone = $('#phone').val()
      this.setState({sendStatus2: true})
      if (!validStr('phone', phone)) {
        message.warning('请填写正确新手机号')
        setTimeout(() => {
          this.setState({sendStatus2: false})
        }, 1000)
        return
      }
      ajax({
        url: `/access/pub-telcode?telphone=${phone}`,
        success: res => {
          if (res.code == 0) {
            this.newphoneOk = true
            timeDown(59, (validStr2) => {
              this.setState({validStr2})
              if (validStr2 == '验证码') {
                this.setState({sendStatus2: false})
              }
            })
          } else {
            message.warning(res.message)
            this.setState({sendStatus2: false})
          }
        }
      })
    }).catch(msg => {
      message.error(msg)
    })
  }
  render() {
    const style = {
      marginLeft: '20px'
    }
    const userInfo = localStorage.userinfo
      ? JSON.parse(localStorage.userinfo)
      : {}

    const {
      updateName,
      visible,
      sendStatus,
      sendStatus2,
      validStr,
      validStr2,
      loading
    } = this.state
    const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 16
      }
    };
    return <div className='tbdetail overhidden'>
      <Demo title='个人资料'>
        <p style={{
            lineHeight: '33px'
          }}>管理员姓名：{
            updateName
              ? <Input placeholder='填写新的昵称' id='newName' defaultValue={userInfo.nickname} style={{
                    width: '200px'
                  }}/>
              : userInfo.nickname
          }
          <Tag color="blue" onClick={this.tabUpdateName.bind(this)} style={style}>{
              updateName
                ? '取消'
                : '修改'
            }</Tag>
        </p>
        <p>管理员手机：{userInfo.phone}<Tag color="blue" style={style} onClick={this.updatePhone.bind(this, true)}>修改</Tag>
        </p>
      </Demo>
      <Demo title='修改登录密码'/> {
        localStorage.usertype == 2
          ? <Demo title='修改支付密码'/>
          : null
      }
      <Modal title="修改手机号" visible={visible} onOk={this.handleOk.bind(this)} confirmLoading={loading} onCancel={this.updatePhone.bind(this, false)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem {...formItemLayout} label='原手机验证码'>
            <Input placeholder="输入管理员验证码" id='code' style={{
                width: '180px',
                marginRight: '10px'
              }}/>
            <Button disabled={sendStatus} onClick={this.sendCode.bind(this)} style={{
                width: '70px'
              }}>{validStr}</Button>
          </FormItem>
          <FormItem {...formItemLayout} label='新手机号'>
            <Input placeholder="输入手机号" id='phone' style={{
                width: '260px'
              }} maxLength='11'/>
          </FormItem>
          <FormItem {...formItemLayout} label='验证码'>
            <Input placeholder="输入验证码" id='validCode' style={{
                width: '180px',
                marginRight: '10px'
              }}/>
            <Button disabled={sendStatus2} onClick={this.sendCode2.bind(this)} style={{
                width: '70px'
              }}>{validStr2}</Button>
          </FormItem>
        </Form>
      </Modal>
    </div>
  }
}
