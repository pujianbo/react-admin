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

const payWay = ['全部', '支付宝', '微信', '零钱']
const typeList = ['全部', '病情咨询', '在线问诊']
const orderStatus = [
  '全部',
  '已取消',
  '退款成功',
  '待退款',
  '待支付',
  '待接诊',
  '接诊中',
  '待评价',
  '已完成'
]
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.query = {
      name: '',
      status: '',
      pageIndex: 1,
      pageSize: 10
    };
    this.state = {
      loading: false,
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1
      }
    };
    this.columns = [
      {
        title: '问诊单号',
        dataIndex: 'order_num'
      }, {
        title: '下单人',
        dataIndex: 'nickname'
      }, {
        title: '接诊医生',
        dataIndex: 'real_name'
      }, {
        title: '问诊类型',
        render: (value, record) => typeList[record.type]
      }, {
        title: '支付方式',
        render: (value, record) => payWay[record.channel]
      }, {
        title: '支付金额￥',
        render: (value, record) => (record.price / 100).toFixed(2)
      }, {
        title: '下单时间',
        render: (value, record) => moment(record.create_date).format(format)
      }, {
        title: '订单状态',
        render: (value, record) => orderStatus[record.status + 4]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => {
          return <Link title='详情' to={`/order/inquiry/detail/${record.type}/${record.order_num}`}><Icon type="exclamation-circle-o"/></Link>
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
    this.query.pageIndex = current
    ajax({
      url: `/profileCard/pageList`,
      type: 'POST',
      data: this.query,
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
      ? ''
      : moment(time[0]).format()
    const endTime = time.length == 0
      ? ''
      : moment(time[1]).format()
    this.query.createDateStart = startTime
    this.query.createDateEnd = endTime
    this.getData(1)
  }

  //重置数据
  resetData() {
    console.log('resetData');
  }

  render() {
    const {data, pagination, loading} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
      </Form>
      <Form layout="inline" className='frminput' id='lbl5'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="问诊单号">
              <Input placeholder='搜索问诊单号' onChange={this.getValue.bind(this, 'orderNum')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="下单人">
              <Input placeholder='搜索下单人' onChange={this.getValue.bind(this, 'nickname')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="接诊医生">
              <Input placeholder='搜索接诊医生' onChange={this.getValue.bind(this, 'realName')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="问诊类型">
              <Select defaultValue="全部" onChange={this.sltStatus.bind(this, 'type')} style={{
                  width: '220px'
                }}>
                {
                  typeList.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="支付方式">
              <Select defaultValue="全部" onChange={this.sltStatus.bind(this, 'channel')} style={{
                  width: '220px'
                }}>
                {
                  payWay.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="下单时间">
              <RangePicker onChange={this.sltTime.bind(this)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="订单状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'status')} style={{
                  width: '220px'
                }}>
                {
                  orderStatus.map((item, index) => {
                    return <Option value={index == 0
                        ? ''
                        : index - 4}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
