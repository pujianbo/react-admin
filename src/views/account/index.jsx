import React, {Component} from 'react'
import {Link} from 'react-router'
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
  Tabs,
  Upload,
  message
} from 'antd';
import moment from 'moment';
import {validStr} from '../../tools'
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {};
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
            sltname += item.nickname + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '昵称',
        dataIndex: 'nickname'
      }, {
        title: '手机号',
        dataIndex: 'phone'
      }, {
        title: '医院',
        dataIndex: 'hospitalName',
        render: (value, record) => '无'
      }, {
        title: '创建时间',
        dataIndex: 'cteateDate',
        render: (value, record) => moment(record.cteateDate).format(format)
      }, {
        title: '登录时间',
        dataIndex: 'lastLoginDate',
        render: (value, record) => moment(record.lastLoginDate).format(format)
      }, {
        title: '账号状态',
        dataIndex: 'status',
        render: (value, record) => ['未激活', '正常', '冻结'][record.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/account/detail/user/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
          <a title={record.status == 2
              ? '解冻'
              : '冻结'} onClick={this.edit.bind(
              this, value, record.status == 2
              ? '解冻'
              : '冻结')}><Icon type={record.status == 2
            ? 'unlock'
            : 'lock'}/></a>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
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
    ajax({
      url: `/user/list-parameter?pageIndex=${current}&pageSize=${pageSize}`,
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
      content: `昵称：${value.nickname}`,
      onOk() {
        if (typeName == '删除') {
          ajax({
            url: `/user/del/${value.id}`,
            type: 'DELETE',
            success: res => {
              if (res.code == 0) {
                message.success(res.message)
                _this.getData(1);
              } else {
                message.error(res.message)
              }
            }
          })
        } else {
          let url = `/user/batch-operate`;
          let type = 'POST';
          let data = {
            ids: [value.id],
            status: typeName.indexOf('解冻') > -1
              ? 1
              : 2
          }
          _this.mulDataHandle(url, type, data)
        }
      }
    });
  }

  //文件上传
  uploadFile(file, fileList) {
    let data = new FormData();
    data.append('tempFile', file);
    uploadFile({
      url: '/user/batch-insert',
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

  //批量操作
  handleSlt(e) {
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        let url = `/user/batch-del`
        let type = 'DELETE'
        let data = {
          ids: _this.selectedRowID
        }
        if (delType.indexOf('删除') == -1) {
          url = `/user/batch-operate`;
          type = 'POST';
          data.status = delType.indexOf('解冻') > -1
            ? 1
            : 2
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
  sltStatus(value) {
    this.query.status = value
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
    if (type == 0) { //创建时间
      this.query.startDate = startTime
      this.query.endDate = endTime
    } else { //登录时间
      this.query.loginStartDate = startTime
      this.query.loginendDate = endTime
    }
    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    this.query[name] = e.target.value
    this.getData(1)
  }

  //新建记录
  addAccount() {
    this.setState({visible: true})
  }

  handleCancel() {
    this.setState({visible: false})
  }

  handleOk(e) {
    e.preventDefault();
    if (this.tabIndex == 1) {
      const phone = $('#phone').val();
      if (!validStr('phone', phone)) {
        message.warning('请正确填写手机号')
        return
      }
      ajax({
        url: '/user/insertOne',
        type: 'POST',
        data: phone,
        success: res => {
          if (res.code == 0) {
            message.success(res.message)
            this.setState({visible: false})
            $('#phone').val('');
            this.getData(1);
          } else {
            message.error(res.message)
          }
        }
      })
    }
  }

  tabChange(key) {
    this.tabIndex = key
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
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量冻结</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量解冻</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button onClick={this.addAccount.bind(this)}>新建账户</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="用户昵称">
              <Input placeholder='搜索昵称或姓名' onChange={this.getValue.bind(this, 'nickname')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="手机号码">
              <Input placeholder='手机号' ref='phone' name='phone' maxLength='11' onChange={this.getValue.bind(this, 'phone')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="账号状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this)} style={{
                  width: '220px'
                }}>
                <Option value="">全部</Option>
                <Option value="0">未激活</Option>
                <Option value="1">正常</Option>
                <Option value="2">冻结</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="创建时间">
              <RangePicker onChange={this.sltTime.bind(this, 0)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="登录时间">
              <RangePicker onChange={this.sltTime.bind(this, 1)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="医院名称">
              <Input placeholder='搜索医院名称' onChange={this.getValue.bind(this, 'hospitalName')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Modal visible={visible} title="新建账户" onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <Tabs defaultActiveKey="1" onChange={this.tabChange.bind(this)}>
            <TabPane tab="单个新增" key="1">
              <FormItem {...formItemLayout} label="手机号">
                <Input placeholder="输入新建用户的手机号" id='phone' maxLength='11' style={{
                    width: '180px'
                  }}/>
                <p className='cgreen'>确定后将发送随机登录密码到手机</p>
              </FormItem>
            </TabPane>
            <TabPane tab="批量新增" key="2">
              <FormItem {...formItemLayout} label="下载模板">
                <Button href='http://tederenoss.oss-cn-beijing.aliyuncs.com/kys/%E7%94%A8%E6%88%B7%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'>下载模板</Button>
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
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
