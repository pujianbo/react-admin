import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import {Form, Button} from 'antd';

export default class datalist extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      message: null
    }
  }

  componentWillMount() {
    const {id, type} = this.props.params
    ajax({
      url: `/useManual/getuseManualDetails?id=${id}&type=${type}`,
      success: res => {
        if (res.result) {
          this.setState({result: res.result})
        } else {
          this.setState({message: '未查询到信息'})
        }
      }
    })
  }

  mulDataHandle(status){
    console.log(status);
    let url = `/user/batch-del`
    let type = 'DELETE'
    let data = {
      ids: _this.selectedRowID
    }
    // ajax({
    //   url,
    //   type,
    //   data,
    //   success: res => {
    //     if (res.code == 0) {
    //       message.success(res.message)
    //       this.getData(1);
    //     } else {
    //       message.error(res.message)
    //     }
    //   }
    // })
  }

  render() {
    const {type, id} = this.props.params
    const {message, result} = this.state
    return (<div className='tbdetail'>
      {
        message
          ? <p className='cred'>{message}</p>
          : <div>
              <Form className='frmbtntop text-right'>
                <Button onClick={this.mulDataHandle.bind(this,2)}>删除</Button>
                <Button onClick={this.mulDataHandle.bind(this,2)}>屏蔽</Button>
                <Button href={`#/content/apphelp/edit/${type}/${id}`}>修改</Button>
              </Form>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>问题标题：</td>
                  <td>{result.title}</td>
                </tr>
                <tr>
                  <td className='vtop'>问题正文：</td>
                  <td dangerouslySetInnerHTML={{
                      __html: result.intro
                    }}/>
                </tr>
              </table>
              <div className='tbbar'>其他信息</div>
              <table>
                <colgroup span="1" className='tbtitle'/>
                <tr>
                  <td>问题状态：</td>
                  <td>{['全部', '已发布', '草稿'][result.state]}</td>
                </tr>
                <tr>
                  <td>发布时间：</td>
                  <td>{moment(result.releaseTime).format(format)}</td>
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
