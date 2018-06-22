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

  render() {
    const {type} = this.props.params
    const {message, result} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              {
                type == 1
                  ? <table>
                      <colgroup span="1" className='tbtitle'/>
                      <tr>
                        <td>主症状名：</td>
                        <td>感冒</td>
                      </tr>
                      <tr>
                        <td>所属性别：</td>
                        <td>男</td>
                      </tr>
                      <tr>
                        <td>所属部位：</td>
                        <td>全身</td>
                      </tr>
                    </table>
                  : <table>
                      <colgroup span="1" className='tbtitle'/>
                      <tr>
                        <td>子症状名：</td>
                        <td>感冒</td>
                      </tr>
                      <tr>
                        <td>所属主症状1：</td>
                        <td>感冒</td>
                        <td>所属性别：</td>
                        <td>男</td>
                        <td>所属部位：</td>
                        <td>全身</td>
                      </tr>
                      <tr>
                        <td>所属主症状2：</td>
                        <td>感冒</td>
                        <td>所属性别：</td>
                        <td>男</td>
                        <td>所属部位：</td>
                        <td>全身</td>
                      </tr>
                      <tr>
                        <td>所属主症状3：</td>
                        <td>感冒</td>
                        <td>所属性别：</td>
                        <td>男</td>
                        <td>所属部位：</td>
                        <td>全身</td>
                      </tr>
                    </table>
              }

              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>展示状态：</td>
                  <td>正常</td>
                </tr>
                <tr>
                  <td>定时时间：</td>
                  <td>{moment(result.lastLoginDate).format(format)}</td>
                </tr>
                <tr>
                  <td>创建时间：</td>
                  <td>{moment(result.cteateDate).format(format)}</td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
