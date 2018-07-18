import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Modal,
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
const dynamicType = [
  '医站笔记',
  '转发笔记',
  '转发质检报告',
  '转发科普报告',
  '转发收藏',
  '转发自诊报告',
  '转发问答',
  '转发科普知识',
  '转发科室',
  '转发医院',
  '转发病例',
  '转发通知',
  '转发词条'
]
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {
      sendUser: '',
      dynamicTitle: '',
      dynamicType: 0,
      endTime: '',
      startTime: '',
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
            sltid.push(item.targetId)
            sltname += item.dynamicTitle + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '动态标题',
        dataIndex: 'dynamicTitle'
      }, {
        title: '发布人',
        dataIndex: 'sendUser'
      }, {
        title: '动态类型',
        render: (value, record) => dynamicType[record.dynamicType]
      }, {
        title: '点赞',
        render: (record) => record.likeNum || 0
      }, {
        title: '收藏',
        render: (record) => record.collectNum || 0
      }, {
        title: '评论',
        render: (record) => record.reviewNum || 0
      }, {
        title: '转发',
        render: (record) => record.forwardNum || 0
      }, {
        title: '创建时间',
        render: (record) => moment(record.createTime).format(format)
      }, {
        title: '操作',
        key: 'id',
        render: (record) => (<span className='links'>
          <Link title='详情' to={`/examine/doctorstation/detail/${record.dynamicType}/${record.targetId}`}><Icon type="exclamation-circle-o"/></Link>
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
      url: `/v1/hospitalmanage/content`,
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
        ajax({
          url: '/v1/hospitalmanage/delete',
          type: 'POST',
          data: {
            dynamicType: _this.query.dynamicType,
            ids: _this.selectedRowID
          },
          success: res => {
            if (res.code == 0) {
              message.success(res.message)
              _this.getData(1);
            } else {
              message.error(res.message)
            }
          }
        })
      }
    });
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
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="动态标题">
              <Input placeholder='搜索动态标题' onChange={this.getValue.bind(this, 'dynamicTitle')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="发布人">
              <Input placeholder='搜索发布人' onChange={this.getValue.bind(this, 'sendUser')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="动态类型">
              <Select defaultValue={0} onChange={this.sltStatus.bind(this, 'dynamicType')} style={{
                  width: '220px'
                }}>
                {
                  dynamicType.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem label="创建时间">
              <RangePicker onChange={this.sltTime.bind(this)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Table rowSelection={rowSelection} rowClassName='docstat_tr' columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
