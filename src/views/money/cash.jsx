import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  List,
  Select,
  Icon,
  Avatar,
  message,
  Modal
} from 'antd';
const confirm = Modal.confirm;
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
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

function number(num) {
  return Math.floor(Math.random() * num)
}
function addData() {
  const commentData = [];
  for (let i = 1; i < 4; i++) {
    commentData.push({
      user: {
        name: '测试用户' + number(10),
        time: `2018.${number(10)}.${number(10)}`,
        content: '医生说的就是这样了'
      },
      comment: [
        {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }
      ]
    });
  }
  return commentData
}

let Demo = React.createClass({
  getInitialState() {
    return {
      loading: false,
      accountList: [
        {
          id: 1,
          name: '中国银行（8430）'
        }, {
          id: 2,
          name: '农业银行（3477）'
        }, {
          id: 3,
          name: '招商银行（5699）'
        }, {
          id: 4,
          name: '建设银行（3454）'
        }
      ]
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {

      if (!!errors)
        return
      let data = this.props.form.getFieldsValue();
      confirm({
        title: '确认提现?', content: <div className='cashcfm'>
          <h4 className='cred'>￥101.00</h4>
          <p>（实际到账100元，提现手续费1元）</p>
        </div>,
        okText: '提现',
        onOk() {
          // ajax({
          //   url: tabindex == 1
          //     ? `/v1/tcm/drug`
          //     : `/v1/tcm/prescription`,
          //   type: 'POST',
          //   data,
          //   success: res => {
          //     this.setState({loading: false})
          //     if (res.code == 0) {
          //       hashHistory.go(-1)
          //     } else {
          //       message.error(res.message)
          //     }
          //   }
          // })
        }
      });
    })
  },
  render() {
    const {loading, accountList} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div>
      <div className='text-center' style={{
          paddingBottom: '100px'
        }}>
        <div className='text-center cashintro'>
          <p>余额</p>
          <p className='cred' style={{
              fontSize: '30px'
            }}>
            <b>300,000</b>
          </p>
          <p>
            <ul>
              <li>1. 根据支付方规则，每笔提现收取0.1%手续费，最低1元，最高25元</li>
              <li>2. 同一银行卡单日限额5W，单次限额5W</li>
              <li>3. 单日总提现限额100W</li>
            </ul>
          </p>
        </div>
        <div>
          <Form onSubmit={this.handleSubmit} style={{
              width: '430px',
              display: 'inline-block',
              textAlign: 'left'
            }}>
            <FormItem {...formItemLayout} label="提现银行卡">
              {
                getFieldDecorator('bank', {
                  rules: [
                    {
                      required: true,
                      message: '必填'
                    }
                  ]
                })(<Select style={{
                    width: '220px'
                  }} placeholder='请选择提现的银行卡'>
                  {
                    accountList.map(item =>< Option value = {
                      item.id
                    } > {
                      item.name
                    }</Option>)
                  }
                </Select>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="提现金额￥">
              {
                getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '必填'
                    },
                    // {
                    //   type: 'number',
                    //   message: '请输入正确的金额'
                    // }
                  ]
                })(<div>
                  <Input placeholder="请输入提现的金额" style={{
                      width: '220px'
                    }}/>
                  <span style={{
                      marginLeft: '20px'
                    }} className='cblue'>手续费￥：1</span>
                </div>)
              }
            </FormItem>
            <FormItem style={{
                marginTop: '40px'
              }}>
              <Button htmlType='submit' type="primary" style={{
                  width: '100%'
                }}>提 交</Button>
            </FormItem>
          </Form>
        </div>
      </div>

    </div>);
  }
});
let Account = React.createClass({
  getInitialState() {
    return {
      loading: false
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return
      let data = this.props.form.getFieldsValue();
    })
  },
  render() {
    const {loading} = this.state
    const {getFieldDecorator} = this.props.form
    return (<Form onSubmit={this.handleSubmit}>
      <FormItem {...formItemLayout} label="持卡人">
        {
          getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '必填'
              }
            ]
          })(<Input placeholder='请填写银行卡户名'/>)
        }
      </FormItem>
      <FormItem {...formItemLayout} label="银行卡号">
        {
          getFieldDecorator('nameka', {
            rules: [
              {
                required: true,
                message: '必填'
              }
            ]
          })(<Input placeholder='请填写银行卡号'/>)
        }
      </FormItem>
      <FormItem {...formItemLayout} label="选择银行">
        {
          getFieldDecorator('bank', {
            rules: [
              {
                required: true,
                message: '必填'
              }
            ]
          })(<Select placeholder='请选择银行'>
            {
              bankList.map(item =>< Option value = {
                item.value
              } > {
                item.text
              }</Option>)
            }
          </Select>)
        }
      </FormItem>
      <FormItem style={{
          marginTop: '40px'
        }}>
        <Button htmlType='submit' type="primary" style={{
            width: '100%'
          }}>保存</Button>
      </FormItem>
    </Form>);
  }
});
Demo = createForm()(Demo);
Account = createForm()(Account);
export default class form extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {};
    this.state = {
      visible: false,
      type: 1,
      commentData: addData()
    }
  }
  showModal() {
    this.setState({visible: true})
  }
  hideModal() {
    if (this.state.type == 2) {
      this.setState({type: 1})
    } else {
      this.setState({visible: false})
    }
  }
  accountDel(type, item) {
    if (type == 0) {
      confirm({
        title: '确定要删除当前账户?',
        content: '中国银行（8430）',
        onOk() {
          // ajax({
          //   url: tabindex == 1
          //     ? `/v1/tcm/drug`
          //     : `/v1/tcm/prescription`,
          //   type: 'POST',
          //   data,
          //   success: res => {
          //     this.setState({loading: false})
          //     if (res.code == 0) {
          //       hashHistory.go(-1)
          //     } else {
          //       message.error(res.message)
          //     }
          //   }
          // })
        }
      });
    } else {
      this.setState({type: 2})
    }
  }
  render() {
    const {visible, commentData, type} = this.state
    return (<div className='tbdetail overhidden'>
      <div className='text-right' style={{
          marginBottom: '20px'
        }}>
        <Button onClick={this.showModal.bind(this)}>管理银行卡</Button>
      </div>
      <Demo/>
      <Modal visible={visible} title="银行卡管理" onCancel={this.hideModal.bind(this)} footer={null} width='400px'>
        {
          type == 1
            ? [
              <List itemLayout="horizontal" size="large" dataSource={commentData} renderItem={item => (<List.Item actions={[
                    <a title='删除' onClick={this.accountDel.bind(this, 0, item)}><Icon type="delete"/></a>,
                    <a title='编辑' onClick={this.accountDel.bind(this, 1, item)}><Icon type="edit"/></a>
                  ]}>
                  <List.Item.Meta avatar={<Avatar size = 'large' src = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} description={<ul > <li>民生银行</li>
                    <li className='clearfix'>
                      <span className='left'>储蓄卡</span>
                      <span className='right'>**** **** **** 5618</span>
                    </li>
                  </ul>}/>
                </List.Item>)}/>,
              <Button type="dashed" onClick={this.accountDel.bind(this, 2)} style={{
                  width: '100%',
                  marginTop: '20px'
                }}>
                <Icon type="plus"/>
                添加新账户
              </Button>
            ]
            : <Account/>
        }
      </Modal>
    </div>)
  }
}
