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
import {validStr, roleList} from '../../tools'
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const statusList = ['全部', '已发布', '定时发布', '草稿']
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {
      //address: "",
      //startSendTime: "",
      //endSendTime: "",
      msgTitle: "",
      orderBy: "-createTime",
      pageIndex: 1,
      pageSize: 10,
      //parameter: {},
      roles: ""
    };
    this.state = {
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
            sltname += item.msgTitle + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
          return true
        }
      }
    };
    this.columns = [
      {
        title: '消息标题',
        dataIndex: 'msgTitle'
      }, {
        title: '消息范围',
        dataIndex: 'regionStr'
      }, {
        title: '接收角色',
        dataIndex: 'roleStr'
      }, {
        title: '发布时间',
        render: (value, record) => moment(record.createTime).format(format)
      }, {
        title: '消息状态',
        render: (value, record) => statusList[record.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/message/detail/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
    roleList().then(roleList => {
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
    this.query.pageIndex = current
    ajax({
      url: `/v1/announcement/query`,
      type: 'POST',
      data: this.query,
      success: res => {
        if (res.code == 0) {
          let {rowSelection} = this.state
          rowSelection.selectedRowKeys = []
          pagination.total = res.result.count
          this.setState({data: res.result.result, pagination, rowSelection})
        } else {
          // message.error(res.message)
        }
      }
    })
  }

  //批量操作
  handleSlt(e) {
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        let url = `/v1/announcement/batchoperate`
        let type = 'POST'
        let data = {
          status: 4,
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

  //选择状态
  sltStatus(name, value) {
    this.query[name] = value
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
    this.query.startSendTime = startTime
    this.query.endSendTime = endTime
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

  render() {
    const {
      roleList,
      data,
      pagination,
      visible,
      rowSelection,
      dltdisabled
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button>重置</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button href='#/message/edit'>发消息</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="消息标题">
              <Input placeholder='搜索消息标题' onChange={this.getValue.bind(this, 'msgTitle')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="消息范围">
              <Input placeholder='搜索城市名称' onChange={this.getValue.bind(this, 'address')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="接收角色">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'roles')} style={{
                  width: '220px'
                }}>
                <Option value="">全部</Option>
                {
                  roleList.map(item =>< Option value = {
                    item.id
                  } > {
                    item.roleName
                  }</Option>)
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="发布时间">
              <RangePicker onChange={this.sltTime.bind(this)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="消息状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                {
                  statusList.map((item, index) => {
                    return <Option value={index == 0
                        ? ''
                        : index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
