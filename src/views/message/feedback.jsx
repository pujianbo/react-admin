import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
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
const {TextArea} = Input;
import moment from 'moment';
import {validStr} from '../../tools'
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const roleList = ['普通用户', '医生']
const statusList = ['忽略', '待处理', '已处理']
const typeList = ['全部', '功能异常', '体念优化', '其他建议']
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {
      pageIndex: 1,
      pageSize: 10
    };
    this.state = {
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
            sltname += item.fbUser + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '反馈内容',
        dataIndex: 'content'
      }, {
        title: '反馈类型',
        render: (value, record) => typeList[record.type]
      }, {
        title: '反馈用户',
        dataIndex: 'fbUser'
      }, {
        title: '反馈角色',
        render: (value, record) => roleList[record.status]
      }, {
        title: '反馈时间',
        render: (value, record) => moment(record.subTime).format(format)
      }, {
        title: '反馈状态',
        render: (value, record) => statusList[record.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/message/feedback/detail/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
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
    this.query.pageIndex = current
    ajax({
      url: `/v1/opinion/query`,
      type: 'POST',
      data: this.query,
      success: res => {
        if (res.code == 0) {
          let {rowSelection} = this.state
          rowSelection.selectedRowKeys = []
          pagination.total = res.result.count
          this.setState({data: res.result.result, pagination,rowSelection})
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
        let url = `/v1/opinion/ignoreopt`
        let type = 'PUT'
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
          this.setState({visible: false})
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
    this.query.startTime = startTime
    this.query.endTime = endTime
    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    console.log(name);
    this.query[name] = e.target.value
    this.getData(1)
  }

  handleCancel() {
    this.setState({visible: false})
  }

  handleOk(e) {
    e.preventDefault();
    const content = $('#content').val();
    if (content == '') {
      message.warning('请填写回复信息')
      return
    }
    let url = `/v1/opinion/batchopt`
    let type = 'PUT'
    let data = {
      freeze: content,
      ids: this.selectedRowID
    }
    this.mulDataHandle(url, type, data)
  }

  replyVisi() {
    this.setState({visible: true})
  }

  //重置数据
  resetData() {
    hashHistory.push('/goback')
  }
  render() {
    const {data, pagination, visible, rowSelection, dltdisabled} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量忽略</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.replyVisi.bind(this)}>批量处理</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="反馈内容">
              <Input placeholder='搜索反馈内容' onChange={this.getValue.bind(this, 'content')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="反馈类型">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'type')} style={{
                  width: '220px'
                }}>
                {
                  typeList.map((item, index) => {
                    return <Option value={index == 0
                        ? ''
                        : index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="反馈用户">
              <Input placeholder='搜索反馈用户' onChange={this.getValue.bind(this, 'fbUser')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="反馈角色">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'fbRole')} style={{
                  width: '220px'
                }}>
                <Option value=''>全部</Option>
                {
                  roleList.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="反馈时间">
              <RangePicker onChange={this.sltTime.bind(this)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="反馈状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                <Option value=''>全部</Option>
                {
                  statusList.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Modal visible={visible} title="回复用户反馈" onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem label="回复内容">
            <TextArea placeholder="输入回复内容" id='content' autosize={{
                minRows: 3
              }}/>
          </FormItem>
        </Form>
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
