import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Menu, Icon} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './index.scss'

const defaultKey = location.hash.split('?')[0].toLocaleLowerCase().slice(2)

export default class menu extends Component {

  handleClick(e) {
    localStorage.syskeyPath = e.keyPath[1]
    hashHistory.push(`/${e.key}`)
  }
  render() {
    return (<div className='menu clearfix'>
      <div className='menubox'>
        <Menu onClick={this.handleClick.bind(this)} defaultOpenKeys={[localStorage.syskeyPath]} defaultSelectedKeys={[defaultKey]} mode="inline">
          {
            localStorage.hospitalId
              ? [
                <SubMenu key="home" title={<span> < Icon type = "home" />< span > 医院管理</span></span>}>
                  <Menu.Item key={`account/hospdetail/${localStorage.userId}`}>医院信息</Menu.Item>
                </SubMenu>,
                <SubMenu key="team" title={<span> < Icon type = "team" />< span > 人员管理</span></span>}>
                  <Menu.Item key="team/doc">医生账户</Menu.Item>
                  <Menu.Item key="team/person">普通人员</Menu.Item>
                  <Menu.Item key="team/group">分组管理</Menu.Item>
                </SubMenu>
              ]
              : <SubMenu key="account" title={<span> < Icon type = "key" />< span > 账户管理</span></span>}>
                  <Menu.Item key="account/">普通账户</Menu.Item>
                  <Menu.Item key="account/doc">医生账户</Menu.Item>
                  <Menu.Item key="account/hosp">医院账户</Menu.Item>
                  <Menu.Item key="account/admin">后台账户</Menu.Item>
                </SubMenu>
          }
          {
            !localStorage.hospitalId
              ? <SubMenu key="message" title={<span> < Icon type = "message" />< span > 消息管理</span></span>}>
                  <Menu.Item key="message/">消息列表</Menu.Item>
                  <Menu.Item key="message/feedback">反馈列表</Menu.Item>
                </SubMenu>
              : null
          }
          <SubMenu key="person" title={<span> < Icon type = "solution" />< span > 个人中心</span></span>}>
            <Menu.Item key="person/">个人资料</Menu.Item>
            <Menu.Item key="person/msg">个人消息</Menu.Item>
          </SubMenu>
          {
            !localStorage.hospitalId
              ? [
                <SubMenu key="west" title={<span> < Icon type = "global" />< span > 西医智检</span></span>}>
                  <Menu.Item key="medicine/west/conclusion">西医智检结论</Menu.Item>
                  {/* <Menu.Item key="medicine/west/illness">疾病检查</Menu.Item> */}
                </SubMenu>,
                <SubMenu key="china" title={<span> < Icon type = "shop" />< span > 中医自诊</span></span>}>
                  <Menu.Item key="medicine/china/symptommain">主症状</Menu.Item>
                  <Menu.Item key="medicine/china/symptomsecond">子症状</Menu.Item>
                  <Menu.Item key="medicine/china/drug">用药</Menu.Item>
                  <Menu.Item key="medicine/china/illness">病例</Menu.Item>
                  <Menu.Item key="medicine/china/advice">养生建议</Menu.Item>
                  <Menu.Item key="medicine/china/illnesszh">中医疾病</Menu.Item>
                </SubMenu>,
                <SubMenu key="examine" title={<span> < Icon type = "check-square-o" />< span > 审核管理</span></span>}>
                  <Menu.Item key="examine/doctorstation">医站管理</Menu.Item>
                  <Menu.Item key="examine/report">举报管理</Menu.Item>
                </SubMenu>
              ]
              : null
          }

          <SubMenu key="order" title={<span> < Icon type = "shopping-cart" />< span > 订单管理</span></span>}>
            <Menu.Item key="order/inquiry">问诊单列表</Menu.Item>
          </SubMenu>
          <SubMenu key="money" title={<span> < Icon type = "pay-circle-o" />< span > 财务管理</span></span>}>
            <Menu.Item key="money/bill">账单列表</Menu.Item>
            {
              !localStorage.hospitalId
                ? [
                  <Menu.Item key="money/platform">平台财务</Menu.Item>,
                  <Menu.Item key="money/hosp">医院财务</Menu.Item>
                ]
                : <Menu.Item key="money/platform/hosp">医院财务</Menu.Item>
            }
            <Menu.Item key="money/doctor">医生财务</Menu.Item>
          </SubMenu>
          {
            !localStorage.hospitalId
              ? [
                <SubMenu key="content" title={<span> < Icon type = "form" />< span > 内容管理</span></span>}>
                  <Menu.Item key="content/apphelp">APP使用手册</Menu.Item>
                </SubMenu>,
                <SubMenu key="system" title={<span> < Icon type = "setting" />< span > 系统管理</span></span>}>
                  <Menu.Item key="system/role">角色管理</Menu.Item>
                  <Menu.Item key="system/config">权限配置</Menu.Item>
                  <Menu.Item key="system/version">版本管理</Menu.Item>
                  {/*<Menu.Item key="system/datalog">系统日志</Menu.Item>*/}
                  <Menu.Item key="system/profit">分润设置</Menu.Item>

                  {/* <Menu.Item key="system/feedback">反馈信息</Menu.Item> */}
                </SubMenu>
              ]
              : null
          }

          {/*
          <SubMenu key="find" title={<span> < Icon type = "eye-o" />< span > 发现管理</span></span>}>
            <Menu.Item key="find/note">医站管理</Menu.Item>
            <Menu.Item key="find/">单项检测分析</Menu.Item>
            <Menu.Item key="find/analysismult">综合检测分析</Menu.Item>
          </SubMenu>
          <SubMenu key="data" title={<span> <Icon type="database" /><span>数据库管理</span></span>}>
            <Menu.Item key="9">数据库备份</Menu.Item>
            <Menu.Item key="10">数据库重置</Menu.Item>
          </SubMenu>
          <SubMenu key="statistics" title={<span> <Icon type="line-chart" /><span>网站统计</span></span>}>
            <Menu.Item key="7">登录统计</Menu.Item>
            <Menu.Item key="8">购买统计</Menu.Item>
          </SubMenu>*/
          }
        </Menu>
      </div>
    </div>)
  }
}
