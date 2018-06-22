import React, {Component} from 'react'
import {Link} from 'react-router'
import {Avatar, Tag} from 'antd';
import moment from 'moment'

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
      url: `/${type}/${type == 'doctor'
        ? 'detail'
        : 'get'}/${id}`,
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
    const {type} = this.props.params
    const {message, result} = this.state
    const hospital = result.hospital
      ? result.hospital
      : {}
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td rowSpan='2'><Avatar size="large" icon="user" src={result.iconUrl}/></td>
                  <td>昵称：{result.nickname || result.realName}
                    {
                      result.role
                        ? <Tag style={{
                              marginLeft: '10px'
                            }}>{result.role.roleName}</Tag>
                        : null
                    }</td>
                </tr>
                <tr>
                  <td>手机号：{result.phone || '无'}</td>
                </tr>
                {
                  type == 'admin'
                    ? null
                    : [
                      <tr>
                        <td>姓名：</td>
                        <td>{result.nickname || result.realName}</td>
                      </tr>,
                      <tr>
                        <td>性别：</td>
                        <td>{result.sexz || '无'}</td>
                      </tr>,
                      <tr>
                        {
                          type == 'doctor'
                            ? null
                            : [
                              <td>医院：</td>,
                              <td>{result.hospitalName || '无'}</td>
                            ]
                        }
                      </tr>,
                      <tr>
                        <td>邮箱：</td>
                        <td>{result.email || '无'}</td>
                      </tr>,
                      <tr>
                        <td>地区：</td>
                        <td>{result.region || '无'}</td>
                      </tr>,
                      <tr>
                        <td>地址：</td>
                        <td>{result.region || '无'}</td>
                      </tr>,
                      <tr>
                        <td>个性签名：</td>
                        <td>{result.autograph || '无'}</td>
                      </tr>
                    ]
                }
              </table>
              {
                type == 'doctor'
                  ? [
                    <div className='tbbar'>认证信息</div>,
                    <table>
                      <colgroup span="1" className='tbtitle'/>
                      <tr>
                        <td>姓名：</td>
                        <td>{result.realName || '无'}</td>
                      </tr>
                      <tr>
                        <td>医院：</td>
                        <td>{hospital.name || '无'}</td>
                      </tr>
                      <tr>
                        <td>科室：</td>
                        <td>{
                            result.department
                              ? result.department.name
                              : '无'
                          }</td>
                      </tr>
                      <tr>
                        <td>职称：</td>
                        <td>{
                            result.jobTitle
                              ? result.jobTitle.name
                              : '无'
                          }</td>
                      </tr>
                      <tr>
                        <td>学校职称：</td>
                        <td>{result.edu || '无'}</td>
                      </tr>
                      <tr>
                        <td>擅长方向：</td>
                        <td>{result.ability || '无'}</td>
                      </tr>
                      <tr>
                        <td>职业优势：</td>
                        <td>{result.professional || '无'}</td>
                      </tr>
                      <tr>
                        <td>个人简介：</td>
                        <td>{result.introduction || '无'}</td>
                      </tr>
                    </table>,
                    <div className='tbbar'>接诊信息</div>,
                    <table>
                      <colgroup span="1" className='tbtitle'/>
                      <tr>
                        <td>接诊状态：</td>
                        <td>在岗</td>
                      </tr>
                      <tr>
                        <td>接诊时间：</td>
                        <td>周一~周五</td>
                      </tr>
                      <tr>
                        <td>接诊类型：</td>
                        <td>病情咨询 ￥30/次</td>
                      </tr>
                    </table>
                  ]
                  : null
              }
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
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
                  <td>{moment(result.cteateDate).format(format)}</td>
                </tr>
                <tr>
                  <td>登录时间：</td>
                  <td>{moment(result.lastLoginDate).format(format)}</td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
