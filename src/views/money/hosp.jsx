import React, {Component} from 'react'
import {Link} from 'react-router'
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
import {departList, jobTitles} from '../../tools'

const FormItem = Form.Item;
const Option = Select.Option;

export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.query = {
      name: '',
      status: -1,
      start: "1970-01-01 00:00:00",
      stop: "2099-01-01 00:00:00"
    };
    this.state = {
      loading: false,
      data: [],
      jobList: [],
      departList: [],
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
        title: '医院名',
        dataIndex: 'title'
      }, {
        title: '医院类型',
        render: (value, record) => hospitalType[0]
      }, {
        title: '经营类型',
        render: (value, record) => hospitalStyle[0]
      }, {
        title: '医院等级',
        render: (value, record) => hospitalLevel[0]
      }, {
        title: '收入',
        render: (value, record) => '500,000'
      }, {
        title: '支出',
        render: (value, record) => '900,000'
      }, {
        title: '提现',
        render: (value, record) => '500,000'
      }, {
        title: '余额',
        render: (value, record) => '900,000'
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

  //重置数据
  resetData() {
    console.log('resetData');
  }

  render() {
    const {
      data,
      pagination,
      loading,
      rowSelection,
      jobList,
      departList
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button>导出</Button>
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
                }} onChange={this.sltStatus.bind(this, 'title')}>
                <Option value="">全部</Option>
                {
                  hospitalType.map(item =>< Option value = {
                    item
                  } > {
                    item
                  }</Option>)
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="经营类型">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'title')}>
                <Option value="">全部</Option>
                {
                  hospitalStyle.map(item =>< Option value = {
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
            <FormItem label="医院等级">
              <Select defaultValue="" style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'title')}>
                <Option value="">全部</Option>
                {
                  hospitalLevel.map(item =>< Option value = {
                    item
                  } > {
                    item
                  }</Option>)
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
