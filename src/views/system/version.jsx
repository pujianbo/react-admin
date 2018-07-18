import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Icon,
  Select,
  Upload,
  message
} from 'antd';
import moment from 'moment';
const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

export default class datalist extends Component {
  constructor() {
    super();
    this.apkUrl = null;
    this.selectedRowID = '';
    this.selectedRowName = '';
    this.tabIndex = 1;
    this.type = 'android';
    this.state = {
      loading: false,
      data: [],
      dltdisabled: true,
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1
      }
    };
    this.columns = [
      {
        title: '设备类型',
        dataIndex: 'type',
        key: 'type',
        filters: [
          {
            text: 'Android',
            value: 'android'
          }, {
            text: 'pad',
            value: 'pad'
          }
        ],
        onFilter: (value, record) => record.type.indexOf(value) === 0
      }, {
        title: '版本序号',
        dataIndex: 'versionCode'
      }, {
        title: '版本名称',
        dataIndex: 'versionName'
      }, {
        title: '创建时间',
        render: (value, record) => moment(record.relDate).format(format)
      }, {
        title: '版本描述',
        dataIndex: 'versionDesc'
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <a title='下载' href={record.downloadUrl} target='_blank'><Icon type="download"/></a>
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
      url: `/apk/getApkVersionList?currentPage=${current}&pageSize=${pageSize}`,
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
      content: `版本序号：${value.versionName}`,
      onOk() {
        ajax({
          url: `/apk/delApkVersion/${value.id}`,
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

  //获取Input内容
  getValue(value, e) {
    console.log(value);
    console.log(e.target.value);
  }

  //选择状态
  sltStatus(value) {
    this.type = value
  }
  //新建账户弹框
  addVersion() {
    this.setState({visible: true})
  }

  handleCancel() {
    this.setState({visible: false})
  }

  handleOk(e) {
    e.preventDefault();
    const versionName = $('#versionName').val();
    const versionCode = $('#versionCode').val();
    const versionDesc = $('#versionDesc').val();
    if (versionName == '' || versionCode == '' || versionDesc == '') {
      message.warning('请填写完整信息')
      return
    }
    if (!this.apkUrl) {
      message.warning('请上传文件')
      return
    }
    this.setState({loading: true})
    let data = new FormData();
    data.append('apk', this.apkUrl);
    let otherData = {
      type: this.type,
      versionCode,
      versionDesc,
      versionName
    }
    data.append('data', JSON.stringify(otherData));
    uploadFile({
      url: `/apk/pub-newVersion`,
      data
    }, (res) => {
      this.setState({loading: false})
      if (res.code == 0) {
        $('.ant-upload-list-item .anticon-cross').click()
        $('#versionName').val('');
        $('#versionCode').val('');
        $('#versionDesc').val('');
        message.success(res.message)
        this.apkUrl = null;
        this.setState({visible: false})
        this.getData(1)
      } else {
        message.error(res.message)
      }
    })
  }

  //文件上传
  uploadApk(file, fileList) {
    this.apkUrl = file
    return false
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
    const {data, pagination, loading, visible, dltdisabled} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.addVersion.bind(this)}>发布版本</Button>
      </Form>
      <Modal visible={visible} title="发布版本" onCancel={this.handleCancel.bind(this)} confirmLoading={loading} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem {...formItemLayout} label="上传文件">
            <Upload beforeUpload={this.uploadApk.bind(this)} >
              <Button>选择文件</Button>
            </Upload>
          </FormItem>
          <FormItem {...formItemLayout} label="版本类型">
            <Select defaultValue="android" onChange={this.sltStatus.bind(this)}>
              <Option value="android">Android</Option>
              <Option value="pad">IOS</Option>
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="版本名称">
            <Input placeholder='输入版本名称' id='versionName'/>
          </FormItem>
          <FormItem {...formItemLayout} label="版本序号" id='apk'>
            <Input placeholder='输入版本序号 数字类型' id='versionCode'/>
          </FormItem>
          <FormItem {...formItemLayout} label="版本描述">
            <TextArea placeholder="输入版本描述" id='versionDesc' autosize={{
                minRows: 3
              }}/>
          </FormItem>
        </Form>
      </Modal>
      <Table columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
