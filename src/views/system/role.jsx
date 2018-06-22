import React, {Component} from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Icon,
  Checkbox,
  message
} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

export default class datalist extends Component {
  constructor() {
    super();
    this.id = null
    this.configList = null
    this.plainOptions = []
    this.state = {
      data: [],
      visible: false,
      eidt: false,
      checkedList: [],
      indeterminate: true,
      checkAll: false
    };
    this.columns = [
      {
        title: '角色',
        dataIndex: 'roleName'
      }, {
        title: '角色权限',
        render: (value, record) => record.privilege
          ? record.privilege.map(item => item.rightName).join(',')
          : ''
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <a title='编辑' onClick={this.editItem.bind(this, value)}><Icon type="edit"/></a>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getConfig();
    this.getData()
  }

  //获取列表
  getData() {
    ajax({
      url: `/role/list/0`,
      success: res => {
        if (res.code == 0) {
          this.setState({data: res.result})
        } else {
          // message.error(res.message)
        }
      }
    })
  }

  //获取权限列表
  getConfig() {
    ajax({
      url: `/privilege/list`,
      async: false,
      success: res => {
        if (res.code == 0) {
          this.configList = res.result
          this.configList.map(item => this.plainOptions.push(item.rightName))
        } else {
          message.error('获取权限列表失败')
        }
      }
    })
  }

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.plainOptions.length),
      checkAll: checkedList.length === this.plainOptions.length
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked
        ? this.plainOptions
        : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  }
  //单个编辑
  edit(value, typeName) {
    let _this = this;
    Modal.confirm({
      title: `您确定要${typeName}以下记录吗?`,
      content: `角色名称：${value.roleName}`,
      onOk() {
        ajax({
          url: `/role/del/${value.id}`,
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
      }
    });
  }

  //项目操作
  editItem(value) {
    this.id = value.id
      ? value.id
      : null
    this.setState({
      visible: true,
      eidt: value.id
        ? true
        : false
    })
  }

  handleCancel() {
    this.setState({visible: false})
  }

  handleOk(e) {
    e.preventDefault();
    let url = `/role/add`
    let data = {}
    let ids = []
    const {eidt, checkedList} = this.state
    if (this.state.eidt) { //编辑
      checkedList.map(item => {
        const index = this.plainOptions.indexOf(item);
        ids.push(this.configList[index].id)
      })
      console.log(ids);
      url = '/role/modify'
      data = {
        id: this.id,
        ids
      }
    } else {
      const rolename = $('#rolename').val();
      if (rolename == '') {
        message.warning('请填写角色名称')
        return
      }
      data = {
        name: rolename,
        status: false,
        type: 0
      }
    }
    ajax({
      url,
      type: 'POST',
      data,
      success: res => {
        this.setState({visible: false})
        if (res.code == 0) {
          message.success(res.message)
          this.getData(1)
        } else {
          message.error(res.message)
        }
      }
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
      visible,
      eidt,
      indeterminate,
      checkAll,
      checkedList
    } = this.state
    return (<div className='rolebox'>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.editItem.bind(this)}>添加角色</Button>
      </Form>
      <Modal visible={visible} title="角色管理" onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)} className='form'>
          {
            eidt
              ? <FormItem {...formItemLayout} label="选择权限" id='apk'>
                  <div style={{
                      borderBottom: '1px solid #E9E9E9'
                    }}>
                    <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>
                      全选
                    </Checkbox>
                  </div>
                  <CheckboxGroup options={this.plainOptions} value={checkedList} onChange={this.onChange}/>
                </FormItem>
              : <FormItem {...formItemLayout} label="角色名称">
                  <Input placeholder='输入角色名称' id='rolename'/>
                </FormItem>
          }
        </Form>
      </Modal>
      <Table columns={this.columns} dataSource={data} pagination={false}/>
    </div>)
  }
}
