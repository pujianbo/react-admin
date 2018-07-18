import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Icon,
  message
} from 'antd';
import moment from 'moment';
const {TextArea} = Input;
const FormItem = Form.Item;

export default class datalist extends Component {
  constructor() {
    super();
    this.id = null;
    this.state = {
      loading: false,
      data: [],
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1
      }
    };
    this.columns = [
      {
        title: '用户昵称',
        render: (value, record) => record.user?record.user.nickname:null
      }, {
        title: '用户手机',
        render: (value, record) => record.user?record.user.phone:null
      }, {
        title: '反馈时间',
        render: (value, record) => moment(record.user?record.user.cteateDate:null).format(format)
      }, {
        title: '反馈内容',
        render: (value, record) => <p style={{
              maxWidth: '20vw'
            }}>{record.content}</p>
      }, {
        title: '回复内容',
        render: (value, record) => <p style={{
              maxWidth: '20vw'
            }}>{record.reply}</p>
      }, {
        title: '操作',
        key: 'action',
        render: (txt, record) => (<span className='links'>
          <a title='回复' onClick={this.replay.bind(this, txt, '删除')}><Icon type="form"/></a>
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
      url: `/feedback/backlist?pageIndex=${current}&pageSize=${pageSize}&orderBy=id`,
      type: 'POST',
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
  //回复
  replay(value) {
    this.id = value.id
    this.setState({visible: true})
  }
  handleCancel() {
    this.setState({visible: false})
  }
  handleOk(e) {
    e.preventDefault();
    const content = $('#content').val();
    if (content == '') {
      message.warning('请填写回复的内容')
      return
    }
    ajax({
      url: `/feedback/reply?id=${this.id}&content=${content}`,
      type: 'POST',
      success: res => {
        if (res.code == 0) {
          this.setState({visible: false})
          message.success(res.message)
          this.getData(1)
          $('#content').val('');
        } else {
          message.error(res.message)
        }
      }
    })
  }

  render() {
    const {data, pagination, loading, visible} = this.state
    return (<div>
      <Modal visible={visible} title="回复用户反馈" onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem label="回复内容">
            <TextArea placeholder="输入回复内容" id='content' autosize={{
                minRows: 3
              }}/>
          </FormItem>
        </Form>
      </Modal>
      <Table columns={this.columns} dataSource={data} pagination={pagination} loading={loading} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
