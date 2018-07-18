import React, {Component} from 'react'
import {Link} from 'react-router'
import {Tag, Pagination, message} from 'antd'
import moment from 'moment'

export default class demo extends Component {
  constructor() {
    super();
    this.hosp = !!localStorage.hospitalId
    this.pageIndex = 1
    this.state = {
      result: {},
      message: null
    }
  }

  componentWillMount() {
    this.getData()
  }

  getData() {
    ajax({
      url: `/v1/announcement/${this.hosp
        ? 'hospitaluserfindall'
        : 'adminuserfindall'}?orderBy=-${this.hosp
          ? 'send_time'
          : 'sendTime'}&pageSize=10&pageIndex=${this.pageIndex}`,
      type: 'POST',
      success: res => {
        if (res.result) {
          if (res.result.result)
            res.result.content = res.result.result
          this.setState({result: res.result})
        } else {
          this.setState({message: '未查询到信息'})
        }
      }
    })
  }

  pageChange(page, pageSize) {
    this.pageIndex = page
    this.getData()
  }

  setReaded(num) {
    const ids = []
    if (num == 2) {
      this.state.result.content.map(item => {
        ids.push(item.id)
      })
    }
    ajax({
      url: `/v1/announcement/${this.hosp
        ? 'hospitaluserbatch'
        : 'adminuserread'}`,
      type: 'POST',
      data: {
        ids
      },
      success: res => {
        if (res.code == 0) {
          message.success(res.message);
          this.getData()
        } else {
          message.error(res.message);
        }
      }
    })
  }

  render() {
    const {result} = this.state
    return (<div className='tbdetail'>
      <div className='tbbar'>
        消息
        <span className='right'>
          <Tag onClick={this.setReaded.bind(this, 1)}>标记所有已读</Tag>
          <Tag onClick={this.setReaded.bind(this, 2)}>标记本页已读</Tag>
        </span>
      </div>
      {
        result.content
          ? <div className='msglistbox'>
              <table >
                {
                  result.content.map(item => {
                    return <tr className={item.isRead
                        ? 'isRead'
                        : null}>
                      <td className='name'>{item.realname}</td>
                      <td className='title'>
                        <Link className='link' to={`/message/detail/${item.id}/1`}>{item.msgTitle}</Link>
                      </td>
                      <td className='time'>{
                          item.sendTime
                            ? moment(item.sendTime).format('YYYY.MM.DD HH:mm:ss')
                            : null
                        }</td>
                    </tr>
                  })
                }
              </table>
            </div>
          : null
      }
      <div className='text-center'>{
          result.totalCount > 10
            ? <Pagination pageSize={10} total={result.totalCount} onChange={this.pageChange.bind(this)}/>
            : null
        }</div>
    </div>)
  }
}
