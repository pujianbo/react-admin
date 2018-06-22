import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Checkbox, Button} from 'antd';
const billStatus = [, '已完成', '退款成功', '已退款', '已到账']
export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      message: null,
      router: null
    }
  }

  componentWillMount() {
    //type顺序
    const {type, id} = this.props.params
    // ajax({
    //   url: '/v1/tcm/' + url,
    //   type: 'GET',
    //   success: res => {
    //     if (res.result) {
    //       const result = res.result
    //       this.setState({result})
    //     } else {
    //       this.setState({message: '未查询到信息'})
    //     }
    //   }
    // })
  }

  render() {
    const {type} = this.props.params
    const {message, result, router} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>

                <Button href={router}>修改</Button>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td style={{
                      verticalAlign: 'middle'
                    }}>账单金额：</td>

                  {
                    type == 4
                      ? <td>
                          <span className='cred account'>101.00</span><span className='account'> = </span><span className='cred account'>100</span>(提现) <span className='cred account'>+1</span>(手续费)
                        </td>
                      : <td>
                          <span className={type == 3
                              ? 'cred account'
                              : 'cgreen account'}>{
                              type == 3
                                ? '+'
                                : '-'
                            }100.00</span>
                        </td>
                  }
                </tr>
                <tr>
                  <td>账单类型：</td>
                  <td>问诊（{billStatus[type]}）</td>
                </tr>
                {
                  type == 3
                    ? [
                      <tr>
                        <td>账单说明:</td>
                        <td>问诊单退款</td>
                      </tr>,
                      <tr>
                        <td>退款方:</td>
                        <td>平台</td>
                      </tr>
                    ]
                    : <tr>
                        <td>付款方：</td>
                        <td>天空里的鱼 13500000000</td>
                      </tr>
                }
                <tr>
                  <td>收款方：</td>
                  <td>
                    {
                      type == 1
                        ? <ul className="tdlist">
                            <li>北京市二医院 13500002222<span className='money cred'>+19.88</span>
                            </li>
                            <li>刘明远 13500001111<span className='money cred'>+87.56</span>
                            </li>
                            <li>微信<span className='money cred'>+14.79</span>
                            </li>
                            <li>支付宝<span className='money cred'>+0.60</span>
                            </li>
                          </ul>
                        : '天空里的鱼 13500000000'
                    }
                  </td>
                </tr>
                {
                  type == 2
                    ? <tr>
                        <td>退款订单:</td>
                        <td>
                          <Link className='cbule'>WD180423348719</Link>
                        </td>
                      </tr>
                    : null
                }
                {
                  type == 4
                    ? null
                    : <tr>
                        <td>关联订单：</td>
                        <td>
                          <Link className='cbule'>WD180423348719</Link>
                        </td>
                      </tr>
                }
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>账单号：</td>
                  <td>ZD180423348719-1</td>
                </tr>

                {
                  type == 3
                    ? <tr>
                        <td>退款账户：</td>
                        <td>零钱</td>
                      </tr>
                    : <tr>
                        <td>{
                            type == 4
                              ? '提现'
                              : '交易'
                          }方式：</td>
                        <td>支付宝</td>
                      </tr>
                }
                {
                  type == 4
                    ? <tr>
                        <td>提现账户：</td>
                        <td>民生银行 6220 3481 4382 5291</td>
                      </tr>
                    : null
                }
                <tr>
                  <td>创建时间：</td>
                  <td>{moment(result.createTime).format(format)}</td>
                </tr>
                {
                  type == 3
                    ? <tr>
                        <td>退款时间：</td>
                        <td>{moment(result.createTime).format(format)}</td>
                      </tr>
                    : null
                }
                {
                  type == 4
                    ? <tr>
                        <td>到账时间：</td>
                        <td>{moment(result.createTime).format(format)}</td>
                      </tr>
                    : null
                }

              </table>
            </div>
      }
    </div>)
  }
}
