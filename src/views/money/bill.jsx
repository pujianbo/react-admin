import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
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
import {unitMoney} from '../../tools'
const FormItem = Form.Item;
const Option = Select.Option;
const start = "1970-01-01 00:00:00";
const stop = "2099-01-01 00:00:00";
const billStatus = [
  '全部',
  '零钱充值',
  '问诊',
  '红包',
  '质检报告解锁',
  '用药解锁',
  '单位购买规模',
  '单位购买话题',
  '单位购买通知',
  '单位购买文件',
  '退款',
  '提现'
]
const payWay = [
  '全部',
  '支付宝',
  '微信',
  '零钱',
  '苹果',
  '银行卡'
]
const billTypes = ['提现', '收入', '支出']
const methodList = ['全部', '收入', '支出']
export default class datalist extends Component {
  constructor(props) {
    super(props);
    const {type, from} = this.props.location.query
    this.query = {
      pageIndex: 1,
      pageSize: 10
    };
    if (from) {
      this.billmore = true
      this.query.type = Number(type)
      if (from == 1) {
        this.query.hosId = localStorage.hospitalId
      }
    }

    this.state = {
      loading: false,
      dltdisabled: true,
      data: [],
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
          selectedRows.map(item => {
            sltid.push(item.out_trade_no)
          })
          this.selectedRowID = sltid;
          return true
        }
      }
    };
    this.columns = [
      {
        title: '账单号',
        dataIndex: 'out_trade_no'
      }, {
        title: '付款方',
        dataIndex: 'nickname'
      }, {
        title: '收款方',
        dataIndex: 'payeeName'
      }, {
        title: '账单金额￥',
        render: (record) => <span className={record.method==1?'cred':'cgreen'}>{[, '+', '-'][record.method] + unitMoney(record.amount)}</span>
      }, {
        title: '账单类型',
        render: (record) => `${billStatus[record.type]}（${ ['申请中', '已完成'][record.status]}）`
      }, {
        title: '交易方式',
        render: (record) => payWay[record.channel]
      }, {
        title: '创建时间',
        render: (record) => moment(record.createDate).format(format)
      }, {
        title: '操作',
        key: 'id',
        render: (record, index) => {
          return <Link title='详情' to={`/money/bill/detail/${record.status}/${record.out_trade_no}`}><Icon type="exclamation-circle-o"/></Link>
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
      url: `/financialManage/${this.billmore
        ? 'queryFinancialInfo'
        : 'billList'}`,
      type: 'POST',
      data: this.query,
      success: res => {
        if (res.code == 0) {
          let {rowSelection} = this.state
          rowSelection.selectedRowKeys = []
          pagination.total = res.result.count
          this.setState({
            data: res.result.list || res.result.List,
            pagination,
            rowSelection
          })
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
    this.query.createDateStart = startTime
    this.query.createDateEnd = endTime
    this.getData(1)
  }

  //重置数据
  resetData() {
    hashHistory.push('/goback')
  }

  //保存Excel
  saveExcel() {
    this.setState({loading: true})
    ajaxBlob({
      url: '/financialManage/exportData',
      filename: `账单列表_${moment().format('MM月DD日HH时mm时ss分')}.xls`,
      data: {
        ids: this.selectedRowID
      }
    }, res => {
      this.setState({loading: false})
    })
  }

  render() {
    const {data, pagination, loading, dltdisabled, rowSelection} = this.state
    const {type} = this.props.location.query
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button disabled={dltdisabled} onClick={this.saveExcel.bind(this)} loading={loading}>导出</Button>
      </Form>
      <Form layout="inline" className='frminput' id='lbl5'>
        {
          type
            ? <Row gutter={8}>
                <Col span={8}>
                  <FormItem label="账单类型">
                    <Select defaultValue={Number(type)} onChange={this.sltStatus.bind(this, 'type')} style={{
                        width: '220px'
                      }}>
                      {
                        billTypes.map((item, index) => {
                          return <Option value={index}>{item}</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="创建时间">
                    <RangePicker onChange={this.sltTime.bind(this)} style={{
                        width: '220px'
                      }}/>
                  </FormItem>
                </Col>
              </Row>
            : [
              <Row gutter={8}>
                <Col span={8}>
                  <FormItem label="账单号">
                    <Input placeholder='搜索账单号' onChange={this.getValue.bind(this, 'out_trade_no')} style={{
                        width: '220px'
                      }}/>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="付款方">
                    <Input placeholder='搜索付款方昵称或手机号' onChange={this.getValue.bind(this, 'drawee')} style={{
                        width: '220px'
                      }}/>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="收款方">
                    <Input placeholder='搜索收款方昵称或手机号' onChange={this.getValue.bind(this, 'payee')} style={{
                        width: '220px'
                      }}/>
                  </FormItem>
                </Col>
              </Row>,
              <Row gutter={8}>
                <Col span={8}>
                  <FormItem label="收支类型">
                    <Select defaultValue={0} onChange={this.sltStatus.bind(this, 'method')} style={{
                        width: '220px'
                      }}>
                      {
                        methodList.map((item, index) => {
                          return <Option value={index}>{item}</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="账单类型">
                    <Select defaultValue={0} onChange={this.sltStatus.bind(this, 'type')} style={{
                        width: '220px'
                      }}>
                      {
                        billStatus.map((item, index) => {
                          return <Option value={index}>{item}</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="交易方式">
                    <Select defaultValue={0} onChange={this.sltStatus.bind(this, 'channel')} style={{
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
              </Row>,
              <Row gutter={8}>
                <Col span={8}>
                  <FormItem label="创建时间">
                    <RangePicker onChange={this.sltTime.bind(this)} style={{
                        width: '220px'
                      }}/>
                  </FormItem>
                </Col>
              </Row>
            ]
        }
      </Form>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
