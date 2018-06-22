import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Button, Form, Input, Row, Col} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

let Demo = React.createClass({
  getInitialState() {
    return {
      passBarShow: false, // 是否显示密码强度提示条
      rePassBarShow: false,
      passStrength: 'L', // 密码强度
      rePassStrength: 'L'
    };
  },

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log(values);
    });
  },

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 2
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 10
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
          offset: 2
        }
      }
    };
    const {getFieldDecorator} = this.props.form
    return (<div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="E-mail">
          {
            getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请填写邮箱'
                }, {
                  type: 'email',
                  message: '请填写正确的邮箱'
                }
              ]
            })(<Input/>)
          }
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register</Button>
        </FormItem>
      </Form>
    </div>);
  }
});

Demo = createForm()(Demo);

export default class form extends Component {
  render() {
    return <Demo/>
  }
}
