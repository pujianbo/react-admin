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
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const statusList = ['正常', '屏蔽', '草稿']
const concluList = ['有', '无', '完整']
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
            sltname += item.name + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '检验项目',
        dataIndex: 'name'
      }, {
        title: '项目英文',
        dataIndex: 'code'
      }, {
        title: '标准值',
        dataIndex: 'sizeRelation'
      }, {
        title: '有无结论',
        render: (value, record) => concluList[record.conclusion]
      }, {
        title: '创建时间',
        render: (value, record) => moment(record.createTime).format(format)
      }, {
        title: '展示状态',
        render: (value, record) => statusList[record.showState]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/medicine/west/conclusion/detail/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
          <a title={record.showState == 0
              ? '屏蔽'
              : '恢复'} onClick={this.edit.bind(
              this, value, record.showState == 0
              ? '屏蔽'
              : '恢复')}><Icon type={record.showState == 0
            ? 'lock'
            : 'unlock'}/></a>
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
      url: `/stdbiocheck/queryByConditions`,
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

  //单个编辑
  edit(value, typeName) {
    let _this = this;
    Modal.confirm({
      title: `您确定要${typeName}以下记录吗?`,
      content: `昵称：${value.name}`,
      onOk() {
        _this.selectedRowID = [value.id]
        _this.funName(typeName)
      }
    });
  }

  //批量操作
  handleSlt(e) {
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        _this.funName(delType.slice(2))
      }
    });
  }

  //方法判断
  funName(name) {
    //默认是屏蔽
    let url = '/stdbiocheck/batchModify'
    let type = 'POST'
    let data = {
      freeze: '非法操作',
      ids: this.selectedRowID
    }
    if (name == '删除') {
      url = '/stdbiocheck/batchDel'
      data.status = 2
    } else if (name == '恢复') {
      url = '/stdbiocheck/batchRestore'
      data.status = 0
    }
    this.mulDataHandle(url, type, data)
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
    data.append('tempFile', file);
    uploadFile({
      url: '/stdbiocheck/batchAddStdbiocheck',
      data
    }, (res) => {
      if (res.code == 0) {
        const {total, failcount} = res.result
        message.success(`共计${total}数据；导入成功（${total - failcount}） 导入失败（${failcount}）`)
        this.setState({visible: false})
        this.getData(1)
      } else {
        message.error(res.message)
      }
    })
    return false
  }

  //重置数据
  resetData() {
    hashHistory.push('/goback')
  }

  //保存Excel
  saveExcel() {
    this.setState({loading: true})
    ajaxBlob({
      url: '/stdbiocheck/exportbycondition',
      filename: `西医智检结论.xls`,
      data: this.query
    }, res => {
      this.setState({loading: false})
    })
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
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量屏蔽</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量恢复</Button>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button href='#/medicine/west/conclusion/edit'>添加</Button>
        <Button onClick={this.handleShow.bind(this)}>批量添加</Button>
        <Button onClick={this.saveExcel.bind(this)} loading={loading}>导出</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="检验项目">
              <Input placeholder='搜索检验项目' onChange={this.getValue.bind(this, 'name')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="项目英文">
              <Input placeholder='输入项目英文缩写' onChange={this.getValue.bind(this, 'code')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="有无结论">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'conclusion')} style={{
                  width: '220px'
                }}>
                <Option value="">全部</Option>
                {
                  concluList.map((item, index) => {
                    return <Option value={index}>{item}</Option>
                  })
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
          <Col span={8}>
            <FormItem label="展示状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'showState')} style={{
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

      <Modal visible={visible} title="批量添加" onCancel={this.handleCancel.bind(this)} footer={null}>
        <Form>
          <FormItem {...formItemLayout} label="下载模板">
            <Button href={excelUrl + '/access/KYS%E6%A3%80%E9%AA%8C%E9%A1%B9%E7%9B%AE%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E6%A8%A1%E6%9D%BF.xlsx'}>下载模板</Button>
            <span className='cgreen' style={{
                marginLeft: '10px'
              }}>(请务必按模板格式填写)</span>
          </FormItem>
          <FormItem {...formItemLayout} label="上传传模板">
            <Upload beforeUpload={this.uploadFile.bind(this)} accept={excelType} fileList={[]}>
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
