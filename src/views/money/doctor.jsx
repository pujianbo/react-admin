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
        title: '医生',
        dataIndex: 'realName'
      }, {
        title: '医生职称',
        dataIndex: 'edu'
      }, {
        title: '科室',
        dataIndex: 'deptName'
      }, {
        title: '医院',
        dataIndex: 'hospName'
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
        render: (record) => {
          return <Link title='详情' to={`/money/doctor/detail/${record.uid}`}><Icon type="exclamation-circle-o"/></Link>
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
      url: `/financialManage/queryDoctorInfo`,
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
      url: '/financialManage/exportdoctorfinancial',
      data: this.query,
      filename: `医生财务.xls`
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
            <FormItem label="医生">
              <Input placeholder='搜索医生姓名或手机号' onChange={this.getValue.bind(this, 'name_phone')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="医生职称">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'edu')}>
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
          <Col span={8}>
            <FormItem label="所属科室">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'dept')}>
                <Option value="">全部</Option>
                {departList.map(item => <Option value={item.id}>{item.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        {
          localStorage.hospitalId
            ? null
            : <Row gutter={8}>
                <Col span={8}>
                  <FormItem label="所属医院">
                    <Input placeholder='搜索医院名称' onChange={this.getValue.bind(this, 'hospName')} style={{
                        width: '220px'
                      }}/>
                  </FormItem>
                </Col>
              </Row>
        }

      </Form>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
