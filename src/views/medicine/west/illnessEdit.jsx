import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Icon,
  message
} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
import {departList, jobTitles} from '../../../tools'
let docId = null;
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, departList: [], jobList: [], result: {}, examine: []};
  },
  componentWillMount() {
    departList().then(departList => {
      this.setState({departList})
    })
    jobTitles().then(jobList => {
      this.setState({jobList})
    })
    if (docId)
      ajax({
        url: `/doctor/detail/${docId}`,
        async: false,
        success: res => {
          if (res.result) {
            this.setState({result: res.result})
          } else {
            message.error(res.message);
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
      data.id = docId
      data.hospitalId = localStorage.hospitalId
      // data.phone = "13324553455"
      this.setState({loading: true})
      ajax({
        url: '/doctor/backAuth',
        type: 'POST',
        data,
        success: res => {
          this.setState({loading: false})
          if (res.code == 0) {
            hashHistory.go(-1)
          } else {
            message.error(res.message)
          }
        }
      })
    })
  },
  elementEdit(type) {
    let html = <div className='inlinepull'>
      <FormItem label="检验项目">
        <Input placeholder="请输入检验项目"/>
      </FormItem>
      <FormItem label="检验值">
        <Select defaultValue="0" style={{
            width: '80px'
          }}>
          <Option value="0">小于</Option>
          <Option value="1">等于</Option>
          <Option value="2">大于</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input style={{
            width: '80px'
          }} placeholder="数值"/>
      </FormItem>
      <FormItem className='beteen' style={{
          display: 'none'
        }}>
        到</FormItem>
      <FormItem className='beteen' style={{
          display: 'none'
        }}>
        <Input style={{
            width: '80px'
          }} placeholder="数值"/>
      </FormItem>

      <FormItem>
        <Checkbox id={'id' + new Date().getTime().toString().slice(6)} onChange={this.sltBeteen.bind(this)}>区间值</Checkbox>
      </FormItem>
      <FormItem>
        <Checkbox>百分比</Checkbox>
      </FormItem>
    </div>;
    let {examine} = this.state
    if (type == 1) {
      examine.push(html)
    } else {
      examine.pop();
    }
    this.setState({examine})
  },
  sltBeteen(e) {
    let obj = $('#' + e.target.id).parents('.inlinepull').find('.beteen')
    if (e.target.checked) {
      obj.show()
    } else {
      obj.hide()
    }
  },
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 3
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 14
        }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 3
        }
      }
    };
    const {loading, departList, jobList, result, examine} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail drugform overhidden'>
      <Form onSubmit={this.handleSubmit} layout="inline">
        <FormItem className='text-right inlinepull'>
          <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} htmlType="submit" loading={loading}>存草稿</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>完成</Button>
        </FormItem>
        <FormItem label="疾病名称" className='inlinepull'>
          {getFieldDecorator('professional', {initialValue: result.professional})(<Input placeholder="请输入疾病名称"/>)}
        </FormItem>
        <div className='inlinepull'>
          <div className='tbbar'>关联检验项目<span className='cgreen' style={{
        fontSize: '12px',
        paddingLeft: '10px'
      }}>（添加检验项目和检验值以判断上述疾病）</span>
          </div>
        </div>
        <div className='inlinepull'>
          <FormItem label="检验项目">
            {getFieldDecorator('introduction', {initialValue: result.introduction})(<Input placeholder="请输入检验项目"/>)}
          </FormItem>
          <FormItem label="检验值">
            {
              getFieldDecorator('test', {initialValue: '小于'})(<Select defaultValue="0" style={{
                  width: '80px'
                }}>
                <Option value="0">小于</Option>
                <Option value="1">等于</Option>
                <Option value="2">大于</Option>
              </Select>)
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('introduction', {initialValue: result.introduction})(<Input style={{
                  width: '80px'
                }} placeholder="数值"/>)
            }
          </FormItem>
          <FormItem className='beteen' style={{
              display: 'none'
            }}>
            到</FormItem>
          <FormItem className='beteen' style={{
              display: 'none'
            }}>
            {
              getFieldDecorator('erer', {initialValue: result.introduction})(<Input style={{
                  width: '80px'
                }} placeholder="数值"/>)
            }
          </FormItem>
          <FormItem>
            {getFieldDecorator('eee')(<Checkbox onChange={this.sltBeteen.bind(this)}>区间值</Checkbox>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('wewewe')(<Checkbox>百分比</Checkbox>)}
          </FormItem>
          <span className='addreduce'>
            <Icon className='cgreen' type="plus-square" onClick={this.elementEdit.bind(this, 1)}/>
            <Icon style={{
                marginLeft: '10px'
              }} className='cred' type="minus-square" onClick={this.elementEdit.bind(this, 0)}/>
          </span>
        </div>
        {examine.map(item => item)}
      </Form>
    </div>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  componentWillMount() {
    docId = this.props.params.id
  }
  render() {
    return <Demo/>
  }
}
