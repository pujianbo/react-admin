import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Button, Modal} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: {},
      message: null
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
          this.setState({message: '未查询到信息'})
        }
      }
    })
  }

  edit() {
    const {id} = this.props.params
    Modal.confirm({
      title: `您确定要${typeName}以下记录吗?`,
      content: `昵称：${value.nickname}`,
      onOk() {
        ajax({
          url: `/v1/announcement/batchoperate`,
          type: 'POST',
          data: {
            ids: [id]
          },
          success: res => {
            if (res.result) {
              hashHistory.go(-1)
            } else {
              this.setState({message: '删除失败'})
            }
          }
        })
      }
    })
  }

  render() {
    const {message, result} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>

                <Button onClick={this.edit.bind(this)} style={{
                    marginRight: '20px'
                  }}>删除</Button>
                <Button href={'#/message/edit/' + result.id}>修改</Button>
              </div>
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
              <div className='tbbar'>消息内容</div>
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
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>消息状态：</td>
                  <td>{['未激活', '正常', '冻结'][result.status]}</td>
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
            </div>
      }
    </div>)
  }
}
