import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Tabs,
  Upload,
  Row,
  Col,
  Icon,
  Select,
  message
} from 'antd';
import moment from 'moment';
import {validStr, departList, jobTitles} from '../../tools'
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

export default class datalist extends Component {
  constructor(props) {
    super(props);
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.moveId = null;
    this.dataId = null;
    this.query = {
      department: this.props.params.groupname
    };
    this.state = {
      data: [],
      dltdisabled: true,
      visible: false,
      renzhen: false,
      move: false,
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
            sltname += item.realName + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      },
      departList: [],
      jobList: []
    };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'realName'
      }, {
        title: '手机号',
        dataIndex: 'docPhone'
      }, {
        title: '科室',
        dataIndex: 'deptName'
      }, {
        title: '职称',
        dataIndex: 'jobTitleDesc'
      }, {
        title: '行医资格',
        render: (value, record) => ['正常', '禁止'][record.qualification]
      }, {
        title: '创建时间',
        render: (value, record) => record.cteateDate
          ? moment(record.cteateDate).format(format)
          : null
      }, {
        title: '登录时间',
        render: (value, record) => record.lastLoginDate
          ? moment(record.lastLoginDate).format(format)
          : null
      }, {
        title: '账户状态',
        dataIndex: 'status',
        render: (value, record) => ['未激活', '正常', '冻结'][record.userStatus]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/account/detail/doctor/${record.id}`}><Icon type="exclamation-circle-o"/></Link>
          <a title={record.userStatus == 2
              ? '解冻'
              : '冻结'} onClick={this.edit.bind(
              this, value, record.userStatus == 2
              ? '解冻'
              : '冻结')}><Icon type={record.userStatus == 2
            ? 'unlock'
            : 'lock'}/></a>
          <a title='移动' onClick={this.editModal.bind(this, 1, value)}><Icon type="right-circle-o"/></a>
          <Link title='移除' onClick={this.edit.bind(this, value, '移除')}><Icon type="logout"/></Link>
          <Link title='认证' to={`/team/authen/${record.id}`}><Icon type="check-circle-o"/></Link>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
    departList().then(departList => {
      this.setState({departList})
    })
    jobTitles().then(jobList => {
      console.log(jobList);
      this.setState({jobList})
    })
  }

  componentDidMount() {
    if (this.query.department)
      $('#department').val(this.query.department)
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
      url: `/doctor/list-parameter?pageIndex=${current}&pageSize=${pageSize}`,
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
      content: `姓名：${value.realName}`,
      onOk() {
        if (typeName == '删除') {
          ajax({
            url: `/doctor/del/${value.id}`,
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
        } else if (typeName == '移除') {
          let url = `/doctor/batch-remove`;
          let type = 'POST';
          let data = {
            ids: [value.id]
          }
          _this.mulDataHandle(url, type, data)
        } else {
          let url = `/doctor/batch-operate`;
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
  //批量操作
  handleSlt(e) {
    const handType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${handType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        let url = `/doctor/batch-del`
        let type = 'DELETE'
        let data = {
          ids: _this.selectedRowID
        }
        if (handType.indexOf('冻') > -1) {
          url = `/doctor/batch-operate`;
          type = 'POST';
          data.status = handType.indexOf('解冻') > -1
            ? 1
            : 2
        }
        if (handType.indexOf('移除') > -1) {
          url = `/doctor/batch-remove`;
          type = 'POST';
        }
        if (handType.indexOf('禁') > -1) {
          url = `/doctor/batch-prohibit`;
          type = 'POST';
          data.status = handType.indexOf('禁止') > -1
            ? 1
            : 0
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
        this.setState({visible: false})
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
    if (name != 'addrole')
      this.getData(1)
  }

  //选择分组
  sltMove(value) {
    this.moveId = value
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
  editModal(type, value) {
    this.setState({
      visible: type != 2,
      move: type == 1,
      renzhen: type == 2
    })
    if (value.id) {
      this.dataId = value.id
    } else {
      this.dataId = null
    }
  }

  handleCancel() {
    this.setState({visible: false, renzhen: false})
  }

  handleOk(e) {
    e.preventDefault();
    if (this.state.move) { //处理移动
      if (this.moveId == null) {
        message.warning('请选择移动到的科室')
        return
      }
      let url = '/doctor/batch-move'
      let type = 'POST'
      let ids = this.selectedRowID
      if (this.dataId)
        ids = [this.dataId]
      let data = {
        id: this.moveId,
        ids
      }
      this.mulDataHandle(url, type, data)
      return
    }
    if (this.tabIndex == 1) {

      const phone = $('#phone').val();
      const realName = $('#name').val();
      if (!validStr('phone', phone)) {
        message.warning('请正确填写手机号')
        return
      }
      if (realName == '') {
        message.warning('请填写医生真实姓名')
        return
      }
      ajax({
        url: '/doctor/adddoctor',
        type: 'POST',
        data: {
          hospitalId: localStorage.hospitalId, //医院ID
          phone,
          realName
        },
        success: res => {
          if (res.code == 0) {
            this.setState({visible: false})
            $('#phone').val('');
            $('#name').val('');
            this.getData(1);
          } else {
            message.error(res.message)
          }
        }
      })
    }
  }

  renzhenOk() {
    this.setState({renzhen: false})
  }

  tabChange(key) {
    this.tabIndex = key
  }

  //文件上传
  ajaxFile(type, file, fileList) {
    let url = '/doctor/batch-auth';
    let name = 'authFile'
    let data = new FormData();
    if (type == 1) { //批量添加医生
      name = 'addCommonFile'
      url = '/doctor/batch-doctor';
    }
    data.append(name, file);
    uploadFile({
      url: url + `?id=${localStorage.hospitalId}`,
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
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 18
        }
      }
    };
    const {
      data,
      pagination,
      rowSelection,
      dltdisabled,
      visible,
      renzhen,
      departList,
      jobList,
      move
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        {/*<Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量移除</Button>*/}
        <Button type="danger" disabled={dltdisabled} onClick={this.editModal.bind(this, 1)}>批量移动</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量禁止</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量解禁</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量冻结</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量解冻</Button>

        <Button onClick={this.editModal.bind(this, 2)}>批量认证</Button>
        <Button onClick={this.editModal.bind(this, 0)}>添加医生</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="用户姓名">
              <Input placeholder='搜索用户姓名' onChange={this.getValue.bind(this, 'docname')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="用户手机">
              <Input placeholder='搜索用户手机号' maxLength='11' onChange={this.getValue.bind(this, 'phone')} style={{width: '220px'}}/>
            </FormItem>
          </Col>
          <Col span={8}></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="科室名称">
              <Input placeholder='搜索科室' id='department' onChange={this.getValue.bind(this, 'department')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="医生职称">
              <Select defaultValue='' style={{
                  width: '220px'
                }} onChange={this.sltStatus.bind(this, 'title')}>
                <Option value="">全部</Option>
                {
                  jobList.map(item => <Option value={item.id}>{item.name}</Option>)
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="行医资格">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'qualification')} style={{width: '220px'}}>
                <Option value="">全部</Option>
                <Option value="0">正常</Option>
                <Option value="1">禁止</Option>
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
            <FormItem label="账号状态">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'status')} style={{width: '220px'}}>
                <Option value="">全部</Option>
                <Option value="0">未激活</Option>
                <Option value="1">正常</Option>
                <Option value="2">冻结</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Modal visible={visible} title={move
          ? '移动人员'
          : '添加医生'
} onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          {
            move
              ? <FormItem {...formItemLayout} label="选择科室">
                  <Select placeholder='选择新科室' style={{
                      width: '140px'
                    }} onChange={this.sltMove.bind(this)}>
                    {departList.map(item =><Option value={item.id}>{item.name}</Option>)}
                  </Select>
                </FormItem>
              : <Tabs defaultActiveKey="1" onChange={this.tabChange.bind(this)}>
                  <TabPane tab="单个新增" key="1">
                    <FormItem {...formItemLayout} label="真实姓名">
                      <Input placeholder="输入真实姓名" id='name' style={{
                          width: '180px'
                        }}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="手机号">
                      <Input placeholder="输入新建用户的手机号" id='phone' maxLength='11' style={{
                          width: '180px'
                        }}/>
                      <p className='cgreen'>确定后将发送随机登录密码到手机</p>
                    </FormItem>
                  </TabPane>
                  <TabPane tab="批量新增" key="2">
                    <FormItem {...formItemLayout} label="下载医生模板">
                      <Button href='http://tederenoss.oss-cn-beijing.aliyuncs.com/kys/%E5%8C%BB%E9%99%A2%E5%8C%BB%E7%94%9F%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20.xlsx'>下载模板</Button>
                      <span className='cgreen' style={{
                          marginLeft: '10px'
                        }}>(请务必按模板格式填写)</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="上传医生文件">
                      <Upload beforeUpload={this.ajaxFile.bind(this, 1)} accept={excelType} fileList={[]}>
                        <Button>
                          <Icon type="upload"/>
                          选择文件
                        </Button>
                      </Upload>
                    </FormItem>
                  </TabPane>
                </Tabs>
          }
        </Form>
      </Modal>
      <Modal visible={renzhen} title='批量认证' onCancel={this.handleCancel.bind(this)} footer={null}>
        <FormItem {...formItemLayout} label="下载认证模板">
          <Button href='http://tederenoss.oss-cn-beijing.aliyuncs.com/kys/%E5%8C%BB%E7%94%9F%E6%89%B9%E9%87%8F%E8%AE%A4%E8%AF%81%E6%A8%A1%E6%9D%BF.xlsx'>下载模板</Button>
          <span className='cgreen' style={{
              marginLeft: '10px'
            }}>(请务必按模板格式填写)</span>
        </FormItem>
        <FormItem {...formItemLayout} label="上传认证文件">
          <Upload beforeUpload={this.ajaxFile.bind(this, 2)} accept={excelType} fileList={[]}>
            <Button>
              <Icon type="upload"/>
              选择文件
            </Button>
          </Upload>
        </FormItem>
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
