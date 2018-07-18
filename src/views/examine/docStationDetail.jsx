import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import moment from 'moment'
import {
  Button,
  Avatar,
  Icon,
  List,
  Modal,
  message,
  Collapse
} from 'antd';

const Panel = Collapse.Panel;
import imgDown from '../../img/icon/down.png'

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: {},
      msg: null,
      loading: true,
      loadingMore: true
    }
  }

  componentWillMount() {
    this.getData()
  }

  getData() {
    const {id} = this.props.params
    ajax({
      url: `/v1/hospitalmanage/detail/${id}`,
      async: false,
      success: res => {
        if (res.result && res.result.detail) {
          this.setState({result: res.result})
        } else {
          this.setState({msg: '未查询到信息'})
        }
      }
    })
  }

  delete(item) {
    let _this = this;
    const {id, type} = this.props.params
    let tip = '医站动态'
    let url = '/v1/hospitalmanage/delete'
    let aType = 'POST'
    let data = {
      dynamicType: type,
      ids: [id]
    }
    if (item.id) {
      tip = '评论'
      url = `/review/del/${item.id}`
      aType = 'GET'
      data = null
    }

    Modal.confirm({
      title: `温馨提示`,
      content: `您确定要删除此条${tip}吗?`,
      onOk() {
        console.log(121);
        ajax({
          url,
          type: aType,
          data,
          success: res => {
            console.log(1212);
            if (res.code == 0) {
              message.success(res.message)
              if (item.id) {
                _this.getData()
              } else {
                hashHistory.go(-1)
              }
            } else {
              message.error(res.message)
            }
          }
        })
      }
    });
  }

  onLoadMore = () => {
    this.setState({loadingMore: true});
  }

  render() {
    const {msg, result, loading, loadingMore, showLoadingMore} = this.state
    const {detail, reviewsList} = result || {}
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
    return (<div className='tbdetail bjdetail'>
      {
        msg
          ? <p className='cred'>{msg}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>
                <Button type='danger' onClick={this.delete.bind(this)}>删除</Button>
              </div>
              <h5 style={{
                  fontSize: '18px'
                }}>{detail.title}</h5>
              <div className='bjdoctor'>
                <Avatar icon="user" src={detail.iconUrl}/>
                <span style={{
                    marginLeft: '10px'
                  }}>{detail.nikename}</span>
                <ul className='lineblock statuslist'>
                  <li>{moment(detail.pubDate).format(format + ' ddd')}</li>
                  <li>阅读 {detail.seeNum || 0}</li>
                  <li>点赞 {detail.likeNum || 0}</li>
                  <li>收藏 {detail.collectNum || 0}</li>
                  <li>评论 {detail.reviewNum || 0}</li>
                  <li>转发 {detail.forwardNum || 0}</li>
                </ul>
              </div>
              <div className='bjcontent'>
                <div className="bjcdetail" dangerouslySetInnerHTML={{
                    __html: detail.content
                  }}/>
                <div className="morelink">
                  <span>
                    <i>展开全文</i>
                    <img src={imgDown}/></span>
                </div>
                {
                  detail.noteItem
                    ? <ul className="files">
                        {
                          detail.noteItem.map(i => {
                            const item = i.item
                            return (<li>
                              <h5>{item.title}</h5>
                              <p><Icon type="file-text"/>
                                <span style={{
                                    paddingLeft: '4px',
                                    paddingRight: '10px'
                                  }}>{item.nickname}</span>
                                {moment(item.createDate).format('YYYY年MM月DD日')}</p>
                            </li>)
                          })
                        }
                      </ul>
                    : null
                }
              </div>
              <div className="btnbar">
                评论
                <span>时间降序</span>
              </div>
              <List className='notescroll' itemLayout="horizontal" size="large" loadMore={loadMore} dataSource={reviewsList} renderItem={item => (<List.Item actions={[<a title='删除' onClick={this.delete.bind(this, item)}><Icon type="delete"/></a>
                    ]}>
                  <List.Item.Meta avatar={<Avatar size = 'large' src = {
                      item.iconUrl
                    } />} description={<table className = 'notecomment' > <tr>
                      <td>
                        <div>{item.name}</div>
                        <div className='cgary'>{moment(item.createTime).format(format)}</div>
                        <div className='item' dangerouslySetInnerHTML={{
                            __html: item.content
                          }}></div>
                        {
                          item.reviewItem
                            ? <div className='item moeny'>附件：{item.reviewItem.item.title + ' ' + item.reviewItem.item.nickname + ' ' + moment(item.reviewItem.item.createDate).format('YYYY年MM月DD日')}</div>
                            : null
                        }
                        {
                          item.reviewImgs.length > 0
                            ? <div className='item imglist'>
                                {
                                  item.reviewImgs.map(i => {
                                    return <a target='_blank' href={i.url}><img src={i.url}/></a>
                                  })
                                }
                              </div>
                            : null
                        }
                        {
                          item.replyReview.length > 100
                            ? <ul className='replay'>
                                <li>{item.replyReview[0].name}：{item.replyReview[0].content}</li>
                                <li>{item.replyReview[1].name}：{item.replyReview[1].content}</li>

                                <Collapse bordered={false}>
                                  <Panel header={<div> {
                                      `${item.replyReview[2].name}：${item.replyReview[2].content}`
                                    }
                                    <span className='cgreen' style={{
                                        marginLeft: '10px'
                                      }}>查看全部</span>
                                  </div>} key="1" style={{
                                      border: 0
                                    }} showArrow={false}>
                                    {
                                      item.replyReview.map((cmt, index) => {
                                        if (index < 3)
                                          return
                                        return <li>{cmt.name}：{cmt.content}</li>
                                      })
                                    }
                                  </Panel>
                                </Collapse>
                              </ul>
                            : null
                        }
                      </td>
                    </tr>
                  </table>}/>
                </List.Item>)}/>
            </div>
      }
    </div>)
  }
}
