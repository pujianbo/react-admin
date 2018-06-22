import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Button, Form, Input, message, Icon} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;

let Id = null
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, result: {}};
  },
  componentWillMount() {
    if (Id)
      ajax({
        url: `/v1/tcm/healthcaresuggest/${Id}`,
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
    UE.getEditor('container');
  },
  componentWillUnmount() {
    if (UE)
      UE.getEditor('container').destroy();
    }
  ,
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      // if (!!errors)
      //   return

      let data = this.props.form.getFieldsValue();
      let content = UE.getEditor('container').getContent()
      if (data.title == '' || content == '')
        return
      data.id = Id
      data.content = content
      data.status = 1
      this.setState({loading: true})
      ajax({
        url: '/v1/tcm/healthcaresuggest',
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
          span: 21
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
          <Button htmlType="submit" disabled={loading} style={{
              marginRight: '10px'
            }}>存草稿</Button>
          <Button htmlType="submit" disabled={loading} type='primary'>发布</Button>
        </div>
        <FormItem {...formItemLayout} label="养生标题">
          {
            getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请填写养生标题'
                }
              ],
              initialValue: result.title
            })(<Input placeholder='请填写消息标题' style={{
                width: '300px'
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="养生描述">
          {
            getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: '请选择养生描述'
                }
              ],
              initialValue: result.content
            })(<div className='ueditor'>
              <script id="container" name="content" type="text/plain">
                {result.content}</script>
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
  }
  render() {
    return <Demo/>
  }
}
