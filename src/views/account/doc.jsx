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
import {jobTitles} from '../../tools'
import moment from 'moment';
const {RangePicker} = DatePicker;

const FormItem = Form.Item;
const Option = Select.Option;

export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {};
    this.state = {
      data: [],
      dltdisabled: true,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      rowSelection: {
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
            sltname += item.realName + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      },
      jobList: []

    };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'realName'
      }, {
        title: '手机号',
        dataIndex: 'docPhone'
      }, {
        title: '医院',
        dataIndex: 'hospitalName'
      }, {
        title: '科室',
        dataIndex: 'deptName'
      }, {
        title: '职称',
        dataIndex: 'jobTitleDesc'
      }, {
        title: '认证状态',
        render: (value, record) => ['未认证', '已认证'][record.status]
      }, {
        title: '创建时间',
        render: (value, record) => moment(record.cteateDate).format(format)
      }, {
        title: '登录时间',
        render: (value, record) => record.lastLoginDate
          ? moment(record.lastLoginDate).format(format)
          : '-'
      }, {
        title: '账户状态',
        dataIndex: 'status',
        render: (value, record) => ['未激活', '正常', '冻结'][record.userStatus]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/account/detail/doctor/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
          <a title={record.userStatus == 2
              ? '解冻'
              : '冻结'} onClick={this.edit.bind(
              this, value, record.userStatus == 2
              ? '解冻'
              : '冻结')}><Icon type={record.userStatus == 2
            ? 'unlock'
            : 'lock'}/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
    jobTitles().then(jobList => {
      this.setState({jobList})
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
      url: `/doctor/list-parameter?pageIndex=${current}&pageSize=${pageSize}`,
      type: 'POST',
      data: this.query,
      success: res => {
        if (res.code == 0) {
          let {rowSelection} = this.state
          rowSelection.selectedRowKeys = []
          pagination.total = res.result.count
          this.setState({data: res.result.list, pagination, rowSelection})
        } else {
          message.error(res.message)
        }
      }
    })
  }

  //单个编辑

  edit(value, typeName) {
    let _this = this;
    Modal.confirm({
      title: `您确定要${typeName}以下记录吗?`,
      content: `姓名：${value.realName}`,
      onOk() {
        if (typeName == '删除') {
          ajax({
            url: `/doctor/del/${value.id}`,
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
          let url = `/doctor/batch-operate`;
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
        let url = `/doctor/batch-del`
        let type = 'DELETE'
        let data = {
          ids: _this.selectedRowID
        }
        if (delType.indexOf('删除') == -1) {
          url = `/doctor/batch-operate`;
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

  render() {
    const {data, pagination, rowSelection, dltdisabled, jobList} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量冻结</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量解冻</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="用户姓名">
              <Input placeholder='搜索用户姓名' onChange={this.getValue.bind(this, 'name')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="用户手机">
              <Input placeholder='搜索用户手机号' maxLength='11' onChange={this.getValue.bind(this, 'phone')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="医生职称">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'title')}>
                <Option value="">全部</Option>
                {
                  jobList.map(item =>< Option value = {
                    item.id
                  } > {
                    item.name
                  }</Option>)
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="医院名称">
              <Input placeholder='搜索医院名称' onChange={this.getValue.bind(this, 'hospitalName')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="科室名称">
              <Input placeholder='搜索科室' onChange={this.getValue.bind(this, 'department')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="认证状态">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'authStatus')}>
                <Option value="">全部</Option>
                <Option value="0">未认证</Option>
                <Option value="1">已认证</Option>
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
      </Form>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
