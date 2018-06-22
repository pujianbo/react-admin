import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  List,
  Row,
  Col,
  Icon,
  Avatar,
  Spin,
  Collapse,
  message
} from 'antd';
import moment from 'moment';
import {validStr} from '../../tools'
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

function number(num) {
  return Math.floor(Math.random() * num)
}
function addData() {
  const commentData = [];
  for (let i = 1; i < 4; i++) {
    commentData.push({
      user: {
        name: '测试用户' + number(10),
        time: `2018.${number(10)}.${number(10)}`,
        content: '医生说的就是这样了'
      },
      comment: [
        {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }, {
          name: `病患${number(100)}号`,
          content: '感谢医生分享'
        }
      ]
    });
  }
  return commentData
}

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
      commentData: addData(),
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
        title: '标题',
        dataIndex: 'nickname'
      }, {
        title: '作者',
        dataIndex: 'phone'
      }, {
        title: '创建时间',
        dataIndex: 'cteateDate',
        render: (value, record) => moment(record.cteateDate).format(format)
      }, {
        title: '最近编辑',
        dataIndex: 'lastLoginDate',
        render: (value, record) => moment(record.lastLoginDate).format(format)
      }, {
        title: '私密性',
        render: (value, record) => '公开'
      }, {
        title: '阅读数',
        render: (value, record) => 233
      }, {
        title: '评论',
        render: (value, record) => <a title='查看评论' style={{borderBottom: '1px solid'}} onClick={this.showModal.bind(this, value, 1)}>23</a>
      }, {
        title: '点赞',
        render: (value, record) => 45
      }, {
        title: '收藏',
        render: (value, record) => 34
      }, {
        title: '推荐',
        render: (value, record) => 44
      }, {
        title: '操作',
        key: 'id',
        render: (value, record) => (<span className='links'>
          <a title='手机预览' onClick={this.showModal.bind(this, value, 2)}><Icon type="mobile"/></a>
          <a title='推荐' onClick={this.edit.bind(this, value, '推荐')}><Icon type="like-o"/></a>
          <a title='删除' onClick={this.edit.bind(this, value, '删除')}><Icon type="delete"/></a>
        </span>)
      }
    ];
  }

  componentWillMount() {
    this.getData()
  }

  showModal(value, type) {
    this.setState({
      visible: true,
      type
    })
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

  commentDel(item) {
    console.log(item);
  }

  onLoadMore = () => {
    this.setState({loadingMore: true});

    let {commentData} = this.state
    commentData = commentData.concat(addData())

    setTimeout(() => {
      this.setState({loadingMore: false, commentData});
    }, 1000)
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
      commentData,
      dltdisabled
    } = this.state
    const loadMore = showLoadingMore
      ? (<div style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px'
        }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>)
      : null;
    return (<div className='notebox'>
      <Form className='frmbtntop text-right'>
        <Button type="danger" disabled={dltdisabled} onClick={this.handleSlt.bind(this)}>批量删除</Button>
      </Form>
      <Form layout="inline" className='frminput'>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="笔记标题">
              <Input placeholder='输入笔记标题' onChange={this.getValue.bind(this, 'nickname')}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="作者昵称">
              <Input placeholder='输入作者昵称' onChange={this.getValue.bind(this, 'nickname')}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="内容搜索">
              <Input placeholder='输入内容关键字' onChange={this.getValue.bind(this, 'nickname')}/>
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
      <Modal wrapClassName='notemodal' visible={visible} title={type==1?'查看评论':'手机预览'} onCancel={this.hideModal.bind(this)} footer={null} width={type == 1
        ? '60%'
        : '400px'}>
        {
          type==1?
        <List className='notescroll' itemLayout="horizontal" size="large" loadMore={loadMore} dataSource={commentData} renderItem={item => (<List.Item actions={[<a title='删除' onClick={this.commentDel.bind(this, item)}><Icon type="delete"/></a>
              ]}>
            <List.Item.Meta avatar={<Avatar size = 'large' src = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} description={<table className = 'notecomment' > <tr>
                <td>
                  <div>{item.user.name}</div>
                  <div className='cgary'>{item.user.time}</div>
                </td>
                <td>
                  <div className='item'>{item.user.content}</div>
                  <div className='item moeny'>附件，收藏或红包等，只做展示</div>
                  <div className='item imglist'>
                    <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                    <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                    <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                    <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>评论回复</td>
                <td>
                  <ul className='replay'>
                    <li>{item.comment[0].name}：{item.comment[0].content}</li>
                    <li>{item.comment[1].name}：{item.comment[1].content}</li>
                    <Collapse bordered={false}>
                      <Panel header={<div> {
                          `${item.comment[2].name}：${item.comment[2].content}`
                        }
                        <span className='cgreen' style={{
                            marginLeft: '10px'
                          }}>查看全部</span>
                      </div>} key="1" style={{
                          border: 0
                        }} showArrow={false}>
                        {
                          item.comment.map((cmt, index) => {
                            if (index < 3)
                              return
                            return <li>{cmt.name}：{cmt.content}</li>
                          })
                        }
                      </Panel>
                    </Collapse>
                  </ul>
                </td>
              </tr>
            </table>}/>
        </List.Item>)}/>:<iframe src='http://m.tederen.com/#/?_k=514jej' />}
      </Modal>
      <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={pagination} onChange={this.handleTableChange.bind(this)}/>
    </div>)
  }
}
