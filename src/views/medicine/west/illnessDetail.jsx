import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import { Checkbox,  Button} from 'antd';

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
    const {message, result} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
          <div className='text-right' style={{
                marginBottom: '20px'
              }}>

              <Button href={`#/account/hospedit/`}>修改</Button>
            </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>疾病名称：</td>
                  <td>慢性乙肝</td>
                </tr>
              </table>
              <div className='tbbar'>关联检验项目</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>检验项目：</td>
                  <td>谷草转氨酶=40~120</td>
                </tr>
                <tr>
                  <td>检验项目：</td>
                  <td>谷草转氨酶=40~120</td>
                </tr>
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>展示状态：</td>
                  <td>正常</td>
                </tr>
                <tr>
                  <td>最近修改：</td>
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
