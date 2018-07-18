import React, {Component} from 'react'
import {Link} from 'react-router'
import {Avatar, Row, Col, Button} from 'antd';
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
      url: `/financialManage/queryDoctorInfoDetails?uid=${id}`,
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
      <table>
        <colgroup span="1" className='tbtitle'/>
        <tr>
          <td rowSpan='2'><Avatar size="large" icon="user" src={result.iconUrl}/></td>
          <td>姓名：{result.realName}</td>
        </tr>
        <tr>
          <td>手机号：{result.phone || '无'}</td>
        </tr>
        <tr>
          <td>职称：</td>
          <td>{result.edu}</td>
        </tr>
        <tr>
          <td>科室：</td>
          <td>{result.deptName}</td>
        </tr>
        <tr>
          <td>医院：</td>
          <td>{result.hospName}</td>
        </tr>
      </table>
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
              <Button href='#/money/bill?type=1&from=2'>收入明细</Button>
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
              <Button href='#/money/bill?type=2&from=2'>支出明细</Button>
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
              <Button href='#/money/bill?type=0&from=2'>提现明细</Button>
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
