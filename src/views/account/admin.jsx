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
  message
} from 'antd';
import moment from 'moment';
import {validStr, roleList2} from '../../tools'
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.sltId = null;
    this.query = {};
    this.state = {
      loading: false,
      data: [],
      roleList: [],
      dltdisabled: true,
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      rowSelection: {
        selectedRowKeys: [],
        onChange: (selectedRowKeys, selectedRows) => {
          let {rowSelection} = this.state
          rowSelection.selectedRowKeys = selectedRowKeys
          this.setState({
            rowSelection,
            dltdisabled: selectedRowKeys.length == 0
          })
          let sltid = []
          let sltname = ''
          selectedRows.map(item => {
            sltid.push(item.id)
            sltname += item.nickname + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '昵称',
        dataIndex: 'nickname'
      }, {
        title: '手机号',
        dataIndex: 'phone'
      }, {
        title: '角色',
        render: (value, record) => record.role
          ? record.role.roleName
          : null
      }, {
        title: '创建时间',
        render: (value, record) => moment(record.cteateDate).format(format)
      }, {
        title: '登录时间',
        render: (value, record) => moment(record.lastLoginDate).format(format)
      }, {
        title: '账号状态',
        render: (value, record) => ['未激活', '正常', '冻结'][record.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/account/detail/admin/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
          <a title={record.status == 2
              ? '解冻'
              : '冻结'} onClick={this.edit.bind(
              this, value, record.status == 2
              ? '解冻'
              : '冻结')}><Icon type={record.status == 2
            ? 'unlock'
            : 'lock'}/></a>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
    roleList2().then(roleList => {
      this.setState({roleList})
    })
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
      url: `/admin/list-parameter?pageIndex=${current}&pageSize=${pageSize}`,
      type: 'POST',
      data: this.query,
      success: res => {
        if (res.code == 0) {
          let {rowSelection} = this.state
          rowSelection.selectedRowKeys = []
          pagination.total = res.result.count
          this.setState({data: res.result.list, pagination, rowSelection})
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
      content: `昵称：${value.nickname}`,
      onOk() {
        if (typeName == '删除') {
          ajax({
            url: `/user/del/${value.id}`,
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
        } else {
          let url = `/admin/batch-operate`;
          let type = 'POST';
          let data = {
            ids: [value.id],
            status: typeName.indexOf('解冻') > -1
              ? 1
              : 2
          }
          _this.mulDataHandle(url, type, data)
        }
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
        let url = `/admin/batch-del`
        let type = 'DELETE'
        let data = {
          ids: _this.selectedRowID
        }
        if (delType.indexOf('删除') == -1) {
          url = `/admin/batch-operate`;
          type = 'POST';
          data.status = delType.indexOf('解冻') > -1
            ? 1
            : 2
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

  //选择状态
  sltStatus(name, value) {
    this.query[name] = value
    if (name != 'addrole')
      this.getData(1)
  }

  //选择时间
  sltTime(type, time) {
    const startTime = time.length == 0
      ? ''
      : moment(time[0])
    const endTime = time.length == 0
      ? ''
      : moment(time[1])
    if (type == 0) { //创建时间
      this.query.startDate = startTime
      this.query.endDate = endTime
    } else { //登录时间
      this.query.loginStartDate = startTime
      this.query.loginendDate = endTime
    }
    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    this.query[name] = e.target.value
    this.getData(1)
  }

  //新建记录
  addAccount() {
    this.setState({visible: true})
  }

  handleCancel() {
    this.setState({visible: false})
  }
  handleOk(e) {
    e.preventDefault();
    const phone = $('#phone').val();
    if (!this.sltId) {
      message.warning('请选择角色')
      return
    }
    if (!validStr('phone', phone)) {
      message.warning('请正确填写手机号')
      return
    }
    if (this.tabIndex == 1) {
      ajax({
        url: '/admin/insertOne',
        type: 'POST',
        data: {
          phone,
          role: this.sltId
        },
        success: res => {
          if (res.code == 0) {
            this.setState({visible: false})
            $('#phone').val('');
            this.getData(1);
          } else {
            message.error(res.message)
          }
        }
      })
    }
  }

  sltRole(value) {
    this.sltId = value
    console.log(value);
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
      roleList,
      pagination,
      loading,
      visible,
      rowSelection,
      dltdisabled
    } = this.state
    const roleTag = roleList.map(item => {
      return <Option value={item.id}>{item.roleName}</Option>
    })
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量冻结</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量解冻</Button>
        <Button onClick={this.addAccount.bind(this)}>新建账户</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="用户昵称">
              <Input placeholder='搜索昵称或姓名' onChange={this.getValue.bind(this, 'nickname')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="手机号码">
              <Input placeholder='手机号' ref='phone' name='phone' maxLength='11' onChange={this.getValue.bind(this, 'phone')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="账号状态">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'status')}>
                <Option value="">全部</Option>
                <Option value="0">未激活</Option>
                <Option value="1">正常</Option>
                <Option value="2">冻结</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="创建时间">
              <RangePicker onChange={this.sltTime.bind(this, 0)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="登录时间">
              <RangePicker onChange={this.sltTime.bind(this, 1)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="用户角色">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'role')}>
                <Option value="">全部</Option>
                {roleTag}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Modal visible={visible} title="新建账户" onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem {...formItemLayout} label="角色" onChange={this.sltRole.bind(this)}>
            <Select placeholder='选择角色' style={{
                width: '220px'
              }} onChange={this.sltRole.bind(this)}>
              {roleTag}
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            <Input placeholder="输入新建用户的手机号" id='phone' maxLength='11' style={{
                width: '220px'
              }}/>
            <p className='cgreen'>确定后将发送随机登录密码到手机</p>
          </FormItem>
        </Form>
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
