import React, {Component} from 'react'
import {Link} from 'react-router'
import {Avatar, Tag, Row, Col, Button} from 'antd';
import moment from 'moment'

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
      <table>
        <colgroup span="1" className='tbtitle'/>
        <tr>
          <td rowSpan='2'><Avatar size="large" icon="user" src={result.iconUrl}/></td>
          <td>姓名：刘明远</td>
        </tr>
        <tr>
          <td>手机号：{result.phone || '无'}</td>
        </tr>
        <tr>
          <td>职称：</td>
          <td>主任医师</td>
        </tr>
        <tr>
          <td>科室：</td>
          <td>骨科</td>
        </tr>
        <tr>
          <td>医院：</td>
          <td>北京市二医院</td>
        </tr>
      </table>
      <div className='tbbar2'>财务信息</div>
      <div className='platform' style={{paddingTop: 0}}>
        <Row gutter={48} className='text-center'>
          <Col span={6} style={{
              borderRight: '1px solid #eee'
            }}>
            <h5 className='pttitle'>收入</h5>
            <p className='price1 cblue'>
              <b>994,000</b>
            </p>
            <p>
              <Button>收入明细</Button>
            </p>
          </Col>
          <Col span={6} style={{
              borderRight: '1px solid #eee'
            }}>
            <h5 className='pttitle'>支付</h5>
            <p className='price1 cgreen'>
              <b>640,000</b>
            </p>
            <p>
              <Button>支出明细</Button>
            </p>
          </Col>
          <Col span={6} style={{
              borderRight: '1px solid #eee'
            }}>
            <h5 className='pttitle'>提现</h5>
            <p className='price1'>
              <b>300,000</b>
            </p>
            <p>
              <Button>提现明细</Button>
            </p>
          </Col>
          <Col span={6}>
            <h5 className='pttitle'>余额</h5>
            <p className='price1 cred'>
              <b>300,000</b>
            </p>
          </Col>
        </Row>
      </div>
    </div>)
  }
}
