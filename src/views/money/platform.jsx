import React, {Component} from 'react'
import {
  Row,
  Col,
  Button,
  DatePicker,
  Radio,
  message
} from 'antd'
// import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
import {unitMoney} from '../../tools'
const {MonthPicker} = DatePicker

// const echarts = require('echarts')

//按需加载模块
const echarts = require('echarts/lib/echarts'); //引入ECharts主模块
require('echarts/lib/chart/pie'); //引入饼状图
require("echarts/lib/chart/line"); //引入走势图
require('echarts/lib/component/tooltip'); //引入提示框
require('echarts/lib/component/title'); //引入标题组件
require('echarts/lib/component/legendScroll'); //引入饼状图选择显示

let myChart
export default class demo extends Component {
  constructor() {
    super();
    this.ptype = null
    this.date = moment().subtract(1, 'month').format('YYYY-MM')
    this.myChart = null;
    this.echartData = {
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
        source: []
      },
      xAxis: {
        type: 'category',
        name: '时间（月份）'
      },
      yAxis: {
        gridIndex: 0,
        name: '金额（万元）'
      },
      grid: {
        top: '50%'
      },
      series: [
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        }, {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        }, {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        }, {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        }, {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        }, {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: [
            '50%', '25%'
          ],
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
      result: {},
      loading: false
    }
  }
  componentWillMount() {
    this.ptype = this.props.params.type
    ajax({
      url: this.ptype == 'hosp'
        ? `/financialManage/queryHospitalInfoDetails?hospId=${localStorage.hospitalId}`
        : '/financialManage/getPlatformFinances',
      success: res => {
        if (res.result) {
          const result = res.result
          this.setState({result})
        } else {
          this.setState({message: '未查询到信息'})
        }
      }
    })
  }

  echartChange() {
    myChart.setOption(this.echartData);
    myChart.on('updateAxisPointer', function(event) {
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
    this.getFinances('year')
  }

  sltChange(e) {
    this.getFinances(e.target.value)
  }

  sltDate(value) {
    this.date = moment(value).format('YYYY-MM')
    this.getFinances(
      this.state.format.slice(-1) == '月'
      ? 'month'
      : 'year')
  }

  getFinances(unit) {
    const [year, month] = this.date.split('-')
    let url = `/financialManage/getFinances?year=${year}`
    if (unit == 'month')
      url += `&month=${month}`
    let _this = this;
    ajax({
      url,
      success: function(res) {
        if (res.code != 0) {
          message.error(res.message);
          return
        }
        let source = []
        let dateTitle = ['月份']
        const yearTitle = [
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九',
          '十',
          '十一',
          '十二'
        ]
        const platformBusiness = ['平台总流水']
        const platformFiances = ['平台收入']
        const docFiances = ['医生收入']
        const hosFiances = ['医院收入']
        const ratioFiances = ['支付手续费']

        res.result.map((item, index) => {
          dateTitle.push(yearTitle[index] + '月')
        })

        res.result.map(item => {
          platformBusiness.push(item.platformBusiness)
          platformFiances.push(item.platformFiances)
          docFiances.push(item.docFiances)
          hosFiances.push(item.hosFiances)
          ratioFiances.push(item.ratioFiances)
        })

        let format = 'YYYY年'
        let xAxisName = '时间（月）'
        let {echartData} = _this.state
        let label = {
          formatter: '{b}: {@一月} ({d}%)'
        }
        let encode = {
          itemName: '月份',
          value: '一月',
          tooltip: '一月'
        }
        if (unit == 'month') {
          format = 'YYYY年MM月'
          dateTitle = ['日期']
          res.result.map((item, index) => {
            dateTitle.push(index + 1 + '')
          })
          xAxisName = '时间（日）'
          label = {
            formatter: '{b}: {@1} ({d}%)'
          }
          encode = {
            itemName: '日期',
            value: 1,
            tooltip: 1
          }
        }
        source.push(dateTitle)
        if (_this.ptype) {
          source.push(hosFiances)
        } else {
          source.push(platformBusiness)
          source.push(platformFiances)
          source.push(docFiances)
          source.push(hosFiances)
          source.push(ratioFiances)
        }
        console.log(source);

        _this.echartData.dataset.source = source
        _this.echartData.xAxis.name = xAxisName
        if (_this.ptype) {
          _this.echartData.title.text = '医院收入统计'
          _this.echartData.grid.top = '20%'
          _this.echartData.series.length = 5
        } else {
          _this.echartData.series[5].label = label
          _this.echartData.series[5].encode = encode
        }
        _this.echartChange();
        _this.setState({format})
      }
    })
  }

  dataPrint(unit) {
    this.setState({loading: true})
    const [year, month] = this.date.split('-')
    let url = `/financialManage/exportFinancial?year=${year}`
    let name = `${year}年`
    if (unit == '月') {
      url += `&month=${month}`
      name += `${month}月`
    }
    ajaxBlob({
      url,
      filename: `${name}财务报表统计.xls`
    }, () => {
      this.setState({loading: false})
    })
  }

  htmlSet(data, name, unit = '收入') {
    if (data)
      return ([
        <div className='typebar'>{name + unit}</div>,
        <div className='text-center tbchart'>
          <table>
            <tr>
              <td>{name + unit}</td>
              <td></td>
              <td>支付宝{unit}</td>
              <td></td>
              <td>微信{unit}</td>
              <td></td>
              <td>苹果{unit}</td>
            </tr>
            <tr>
              <td>
                <b className='cblue'>{(data.all).toFixed(2)}</b>
              </td>
              <td>=</td>
              <td>{data.aliIncome}</td>
              <td>+</td>
              <td>{data.wechatIncome}</td>
              <td>+</td>
              <td>{data.iphoneIncome}</td>
            </tr>
          </table>
        </div>
      ])
  }
  disabledDate(value) {
    if (moment(value).diff(moment(), 'month') > -1)
      return true
  }

  render() {
    const {result, format, echartData, loading} = this.state
    const {docFiances, hosFiances, platformBusiness, platformFiances, ratioFiances} = result
    const unit = format.slice(-1)
    return (<div className='platform'>
      {
        this.ptype
          ? <Row gutter={48} className='text-center tbchart'>
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
                <p>
                  <Button href='#/money/cash'>提现</Button>
                </p>
              </Col>
            </Row>
          : [
            this.htmlSet(platformBusiness, '平台总', '流水'),
            this.htmlSet(platformFiances, '平台'),
            this.htmlSet(docFiances, '医生'),
            this.htmlSet(hosFiances, '医院'),
            this.htmlSet(ratioFiances, '支付', '手续费')
          ]
      }

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
        <MonthPicker allowClear={false} format={format} disabledDate={this.disabledDate.bind(this)} defaultValue={moment().subtract(1, 'month')} onChange={this.sltDate.bind(this)} style={{
            width: '140px'
          }}/>
        <Button type="button" loading={loading} className='right' onClick={this.dataPrint.bind(this, unit)}>导出{unit}收入</Button>
      </div>
      <div id="echart" style={{
          height: '600px',
          paddingTop: '30px',
          backgroundColor: '#f3f3f3'
        }}></div>
    </div>)
  }
}
