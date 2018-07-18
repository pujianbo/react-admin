import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import moment from 'moment'
import {Button, Modal, message} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: {},
      msg: null
    }
  }

  componentWillMount() {
    const {id} = this.props.params
    ajax({
      url: `/v1/announcement/findannouncement?id=${id}`,
      success: res => {
        if (res.result) {
          this.setState({result: res.result})
        } else {
          this.setState({msg: '未查询到信息'})
        }
      }
    })
  }

  edit() {
    const {id} = this.props.params
    Modal.confirm({
      title: `您确定要删除以下记录吗?`,
      content: `消息标题：${this.state.result.msgTitle}`,
      onOk() {
        ajax({
          url: `/v1/announcement/batchoperate`,
          type: 'POST',
          data: {
            ids: [id],
            status: 0
          },
          success: res => {
            if (res.code == 0) {
              hashHistory.go(-1)
            } else {
              message.error(res.message)
            }
          }
        })
      }
    })
  }

  render() {
    const {msg, result} = this.state
    const {sign} = this.props.params
    return (<div className='tbdetail'>
      {
        msg
          ? <p className='cred'>{msg}</p>
          : <div>
              {
                sign
                  ? null
                  : [
                    <div className='text-right' style={{
                        marginBottom: '20px'
                      }}>

                      <Button onClick={this.edit.bind(this)} style={{
                          marginRight: '20px'
                        }}>删除</Button>
                      {
                        result.status == 3
                          ? <Button href={'#/message/edit/' + result.id}>修改</Button>
                          : null
                      }
                    </div>,
                    <table>
                      <colgroup span="1" className='tbtitle'/>
                      <tr>
                        <td>消息范围：</td>
                        <td>{result.regionStr}</td>
                      </tr>
                      <tr>
                        <td>接收角色：</td>
                        <td>{result.roleStr}</td>
                      </tr>
                    </table>
                  ]
              }
              {
                sign
                  ? null
                  : <div className='tbbar'>消息内容</div>
              }
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>消息标题：</td>
                  <td>{result.msgTitle}</td>
                </tr>
                <tr>
                  <td className='vtop'>消息正文：</td>
                  <td dangerouslySetInnerHTML={{
                      __html: result.msgContent
                    }}/>
                </tr>
              </table>
              {
                sign
                  ? null
                  : [
                    <div className='tbbar'>其他信息</div>,
                    <table>
                      <colgroup span="1" className='tbtitle'/>
                      <tr>
                        <td>消息状态：</td>
                        <td>{['全部', '定时发布', '已发布', '草稿'][result.status]}</td>
                      </tr>
                      {
                        result.sendTime
                          ? <tr>
                              <td>定时时间：</td>
                              <td>{moment(result.sendTime).format(format)}</td>
                            </tr>
                          : null
                      }
                      <tr>
                        <td>创建时间：</td>
                        <td>{moment(result.createTime).format(format)}</td>
                      </tr>
                    </table>
                  ]
              }
            </div>
      }
    </div>)
  }
}
