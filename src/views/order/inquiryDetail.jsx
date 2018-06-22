import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Tag, Rate, Steps} from 'antd';
const Step = Steps.Step;

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      message: null
    }
  }

  componentWillMount() {
    const {id} = this.props.params
    ajax({
      url: `/profileCard/getCardByOrderNum?orderNum=${id}`,
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
                  <td>患者姓名：</td>
                  <td>{result.name}</td>
                </tr>
                <tr>
                  <td>患者性别：</td>
                  <td>{['女', '男', '儿童'][result.sex]}</td>
                </tr>
                <tr>
                  <td>患者年龄：</td>
                  <td>{moment().diff(result.age, 'years')}岁</td>
                </tr>
                <tr>
                  <td>患者病名：</td>
                  <td>{result.illName}</td>
                </tr>
                <tr>
                  <td>病情描述：</td>
                  <td>{result.illDesc}</td>
                </tr>
                <tr>
                  <td>接诊医生：</td>
                  <td>{result.docRealName} 13500000000</td>
                </tr>
                <tr>
                  <td>问诊类型：</td>
                  <td>病情咨询</td>
                </tr>
                <tr>
                  <td>公开问诊：</td>
                  <td>{result.pubInquiry?'开启':'关闭'}</td>
                </tr>
              </table>
              <div className='tbbar'>支付信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>下单人：</td>
                  <td>李璇 13500000000</td>
                </tr>
                <tr>
                  <td>支付方式：</td>
                  <td>微信</td>
                </tr>
                <tr>
                  <td>应付款：</td>
                  <td>￥30.00</td>
                </tr>
                <tr>
                  <td>实付款：</td>
                  <td>￥30.00</td>
                </tr>
                <tr>
                  <td>退款：</td>
                  <td>￥30.00</td>
                </tr>
                <tr>
                  <td>退款原因：</td>
                  <td>已经解决了</td>
                </tr>
                <tr>
                  <td>退款描述：</td>
                  <td>不好意思，因为您长时间没有回复，我这边已经找人解决了，麻烦退一下款</td>
                </tr>
              </table>
              <div className='tbbar'>评价信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>评星：</td>
                  <td><Rate disabled="disabled" allowHalf="allowHalf" defaultValue={4.5}/></td>
                </tr>
                <tr>
                  <td>评价标签：</td>
                  <td>
                    <Tag color="blue">态度好</Tag>
                    <Tag color="blue">很专业</Tag>
                    <Tag color="blue">好医生</Tag>
                  </td>
                </tr>
                <tr>
                  <td>评语：</td>
                  <td>感谢刘医生，感谢康医生平台，不仅看病真的方便了，而且真的能解决我多年的问题，赞！</td>
                </tr>
              </table>
              <div className='tbbar'>订单流转<span className='cgreen' style={{
                fontSize: '12px',
                paddingLeft: '10px'
              }}>退款成功 WD180419572917</span>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td rowSpan='2'>
                    <Steps direction="vertical" current={1} size="small">
                      <Step title="评价问诊单" description="2018.04.19 15:03:32"/>
                      <Step title="接诊结束" description="2018.04.19 15:03:32"/>
                      <Step title="接诊开始" description="2018.04.19 15:03:32"/>
                      <Step title="支付问诊单" description="2018.04.19 15:03:32"/>
                      <Step title="下单" description="2018.04.19 15:03:32"/>
                    </Steps>
                  </td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
