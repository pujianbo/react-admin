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
message.config({top: 100, maxCount: 1});
import {unitMoney} from '../../tools'
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

let Demo = React.createClass({
  data: null,
  getInitialState() {
    return {fee: 1, loading: false, visible: false, result: {}, accountList: []};
  },
  componentDidMount() {
    this.getMoney()
  },
  componentWillReceiveProps() {
    ajax({
      url: '/v1/bankcard/currentuserall',
      success: res => {
        if (res.result && res.result.length > 0) {
          this.setState({accountList: res.result})
        } else {
          this.setState({accountList: []})
          message.warn('请先添加银行卡')
        }
      }
    })
  },
  getMoney() {
    ajax({
      url: `/financialManage/queryHospitalInfoDetails?hospId=${localStorage.hospitalId}`,
      success: res => {
        if (res.result) {
          this.setState({result: res.result})
        }
      }
    })
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      let _this = this;
      if (!!errors)
        return
      let data = this.props.form.getFieldsValue();
      const {number, fee, accountList} = this.state
      data.amount = number * 100
      const item = accountList.find(i => i.id == data.id)
      data.bankNo = item.bankNo
      data.cardName = item.cardName
      data.cardNum = item.cardNum
      delete data.id
      this.data = data
      this.setState({visible: true})
    })
  },
  hideModal(type) {
    if (type != 1) {
      this.setState({visible: false})
      return
    }
    let password = document.querySelector('#pwd').value
    if (password == '') {
      message.warn('请填写支付密码')
      return
    }
    this.setState({loading: true})
    this.data.password = password
    ajax({
      url: `/pay/withdrawbank`,
      type: 'POST',
      data: this.data,
      success: res => {
        if (res.code == 0) {
          message.success(res.message)
          this.setState({visible: false})
          this.getMoney()
        } else {
          message.error(res.message)
        }
        setTimeout(() => {
          this.setState({loading: false})
        }, 1000)
      }
    })
  },
  chargeMoney(e) {
    let number = parseInt(e.target.value || 0, 10);
    let {balance} = this.state.result
    balance = balance / 100
    if (isNaN(number))
      return
    if (number > balance) {
      number = balance
      message.warn('超出您的账户余额')
    }
    if (number > 5000) {
      number = 50000
      message.warn('最高金额5万')
    }

    let fee = (number / 1000).toFixed(2)
    if (fee < 1)
      fee = 1
    if (fee > 25)
      fee = 25
    this.setState({fee, number})
  },
  render() {
    const {
      loading,
      result,
      accountList,
      fee,
      number,
      visible
    } = this.state
    const {getFieldDecorator} = this.props.form
    return (<div>
      <Modal width='420' title={null} confirmLoading={loading} visible={visible} onOk={this.hideModal.bind(this, 1)} onCancel={this.hideModal.bind(this, 2)} okText="提现" cancelText="取消">
        <div style={{
            fontSize: '18px',
            paddingLeft: '4px'
          }}>确认提现?</div>
        <div className='cashcfm'>
          <h4 className='cred'>￥{number + Number(fee)}</h4>
          <p>（实际到账{number}元，提现手续费{fee}元）</p>
          <p><Input id='pwd' type='password' style={{
        width: '80%',
        marginTop: '20px',
        marginLeft: '10px'
      }} placeholder='填写支付密码'/></p>
        </div>
      </Modal>
      <div className='text-center' style={{
          paddingBottom: '100px'
        }}>
        <div className='text-center cashintro'>
          <p>余额</p>
          <p className='cred' style={{
              fontSize: '30px'
            }}>
            <b>{unitMoney(result.balance)}</b>
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
                getFieldDecorator('id', {
                  rules: [
                    {
                      required: true,
                      message: '请选择提现的银行卡'
                    }
                  ]
                })(<Select style={{
                    width: '300px'
                  }} placeholder='请选择提现的银行卡'>
                  {
                    accountList.map(item => {
                      return <Option value={item.id}>{item.bankName}
                        - {item.cardName}（{item.cardNum.slice(-4)}）</Option>
                    })
                  }
                </Select>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="提现金额￥">
              {
                getFieldDecorator('amount', {
                  rules: [
                    {
                      required: true,
                      message: '请输入提现的金额'
                    }
                  ]
                })(<div>
                  <Input value={number} onChange={this.chargeMoney.bind(this)} placeholder="请输入提现的金额" style={{
                      width: '300px'
                    }}/>
                  <div className='cred' style={{
                      paddingLeft: '6px'
                    }}>手续费￥：{fee}</div>
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
    return {loading: false, bankList: []};
  },
  componentWillMount() {
    ajax({
      url: '/v1/bankcard/supportbank',
      success: res => {
        if (res.result && res.result.length > 0) {
          this.setState({bankList: res.result})
        } else {
          message.warn('请先添加银行卡')
        }
      }
    })
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return
      let data = this.props.form.getFieldsValue();
      data.adminUserId = localStorage.userId
      data.bankName = this.state.bankList.find(item => item.bankNo == data.bankNo).bankName
      console.log(data);
      ajax({
        url: '/v1/bankcard/addbankcard',
        type: 'POST',
        data,
        success: res => {
          if (res.code == 0) {
            message.success(res.message)
            this.props.handle(1)
          } else {
            message.error(res.message)
          }
        }
      })
    })
  },
  render() {
    const {loading, bankList} = this.state
    const {getFieldDecorator} = this.props.form
    return (<Form onSubmit={this.handleSubmit}>
      <FormItem {...formItemLayout} label="持卡人">
        {
          getFieldDecorator('cardName', {
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
          getFieldDecorator('cardNum', {
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
          getFieldDecorator('bankNo', {
            rules: [
              {
                required: true,
                message: '必填'
              }
            ]
          })(<Select placeholder='请选择银行'>
            {
              bankList.map(item =>< Option value = {
                item.bankNo
              } > {
                item.bankName
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
      accountList: []
    }
  }
  componentWillMount() {
    this.getMyBank()
  }
  getMyBank() {
    ajax({
      url: '/v1/bankcard/currentuserall',
      success: res => {
        if (res.result) {
          this.setState({accountList: res.result})
        }
      }
    })
  }
  showModal() {
    this.setState({visible: true})
  }
  hideModal() {
    if (this.state.type == 2) {
      this.setState({type: 1})
    } else {
      // this.refs.bankcash.updateok();
      this.setState({visible: false})
    }
  }
  accountDel(type, item) {
    if (type == 0) {
      let _this = this
      confirm({
        title: '确定要删除当前银行卡?',
        content: `${item.bankName} - ${item.cardName} (${item.cardNum.slice(-4)})`,
        onOk() {
          ajax({
            url: `/v1/bankcard/removebankcard/${item.id}`,
            type: 'DELETE',
            success: res => {
              if (res.code == 0) {
                message.success(res.message)
                _this.getMyBank();
              } else {
                message.error(res.message)
              }
            }
          })
        }
      });
    } else {
      this.setState({type: 2})
    }
  }
  handle(data) {
    this.getMyBank();
    this.setState({type: 1})
  }
  render() {
    const {visible, accountList, type} = this.state
    return (<div className='tbdetail overhidden'>
      <div className='text-right' style={{
          marginBottom: '20px'
        }}>
        <Button onClick={this.showModal.bind(this)}>管理银行卡</Button>
      </div>
      <Demo ref='bankcash'/>
      <Modal visible={visible} title="银行卡管理" onCancel={this.hideModal.bind(this)} footer={null} width='400px'>
        {
          type == 1
            ? [
              <List itemLayout="horizontal" size="large" dataSource={accountList} renderItem={item => (<List.Item actions={[<a title='删除' onClick={this.accountDel.bind(this, 0, item)}><Icon type="delete"/></a>
                    ]}>
                  {/* <a title='编辑' onClick={this.accountDel.bind(this, 1, item)}><Icon type="edit"/></a> */}

                  <List.Item.Meta avatar={<Avatar size = 'large' src = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} description={<ul > <li>{item.bankName}</li>
                    <li className='clearfix'>
                      <span className='left'>{item.cardName}</span>
                      <span className='right'>**** **** **** {item.cardNum.slice(-4)}</span>
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
            : <Account handle={this.handle.bind(this)}/>
        }
      </Modal>
    </div>)
  }
}
