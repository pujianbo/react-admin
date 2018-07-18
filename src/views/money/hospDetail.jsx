import React, {Component} from 'react'
import {Link} from 'react-router'
import {Row, Col, Button} from 'antd';
import {unitMoney} from '../../tools'

export default class demo extends Component {
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
      url: `/financialManage/queryHospitalInfoDetails?hospId=${id}`,
      async: false,
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
    const {info} = result
    const imgUrl = info.hospitalImg
      ? fileUrl + info.hospitalImg.place
      : ''
    return (<div className='tbdetail'>
      <Row gutter={48}>
        <Col span={12} style={{
            borderRight: '1px solid #eee'
          }}>
          <table>
            <colgroup span="1" className='tbtitle'/>
            <tr>
              <td>医院名称：</td>
              <td>{info.name}</td>
            </tr>
            <tr>
              <td>医院地址：</td>
              <td>{info.address}</td>
            </tr>
            <tr>
              <td>医院类型：</td>
              <td>{hospitalType[info.type]}</td>
            </tr>
            <tr>
              <td>经营类型：</td>
              <td>{hospitalStyle[info.style]}</td>
            </tr>
            <tr>
              <td>医院等级：</td>
              <td>{hospitalLevel[info.level]}</td>
            </tr>
            <tr>
              <td>联系人1姓名：</td>
              <td>{info.linkOneName}</td>
            </tr>
            <tr>
              <td>联系人1手机：</td>
              <td>{info.linkOneCall}</td>
            </tr>
            {
              info.linkTwoCall
                ? [
                  <tr>
                    <td>联系人2姓名：</td>
                    <td>{info.linkTwoName}</td>
                  </tr>,
                  <tr>
                    <td>联系人2手机：</td>
                    <td>{info.linkTwoCall}</td>
                  </tr>
                ]
                : null
            }
          </table>
        </Col>
        <Col span={12} className='text-center'>
          <a className='block'>
            <img src={imgUrl} style={{
                maxHeight: '231px'
              }}/>
          </a>
        </Col>
      </Row>
      <div className='tbbar2'>财务信息</div>
      <div className='platform' style={{
          paddingTop: 0
        }}>
        <Row gutter={48} className='text-center'>
          <Col span={6} style={{
              borderRight: '1px solid #eee'
            }}>
            <h5 className='pttitle'>收入</h5>
            <p className='price1 cblue'>
              <b>{unitMoney(result.income)}</b>
            </p>
            <p>
              <Button href='#/money/bill?type=1&from=1'>收入明细</Button>
            </p>
          </Col>
          <Col span={6} style={{
              borderRight: '1px solid #eee'
            }}>
            <h5 className='pttitle'>支付</h5>
            <p className='price1 cgreen'>
              <b>{unitMoney(result.exp)}</b>
            </p>
            <p>
              <Button href='#/money/bill?type=2&from=1'>支出明细</Button>
            </p>
          </Col>
          <Col span={6} style={{
              borderRight: '1px solid #eee'
            }}>
            <h5 className='pttitle'>提现</h5>
            <p className='price1'>
              <b>{unitMoney(result.PutForward)}</b>
            </p>
            <p>
              <Button href='#/money/bill?type=0&from=1'>提现明细</Button>
            </p>
          </Col>
          <Col span={6}>
            <h5 className='pttitle'>余额</h5>
            <p className='price1 cred'>
              <b>{unitMoney(result.balance)}</b>
            </p>
          </Col>
        </Row>
      </div>
    </div>)
  }
}
