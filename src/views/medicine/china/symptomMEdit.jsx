import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  message
} from 'antd';
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
import {positionList} from '../../../tools'
let Id = null;
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
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, posiList: [], result: {}, examine: []};
  },
  componentWillMount() {
    if (Id)
      ajax({
        url: `/v1/tcm/mainsymptom/${Id}`,
        async: false,
        success: res => {
          if (res.result) {
            this.setState({result: res.result})
            positionList({crowd: res.result.crowd}).then(posiList => {
              this.setState({posiList})
            })
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
        url: '/v1/tcm/mainsymptom',
        type: Id
          ? 'PUT'
          : 'POST',
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
  sltCrowd(e) {
    // console.log(e.target.value);
    positionList({crowd: e.target.value}).then(posiList => {
      this.setState({posiList})
      //需要清空选择的值，重新选择
    })
  },
  render() {

    const {loading, posiList, result} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail drugform overhidden'>
      <Form onSubmit={this.handleSubmit} layout="inline">
        <FormItem className='text-right inlinepull'>
          <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>完成</Button>
        </FormItem>
        <FormItem {...formItemLayout} label="主症状名" className='inlinepull'>
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.name
            })(<Input style={{
                width: '200px'
              }} placeholder="请输入主症状名"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="所属性别" className='inlinepull'>
          {
            getFieldDecorator('crowd', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.crowd
            })(<RadioGroup onChange={this.sltCrowd.bind(this)}>
              <Radio value={1}>男</Radio>
              <Radio value={0}>女</Radio>
              <Radio value={2}>儿童</Radio>
            </RadioGroup>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="所属部位" className='inlinepull'>
          {
            getFieldDecorator('position', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.position
            })(<Select placeholder='选择' style={{
                width: 140
              }}>
              {posiList.map(item => <Option value={item.code}>{item.name}</Option>)}
            </Select>)
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
