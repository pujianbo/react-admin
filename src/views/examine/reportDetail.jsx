import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Checkbox,Button} from 'antd';

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
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <div className='text-right' style={{
                  marginBottom: '20px'
                }}>
                <Button style={{
                    marginRight: '10px'
                  }}>忽略</Button>
                <Button>处理</Button>
              </div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>被举报人：</td>
                  <td>柳木海</td>
                </tr>
                <tr>
                  <td>举报类型：</td>
                  <td>评论</td>
                </tr>
                <tr>
                  <td className='vtop'>被举报内容：</td>
                  <td>
                    <ul>
                      <li>可以视频聊天了，大幅提升医患沟通体验；可以自我诊断……</li>
                      <li>1.朋友圈虚假健康文章太多，来这里可以看看医生写的「科普文章」，每天学点健康知识；</li>
                      <li>2.生病了，想了解下疾病症状，怎么治，吃什么药，去哪个医院治疗比较好，可以通过「常见病症」查找；</li>
                      <li>3.孕妇、喂奶期的妈妈，最担心吃错药对孩子有不良影响，丁香医生对药品安全性做了标注，在丁香医生搜索这个药品，就知道能不能吃；</li>
                      <li>4.吃药期间，多份药物同时服用时，给出「药物相关作用」，为您生成「服药清单」，输入服药间隔后，自动「服药提醒」；</li>
                      <li>5.爸妈容易被忽悠买保健品？试试丁香医生的「鉴别虚假医疗广告」功能，让虚假广告显出原形;</li>
                      <li>6.小孩打疫苗很麻烦，老是忘记怎么办？试试「疫苗管理」功能，打什么疫苗，什么时间，去哪打，一目了然。</li>
                    </ul>
                    <div className='imglist'>
                      <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                      <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                      <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                      <a target='_blank'><img src='https://wx1.sinaimg.cn/thumb150/92be1fb5ly1fq7c38bcrjj203j03jmx1.jpg'/></a>
                    </div>
                  </td>
                </tr>
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>处理状态：</td>
                  <td>待处理</td>
                </tr>
                <tr>
                  <td>被举报次数：</td>
                  <td>44</td>
                </tr>
                <tr>
                  <td>举报人：</td>
                  <td>李开慧</td>
                </tr>
                <tr>
                  <td>举报时间：</td>
                  <td>{moment(result.cteateDate).format(format)}</td>
                </tr>
              </table>
            </div>
      }
    </div>)
  }
}
