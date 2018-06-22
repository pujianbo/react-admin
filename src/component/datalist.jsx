import React, {Component} from 'react'
import {Table, Button, Modal} from 'antd';

const data = [];
for (let i = 1; i <= 46; i++) {
  if (i < 10)
    i = '0' + i;
  data.push({
    key: i,
    index: i,
    name: '张斌超',
    phone: 15928287799,
    keshi: '儿科',
    zhicheng: '专家',
    status: '正常'
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
      pagination: {
        current: 1,
        pageSize: 10,
        total: 46
      },
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            dltdisabled: selectedRowKeys.length == 0
          })
          this.selectedRowKeys = selectedRowKeys
        }
      }
    };
    this.columns = [
      {
        title: '序号',
        dataIndex: 'index'
      }, {
        title: '用户名',
        dataIndex: 'name'
      }, {
        title: '手机号',
        dataIndex: 'phone'
      }, {
        title: '科室',
        dataIndex: 'keshi'
      }, {
        title: '职称',
        dataIndex: 'zhicheng'
      }, {
        title: '状态',
        dataIndex: 'status'
      }, {
        title: '操作',
        key: 'action',
        render: (txt, record) => (<span className='links'>
          <a onClick={this.edit.bind(this, txt, 0)}>编辑</a>
          <a onClick={this.edit.bind(this, txt, 1)}>删除</a>
        </span>)
      }
    ];
  }
  handleTableChange(pagination, filters, sorter) {
    this.setState({pagination})
    console.log(filters);
  }

  edit(txt, type) {
    console.log(txt);
    if (type == 1) {
      Modal.confirm({
        title: '你确定要删除此条记录?',
        content: `序号：${txt.index}，姓名：${txt.name}`,
        onOk() {
          console.log('OK');
        }
      });
    }
  }
  deleteSlt() {
    console.log(this.selectedRowKeys);
    Modal.confirm({
      title: '你确定要删除所选记录?',
      content: `选择项：${this.selectedRowKeys.join(',')}`,
      onOk() {
        console.log('OK');
      }
    });
  }
  render() {
    const {data, pagination, loading, rowSelection, dltdisabled} = this.state
    return (<div>
      <div className='frmbtntop'>
        <Button type="danger" disabled={dltdisabled} onClick={this.deleteSlt.bind(this)}>批量删除</Button>
        <Button>新建用户</Button>
      </div>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} loading={loading} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
