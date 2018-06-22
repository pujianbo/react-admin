import React, {Component} from 'react'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {};
  }
  handleSubmit() {
    console.log(23);
  }

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
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 2,
        },
      },
    };
    return (<Form onSubmit={this.handleSubmit.bind(this)} style={{
        marginTop: '40px'
      }}>
      <FormItem {...formItemLayout} label="名称">
        <Input/>
      </FormItem>
      <FormItem {...formItemLayout} label="描述">
        <Input type="textarea"/>
      </FormItem>
      <FormItem {...formItemLayout} label="选择">
        <Select showSearch="showSearch" style={{
            width: 200
          }} placeholder="Select a person" optionFilterProp="children">
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="tom">Tom</Option>
        </Select>
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">提交</Button>
      </FormItem>
    </Form>);
  }
}
