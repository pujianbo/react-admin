import React, {Component} from 'react'
import {Row, Col, Button, DatePicker, Radio} from 'antd'
// import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
const {MonthPicker} = DatePicker

// const echarts = require('echarts')

//按需加载模块
const echarts = require('echarts/lib/echarts');//引入ECharts主模块
require('echarts/lib/chart/pie');//引入饼状图
require("echarts/lib/chart/line");//引入走势图
require('echarts/lib/component/tooltip');//引入提示框
require('echarts/lib/component/title');//引入标题组件
require('echarts/lib/component/legendScroll');//引入饼状图选择显示

let myChart
export default class demo extends Component {
  constructor() {
    super();
    this.myChart=null;
    this.echartData={
        legend: {},
        title: {
          text: '平台财务统计',
          subtext: '数据来自康医生',
          x: '20px'
        },
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            source: [
              ['月份', '一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'],
              ['平台总流水', 500, 578, 670, 566, 788, 458,500, 578, 670, 566, 788, 458],
              ['平台收入', 400, 300, 349, 540, 340, 335,400, 300, 349, 540, 340, 335],
              ['医生收入', 30, 42, 33, 45, 29, 33,30, 42, 33, 45, 29, 33],
              ['医院收入', 120, 119, 68, 100, 160, 90,120, 119, 68, 100, 160, 90],
              ['支付手续费', 11, 14, 8, 10, 15, 14,11, 14, 8, 10, 15, 14]
            ]
        },
        xAxis: {type: 'category',name : '时间（月份）'},
        yAxis: {gridIndex: 0,name : '金额（万元）'},
        grid: {top: '50%'},
        series: [
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              label: {
                  formatter: '{b}: {@一月} ({d}%)'
              },
              encode: {
                  itemName: '月份',
                  value: '一月',
                  tooltip: '一月'
              }
            }
        ]
    }
    this.state = {
      format: 'YYYY年',
      result: {}
    }
  }
  componentWillMount() {
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

  echartChange(){
    myChart.setOption(this.echartData);
    myChart.on('updateAxisPointer', function (event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            var dimension = xAxisInfo.value + 1;
            myChart.setOption({
                series: {
                    id: 'pie',
                    label: {
                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
        }
    });
  }

  componentDidMount() {
    myChart = echarts.init(document.getElementById('echart'));
    this.echartChange();
  }

  sltChange(e) {
    const value=e.target.value
    let format='YYYY年'
    let source= [
      ['月份', '一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'],
      ['平台总流水', 500, 578, 670, 566, 788, 458,500, 578, 670, 566, 788, 458],
      ['平台收入', 400, 300, 349, 540, 340, 335,400, 300, 349, 540, 340, 335],
      ['医生收入', 30, 42, 33, 45, 29, 33,30, 42, 33, 45, 29, 33],
      ['医院收入', 120, 119, 68, 100, 160, 90,120, 119, 68, 100, 160, 90],
      ['支付手续费', 11, 14, 8, 10, 15, 14,11, 14, 8, 10, 15, 14]
    ]
    let xAxisName='时间（月）'
    let {echartData}=this.state
    let label={
      formatter: '{b}: {@一月} ({d}%)'
    }
    let encode={
      itemName: '月份',
      value: '一月',
      tooltip: '一月'
    }
    if(value=='month'){
      format='YYYY年MM月'
      source= [
        ['日期', '1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12','13', '14', '15', '16','17', '18', '19', '20', '21', '22', '23', '24','25', '26','27', '28', '29', '30'],
        ['平台总流水', 500, 578, 670, 566, 788, 458,500, 578, 670, 566, 788, 458,500, 578, 670, 566, 788, 458,500, 578, 670, 566, 788, 458, 578, 670, 566, 788, 458,555],
        ['平台收入', 400, 300, 349, 540, 340, 335,400, 300, 349, 540, 340, 335,400, 300, 349, 540, 340, 335,400, 300, 349, 540, 340, 335,400, 300, 349, 540, 340, 335],
        ['医生收入', 30, 42, 33, 45, 29, 33,30, 42, 33, 45, 29, 33,30, 42, 33, 45, 29, 33,30, 42, 33, 45, 29, 33,30, 42, 33, 45, 29, 33],
        ['医院收入', 220, 119, 68, 100, 160, 90,120, 119, 68, 100, 160, 90,20, 119, 68, 100, 160, 90,120, 119, 68, 100, 160, 90,120, 119, 68, 100, 160, 90],
        ['支付手续费', 11, 14, 8, 10, 15, 14,11, 14, 8, 10, 15, 14,11, 14, 8, 10, 15, 14,11, 14, 8, 10, 15, 14,11, 14, 8, 10, 15, 14]
      ]
      xAxisName='时间（日）'
      label={
          formatter: '{b}: {@1} ({d}%)'
      }
      encode={
          itemName: '日期',
          value: '1',
          tooltip: '1'
      }
    }
    this.echartData.dataset.source=source
    this.echartData.xAxis.name=xAxisName
    this.echartData.series[5].label=label
    this.echartData.series[5].encode=encode
    this.echartChange();
    this.setState({
      format
    })
  }

  render() {
    const {result, format,echartData} = this.state
    return (<div className='platform'>
      <Row gutter={48} className='text-center'>
        <Col span={8} style={{
            borderRight: '1px solid #eee'
          }}>
          <h5 className='pttitle'>平台收入</h5>
          <p className='price1 cblue'>
            <b>994,000</b>
          </p>
          <p>
            <Button>收入明细</Button>
          </p>
        </Col>
        <Col span={8} style={{
            borderRight: '1px solid #eee'
          }}>
          <h5 className='pttitle'>平台提现</h5>
          <p className='price1 cgreen'>
            <b>640,000</b>
          </p>
          <p>
            <Button>提现明细</Button>
          </p>
        </Col>
        <Col span={8}>
          <h5 className='pttitle'>平台余额</h5>
          <p className='price1 cred'>
            <b>300,000</b>
          </p>
          <p>
            <Button href='#/money/cash'>提现</Button>
          </p>
        </Col>
      </Row>
      <div className='text-center tbchart'>
        <table>
          <tr>
            <td>平台总流水</td>
            <td></td>
            <td>支付宝收入</td>
            <td></td>
            <td>微信收入</td>
            <td></td>
            <td>苹果收入</td>
          </tr>
          <tr>
            <td>
              <b className='cblue'>994,000</b>
            </td>
            <td>=</td>
            <td>497,000</td>
            <td>+</td>
            <td>298,200</td>
            <td>+</td>
            <td>198,800</td>
          </tr>
        </table>
      </div>
      <div className='typebar'>平台总流水</div>
      <div className='text-center tbchart'>
        <table>
          <tr>
            <td>平台总流水</td>
            <td></td>
            <td>支付宝收入</td>
            <td></td>
            <td>微信收入</td>
            <td></td>
            <td>苹果收入</td>
          </tr>
          <tr>
            <td>
              <b className='cblue'>994,000</b>
            </td>
            <td>=</td>
            <td>497,000</td>
            <td>+</td>
            <td>298,200</td>
            <td>+</td>
            <td>198,800</td>
          </tr>
        </table>
      </div>
      <div className='typebar'>医生收入</div>
      <div className='text-center tbchart'>
        <table>
          <tr>
            <td>医生收入</td>
            <td></td>
            <td>支付宝收入</td>
            <td></td>
            <td>微信收入</td>
            <td></td>
            <td>苹果收入</td>
          </tr>
          <tr>
            <td>
              <b className='cblue'>994,000</b>
            </td>
            <td>=</td>
            <td>497,000</td>
            <td>+</td>
            <td>298,200</td>
            <td>+</td>
            <td>198,800</td>
          </tr>
        </table>
      </div>
      <div className='typebar'>医院收入</div>
      <div className='text-center tbchart'>
        <table>
          <tr>
            <td>医院收入</td>
            <td></td>
            <td>支付宝收入</td>
            <td></td>
            <td>微信收入</td>
            <td></td>
            <td>苹果收入</td>
          </tr>
          <tr>
            <td>
              <b className='cblue'>994,000</b>
            </td>
            <td>=</td>
            <td>497,000</td>
            <td>+</td>
            <td>298,200</td>
            <td>+</td>
            <td>198,800</td>
          </tr>
        </table>
      </div>
      <div className='typebar'>支付手续费</div>
      <div className='text-center tbchart'>
        <table>
          <tr>
            <td>支付手续费</td>
            <td></td>
            <td>支付宝手续费</td>
            <td></td>
            <td>微信手续费</td>
            <td></td>
            <td>苹果手续费</td>
          </tr>
          <tr>
            <td>
              <b className='cblue'>994,000</b>
            </td>
            <td>=</td>
            <td>497,000</td>
            <td>+</td>
            <td>298,200</td>
            <td>+</td>
            <td>198,800</td>
          </tr>
        </table>
      </div>
      <div className='typebar' style={{
          marginBottom: '40px'
        }}>图表统计</div>
      <div className='clearfix' style={{
          marginBottom: '20px'
        }}>
        <Radio.Group defaultValue="year" onChange={this.sltChange.bind(this)} style={{
            marginRight: '20px'
          }}>
          <Radio.Button value="year">年</Radio.Button>
          <Radio.Button value="month">月</Radio.Button>
        </Radio.Group>
        <MonthPicker allowClear={false} format={format} defaultValue={moment()} style={{width:'140px'}}/>
        <Button type="button" className='right'>导出{format.substring(format.length-1)}收入</Button>
      </div>
      <div id="echart" style={{height:'600px',paddingTop: '30px',backgroundColor: '#f3f3f3'}}></div>
    </div>)
  }
}
