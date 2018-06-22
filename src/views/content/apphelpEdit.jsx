import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Button, Form, Input, message} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;

let Id = null
let Type = 0
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, result: {}};
  },
  ue: null,
  stateVal: 1,
  componentWillMount() {
    if (Id)
      ajax({
        url: `/useManual/getuseManualDetails?id=${Id}&type=${Type}`,
        async: false,
        success: res => {
          if (res.code == 0) {
            this.setState({result: res.result})
          } else {
            message.error(res.message);
          }
        }
      })
  },
  componentDidMount() {
    this.ue = UE.getEditor('container');
  },
  componentWillUnmount() {
    if (UE)
      UE.getEditor('container').destroy();
    }
  ,
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return

      let data = this.props.form.getFieldsValue();
      data.type = Type
      let content = this.ue.getContent();
      if (content == '') {
        message.warn('请填写问题正文');
        return
      }
      data.content = content
      data.state = this.stateVal

      if (Id)
        data.id = Id
      this.setState({loading: true})
      ajax({
        url: `/useManual/saveOrUpdate`,
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
  save(state) {
    this.stateVal = state
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
          span: 21
        }
      }
    };
    const {loading, result} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail overhidden'>
      <Form onSubmit={this.handleSubmit}>
        <div className='text-right' style={{
            marginBottom: '20px'
          }}>
          <Button style={{
              marginRight: '10px'
            }}>取消</Button>
          <Button style={{
              marginRight: '10px'
            }} htmlType="submit" loading={loading} onClick={this.save.bind(this, 2)}>存草稿</Button>
          <Button type='primary' htmlType="submit" loading={loading} onClick={this.save.bind(this, 1)}>发布</Button>
        </div>
        <FormItem {...formItemLayout} label="问题标题">
          {
            getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请填写问题标题'
                }
              ],
              initialValue: result.title
            })(<Input placeholder='请填写问题标题' style={{
                width: '500px'
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="问题正文">
          {
            getFieldDecorator('content')(<div className='ueditor'>
              <script id="container" name="content" type="text/plain">{result.intro}</script>
            </div>)
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
    Type = this.props.params.type
  }
  render() {
    return <Demo/>
  }
}
