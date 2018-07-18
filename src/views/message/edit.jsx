import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Upload,
  Button,
  Form,
  Input,
  Select,
  message,
  DatePicker,
  Icon,
  Checkbox,
  Tabs,
  Tree,
  Radio,
  Cascader
} from 'antd';
import {roleList, serverCity} from '../../tools'
import moment from 'moment'
const {RangePicker} = DatePicker;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;

let Id = null
let Demo = React.createClass({
  ue: null,
  save: 1,
  sendTime: null,
  regions: [],
  regionCodes: [],
  getInitialState() {
    return {result: {}, checked: false, cityList: [], roleList: []};
  },
  componentWillMount() {
    this.regions = []
    this.regionCodes = []
    serverCity().then((cityList) => {
      this.setState({cityList})
    })
    roleList().then((roleList) => {
      roleList.map((item, index) => {
        item.label = item.roleName
        item.value = item.id
      })
      this.setState({roleList})
    })
    if (Id)
      ajax({
        url: `/v1/announcement/findannouncement?id=${Id}`,
        async: false,
        success: res => {
          if (res.code == 0) {
            this.setState({result: res.result})
          } else {
            message.error(res.message);
          }
        }
      })
  },
  componentDidMount() {
    this.ue = UE.getEditor('container');
  },
  componentWillUnmount() {
    if (UE) {
      UE.getEditor('container').destroy();
    }
  },
  saveTemp(type) {
    this.save = type;
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return
      let data = this.props.form.getFieldsValue();
      let msgContent = this.ue.getContent();
      if (msgContent == '') {
        message.warn('请填写消息正文');
        return
      }
      data.msgContent = msgContent
      data.region = this.regions
      data.regionCodes = this.regionCodes
      // data.status = 3//草稿
      console.log(data);
      if (this.state.checked) {
        if (this.sendTime) {
          data.sendTime = moment(this.sendTime).format()
        } else {
          message('请选择定时发送的时间')
          return
        }
      }
      if (Id)
        data.id = Id
      // if (this.save == 2)
      //   data.status = 3

      ajax({
        url: `/v1/announcement/${this.save == 2
          ? 'savedraft'
          : 'saveorupdate'}`,
        type: 'POST',
        data,
        success: res => {
          if (res.code == 0) {
            hashHistory.go(-1)
          } else {
            message.error(res.message)
          }
        }
      })
    })
  },

  onChangeCity(e) {
    const {value, lbl} = e.target;
    if (e.target.checked) {
      this.regionCodes.push(value)
      this.regions.push(lbl)
    } else {
      this.regions.splice(this.regions.findIndex(item => item == lbl), 1)
      this.regionCodes.splice(this.regionCodes.findIndex(item => item == value), 1)
    }
    console.log(this.regions);
    this.regions = Array.from(new Set(this.regions))
    this.regionCodes = Array.from(new Set(this.regionCodes))
    console.log(this.regions);
  },
  publishTime() {
    this.setState({
      checked: !this.state.checked
    })
  },
  sltDate(value) {
    this.sendTime = value;
    // console.log(moment(value).format());
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
          span: 21
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
    const {checked, result, cityList, roleList} = this.state
    const {getFieldDecorator} = this.props.form

    return (<div className='tbdetail overhidden msgedit'>
      <Form onSubmit={this.handleSubmit}>
        <div className='text-right' style={{
            marginBottom: '20px'
          }}>
          {
            checked
              ? <DatePicker showTime="showTime" onChange={this.sltDate.bind(this)} format="YYYY-MM-DD HH:mm:ss" placeholder="设置发布时间" style={{
                    marginRight: '10px'
                  }}/>
              : null
          }
          <Checkbox onChange={this.publishTime} checked={checked} style={{
              marginRight: '10px'
            }}>定时发布</Checkbox>
          <Button style={{
              marginRight: '10px'
            }} onClick={() => {
              hashHistory.go(-1)
            }}>取消</Button>
          <Button htmlType="submit" style={{
              marginRight: '10px'
            }} onClick={this.saveTemp.bind(this, 2)}>存草稿</Button>
          <Button type='primary' htmlType="submit" onClick={this.saveTemp.bind(this, 1)}>发布</Button>
        </div>
        <FormItem {...formItemLayout} label="消息范围">
          {
            getFieldDecorator('region', {
              rules: [
                {
                  required: true,
                  message: '请选择消息范围'
                }
              ]
            })(<div>
              <Checkbox onChange={this.onChangeCity.bind(this)} lbl='全国' value='000000'>全国</Checkbox>
              <Tabs tabPosition='left' className='tbcontainer'>
                {
                  cityList.map(item => {
                    return <TabPane tab={<div className = 'tabname' > <Checkbox onChange={this.onChangeCity.bind(this)} lbl={item.regionName} value={item.regionCode}></Checkbox>
                      <span>{item.regionName}</span>
                    </div>} key={item.id}>
                      {
                        item.list.map(item => {
                          return <Checkbox onChange={this.onChangeCity.bind(this)} lbl={item.regionName} value={item.regionCode}>{item.regionName}</Checkbox>
                        })
                      }
                    </TabPane>
                  })
                }
              </Tabs>
            </div>)
          }

        </FormItem>

        <FormItem {...formItemLayout} label="接收角色">
          {
            getFieldDecorator('roles', {
              rules: [
                {
                  required: true,
                  message: '请选择角色'
                }
              ]
            })(<CheckboxGroup options={roleList}/>)
          }
        </FormItem>
        <FormItem>
          <div className='tbbar'>消息内容</div>
        </FormItem>
        <FormItem {...formItemLayout} label="消息标题">
          {
            getFieldDecorator('msgTitle', {
              rules: [
                {
                  required: true,
                  message: '请填写消息标题'
                }
              ],
              initialValue: result.msgTitle
            })(<Input placeholder='请填写消息标题' style={{
                width: '500px'
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="消息正文">
          <script id="container" name="content" type="text/plain">{result.msgContent}</script>
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
