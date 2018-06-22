import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  Select,
  Icon,
  message
} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
import {departList, jobTitles} from '../../tools'
let docId = null;
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, departList: [], jobList: [], result: {}};
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
    const {loading, departList, jobList, result} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail overhidden'>
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          <div className='tbbar'>行医认证<span className='cgreen' style={{
        fontSize: '12px',
        paddingLeft: '10px'
      }}>(认证后的医生才可在康医生APP端接诊患者)</span>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="所属科室">
          {
            getFieldDecorator('departId', {
              rules: [
                {
                  required: true,
                  message: '请选择科室'
                }
              ],
              initialValue: result.deptName
                ? result.deptName
                : ''
            })(<Select placeholder='选择' style={{
                width: 140
              }}>
              {
                departList.map(item => <Option value={item.id}>{item.name}</Option>)
              }
            </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="医生职称">
          {
            getFieldDecorator('doctorJob', {
              rules: [
                {
                  required: true,
                  message: '请选择医生职称'
                }
              ],
              initialValue: result.jobTitle && jobList.length > 0
                ? jobList.find(i => i.id == result.jobTitle).name
                : ''
            })(<Select placeholder='选择' style={{
                width: 140
              }}>
              {jobList.map(item => <Option value={item.id}>{item.name}</Option>)}
            </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="学校职称">
          {
            getFieldDecorator('edu', {
              rules: [
                {
                  required: true,
                  message: '请选择学校职称'
                }
              ],
              initialValue: result.edu

            })(<Select placeholder='选择' style={{
                width: 140
              }}>
              {
                schoolTitle.map(item => {
                  return (<Option value={item}>{item}</Option>)
                })
              }
            </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="擅长方向">
          {
            getFieldDecorator('ability', {initialValue: result.ability})(<TextArea placeholder="输入擅长的方向" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="职业优势">
          {getFieldDecorator('professional', {initialValue: result.professional})(<Input placeholder="优势之间以空格隔开（如从业三十年 业内名医 )"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="个人简介">
          {
            getFieldDecorator('introduction', {initialValue: result.introduction})(<TextArea placeholder="输入个人简介" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>

        <FormItem {...tailFormItemLayout} style={{
            marginBottom: '100px'
          }}>
          <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>确定</Button>
        </FormItem>
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
