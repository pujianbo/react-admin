import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {
  Table,
  Button,
  Form,
  Input,
  Row,
  Col,
  Icon,
  Select,
  message
} from 'antd';
import {departList, jobTitles, unitMoney} from '../../tools'

const FormItem = Form.Item;
const Option = Select.Option;

export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.query = {
      pageIndex: 1,
      pageSize: 10
    };
    this.state = {
      loading: false,
      dltdisabled: true,
      data: [],
      jobList: [],
      departList: [],
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
        title: '医院名',
        dataIndex: 'hospName'
      }, {
        title: '医院类型',
        render: (record) => hospitalType[record.type]
      }, {
        title: '经营类型',
        render: (record) => hospitalStyle[record.style]
      }, {
        title: '医院等级',
        render: (record) => hospitalLevel[record.level]
      }, {
        title: '收入',
        render: (record) => unitMoney(record.income)
      }, {
        title: '支出',
        render: (record) => unitMoney(record.exp)
      }, {
        title: '提现',
        render: (record) => unitMoney(record.PutForward)
      }, {
        title: '余额',
        render: (record) => unitMoney(record.balance)
      }, {
        title: '操作',
        key: 'id',
        render: (value, record, index) => {
          return <Link title='详情' to={`/money/hosp/detail/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
        }
      }
    ];
  }

  componentWillMount() {
    departList().then(departList => {
      this.setState({departList})
    })
    jobTitles().then(jobList => {
      this.setState({jobList})
    })
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
      url: `/financialManage/queryHospitalInfo`,
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

  //重置数据
  resetData() {
    hashHistory.push('/goback')
  }

  //导出Excel
  saveExcel() {
    this.setState({loading: true})
    ajaxBlob({
      url: '/financialManage/exporthospitalfinancial',
      data: this.query,
      filename: `医院财务.xls`
    }, () => {
      this.setState({loading: false})
    })
  }

  render() {
    const {
      data,
      pagination,
      rowSelection,
      dltdisabled,
      loading,
      jobList,
      departList
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button onClick={this.saveExcel.bind(this)} loading={loading}>导出</Button>
      </Form>
      <Form layout="inline" className='frminput' id='lbl5'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="医院名">
              <Input placeholder='搜索医院名名称' onChange={this.getValue.bind(this, 'name')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="医院类型">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'type')}>
                <Option value="">全部</Option>
                {
                  hospitalType.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="经营类型">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'style')}>
                <Option value="">全部</Option>
                {
                  hospitalStyle.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="医院等级">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'level')}>
                <Option value="">全部</Option>
                {
                  hospitalLevel.map((item, index) => {
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
