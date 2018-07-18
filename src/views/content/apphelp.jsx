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
  Upload,
  message
} from 'antd';
import moment from 'moment';
import {validStr} from '../../tools'
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const stateList = ['全部', '已发布', '草稿', '屏蔽']
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {
      type: 0,
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
            sltname += item.title + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '问题标题',
        dataIndex: 'title'
      }, {
        title: '发布时间',
        render: (value, record) => moment(record.createTime).format(format)
      }, {
        title: '问题状态',
        render: (value, record) => stateList[record.state]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/content/apphelp/detail/${record.type}/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
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
    console.log(pagination);
    this.query.pageIndex = current
    ajax({
      url: `/useManual/getuseManualList`,
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

  //批量操作
  handleSlt(e) {
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        let url = `/useManual/batchShield`
        let type = 'POST'
        let data = {
          ids: _this.selectedRowID,
          status: 2
        }
        if (delType.indexOf('删除') > -1) {
          url = `/useManual/batchDel`;
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

    this.query.beginTime = startTime
    this.query.endTime = endTime

    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    this.query[name] = e.target.value
    this.getData(1)
  }

  //显示
  handleShow() {
    this.setState({visible: true})
  }
  //隐藏
  handleCancel() {
    this.setState({visible: false})
  }

  //文件上传
  uploadFile(file, fileList) {
    let data = new FormData();
    data.append('authFile', file);
    uploadFile({
      url: '/v1/import/exceltousemanual',
      data
    }, (res) => {
      if (res.code == 0) {
        const {total, failcount, faillist} = res.result
        if (failcount > 0) {
          Modal.error({
            title: '批量操作温馨提示：', content: <div>
                <p>共计数据{total}条；成功：{total - failcount}条、失败：{failcount}条</p>
                <p>失败项：<br/>{faillist.join('，')}</p>
              </div>
          });
        } else {
          message.success(`成功导入数据：${total}条`)
        }
        this.setState({visible: false, renzhen: false})
        this.getData(1)
      } else {
        message.error(res.message)
      }
    })
    return false
  }

  editHelp() {
    hashHistory.push(`/content/apphelp/edit/${this.query.type}`)
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
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
        <Button onClick={this.handleShow.bind(this)}>批量发布</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量屏蔽</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button onClick={this.editHelp.bind(this)}>新建问题</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="消息范围">
              <Select defaultValue="0" onChange={this.sltStatus.bind(this, 'type')} style={{
                  width: '220px'
                }}>
                <Option value="0">使用指南</Option>
                <Option value="1">特色功能</Option>
                <Option value="2">FAQ</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="问题标题">
              <Input placeholder='搜索问题标题' onChange={this.getValue.bind(this, 'title')} style={{
                  width: '220px'
                }}/>
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
            <FormItem label="问题状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'state')} style={{
                  width: '220px'
                }}>
                {
                  stateList.map((item, index) => {
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
      <Modal visible={visible} title="批量发布" onCancel={this.handleCancel.bind(this)} footer={null}>
        <Form>
          <FormItem {...formItemLayout} label="下载模板">
            <Button href={excelUrl + '/access/APP%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%E6%A8%A1%E6%9D%BF.xlsx'}>下载模板</Button>
            <span className='cgreen' style={{
                marginLeft: '10px'
              }}>(请务必按模板格式填写)</span>
          </FormItem>
          <FormItem {...formItemLayout} label="上传传模板">
            <Upload beforeUpload={this.uploadFile.bind(this)} accept={excelType} fileList={[]} >
              <Button>
                <Icon type="upload"/>
                选择文件
              </Button>
            </Upload>
          </FormItem>
        </Form>
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
