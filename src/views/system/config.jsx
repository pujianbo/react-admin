import React, {Component} from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Icon,
  message
} from 'antd';
const FormItem = Form.Item;

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      visible: false
    };
    this.columns = [
      {
        title: '权限名称',
        dataIndex: 'rightName'
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
  }

  //获取列表
  getData(newpage) {
    ajax({
      url: `/privilege/list`,
      success: res => {
        if (res.code == 0) {
          this.setState({data: res.result})
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
      content: `角色名称：${value.rightName}`,
      onOk() {
        ajax({
          url: `/privilege/del/${value.id}`,
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
  editItem() {
    this.setState({visible: true})
  }

  handleCancel() {
    this.setState({visible: false})
  }

  handleOk(e) {
    e.preventDefault();
    const configname = $('#configname').val();

    if (configname == '') {
      message.warning('请填写权限名称')
      return
    }
    ajax({
      url: `/privilege/add`,
      type: 'POST',
      data: {
        name: configname
      },
      success: res => {
        if (res.code == 0) {
          message.success(res.message)
          this.setState({visible: false})
          this.getData(1)
          $('#configname').val('');
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
    const {data, visible} = this.state
    return (<div>
      <Form className='frmbtntop text-right'>
        <Button onClick={this.editItem.bind(this)}>添加权限</Button>
      </Form>
      <Modal visible={visible} title="角色管理" onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem {...formItemLayout} label="权限名称">
            <Input placeholder='输入权限名称' id='configname'/>
          </FormItem>
        </Form>
      </Modal>
      <Table columns={this.columns} dataSource={data} pagination={false}/>
    </div>)
  }
}
