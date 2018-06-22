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
  message
} from 'antd';
import moment from 'moment';
const {RangePicker} = DatePicker;
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
      data: [],
      dltdisabled: true,
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
            sltname += item.nickname + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '医院名称',
        render: (value, record) => record.hospital.name
      }, {
        title: '管理员手机号',
        dataIndex: 'phone'
      }, {
        title: '医院类型',
        render: (value, record) => hospitalType[record.hospital.type]
      }, {
        title: '经营类型',
        render: (value, record) => hospitalStyle[record.hospital.style]
      }, {
        title: '医院等级',
        render: (value, record) => hospitalLevel[record.hospital.level]
      }, {
        title: '创建时间',
        render: (value, record) => moment(record.cteateDate).format(format)
      }, {
        title: '登录时间',
        render: (value, record) => moment(record.lastLoginDate).format(format)
      }, {
        title: '账号状态',
        dataIndex: 'status',
        render: (value, record) => ['未激活', '正常', '冻结'][record.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <Link title='详情' to={`/account/hospdetail/${record.id}/1`}><Icon type="exclamation-circle-o"/></Link>
          <a title={record.status == 2
              ? '解冻'
              : '冻结'} onClick={this.edit.bind(
              this, value, record.status == 2
              ? '解冻'
              : '冻结')}><Icon type={record.status == 2
            ? 'unlock'
            : 'lock'}/></a>
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
      url: `/hospital/list-parameter?pageIndex=${current}&pageSize=${pageSize}`,
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

  //单个编辑

  edit(value, typeName) {
    let _this = this;
    Modal.confirm({
      title: `您确定要${typeName}以下记录吗?`,
      content: `昵称：${value.nickname}`,
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
        } else {
          let url = `/hospital/batch-operate`;
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
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`,
      content: `选择项：${this.selectedRowName}`,
      onOk() {
        let url = `/hospital/batch-del`
        let type = 'DELETE'
        let data = {
          ids: _this.selectedRowID
        }
        if (delType.indexOf('删除') == -1) {
          url = `/hospital/batch-operate`;
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
  sltStatus(name, value) {
    this.query[name] = value
    if (name != 'addrole')
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


  render() {
    const {data, pagination, rowSelection, dltdisabled} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量冻结</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量解冻</Button>
        <Button href='#/account/hospedit'>新建账户</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="医院名称">
              <Input placeholder='搜索医院名称' onChange={this.getValue.bind(this, 'hospitalName')} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="管理员手机号">
              <Input placeholder='管理员手机号' maxLength='11' onChange={this.getValue.bind(this, 'phone')} style={{width: '192px'}}/>
            </FormItem>
          </Col>
          <Col span={8}></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="医院类型">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'type')} style={{width: '220px'}}>
                <Option value="">全部</Option>
                {
                  hospitalType.map((item, index) => {
                    return (<Option value={index}>{item}</Option>)
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="经营类型">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'style')} style={{width: '220px'}}>
                <Option value="">全部</Option>
                {
                  hospitalStyle.map((item, index) => {
                    return (<Option value={index}>{item}</Option>)
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="医院等级">
              <Select defaultValue="" onChange={this.sltStatus.bind(this, 'level')} style={{width: '220px'}}>
                <Option value="">全部</Option>
                {
                  hospitalLevel.map((item, index) => {
                    return (<Option value={index}>{item}</Option>)
                  })
                }
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
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
