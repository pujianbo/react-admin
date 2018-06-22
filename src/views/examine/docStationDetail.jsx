import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {
  Checkbox,
  Button,
  Avatar,
  Icon,
  List,
  Collapse
} from 'antd';

const Panel = Collapse.Panel;
import imgDown from '../../img/icon/down.png'

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
    this.state = {
      result: [],
      message: null,
      commentData: addData()
    }
  }

  componentWillMount() {
    const {type, id} = this.props.params
    // ajax({
    //   url: `/${type}/${type == 'doctor'
    //     ? 'detail'
    //     : 'get'}/${id}`,
    //   success: res => {
    //     if (res.result) {
    //       this.setState({result: res.result})
    //     } else {
    //       this.setState({message: '未查询到信息'})
    //     }
    //   }
    // })
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
    const {
      message,
      result,
      data,
      pagination,
      loading,
      type,
      visible,
      rowSelection,
      loadingMore,
      showLoadingMore,
      commentData
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
    return (<div className='tbdetail bjdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>
                <Button type='danger'>删除</Button>
              </div>
              <h5 style={{
                  fontSize: '18px'
                }}>肺炎治疗后每天都有痰能治好吗？</h5>
              <div className='bjdoctor'>
                <Avatar icon="user"/>
                <span style={{
                    marginLeft: '10px'
                  }}>张医生</span>
                <ul className='lineblock statuslist'>
                  <li>2017.12.8 20:37 周五</li>
                  <li>阅读 23</li>
                  <li>点赞 23</li>
                  <li>收藏 23</li>
                  <li>评论 23</li>
                  <li>转发 23</li>
                </ul>
              </div>
              <div className='bjcontent'>
                <div className="bjcdetail">
                  病来如山倒，病去如抽丝，疾病的康复都需要一个过程，重症肺炎用药一般在2周左右，具体根据你的药敏决定。从复查片子看你恢复还是挺好的。 前期注意休息后期注意锻炼，多饮水，使痰易咳出，注意锻炼增强免疫力，预防再感染。 这种情况要注意身体虚弱等原因造成的可能，以及体温低热等原因造成的可能，以及贫血等原因造成的可能，指导意见：充分放松自己，不要吸烟及被动吸烟，主动休息还是有必要的，口服生脉饮、谷维素等药物来进行治疗，必要时考虑进行中药调理，但是要注意及时检查还是有必要的，如血常规、肝功能等检查……
                </div>
                <div className="morelink">
                  <span>
                    <i>展开全文</i>
                    <img src={imgDown}/></span>
                </div>
                <ul className="files">
                  <li>
                    <h5>感冒是万病之源，不要把感冒当小病</h5>
                    <p><Icon type="file-text"/>
                      祝无双 12月23日</p>
                  </li>
                  <li>
                    <h5>感冒是万病之源，不要把感冒当小病</h5>
                    <p><Icon type="file-text"/>
                      祝无双 12月23日</p>
                  </li>
                </ul>
              </div>
              <div className="btnbar">
                评论
                <span>时间降序</span>
              </div>
              <List className='notescroll' itemLayout="horizontal" size="large" loadMore={loadMore} dataSource={commentData} renderItem={item => (<List.Item actions={[<a title='删除' onCick={this.commentDel.bind(this, item)}><Icon type="delete"/></a>
                    ]}>
                  <List.Item.Meta avatar={<Avatar size = 'large' src = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} description={<table className = 'notecomment' > <tr>
                      <td>
                        <div>{item.user.name}</div>
                        <div className='cgary'>{item.user.time}</div>
                        <div className='item'>{item.user.content}</div>
                        <div className='item moeny'>附件，收藏或红包等，只做展示</div>
                        <div className='item imglist'>
                          <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                          <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                          <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                          <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                        </div>
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
                </List.Item>)}/>
            </div>
      }
    </div>)
  }
}
