import React, {Component} from 'react'
import {Link} from 'react-router'
import {Tabs, Radio, Button, message, Modal} from 'antd';
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export default class buyservice extends Component {
  constructor(props) {
    super(props);
    this.tabKey = this.props.params.active || 1
    this.priceArr = [0, 0, 0, 0, 0]
    this.state = {
      scale: '',
      topic: '',
      notice: '',
      fileCapacity: '',
      disabled: false,
      pay: 'alipay',
      payPrice: 0,
      getAllScale: [],
      getAllTopic: [],
      getAllNotice: [],
      getAllFileCapacity: []
    }
  }
  componentWillMount() {
    this.ajaxData('getAllScale');
    this.ajaxData('getAllTopic');
    this.ajaxData('getAllNotice');
    this.ajaxData('getAllFileCapacity');
  }

  onChange(type, e) {
    const value = e.target.value
    let json = {};
    json[type] = value
    if (type != 'pay') {
      json.payPrice = value.split('&')[1]
      this.priceArr[this.tabKey] = json.payPrice
    }
    this.setState(json);
  }

  paySubmit() {
    const {id} = this.props.params
    const {
      scale,
      notice,
      topic,
      fileCapacity,
      pay,
      payPrice
    } = this.state
    let name = 'buyHospitalScale'
    let getId = ''
    let data = {
      hospitalId: id
    }
    this.tabKey = Number(this.tabKey)
    switch (this.tabKey) {
      case 2:
        getId = notice
        data.noticeId = getId.split('&')[0]
        name = 'buyHospitalNotice'
        break;
      case 3:
        getId = topic
        data.topicId = getId.split('&')[0]
        name = 'buyHospitalTopic'
        break;
      case 4:
        getId = fileCapacity
        data.fileCapacityId = getId.split('&')[0]
        name = 'buyFileCapacity'
        break;
      default:
        getId = scale
        data.scaleId = getId.split('&')[0]
        break;
    }
    if (getId == '') {
      message.warning('请选择购买项');
      return
    }

    console.log(getId);
    this.setState({disabled: true})
    ajax({
      url: `/hospital/${name}`,
      type: 'POST',
      data,
      success: res => {
        if (res.code == 0) {
          //去支付
          ajax({
            url: '/pay/payurl',
            type: 'POST',
            data: {
              amount: payPrice * 100,
              // amount: 1,
              method: 'recharge',
              type: pay
            },
            success: res => {
              this.setState({disabled: false})
              if (res.code == 0) {
                window.open('https://www.baidu.com/', '_blank');
                var link = document.createElement('a');
                link.href = res.result
                // link.target = '_blank'
                link.click()

                Modal.confirm({
                  title: `支付已完成?`,
                  content: `支付金额：￥${Number(payPrice).toFixed(2)}`,
                  onOk() {
                    console.log('OK');
                  }
                });
              } else {
                message.error(res.message);
              }
            }
          })
        } else {
          this.setState({disabled: false})
          message.error(res.message);
        }
      }
    })
  }

  ajaxData(name) {
    ajax({
      url: `/hospital/${name}`,
      success: res => {
        if (res.code == 0) {
          let json = {}
          json[name] = res.result
          this.setState(json)
        } else {
          message.error(res.message);
        }
      }
    })
  }

  tabChange(key) {
    this.tabKey = key
    this.setState({
      payPrice: this.priceArr[this.tabKey]
    })
  }

  render() {
    const {
      scale,
      topic,
      notice,
      fileCapacity,
      pay,
      payPrice,
      disabled,
      getAllScale,
      getAllTopic,
      getAllNotice,
      getAllFileCapacity
    } = this.state

    const getAllScales = getAllScale.map(item => {
      return (<Radio value={`${item.id}&${item.price}`}>{item.scaleNum}人/￥{item.price}</Radio>)
    })
    const getAllTopics = getAllTopic.map(item => {
      return (<Radio value={`${item.id}&${item.price}`}>{item.monthNum}个月/￥{item.price}</Radio>)
    })
    const getAllNotices = getAllNotice.map(item => {
      return (<Radio value={`${item.id}&${item.price}`}>{item.monthNum}个月/￥{item.price}</Radio>)
    })
    const getAllFileCapacitys = getAllFileCapacity.map(item => {
      return (<Radio value={`${item.id}&${item.price}`}>{item.capacity}G {item.yearNum}年/￥{item.price}</Radio>)
    })

    return (<div className='tbdetail buyservice'>
      <Tabs defaultActiveKey={this.tabKey} onChange={this.tabChange.bind(this)}>
        <TabPane tab="医院规模" key="1">
          <ul>
            <li>当前规模：324人</li>
            <li>规模上限：1000人</li>
          </ul>
          <div className='tbbar'>选择规模
            <span className='cgreen' style={{
                fontSize: '14px',
                marginLeft: '10px'
              }}>(规模扩张后永久有效)</span>
          </div>
          <div className='rdolist'>
            <RadioGroup onChange={this.onChange.bind(this, 'scale')} value={scale}>
              {getAllScales}
            </RadioGroup>
          </div>
        </TabPane>
        <TabPane tab="通 知" key="2">
          <ul>
            <li>有效期至：2018.10.10</li>
          </ul>
          <div className='tbbar'>选择时间</div>
          <div className='rdolist'>
            <RadioGroup onChange={this.onChange.bind(this, 'notice')} value={notice}>
              {getAllNotices}
            </RadioGroup>
          </div>
        </TabPane>
        <TabPane tab="话 题" key="3">
          <ul>
            <li>有效期至：2018.10.10</li>
          </ul>
          <div className='tbbar'>选择时间</div>
          <div className='rdolist'>
            <RadioGroup onChange={this.onChange.bind(this, 'topic')} value={topic}>
              {getAllTopics}
            </RadioGroup>
          </div>
        </TabPane>
        <TabPane tab="文 件" key="4">
          <ul>
            <li>当前容量：3.2G</li>
            <li>容量上限：5G</li>
            <li>有效期至：2018.10.10</li>
          </ul>
          <div className='tbbar'>选择容量</div>
          <div>
            <p>1. 套餐到期后若实际使用容量≤容量上限，则文件不受任何影响。</p>
            <p>2. 套餐到期后若实际使用容量＞容量上限，则超出容量的文件不会被删除，但将无法下载，扩容后恢复正常。</p>
          </div>
          <div className='rdolist'>
            <RadioGroup onChange={this.onChange.bind(this, 'fileCapacity')} value={fileCapacity}>
              {getAllFileCapacitys}
            </RadioGroup>
          </div>
        </TabPane>
      </Tabs>

      <div className='tbbar'>选择支付方式</div>
      <div style={{
          marginTop: '20px'
        }}>
        <RadioGroup onChange={this.onChange.bind(this, 'pay')} value={pay}>
          <Radio value='alipay'>支付宝</Radio>
          <Radio value='wechat' disabled='disabled'>微信</Radio>
        </RadioGroup>
      </div>
      <div style={{
          marginTop: '20px',
          marginBottom: '40px'
        }}>
        支付金额：<span className='cred' style={{
        fontSize: '20px'
      }}>￥{payPrice}</span>
      </div>
      <div>
        <Button type='primary' onClick={this.paySubmit.bind(this)} disabled={disabled}>确认支付</Button>
      </div>
    </div>)
  }
}
