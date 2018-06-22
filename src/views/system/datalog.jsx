import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Icon,
  Select,
  Tabs,
  Upload,
  message
} from 'antd';
// import moment from 'moment';
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const FormItem = Form.Item;
const Option = Select.Option;
const data = [];
for (let i = 1; i <= 46; i++) {
  data.push({
    key: i,
    person: 'admin',
    createtime: '2018.01.07 17:54:34',
    name: '登录',
    ip: '200.123.234.34',
    equipment: 'Android'
  });
}
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text'
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowKeys = '';
    this.state = {
      loading: false,
      data,
      dltdisabled: true,
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 46
      }
    };
    this.columns = [
      {
        title: '操作用户',
        dataIndex: 'person'
      }, {
        title: '操作时间',
        dataIndex: 'createtime'
      }, {
        title: '操作名称',
        dataIndex: 'name'
      }, {
        title: '操作IP',
        dataIndex: 'ip'
      }, {
        title: '操作设备',
        dataIndex: 'equipment'
      }
    ];
  }
  handleTableChange(pagination, filters, sorter) {
    this.setState({pagination})
    console.log(filters);
  }

  //选择状态
  sltStatus(value) {
    console.log(`selected ${value}`);
  }

  //选择时间
  sltTime(time, type) {
    console.log(time);
    console.log(type);
  }

  //获取Input内容
  getValue(value, e) {
    console.log(value);
    console.log(e.target.value);
  }

  //新建账户弹框
  addVersion() {
    this.setState({visible: true})
  }

  handleCancel() {
    this.setState({visible: false})
  }
  handleOk(e) {
    e.preventDefault();
  }

  render() {
    const {data, pagination, loading, dltdisabled} = this.state
    return (<div>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="操作名称">
              <Select defaultValue="all" onChange={this.sltStatus.bind(this)}>
                <Option value="all">全部</Option>
                <Option value="login">登录</Option>
                <Option value="reg">注册</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="操作用户">
              <Input placeholder='搜索操作用户' onChange={this.getValue.bind(this, 0)}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="操作时间">
              <RangePicker onChange={this.sltTime.bind(this, 1)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table columns={this.columns} dataSource={data} pagination={pagination} loading={loading} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
