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
const CheckboxGroup = Checkbox.Group;
const {TextArea} = Input;
import {symptomList, minsymptomList, adviceList, drugList, prescriptList} from '../../../tools'
let Id = null;
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
let Demo = React.createClass({
  getInitialState() {
    return {
      loading: false,
      symptomList: [],
      minsymptomList: [],
      adviceList: [],
      drugList: [],
      prescriptList: [],
      jobList: [],
      result: {
        baseInfo: {},
        healthcaresuggest: {},
        prescription: {},
        mainsymptom: {}
      },
      examine: []
    };
  },
  componentWillMount() {
    symptomList().then(symptomList => {
      this.setState({symptomList})
    })
    adviceList().then(adviceList => {
      this.setState({adviceList})
    })
    drugList().then(drugList => {
      this.setState({drugList})
    })
    prescriptList().then(prescriptList => {
      this.setState({prescriptList})
    })
    if (Id)
      ajax({
        url: `/v1/tcm/dzdisease/${Id}`,
        async: false,
        success: res => {
          if (res.result) {
            let result = res.result;
            const drugs = []
            const minorsymptoms = []
            result.drug.map(item => {
              drugs.push(item.id)
            })
            result.minorsymptom.map(item => {
              minorsymptoms.push(item.id)
            })
            result = {
              ...result,
              drugs,
              minorsymptoms
            }

            this.setState({result})
            this.sltMainSymptom(result.mainsymptom.id)
          } else {
            message.error(res.message);
          }
        }
      })
  },
  setType(status) {
    this.status = status
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return
      let data = this.props.form.getFieldsValue();
      data.id = Id
      data.status = this.status
      if (!data.minorSymptoms) {
        message.warn('请选择子症状');
        return
      }
      this.setState({loading: true})
      ajax({
        url: '/v1/tcm/dzdisease',
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
  sltMainSymptom(value) {
    minsymptomList({mainSymptomId: value}).then(minsymptomList => {
      minsymptomList.map(item => {
        if (item.base.name) {
          item.label = item.base.name
          item.value = item.base.id
        }
      })
      this.setState({minsymptomList})
    }).catch(() => {
      this.setState({minsymptomList: []})
    })
  },
  render() {
    const {
      loading,
      symptomList,
      minsymptomList,
      adviceList,
      drugList,
      prescriptList,
      result,
      examine
    } = this.state
    const {getFieldDecorator} = this.props.form
    return (<div className='tbdetail drugform overhidden'>
      <Form onSubmit={this.handleSubmit}>
        <FormItem className='text-right inlinepull'>
          <Button onClick={() => {
              history.back()
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} htmlType="submit" onClick={this.setType.bind(this, 0)} loading={loading}>存草稿</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" onClick={this.setType.bind(this, 2)} loading={loading}>完成</Button>
        </FormItem>

        <FormItem {...formItemLayout} label="疾病名">
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.baseInfo.name
            })(<Input placeholder="请输入疾病名"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="所属主症状">
          {
            getFieldDecorator('mainSymptomID', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.mainsymptom.id
            })(<Select placeholder="选择主症状" onChange={this.sltMainSymptom.bind(this)} showSearch="showSearch" style={{
                width: 200
              }} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {symptomList.map(item => <Option value={item.id}>{item.name}</Option>)}
            </Select>)
          }
        </FormItem>
        {
          <FormItem {...formItemLayout} label="包含子症状">
              {
                getFieldDecorator('minorSymptoms', {
                  rules: [
                    {
                      required: true,
                      message: '必填'
                    }
                  ],
                  initialValue: result.minorsymptoms
                })(
                  minsymptomList.length > 0
                  ? <CheckboxGroup options={minsymptomList}/>
                  : <span className='cred'>未获取到子症状</span>)
              }
            </FormItem>

        }
        <div className='inlinepull'>
          <div className='tbbar'>病因分析</div>
        </div>
        <FormItem {...formItemLayout} label="病因分析">
          {
            getFieldDecorator('intro', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.baseInfo.intro
            })(<TextArea placeholder="输入病因分析" autosize={{
                minRows: 3
              }}/>)
          }
        </FormItem>
        <div className='inlinepull'>
          <div className='tbbar'>选择药品</div>
        </div>
        <FormItem {...formItemLayout} label="中成药" className='druglist'>
          {
            getFieldDecorator('drugs', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.drugs
            })(<Select mode="multiple" style={{
                width: '100%'
              }} placeholder="选择中成药">
              {drugList.map(item => <Option value={item.id}>{item.name}</Option>)}
            </Select>)
          }
        </FormItem>
        {examine.map(item => item)}
        <FormItem {...formItemLayout} label="中药方">
          {
            getFieldDecorator('prescriptionCode', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.prescription.code
            })(<Select placeholder="选择中药方" showSearch="showSearch" style={{
                width: 200
              }} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {prescriptList.map(item => <Option value={item.code}>{item.name}</Option>)}
            </Select>)
          }
        </FormItem>
        <div className='inlinepull'>
          <div className='tbbar'>养生建议</div>
        </div>
        <FormItem {...formItemLayout} label="养生建议">
          {
            getFieldDecorator('healthCareSuggestID', {
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ],
              initialValue: result.healthcaresuggest.id
            })(<Select placeholder="选择养生建议" showSearch="showSearch" style={{
                width: 200
              }} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {adviceList.map(item => <Option value={item.id}>{item.title}</Option>)}
            </Select>)
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
