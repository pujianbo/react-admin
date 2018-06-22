import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Button, Form, Input, Icon, message} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;
const {TextArea} = Input;
let Id = null;
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, result: {}};
  },
  componentWillMount() {
    if (Id)
      ajax({
        url: `/v1/tcm/similarases/${Id}`,
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
      data.id = Id
      this.setState({loading: true})
      ajax({
        url: '/v1/tcm/similarases',
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
    const {loading, result} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail drugform overhidden'>
      <Form onSubmit={this.handleSubmit}>
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

        <FormItem {...formItemLayout} label="病例标题">
          {
            getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.title
            })(<Input placeholder="请输入病例标题"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="病例出处">
          {
            getFieldDecorator('casesOfTheSource', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.casesOfTheSource
            })(<Input placeholder="请输入病例出处"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="医生名">
          {
            getFieldDecorator('author', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.author
            })(<Input placeholder="请输入书写该病例的医生姓名"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="主诉">
          {
            getFieldDecorator('actionInChief', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.actionInChief
            })(<TextArea placeholder="输入主诉" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="现病史">
          {
            getFieldDecorator('nowDied', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.nowDied
            })(<TextArea placeholder="输入现病史" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>

        <FormItem {...formItemLayout} label="中医诊断">
          {
            getFieldDecorator('tcmDiagnosis', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.tcmDiagnosis
            })(<Input placeholder="请输入中医诊断，病名以空格隔开"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="西医诊断">
          {
            getFieldDecorator('westernDiagnosis', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.westernDiagnosis
            })(<Input placeholder="请输入西医诊断，病名以空格隔开"/>)
          }
        </FormItem>

      </Form>
    </div>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  componentWillMount() {
    Id = this.props.params.id
  }
  render() {
    return <Demo/>
  }
}
