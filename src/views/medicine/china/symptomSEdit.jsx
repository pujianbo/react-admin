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
import {symptomList} from '../../../tools'
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
    return {
      loading: false,
      symptomList: [],
      result: {
        base: {},
        main: []
      },
      examine: []
    };
  },
  componentWillMount() {
    symptomList().then(symptomList => {
      this.setState({symptomList})
    })
    if (Id)
      ajax({
        url: `/v1/tcm/minorsymptom/${Id}`,
        async: false,
        success: res => {
          if (res.result) {
            let result = res.result;
            const mainSymptomids = []
            result.main.map(item => {
              mainSymptomids.push(item.id)
            })
            result = {
              ...result,
              mainSymptomids
            }
            this.setState({result})
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
      data.id = Id;
      this.setState({loading: true})
      ajax({
        url: '/v1/tcm/minorsymptom/',
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
    const {loading, symptomList, result, examine} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail drugform overhidden'>
      <Form onSubmit={this.handleSubmit}>
        <FormItem className='text-right inlinepull'>
          <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>完成</Button>
        </FormItem>
        <FormItem {...formItemLayout} label="子症状名" className='inlinepull'>
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.base.name
            })(<Input style={{
                width: '200px'
              }} placeholder="请输入子症状名"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="所属主症状1" className='symptomitem'>
          {
            getFieldDecorator('mainSymptomids', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.mainSymptomids
            })(<Select mode="multiple" style={{
                width: '100%'
              }} placeholder="选择主症状">
              {symptomList.map(item => <Option value={item.id}>{item.name}</Option>)}
            </Select>)
          }
        </FormItem>
        {examine.map(item => item)}
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
