import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
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
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const start = "1970-01-01 00:00:00";
const stop = "2099-01-01 00:00:00";
const billStatus = [
  '问诊',
  '智检报告解锁',
  '用药解锁',
  '单位购买规模',
  '单位购买话题',
  '单位购买文件',
  '单位购买通知',
  '零钱充值',
  '退款',
  '红包',
  '提现'
]
const payWay = ['支付宝', '微信', '苹果', '零钱', '银行卡']
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.query = {
      name: '',
      status: -1,
      start,
      stop
    };
    this.state = {
      loading: false,
      data: [],
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
            sltname += item.title + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '账单号',
        dataIndex: 'title'
      }, {
        title: '付款方',
        dataIndex: 'name'
      }, {
        title: '收款方',
        dataIndex: 'doc'
      }, {
        title: '账单金额￥',
        dataIndex: '45.90'
      }, {
        title: '账单类型',
        render: (value, record) => billStatus[2]
      }, {
        title: '交易方式',
        render: (value, record) => payWay[2]
      }, {
        title: '创建时间',
        dataIndex: 'cteateDate',
        render: (value, record) => moment(record.createTime).format(format)
      }, {
        title: '操作',
        key: 'id',
        render: (value, record, index) => {
          return <Link title='详情' to={`/money/bill/detail/${index + 1}/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
        }
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
      url: `/v1/tcm/healthcaresuggests?pageIndex=${current}&pageSize=${pageSize}&parameter=${encodeURI(JSON.stringify(this.query))}`,
      type: 'GET',
      // data: this.query,
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

  //选择状态
  sltStatus(name, value) {
    this.query[name] = value
    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    this.query[name] = e.target.value
    this.getData(1)
  }

  //选择时间
  sltTime(time) {
    const startTime = time.length == 0
      ? start
      : moment(time[0]).format(format)
    const endTime = time.length == 0
      ? stop
      : moment(time[1]).format(format)
    this.query.start = startTime
    this.query.stop = endTime
    this.getData(1)
  }

  //重置数据
  resetData() {
    console.log('resetData');
  }

  render() {
    const {data, pagination, loading, rowSelection} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button>导出</Button>
      </Form>
      <Form layout="inline" className='frminput' id='lbl5'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="账单号">
              <Input placeholder='搜索账单号' onChange={this.getValue.bind(this, 'name')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="付款方">
              <Input placeholder='搜索付款方昵称或手机号' onChange={this.getValue.bind(this, 'name')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="收款方">
              <Input placeholder='搜索收款方昵称或手机号' onChange={this.getValue.bind(this, 'name')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="收支类型">
              <Select defaultValue="-1" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                <Option value="-1">全部</Option>
                <Option value="2">支出</Option>
                <Option value="1">收入</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="账单类型">
              <Select defaultValue="-1" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                <Option value="-1">全部</Option>
                {
                  billStatus.map(item =>< Option value = {
                    item
                  } > {
                    item
                  }</Option>)
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="交易方式">
              <Select defaultValue="-1" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                <Option value="-1">全部</Option>
                {
                  payWay.map(item =>< Option value = {
                    item
                  } > {
                    item
                  }</Option>)
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="创建时间">
              <RangePicker onChange={this.sltTime.bind(this)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
