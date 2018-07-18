import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {Avatar, Tag, Icon, Button, message} from 'antd';
import moment from 'moment'

import imgZhizhao from '../../img/other/zhizhao.jpg'
import imgYiyuan from '../../img/other/yiyuan.jpg'

let hospId = null
let hospSign = null
export default class datalist extends Component {
  constructor(props) {
    super(props);
    const {sign, id} = this.props.params
    hospId = id
    hospSign = sign
    this.state = {
      result: {
        hospital: {}
      },
      count: 0
    }
  }
  componentWillMount() {
    ajax({
      url: `/hospital/get/${hospId}`,
      async: false,
      success: res => {
        if (res.code == 0 && res.result) {
          this.setState({result: res.result})
        } else {
          message.error(res.message);
        }
      }
    })
    ajax({
      url: `/doctor/getcount/${hospId}`,
      success: res => {
        if (res.code == 0) {
          this.setState({count: res.result.count})
        } else {
          message.error(res.message);
        }
      }
    })
  }
  // componentWillReceiveProps() {
  //   location.reload();
  // }

  dateOK(date) {
    return moment(date).diff(moment(), 'days') >= 0
      ? <Icon className='istus cgreen' type="check-circle"/>
      : <Icon className='istus cred' type="exclamation-circle"/>
  }
  buy(type) {
    if (!hospSign)
      hashHistory.push(`/team/buyservice/${hospId}/${type}`);
    }

  render() {
    const fmt = 'YYYY.MM.DD'
    const {result, count} = this.state
    const {hospital} = result
    const imgUrl = hospital.hospitalImg
      ? fileUrl + hospital.hospitalImg.place
      : ''
    const businessImg = hospital.businessImg
      ? fileUrl + hospital.businessImg.place
      : ''
    const licenseImg = hospital.licenseImg
      ? fileUrl + hospital.licenseImg.place
      : ''
    return (<div className='tbdetail'>
      {
        hospSign
          ? null
          : <div className='text-right' style={{
                marginBottom: '20px'
              }}>
              <Button href={`#/team/buyservice/${hospId}`} style={{
                  marginRight: '10px'
                }}>购买增值服务</Button>
              <Button href={`#/account/hospedit/${hospId}`}>编辑信息</Button>
            </div>
      }
      <a className='block' target='_blank' href={imgUrl}>
        <img src={imgUrl} style={{
            maxHeight: '300px'
          }}/>
      </a>
      <div className='tbbar'>基本信息</div>
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
      <div className='tbbar'>证件信息</div>
      <table>
        <colgroup span="1" className='tbtitle'/>
        <tr>
          <td colSpan='2'>
            <p>医疗许可证：</p>
            <p>
              <a className='imglink' target='_blank' href={businessImg}>
                <img src={businessImg}/>
              </a>
            </p>
          </td>
        </tr>
        <tr>
          <td>有效时间：</td>
          <td>
            {hospital.businessDescribe}
            {
              hospital.businessDescribe
                ? this.dateOK(hospital.businessDescribe.split('~')[1])
                : null
            }
          </td>
        </tr>
        <tr>
          <td style={{
              paddingBottom: '30px'
            }}></td>
        </tr>
        <tr>
          <td colSpan='2'>
            <p>营业执照：</p>
            <p>
              <a className='imglink' target='_blank' href={licenseImg}>
                <img src={licenseImg}/>
              </a>
            </p>
          </td>
        </tr>
        <tr>
          <td>有效时间：</td>
          <td>
            {hospital.licenseDescribe}
            {
              hospital.licenseDescribe
                ? this.dateOK(hospital.licenseDescribe.split('~')[1])
                : null
            }
          </td>
        </tr>
        <tr>
          <td style={{
              paddingBottom: '30px'
            }}></td>
        </tr>
      </table>
      <div className='tbbar'>增值服务</div>
      <table>
        <colgroup span="1" className='tbtitle'/>
        <tr>
          <td>接诊状态：</td>
          <td>在岗</td>
        </tr>
        <tr>
          <td>医院规模：</td>
          {
            hospital.hospitalScale
              ? <td>{count}/{hospital.hospitalScale.scaleNum}</td>
              : <td>
                  <Tag color="orange" onClick={this.buy.bind(this, 1)}>未购买</Tag>
                </td>
          }
        </tr>
        <tr>
          <td>通知：</td>
          {
            hospital.noticeExpiryDate
              ? <td>
                  {moment(hospital.noticeExpiryDate).format(fmt)}
                  {this.dateOK(hospital.noticeExpiryDate)}
                </td>
              : <td>
                  <Tag color="orange" onClick={this.buy.bind(this, 2)}>未购买</Tag>
                </td>
          }
        </tr>
        <tr>
          <td>话题：</td>
          {
            hospital.topicExpiryDate
              ? <td>
                  {moment(hospital.topicExpiryDate).format(fmt)}
                  {this.dateOK(hospital.topicExpiryDate)}
                </td>
              : <td>
                  <Tag color="orange" onClick={this.buy.bind(this, 3)}>未购买</Tag>
                </td>
          }
        </tr>
        <tr>
          <td>文件：</td>
          {
            hospital.fileCapacity
              ? <td>
                  {hospital.fileCapacity || 0}G, {moment(hospital.fileExpiryDate).format(fmt)}
                  {this.dateOK(hospital.fileExpiryDate)}
                </td>
              : <td>
                  <Tag color="orange" onClick={this.buy.bind(this, 4)}>未购买</Tag>
                </td>
          }
        </tr>
      </table>
      <div className='tbbar'>其他信息</div>
      <table>
        <colgroup span="1" className='tbtitle'/>
        <tr>
          <td>管理员姓名：</td>
          <td>{result.nickname}</td>
        </tr>
        <tr>
          <td>管理员手机：</td>
          <td>{result.phone}</td>
        </tr>
        <tr>
          <td>账号状态：</td>
          <td>
            <Tag color={result.status == 1
                ? 'green'
                : 'red'}>{['未激活', '正常', '冻结'][result.status]}</Tag>
          </td>
        </tr>
        {
          result.status == 2
            ? <tr>
                <td>冻结理由：</td>
                <td>{result.freeze || '无'}</td>
              </tr>
            : null
        }
        <tr>
          <td>创建时间：</td>
          <td>{moment(result.cteateDate).format(fmt + ' HH:MM:SS')}</td>
        </tr>
        <tr>
          <td>登录时间：</td>
          <td>{moment(result.lastLoginDate).format(fmt + ' HH:MM:SS')}</td>
        </tr>
      </table>
    </div>)
  }
}
