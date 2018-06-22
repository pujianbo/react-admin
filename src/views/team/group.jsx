import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Icon,
  message
} from 'antd';
const FormItem = Form.Item;

export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.id = null;
    this.state = {
      edit: false,
      data: [],
      dltdisabled: true,
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            dltdisabled: selectedRowKeys.length == 0
          })
          let sltid = []
          let sltname = ''
          selectedRows.map(item => {
            sltid.push(item.id)
            sltname += item.name + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name'
      }, {
        title: '人数',
        dataIndex: 'count'
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/team/doc/${encodeURI(value.name)}`} ><Icon type="exclamation-circle-o"/></Link>
          <a title='编辑' onClick={this.eidtItem.bind(this, value)}><Icon type="edit"/></a>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
  }

  //翻页
  handleTableChange(pagination, filters, sorter) {
    console.log(pagination);
    this.setState({pagination})
    this.getData(pagination.current);
  }
  //获取列表
  getData(newpage) {
    let {pagination} = this.state
    if (newpage)
      pagination.current = newpage;
    const {current, pageSize} = pagination
    console.log(pagination);
    ajax({
      url: `/v1/depart/list?pageIndex=${current}&pageSize=${pageSize}`,
      success: res => {
        if (res.code == 0) {
          pagination.total = res.result.count
          this.setState({data: res.result.list, pagination})
        } else {
          // message.error(res.message)
        }
      }
    })
  }

  //单个编辑

  edit(value, typeName) {
    let _this = this;
    Modal.confirm({
      title: `您确定要${typeName}以下记录吗?`,
      content: `昵称：${value.name}`,
      onOk() {
        ajax({
          url: `/depart/del/${value.id}`,
          type: 'DELETE',
          success: res => {
            if (res.code == 0) {
              message.success(res.message)
              _this.getData(1);
            } else {
              message.error(res.message)
            }
          }
        })
      }
    });
  }
  //批量操作
  handleSlt(e) {
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        let url = `/depart/batch-del`
        let type = 'POST'
        let data = {
          ids: _this.selectedRowID
        }
        _this.mulDataHandle(url, type, data)
      }
    });
  }

  //批量操作数据
  mulDataHandle(url, type, data) {
    ajax({
      url,
      type,
      data,
      success: res => {
        if (res.code == 0) {
          message.success(res.message)
          this.getData(1);
        } else {
          message.error(res.message)
        }
      }
    })
  }

  //新建记录
  eidtItem(value) {
    console.log(value);
    this.setState({
      visible: true,
      edit: value.id
        ? true
        : false
    })
    if (value.id)
      setTimeout(() => {
        $('#name').val(value.name)
      }, 100)
    this.id = value.id
  }

  handleCancel() {
    this.setState({visible: false})
  }
  handleOk(e) {
    e.preventDefault();
    const name = $('#name').val();
    if (name == '') {
      message.warning('请填写分组名称')
      return
    }
    let data = {
      hospitalId: localStorage.hospitalId,
      name,
      description: name
    }
    if (this.state.edit)
      data.id = this.id;
    ajax({
      url: `/depart/${this.state.edit
        ? 'update'
        : 'add'}`,
      type: 'POST',
      data,
      success: res => {
        if (res.code == 0) {
          this.setState({visible: false})
          $('#name').val('');
          this.getData(1);
        } else {
          message.error(res.message)
        }
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
    const {
      data,
      edit,
      pagination,
      visible,
      rowSelection,
      dltdisabled
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button onClick={this.eidtItem.bind(this)}>新建分组</Button>
      </Form>
      <Modal visible={visible} title={`${edit
          ? '编辑'
          : '新建'}分组`} onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem {...formItemLayout} label="分组名称">
            <Input placeholder="分组名称" id='name'/>
          </FormItem>
        </Form>
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
