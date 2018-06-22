import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Checkbox, Button} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      message: null,
      tbinfo: '',
      router: null
    }
  }

  componentWillMount() {
    //type顺序
    //主症状、子针状、中成药、病例、养生建议、中医疾病、中药方
    const {type, id} = this.props.params
    const url = [
      `mainsymptom/${id}`,
      `minorsymptom/${id}`,
      `drug/${id}`,
      `similarases/${id}`,
      `healthcaresuggest/${id}`,
      `dzdisease/${id}`,
      `prescription/${id}`
    ][type - 1];
    const router = [
      `symptommain/edit/${id}`,
      `symptomsecond/edit/${id}`,
      `drug/edit/1/${id}`,
      `illness/edit/${id}`,
      `advice/edit/${id}`,
      `illnesszh/edit/${id}`,
      `drug/edit/2/${id}`
    ][type - 1];
    this.setState({router: `#/medicine/china/${router}`})
    ajax({
      url: '/v1/tcm/' + url,
      type: 'GET',
      success: res => {
        if (res.result) {
          const result = res.result
          this.setState({result})
          let tbinfo = '';
          switch (Number(type)) {
            case 1:
              tbinfo = <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>主症状名：</td>
                  <td>{result.name}</td>
                </tr>
                <tr>
                  <td>所属性别：</td>
                  <td>{['女', '男', '儿童'][result.crowd]}</td>
                </tr>
                <tr>
                  <td>所属部位：</td>
                  <td>{result.position}</td>
                </tr>
              </table>;
              break;
            case 2:
              tbinfo = <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>子症状名：</td>
                  <td>{result.base.name}</td>
                </tr>
                {
                  result.main.map((item, index) => <tr>
                    <td>所属主症状{index + 1}：</td>
                    <td>{item.name}</td>
                    <td>所属性别：</td>
                    <td>{['女', '男', '儿童'][item.crowd]}</td>
                    <td>所属部位：</td>
                    <td>{item.position}</td>
                  </tr>)
                }
              </table>;
              break;
            case 3:
              tbinfo = <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>药品名称：</td>
                  <td>{result.name}</td>
                </tr>
                <tr>
                  <td>药品类别：</td>
                  <td>中药方</td>
                </tr>
                <tr>
                  <td>主要成分：</td>
                  <td>{result.mainIngredients}</td>
                </tr>
                <tr>
                  <td>功能主治：</td>
                  <td>{result.majorFunction}</td>
                </tr>
                <tr>
                  <td>用法用量：</td>
                  <td>{result.usageAndDosage}</td>
                </tr>
                <tr>
                  <td>注意事项：</td>
                  <td>{result.mattersNeedAttention}</td>
                </tr>
                <tr>
                  <td>规格：</td>
                  <td>{result.specification}</td>
                </tr>
                <tr>
                  <td>批准文号：</td>
                  <td>{result.approvalNumber}</td>
                </tr>
                <tr>
                  <td>生产企业：</td>
                  <td>{result.manufacturingnterprise}</td>
                </tr>
                <tr>
                  <td>性状：</td>
                  <td>{result.properties}</td>
                </tr>
                <tr>
                  <td>贮藏：</td>
                  <td>{result.storeUp}</td>
                </tr>
                <tr>
                  <td>有效期：</td>
                  <td>{result.periodOfValidity?moment(result.periodOfValidity).format(format):null}</td>
                </tr>
                <tr>
                  <td>药理作用：</td>
                  <td>{result.pharmacologicction}</td>
                </tr>
                <tr>
                  <td>药物相互作用：</td>
                  <td>{result.drugnteractions}</td>
                </tr>
                <tr>
                  <td>不良反应：</td>
                  <td>{result.badReflect}</td>
                </tr>
                <tr>
                  <td>禁忌：</td>
                  <td>{result.taboo}</td>
                </tr>
              </table>;
              break;
            case 4:
              tbinfo = <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>病例标题：</td>
                  <td>{result.title}</td>
                </tr>
                <tr>
                  <td>病例出处：</td>
                  <td>{result.casesOfTheSource}</td>
                </tr>
                <tr>
                  <td>医生名：</td>
                  <td>{result.author}</td>
                </tr>
                <tr>
                  <td>主诉：</td>
                  <td>{result.actionInChief}</td>
                </tr>
                <tr>
                  <td>现病史：</td>
                  <td>{result.nowDied}</td>
                </tr>
                <tr>
                  <td>中医诊断：</td>
                  <td>{result.tcmDiagnosis}</td>
                </tr>
                <tr>
                  <td>西医诊断：</td>
                  <td>{result.westernDiagnosis}</td>
                </tr>
              </table>;
              break;
            case 5:
              tbinfo = <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>养生标题：</td>
                  <td>{result.title}</td>
                </tr>
                <tr>
                  <td>养生描述：</td>
                  <td dangerouslySetInnerHTML={{
                      __html: result.content
                    }}></td>
                </tr>
              </table>;
              break;
            case 6:
              this.setState({
                result: {
                  ...result,
                  createTime: result.baseInfo.createTime
                }
              })
              let prescription = JSON.parse(result.prescription.items);
              let prescriptionHtml = '';
              for (var item in prescription) {
                prescriptionHtml += '<span class="pr10">' + item + prescription[item] + '</span>'
              }
              tbinfo = <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>病名：</td>
                  <td>{result.baseInfo.name}</td>
                </tr>
                <tr>
                  <td>所属主症状：</td>
                  <td>{result.mainsymptom.name}</td>
                </tr>
                <tr>
                  <td>包含子症状：</td>
                  <td>
                    <ul className='tdlist'>
                      {
                        result.minorsymptom.map(item =>< li > {
                          item.name
                        }</li>)
                      }
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>病因分析：</td>
                  <td>{result.baseInfo.intro}</td>
                </tr>
                <tr>
                  <td>中成药：</td>
                  <td>
                    <ul className='tdlist'>
                      {
                        result.drug.map(item =>< li > {
                          item.name
                        }</li>)
                      }
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>中药方：</td>
                  <td dangerouslySetInnerHTML={{
                      __html: prescriptionHtml
                    }}></td>
                </tr>
                <tr>
                  <td>养生建议：</td>
                  <td>{result.healthcaresuggest.title}（{result.healthcaresuggest.content}）</td>
                </tr>
              </table>;
              break;
            case 7:
              let drugs = JSON.parse(result.items);
              let drugsHtml = `<colgroup span="1" className='tbtitle'/><tr><td>药品名称：</td><td>${result.name}</td></tr>`;
              for (var item in drugs) {
                drugsHtml += `<tr><td>${item}</td><td>${drugs[item]}</td></tr>`
              }
              tbinfo = <table dangerouslySetInnerHTML={{
                  __html: drugsHtml
                }}></table>;
              break;
            default:
              break;

          }
          this.setState({tbinfo})
        } else {
          this.setState({message: '未查询到信息'})
        }
      }
    })

  }

  render() {
    const {type} = this.props.params
    const {message, result, tbinfo, router} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>

                <Button href={router}>修改</Button>
              </div>
              {tbinfo}
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/> {
                  Number(type) > 2
                    ? null
                    : <tr>
                        <td>展示状态：</td>
                        <td>{['删除', '屏蔽', '正常'][result.status]}</td>
                      </tr>
                }
                <tr>
                  <td>最近修改：</td>
                  <td>{moment(result.createTime).format(format)}</td>
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
