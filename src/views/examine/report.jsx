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
  Radio,
  message
} from 'antd';
import moment from 'moment';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const typeList = ['用户', '评论']
const statusList = ['忽略', '待处理', '已处理']
export default class datalist extends Component {
  constructor() {
    super();
    this.day = 1;
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {
      pageIndex: 1,
      pageSize: 10
    };
    this.state = {
      loading: false,
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
            sltname += item.toNickname + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '被举报人',
        render: (value, record) => record.type == 1
          ? (record.review || record.forwardReview || record.noticeReview || {}).nickname
          : record.toNickname
      }, {
        title: '举报类型',
        render: (value, record) => typeList[record.type]
      }, {
        title: '被举报内容',
        dataIndex: 'content'
      }, {
        title: '举报人',
        dataIndex: 'fromNickname'
      }, {
        title: '举报时间',
        render: (value, record) => moment(record.createDate).format(format)
      }, {
        title: '处理状态',
        render: (value, record) => statusList[record.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/examine/report/detail/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
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
      url: `/report/query`,
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
  sltDay(e) {
    this.day = e.target.value.slice(0, 1)
  }

  //批量操作
  handleSlt(e) {
    const plainOptions = ['1天', '3天', '5天'];
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`, content: <div>选择项：{this.selectedRowName}{
          delType.indexOf('冻结') > -1
            ? <div style={{
                  marginTop: '10px'
                }}>冻结天数：<RadioGroup options={plainOptions} defaultValue={plainOptions[0]} onChange={this.sltDay.bind(this)}/></div>
            : null
        }</div>,
      onOk() {
        let url = `/report/operation`
        let type = 'POST'
        let data = {
          ids: _this.selectedRowID,
          type: 0 //0 忽略 1 删除评论 2 冻结账号
        }
        if (delType.indexOf('删除') > -1) {
          data.type = 1
        } else if (delType.indexOf('冻结') > -1) {
          data.type = 2
          data.dayNum = _this.day
          data.freeze = '非法操作'
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
    this.query.reportDateStart = startTime
    this.query.reportDateEnd = endTime

    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    this.query[name] = e.target.value
    this.getData(1)
  }

  //重置数据
  resetData() {
    hashHistory.push('/goback')
  }
  render() {
    const {
      data,
      pagination,
      loading,
      visible,
      rowSelection,
      dltdisabled
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量忽略</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量冻结</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="被举报人">
              <Input placeholder='被举报人' onChange={this.getValue.bind(this, 'toNickname')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="举报类型">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'type')} style={{
                  width: '220px'
                }}>
                <Option value="">全部</Option>
                {
                  typeList.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="举报人">
              <Input placeholder='举报人' onChange={this.getValue.bind(this, 'fromNickname')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="举报时间">
              <RangePicker onChange={this.sltTime.bind(this)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="处理状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                <Option value="">全部</Option>
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

      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
