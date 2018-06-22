import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Row,
  Col,
  Icon,
  message
} from 'antd';
import moment from 'moment';
import {validStr} from '../../tools'
const {RangePicker} = DatePicker;
const {TextArea} = Input;
const FormItem = Form.Item;
const createForm = Form.create;

export default class datalist extends Component {
  constructor() {
    super();
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.query = {};
    this.state = {
      loading: false,
      type: 1,
      width: '60%',
      loadingMore: false,
      showLoadingMore: true,
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
        title: '项目名称',
        dataIndex: 'realName'
      }, {
        title: '创建时间',
        dataIndex: 'cteateDate',
        render: (value, record) => moment(record.cteateDate).format(format)
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <a title='编辑' onClick={this.showModal.bind(this, 2, value)}><Icon type="edit"/></a>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
  }

  showModal(type, value) {
    this.setState({visible: true, type})
  }
  hideModal() {
    this.setState({visible: false})
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
            url: `/users/del/${value.id}`,
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
          let url = `/users/batch-operate`;
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

  handleCancel() {
    this.setState({visible: false})
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
      type,
      visible,
      rowSelection,
      loadingMore,
      showLoadingMore,
      dltdisabled
    } = this.state
    return (<div className='notebox'>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
        <Button onClick={this.showModal.bind(this, 0)}>批量导入</Button>
        <Button onClick={this.showModal.bind(this, 1)}>新建项目</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="项目名称">
              <Input placeholder='搜索项目名称' onChange={this.getValue.bind(this, 'nickname')}/>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="创建时间">
              <RangePicker onChange={this.sltTime.bind(this, 0)} style={{
                  width: '220px'
                }}/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Modal visible={visible} title={['批量导入', '新建项目', '编辑项目'][type]} onCancel={this.handleCancel.bind(this)} footer={null}>
        {
          type == 0
            ? [
              <FormItem {...formItemLayout} label="下载模板">
                <Button href='http://tederenoss.oss-cn-beijing.aliyuncs.com/kys/%E5%8C%BB%E7%94%9F%E6%89%B9%E9%87%8F%E8%AE%A4%E8%AF%81%E6%A8%A1%E6%9D%BF.xlsx'>下载模板</Button>
                <span className='cgreen' style={{
                    marginLeft: '10px'
                  }}>(请务必按模板格式填写)</span>
              </FormItem>,
              <FormItem {...formItemLayout} label="上传文件">
                <Upload beforeUpload={this.ajaxFile.bind(this, 2)}>
                  <Button>
                    <Icon type="upload"/>
                    选择文件
                  </Button>
                </Upload>
              </FormItem>
            ]
            : <Demo/>
        }
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}

let Demo = React.createClass({
  getInitialState() {
    return {loading: false};
  },
  componentWillMount() {
    console.log('componentWillMount');
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return

      let data = this.props.form.getFieldsValue();
      console.log(data);
    })
  },
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
          span: 20
        }
      }
    };
    const {getFieldDecorator} = this.props.form
    return (<div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="项目名称">
          {getFieldDecorator('intro', {rules: [
            {
              required: true,
              message: '输入项目名称'
            }
          ],initialValue: 1213})(<Input placeholder="输入项目名称"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="项目说明">
          {
            getFieldDecorator('intro', {rules: [
              {
                required: true,
                message: '输入项目说明'
              }
            ],initialValue: 1213})(<TextArea placeholder="输入项目说明" autosize={{
                minRows: 2
              }}/>)
          }
        </FormItem>
        <FormItem>
          <div className='cgreen'>以下是分析结果</div>
        </FormItem>
        <FormItem {...formItemLayout} label="正常">
          {
            getFieldDecorator('normal', {rules: [
              {
                required: true,
                message: '输入正常的描述内容'
              }
            ],initialValue: 1213})(<TextArea placeholder="输入正常的描述内容" autosize={{
                minRows: 2
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="初级预警">
          {
            getFieldDecorator('primary', {rules: [
              {
                required: true,
                message: '输入初级预警的描述内容'
              }
            ],initialValue: 1213})(<TextArea placeholder="输入初级预警的描述内容" autosize={{
                minRows: 2
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="中级预警">
          {
            getFieldDecorator('middle', {rules: [
              {
                required: true,
                message: '输入中级预警的描述内容'
              }
            ],initialValue: 1213})(<TextArea placeholder="输入中级预警的描述内容" autosize={{
                minRows: 2
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="高级预警">
          {
            getFieldDecorator('senior', {rules: [
              {
                required: true,
                message: '输入高级预警的描述内容'
              }
            ],initialValue: ''})(<TextArea placeholder="输入高级预警的描述内容" autosize={{
                minRows: 2
              }}/>)
          }
        </FormItem>

        <FormItem style={{textAlign: 'right'}}>
          <Button onClick={()=>{history.back()}}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit">确定</Button>
        </FormItem>
      </Form>
    </div>);
  }
});
Demo = createForm()(Demo);
