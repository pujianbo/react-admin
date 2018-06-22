import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  DatePicker,
  Tabs,
  Icon,
  message
} from 'antd';
import moment from 'moment'
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {TextArea} = Input;
let Id = null;
let tabindex = 1;
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, result: {}, examine: [], tabindex};
  },
  componentWillMount() {
    const {tabindex} = this.state;
    if (Id)
      ajax({
        url: tabindex == 1
          ? `/v1/tcm/drug/${Id}`
          : `/v1/tcm/prescription/${Id}`,
        async: false,
        success: res => {
          if (res.result) {
            let result = res.result
            if (tabindex == 2) {
              const arr = [];
              const json = JSON.parse(result.items);
              for (var item in json) {
                arr.push({name: item, value: json[item]})
              }
              result.drugs = arr
              if (arr.length > 1) {
                for (var i = 1; i < arr.length; i++) {
                  arr[i].index = i + 1;
                  this.elementEdit(1, arr[i])
                }
              }
            }
            this.setState({result})
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

      const {tabindex} = this.state
      let data = this.props.form.getFieldsValue();
      if (tabindex == 2) {
        data.code = Id
        data.name = data.nametemp
        delete data.nametemp
        delete data.number
        delete data.drug
        let items = {};
        $('.druglist').each(function() {
          items[$(this).find('.name').val()] = $(this).find('.value').val()
        })
        data.items = JSON.stringify(items)
      } else {
        data.id = Id
      }
      this.setState({loading: true})
      ajax({
        url: tabindex == 1
          ? `/v1/tcm/drug`
          : `/v1/tcm/prescription`,
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
  elementEdit(type, data) {
    let index = $('.inlinepull').length - 1
    if (index < 0)
      index = data.index
    let html = <div className='inlinepull druglist'>
      <FormItem label={"药材" + index}>
        <Input placeholder="请输入药材名称" className='name' defaultValue={data.name || ''}/>
      </FormItem>
      <FormItem label="重量">
        <Input style={{
            width: '80px'
          }} defaultValue={data.value || ''} className='value' placeholder="数值"/>
      </FormItem>
    </div>;
    let {examine} = this.state
    if (type == 1) {
      examine.push(html)
    } else {
      examine.pop();
    }
    this.setState({examine})
  },
  callback(key) {
    this.setState({tabindex: key})
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 3
        }
      }
    };
    const {loading, result, examine, tabindex} = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail drugform overhidden'>
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Tabs defaultActiveKey={tabindex} onChange={this.callback} tabBarExtraContent={<FormItem className = 'text-right inlinepull' > <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} htmlType="submit" loading={loading}>存草稿</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>完成</Button>
        </FormItem>}>
          <TabPane tab="中成药" key="1">
            {
              tabindex == 1
                ? <div>
                    <FormItem {...formItemLayout} label="药品名称" className='inlinepull'>
                      {
                        getFieldDecorator('name', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.name
                        })(<Input placeholder="请输入药品名称"/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="主要成分" className='inlinepull'>
                      {
                        getFieldDecorator('mainIngredients', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.mainIngredients
                        })(<TextArea placeholder="输入主要成分" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="功能主治" className='inlinepull'>
                      {
                        getFieldDecorator('majorFunction', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.majorFunction
                        })(<TextArea placeholder="输入功能主治" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="用法用量" className='inlinepull'>
                      {
                        getFieldDecorator('usageAndDosage', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.usageAndDosage
                        })(<TextArea placeholder="输入用法用量" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="注意事项" className='inlinepull'>
                      {
                        getFieldDecorator('mattersNeedAttention', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.mattersNeedAttention
                        })(<TextArea placeholder="输入注意事项" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="规格" className='inlinepull'>
                      {
                        getFieldDecorator('specification', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.specification
                        })(<Input placeholder="请输入规格"/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="批准文号" className='inlinepull'>
                      {
                        getFieldDecorator('approvalNumber', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.approvalNumber
                        })(<Input placeholder="请输入批准文号"/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="生产企业" className='inlinepull'>
                      {
                        getFieldDecorator('manufacturingnterprise', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.manufacturingnterprise
                        })(<Input placeholder="请输入生产企业"/>)
                      }
                    </FormItem>
                    <div className='inlinepull'>
                      <div className='tbbar'>扩展信息</div>
                    </div>
                    <FormItem {...formItemLayout} label="性状" className='inlinepull'>
                      {getFieldDecorator('properties', {initialValue: result.properties})(<Input placeholder="请输入性状"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="有效期" className='inlinepull'>
                      {
                        getFieldDecorator('periodOfValidity', {
                          initialValue: result.periodOfValidity?moment(result.periodOfValidity):null
                        })(<DatePicker placeholder='请输入有效期'/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="贮藏" className='inlinepull'>
                      {getFieldDecorator('storeUp', {initialValue: result.storeUp})(<Input placeholder="请输入贮藏"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="不良反应" className='inlinepull'>
                      {
                        getFieldDecorator('badReflect', {initialValue: result.badReflect})(<TextArea placeholder="不良反应" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="禁忌" className='inlinepull'>
                      {
                        getFieldDecorator('taboo', {initialValue: result.taboo})(<TextArea placeholder="禁忌" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="药物相互作用" className='inlinepull'>
                      {
                        getFieldDecorator('drugnteractions', {initialValue: result.drugnteractions})(<TextArea placeholder="药物相互作用" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="药理作用" className='inlinepull'>
                      {
                        getFieldDecorator('pharmacologicction', {initialValue: result.pharmacologicction})(<TextArea placeholder="药理作用" autosize={{
                            minRows: 3
                          }}/>)
                      }
                    </FormItem>
                  </div>
                : null
            }
          </TabPane>
          <TabPane tab="中药方" key="2">
            {
              tabindex == 2
                ? <div>
                    <FormItem label="药方名称" className='inlinepull'>
                      {
                        getFieldDecorator('nametemp', {
                          rules: [
                            {
                              required: true,
                              message: '必填'
                            }
                          ],
                          initialValue: result.name
                        })(<Input placeholder="请输入药方名称"/>)
                      }
                    </FormItem>
                    <div className='inlinepull druglist'>
                      <FormItem label="药材1">
                        {
                          getFieldDecorator('drug', {
                            rules: [
                              {
                                required: true,
                                message: '必填'
                              }
                            ],
                            initialValue: result.drugs
                              ? result.drugs[0].name
                              : null
                          })(<Input placeholder="请输入药材名称" className='name'/>)
                        }
                      </FormItem>
                      <FormItem label="重量">
                        {
                          getFieldDecorator('number', {
                            rules: [
                              {
                                required: true,
                                message: '必填'
                              }
                            ],
                            initialValue: result.drugs
                              ? result.drugs[0].value
                              : null
                          })(<Input style={{
                              width: '80px'
                            }} placeholder="数值" className='value'/>)
                        }
                      </FormItem>
                      <span className='addreduce'>
                        <Icon className='cblue' type="plus-square" onClick={this.elementEdit.bind(this, 1)}/>
                        <Icon style={{
                            marginLeft: '10px'
                          }} className='cred' type="minus-square" onClick={this.elementEdit.bind(this, 0)}/>
                      </span>
                    </div>
                    {examine.map(item => item)}
                  </div>
                : null
            }
          </TabPane>
        </Tabs>

      </Form>
    </div>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  componentWillMount() {
    Id = this.props.params.id
    tabindex = this.props.params.tabindex
  }
  render() {
    return <Demo/>
  }
}
