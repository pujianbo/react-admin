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
  Upload,
  message
} from 'antd';
import moment from 'moment';
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
import {symptomList} from '../../../tools'

const start = "1970-01-01 00:00:00";
const stop = "2099-01-01 10:10:10";
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
export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.query = {
      name: '',
      status: -1,
      mainSymptomId: '-1',
      start,
      stop
    };
    this.state = {
      loading: false,
      data: [],
      symptomList: [],
      dltdisabled: true,
      visible: false,
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
            sltid.push(item.base.id)
            sltname += item.base.name + ','
          })
          this.selectedRowID = sltid;
          this.selectedRowName = sltname.slice(0, -1);
        }
      }
    };
    this.columns = [
      {
        title: '子症状',
        render: (value, record) => record.base.name
      }, {
        title: '所属主症状',
        render: (value, record) => record.main.map(item => item.name + '').toString()
      }, {
        title: '创建时间',
        render: (value, record) => moment(record.createTime).format(format)
      }, {
        title: '展示状态',
        render: (value, record) => ['删除', '屏蔽', '正常'][record.base.status]
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => {
          let title = record.base.status == 1
            ? '解锁'
            : '屏蔽'
          return <span className='links'>
            <Link title='详情' to={`/medicine/china/detail/${record.base.id}/2`}><Icon type="exclamation-circle-o"/></Link>
            <a title={title} onClick={this.edit.bind(this, value, title)}><Icon type={record.base.status == 1
              ? 'unlock'
              : 'lock'}/></a>
          </span>
        }
      }
    ];
  }

  componentWillMount() {
    symptomList().then(symptomList => {
      this.setState({symptomList})
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
      url: `/v1/tcm/minorsymptoms?pageIndex=${current}&pageSize=${pageSize}&parameter=${encodeURI(JSON.stringify(this.query))}`,
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

  //单个编辑
  edit(value, tipName) {
    //['删除', '屏蔽', '正常'][record.status]
    let data = {
      freeze: "理由",
      "ids": [value.base.id],
      "status": value.base.status == 1
        ? 2
        : 1
    }
    this.mulDataHandle({tipName, tipInfo: value.base.name, data})
  }

  //批量操作
  handleSlt(e) {
    const tipName = e.target.innerText;
    const json = {
      '删除': 0,
      '屏蔽': 1,
      '恢复': 2
    }
    let data = {
      freeze: "理由",
      "ids": this.selectedRowID,
      "status": json[tipName.slice(2)]
    }
    this.mulDataHandle({tipName, tipInfo: this.selectedRowName, data})
  }

  //批量操作数据
  mulDataHandle(config) {
    let _this = this;
    const {tipName, tipInfo, url, type, data} = config

    Modal.confirm({
      title: `您确定要${tipName}以下记录吗?`,
      content: `选择项：${tipInfo}`,
      onOk() {
        ajax({
          url: '/v1/tcm/minorsymptoms',
          type: 'PUT',
          data,
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

  //文件上传
  ajaxFile(file, fileList) {
    return;
    let url = '/doctor/batch-auth';
    let name = 'authFile'
    let data = new FormData();
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
  }

  //选择状态
  sltStatus(name, value) {
    this.query[name] = value
    this.getData(1)
  }

  //获取Input内容
  getValue(name, e) {
    if (name == 'mainSymptomId') {
      if (!e)
        e = -1
      this.query[name] = e
    } else {
      this.query[name] = e.target.value
    }
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
    this.query.start = startTime
    this.query.stop = endTime
    this.getData(1)
  }

  //显示Modal
  visiModal() {
    this.setState({visible: true})
  }
  //隐藏Modal
  handleCancel() {
    this.setState({visible: false})
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
      visible,
      rowSelection,
      symptomList,
      dltdisabled
    } = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量添加</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量屏蔽</Button>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量恢复</Button>
        <Button onClick={this.resetData.bind(this)}>重置</Button>
        <Button onClick={this.visiModal.bind(this)}>批量添加</Button>
        <Button href='#/medicine/china/symptomsecond/edit'>添加</Button>
        <Button>导出</Button>
      </Form>
      <Form layout="inline" className='frminput' id='lbl5'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="子症状">
              <Input placeholder='搜索子症状' onChange={this.getValue.bind(this, 'name')} style={{width: '220px'}}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="主症状">
              <Select placeholder="选择主症状" allowClear="true" onChange={this.getValue.bind(this, 'mainSymptomId')} showSearch="showSearch" style={{
                  width: 200
                }} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {symptomList.map(item => <Option value={item.id}>{item.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="展示状态">
              <Select defaultValue="-1" onChange={this.sltStatus.bind(this, 'status')} style={{width: '220px'}}>
                <Option value="-1">全部</Option>
                <Option value="2">正常</Option>
                <Option value="1">屏蔽</Option>
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
        </Row>
      </Form>
      <Modal visible={visible} title='批量添加' onCancel={this.handleCancel.bind(this)} footer={null}>
        <FormItem {...formItemLayout} label="下载模板">
          <Button href='http://tederenoss.oss-cn-beijing.aliyuncs.com/kys/%E5%8C%BB%E7%94%9F%E6%89%B9%E9%87%8F%E8%AE%A4%E8%AF%81%E6%A8%A1%E6%9D%BF.xlsx'>下载模板</Button>
          <span className='cgreen' style={{
              marginLeft: '10px'
            }}>(请务必按模板格式填写)</span>
        </FormItem>
        <FormItem {...formItemLayout} label="上传文件">
          <Upload beforeUpload={this.ajaxFile.bind(this)}>
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
