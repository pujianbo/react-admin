import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Button, Form, Input, message} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

let Demo = React.createClass({
  getInitialState() {
    return {result: {}};
  },
  componentWillMount() {
    let _this = this
    ajax({
      url: '/ratioset/get',
      type: 'POST',
      async: false,
      success: function(res) {
        if (res.code == 0) {
          let result = _this.percentHandle(res.result, 1)
          _this.setState({result})
        } else {
          message.error(res.msg);
        }
      }
    })
  },
  percentHandle(result, type) {
    for (let item in result) {
      if (item == 'id' || item == 'wechatLowest' || item == 'wechatHighest')
        continue
      result[item] = result[item] * (
        type == 1
        ? 100
        : 0.01)
    }
    return result
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return

      let data = this.props.form.getFieldsValue();
      data = this.percentHandle(data, 0)
      data.id = this.state.result.id
      console.log(data);
      ajax({
        url: '/ratioset/save',
        type: 'POST',
        data,
        success: function(res) {
          if (res.code == 0) {
            message.success('保存成功');
            // _this.setState({result: res.result})
          } else {
            message.error(res.msg);
          }
        }
      })
    })
  },
  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
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
    const style = {
      width: '200px',
      marginRight: '10px'
    }
    const style2 = {
      marginLeft: '60px'
    }
    const style3 = {
      width: '100px'
    }
    const width = '400px'

    const {result} = this.state
    const {title} = this.props
    const {getFieldDecorator} = this.props.form
    return (<Form onSubmit={this.handleSubmit} layout="inline">
      <div className='inlinepull'>
        <div className='tbbar'>支付费率设置
          <span className='cgreen' style={{
              fontSize: '12px',
              paddingLeft: '10px'
            }}>（用于分润结算时第三方支付平台抽取手续费）</span>
          <Button className='right' style={{
              marginTop: '-10px',
              marginRight: '10px'
            }} htmlType='submit'>保存更改</Button>
        </div>
      </div>
      <div style={{
          width: width
        }}>
        <FormItem {...formItemLayout} label="支付宝费率" className='inlinepull'>
          {getFieldDecorator('alipay', {initialValue: result.alipay})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
        </FormItem>
        <FormItem {...formItemLayout} label="微信费率" className='inlinepull'>
          {getFieldDecorator('wechat', {initialValue: result.wechat})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
        </FormItem>
        <FormItem {...formItemLayout} label="苹果费率" className='inlinepull'>
          {getFieldDecorator('iphone', {initialValue: result.iphone})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
        </FormItem>
      </div>
      <div className='inlinepull'>
        <div className='tbbar'>提现费率设置</div>
      </div>
      <div>
        <div style={{
            width: width,
            display: 'inline-block'
          }}>
          <FormItem {...formItemLayout} label="微信费率" className='inlinepull'>
            {getFieldDecorator('wechatWithdraw', {initialValue: result.wechatWithdraw})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
          </FormItem>
        </div>
        <FormItem label="最低￥">
          {getFieldDecorator('wechatLowest', {initialValue: result.wechatLowest})(<Input type="text" style={style3}/>)}<span style={{
        paddingLeft: '10px'
      }}>元</span>
        </FormItem>
        <FormItem label="最高￥" style={style2}>
          {getFieldDecorator('wechatHighest', {initialValue: result.wechatHighest})(<Input type="text" style={style3}/>)}<span style={{
        paddingLeft: '10px'
      }}>元</span>
        </FormItem>
      </div>
      <div className='inlinepull'>
        <div className='tbbar'>问诊分润设置
          <span className='cgreen' style={{
              fontSize: '12px',
              paddingLeft: '10px'
            }}>（用于问诊分润结算时非支付平台方抽取费用，各方比例之和=100%）</span>
        </div>
      </div>
      <div style={{
          width: width
        }}>
        <FormItem {...formItemLayout} label="医生分润" className='inlinepull'>
          {getFieldDecorator('doc', {initialValue: result.doc})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
        </FormItem>
        <FormItem {...formItemLayout} label="医院分润" className='inlinepull'>
          {getFieldDecorator('hospital', {initialValue: result.hospital})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
        </FormItem>
        <FormItem {...formItemLayout} label="平台分润" className='inlinepull'>
          {getFieldDecorator('platform', {initialValue: result.platform})(<Input type="text" placeholder='支持两位小数' style={style}/>)}%
        </FormItem>
      </div>
    </Form>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  render() {
    return <div className='tbdetail overhidden'>
      <Demo/>
    </div>
  }
}
