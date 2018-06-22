import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Button} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      message: null
    }
  }

  componentWillMount() {
    const {id} = this.props.params
    ajax({
      url: `/stdbiocheck/findOne?stdbiocheckId=${id}`,
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
    const {id} = this.props.params
    const {message, result} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>

                <Button href={`#/medicine/west/conclusion/edit/${id}`}>修改</Button>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>检验项目：</td>
                  <td>{result.name}</td>
                </tr>
                <tr>
                  <td>项目英文：</td>
                  <td>{result.code}</td>
                </tr>
                <tr>
                  <td>标准值：</td>
                  <td>{result.sizeRelation}</td>
                </tr>
                <tr>
                  <td>项目简介：</td>
                  <td>{result.intro}</td>
                </tr>
              </table>
              <div className='tbbar'>智检结论<span className='cred' style={{
                fontSize: '12px',
                paddingLeft: '10px'
              }}>升高趋势</span>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>轻度结论：</td>
                  <td>{result.upMildwarn}</td>
                </tr>
                <tr>
                  <td>中度结论：</td>
                  <td>{result.upMiddlewarn}</td>
                </tr>
                <tr>
                  <td>重度结论：</td>
                  <td>{result.upHighwarn}</td>
                </tr>
              </table>
              <div className='tbbar'>智检结论<span className='cgreen' style={{
                fontSize: '12px',
                paddingLeft: '10px'
              }}>降低趋势</span>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>轻度结论：</td>
                  <td>{result.downMildwarn}</td>
                </tr>
                <tr>
                  <td>中度结论：</td>
                  <td>{result.downMiddlewarn}</td>
                </tr>
                <tr>
                  <td>重度结论：</td>
                  <td>{result.downHighwarn}</td>
                </tr>
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>展示状态：</td>
                  <td>{['正常', '屏蔽', '草稿'][result.showState]}</td>
                </tr>
                <tr>
                  <td>最近修改：</td>
                  <td>{moment(result.updateTime).format(format)}</td>
                </tr>
                <tr>
                  <td>创建时间：</td>
                  <td>{moment(result.createTime).format(format)}</td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
