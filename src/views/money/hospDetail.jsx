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
    ajax({
      url: `/hospital/get/${ 16}`,
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
    const {hospital} = result
    const imgUrl = hospital.hospitalImg
      ? fileUrl + hospital.hospitalImg.place
      : ''
    return (<div className='tbdetail'>
      <Row gutter={48} className='text-center'>
        <Col span={12} style={{
            borderRight: '1px solid #eee'
          }}>
          <table>
            <colgroup span="1" className='tbtitle'/>
            <tr>
              <td>姓名：</td>
              <td>{result.nickname}</td>
            </tr>
            <tr>
              <td>医院名称：</td>
              <td>{hospital.name}</td>
            </tr>
            <tr>
              <td>医院地址：</td>
              <td>{hospital.address}</td>
            </tr>
            <tr>
              <td>医院类型：</td>
              <td>{hospitalType[hospital.type]}</td>
            </tr>
            <tr>
              <td>经营类型：</td>
              <td>{hospitalStyle[hospital.style]}</td>
            </tr>
            <tr>
              <td>医院等级：</td>
              <td>{hospitalLevel[hospital.level]}</td>
            </tr>
            <tr>
              <td>联系人1姓名：</td>
              <td>{hospital.linkOneName}</td>
            </tr>
            <tr>
              <td>联系人1手机：</td>
              <td>{hospital.linkOneCall}</td>
            </tr>
            {
              hospital.linkTwoCall
                ? [
                  <tr>
                    <td>联系人2姓名：</td>
                    <td>{hospital.linkTwoName}</td>
                  </tr>,
                  <tr>
                    <td>联系人2手机：</td>
                    <td>{hospital.linkTwoCall}</td>
                  </tr>
                ]
                : null
            }
          </table>
        </Col>
        <Col span={12}>

            <a className='block' target='_blank'>
              <img src={imgUrl}/>
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
