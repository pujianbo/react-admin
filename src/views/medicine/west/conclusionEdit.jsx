import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Icon,
  message
} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
let Id = null;
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, result: {}, between: false};
  },
  componentWillMount() {
    if (Id)
      ajax({
        url: `/stdbiocheck/findOne?stdbiocheckId=${Id}`,
        async: false,
        success: res => {
          if (res.result) {
            let between = res.result.stdValue.indexOf('-') > -1
              ? true
              : false
            this.setState({result: res.result, between})
          } else {
            message.error(res.message);
          }
        }
      })
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return

      let data = this.props.form.getFieldsValue();

      if (Id)
        data.id = Id
      if (data.between && !data.std2) {
        message.warn('请填写检验值范围')
        return
      }
      if (data.percent) {
        data.std1 = data.std1 + '%'
        if (data.std2)
          data.std2 = data.std2 + '%'
      }
      console.log(data);
      // return
      this.setState({loading: true})
      ajax({
        url: '/stdbiocheck/addOrUpdate',
        type: 'POST',
        data,
        success: res => {
          this.setState({loading: false})
          if (res.code == 0) {
            hashHistory.go(-1)
          } else {
            message.error(res.message)
          }
        }
      })
    })
  },
  sltBeteen(e) {
    let obj = $('#' + e.target.id).parents('.inlinepull').find('.between')
    this.setState({between: e.target.checked})
    if (e.target.checked) {
      obj.show()
    } else {
      obj.hide()
    }
  },
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 3
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 14
        }
      }
    };

    const {loading, result, between} = this.state
    const {getFieldDecorator} = this.props.form

    return (<div className='tbdetail overhidden'>
      <Form onSubmit={this.handleSubmit} layout="inline">
        <FormItem className='text-right inlinepull'>
          <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} htmlType="submit" loading={loading}>存草稿</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>完成</Button>
        </FormItem>
        <FormItem {...formItemLayout} label="检验项目" className='inlinepull'>
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请填写检验项目'
                }
              ],
              initialValue: result.name
            })(<Input placeholder="请输入检验项目"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="项目英文" className='inlinepull'>
          {
            getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请填写项目英文'
                }
              ],
              initialValue: result.code
            })(<Input placeholder="请输入检验项目英文缩写，区分大小写"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} className='inlinepull' label="检验值">
          {
            getFieldDecorator('sizestr', {
              rules: [
                {
                  required: true,
                  message: '请填写检验值范围'
                }
              ],
              initialValue: result.name
            })(<div>
              <FormItem>
                {
                  getFieldDecorator('sizeRelation', {initialValue: '小于'})(<Select defaultValue="0" style={{
                      width: '80px'
                    }}>
                    <Option value="<">小于</Option>
                    <Option value=" =">等于</Option>
                    <Option value=">">大于</Option>
                  </Select>)
                }
              </FormItem>
              <FormItem>
                {
                  getFieldDecorator('std1', {
                    rules: [
                      {
                        required: true,
                        message: '必填'
                      }
                    ],
                    initialValue: result.stdValue?result.stdValue.split('-')[0]:''
                  })(<Input style={{
                      width: '80px'
                    }} placeholder="数值"/>)
                }
              </FormItem>
              {
                between? [
                  <FormItem className='between'>
                    到</FormItem>,
                  <FormItem className='between'>
                    {
                      getFieldDecorator('std2', {
                        rules: [
                          {
                            required: between,
                            message: '必填'
                          }
                        ],
                        initialValue: result.stdValue?result.stdValue.split('-')[1]:''
                      })(<Input style={{
                          width: '80px'
                        }} placeholder="数值"/>)
                    }
                  </FormItem>
                ]: null
              }
              <FormItem>
                {getFieldDecorator('between')(<Checkbox defaultChecked={between} onChange={this.sltBeteen.bind(this)}>区间值</Checkbox>)}
              </FormItem>
              <FormItem>
                {
                  getFieldDecorator('percent')(<Checkbox defaultChecked={result.stdValue&&result.stdValue.indexOf('%') > -1
                      ? true
                      : false}>百分比</Checkbox>)
                }
              </FormItem>
            </div>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="项目简介" className='inlinepull'>
          {
            getFieldDecorator('intro', {
              rules: [
                {
                  required: true,
                  message: '请填写项目简介'
                }
              ],
              initialValue: result.intro
            })(<TextArea placeholder="请输入项目简介" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <div className='inlinepull'>
          <div className='tbbar'>智检结论<span className='cred' style={{
        fontSize: '12px',
        paddingLeft: '10px'
      }}>升高趋势</span>
          </div>
        </div>
        <FormItem {...formItemLayout} label="轻度结论" className='inlinepull'>
          {
            getFieldDecorator('upMildwarn', {initialValue: result.upMildwarn})(<TextArea placeholder="请输入轻度结论" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="中度结论" className='inlinepull'>
          {
            getFieldDecorator('upMiddlewarn', {initialValue: result.upMiddlewarn})(<TextArea placeholder="请输入中度结论" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="重度结论" className='inlinepull'>
          {
            getFieldDecorator('upHighwarn', {initialValue: result.upHighwarn})(<TextArea placeholder="请输入重度结论" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <div className='inlinepull'>
          <div className='tbbar'>智检结论<span className='cgreen' style={{
        fontSize: '12px',
        paddingLeft: '10px'
      }}>降低趋势</span>
          </div>
        </div>
        <FormItem {...formItemLayout} label="轻度结论" className='inlinepull'>
          {
            getFieldDecorator('downMildwarn', {initialValue: result.downMildwarn})(<TextArea placeholder="请输入轻度结论" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="中度结论" className='inlinepull'>
          {
            getFieldDecorator('downMiddlewarn', {initialValue: result.downMiddlewarn})(<TextArea placeholder="请输入中度结论" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="重度结论" className='inlinepull'>
          {
            getFieldDecorator('downHighwarn', {initialValue: result.downHighwarn})(<TextArea placeholder="请输入重度结论" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
      </Form>
    </div>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  componentWillMount() {
    Id = this.props.params.id
  }
  render() {
    return <Demo/>
  }
}
