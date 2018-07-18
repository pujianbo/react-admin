import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Button, Modal} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.day = 1
    this.state = {
      result: [],
      message: null
    }
  }

  //批量操作
  //批量操作
  handleSlt(e) {
    const plainOptions = ['1天', '3天', '5天'];
    const delType = e.target.innerText;
    let _this = this;
    Modal.confirm({
      title: `您确定要${delType}以下记录吗?`, content: <div>选择项：{this.selectedRowName}{
          delType.indexOf('冻结') > -1
            ? <div style={{
                  marginTop: '10px'
                }}>冻结天数：<RadioGroup options={plainOptions} defaultValue={plainOptions[0]} onChange={this.sltDay.bind(this)}/></div>
            : null
        }</div>,
      onOk() {
        let url = `/report/operation`
        let type = 'POST'
        let data = {
          ids: _this.selectedRowID,
          type: 0 //0 忽略 1 删除评论 2 冻结账号
        }
        if (delType.indexOf('删除') > -1) {
          data.type = 1
        } else if (delType.indexOf('冻结') > -1) {
          data.type = 2
          data.dayNum = _this.day
          data.freeze = '非法操作'
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

  componentWillMount() {
    const {type, id} = this.props.params
    ajax({
      url: `/report/queryDetails?reportId=${id}`,
      success: res => {
        if (res.result) {
          this.setState({result: res.result})
        } else {
          this.setState({message: '未查询到信息'})
        }
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
                <Button style={{
                    marginRight: '10px'
                  }} onClick={this.handleSlt.bind(this)}>忽略</Button>
                <Button style={{
                    marginRight: '10px'
                  }} onClick={this.handleSlt.bind(this)}>删除</Button>
                <Button onClick={this.handleSlt.bind(this)}>冻结</Button>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>被举报人：</td>
                  <td>{result.toNickname}</td>
                </tr>
                <tr>
                  <td>举报类型：</td>
                  <td>{['评论', '用户'][result.type]}</td>
                </tr>
                <tr>
                  <td className='vtop'>被举报内容：</td>
                  <td>
                    {result.content}
                    {
                      result.reportImgs && result.reportImgs.length > 0
                        ? <div className='imglist'>
                            {
                              result.reportImgs.map(item => {
                                return <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                              })
                            }
                          </div>
                        : null
                    }
                  </td>
                </tr>
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>处理状态：</td>
                  <td>{['忽略', '待处理', '已处理'][result.status]}</td>
                </tr>
                <tr>
                  <td>被举报次数：</td>
                  <td>{result.reportCount}</td>
                </tr>
                <tr>
                  <td>举报人：</td>
                  <td>{result.fromNickname}</td>
                </tr>
                <tr>
                  <td>举报时间：</td>
                  <td>{moment(result.createDate).format(format)}</td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
