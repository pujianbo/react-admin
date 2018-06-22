import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Checkbox} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      message: null
    }
  }

  componentWillMount() {
    const {type, id} = this.props.params
    ajax({
      url: `/v1/opinion/detail/${id}`,
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
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td className='vtop'>反馈内容：</td>
                  <td dangerouslySetInnerHTML={{
                      __html: result.content
                    }}></td>
                </tr>
                <tr>
                  <td>反馈类型：</td>
                  <td>{['全部', '功能异常', '体念优化', '其他建议'][result.type]}</td>
                </tr>
                <tr>
                  <td>反馈用户：</td>
                  <td>{result.fbUser}</td>
                </tr>
                <tr>
                  <td>反馈角色：</td>
                  <td>{result.fbRole}</td>
                </tr>
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>处理状态：</td>
                  <td>{['忽略', '待处理', '已处理'][result.statusList]}</td>
                </tr>
                <tr>
                  <td>回复内容：</td>
                  <td>{result.replyContent}</td>
                </tr>
                <tr>
                  <td>反馈次数：</td>
                  <td>{result.number}</td>
                </tr>
                <tr>
                  <td>反馈时间：</td>
                  <td>{moment(result.subTime).format(format)}</td>
                </tr>
                <tr>
                  <td>处理时间：</td>
                  <td>{moment(result.dealTime).format(format)}</td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
