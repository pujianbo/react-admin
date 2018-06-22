import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  DatePicker,
  Upload,
  Button,
  Form,
  Input,
  Select,
  message,
  Icon,
  Cascader
} from 'antd';
import {cityList} from '../../tools'
import moment from 'moment'
const {RangePicker} = DatePicker;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

const options = cityList()
let hospId = null
let Demo = React.createClass({
  getInitialState() {
    return {loading: false, hospital: {}};
  },
  componentWillMount() {
    if (hospId)
      ajax({
        url: `/hospital/get/${hospId}`,
        async: false,
        success: res => {
          if (res.code == 0) {
            this.setState({hospital: res.result.hospital})
          } else {
            message.error(res.message);
          }
        }
      })
  },
  businessFile: null,
  licenseFile: null,
  hospitalImg: null,
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors)
        return

      let data = this.props.form.getFieldsValue();
      this.setState({loading: true})

      const fmt = 'YYYY.MM.DD'
      data.businessDescribe = moment(data.businessDescribe[0]).format(fmt) + '~' + moment(data.businessDescribe[1]).format(fmt)
      data.licenseDescribe = moment(data.licenseDescribe[0]).format(fmt) + '~' + moment(data.licenseDescribe[1]).format(fmt)
      data.hospitalAddress = data.hospitalAddress.join(',') + ';' + data.hospitalAdrsDetail
      data.hospitalType = Number(data.hospitalType);
      data.hospitalStyle = Number(data.hospitalStyle);
      data.hospitalLevel = Number(data.hospitalLevel);
      data.isYbPoint = true

      delete data.hospitalAdrsDetail;
      delete data.license;
      delete data.business;

      if (hospId)
        data.id = hospId
      setTimeout(() => {
        this.uploading(data, this.businessFile, 'hospitalBusiness', '医疗许可证')
        this.uploading(data, this.licenseFile, 'hospitalLicense', '营业执照')
        this.uploading(data, this.hospitalImg, 'hospitalImg', '医院图片')
        setTimeout(() => {
          console.log(data);
          this.ajaxSubmit(data)
        }, 200)
      }, 100)
    })
  },
  sltFile(type, file, fileList) {
    if (type == 0) {
      this.businessFile = file
    } else if (type == 1) {
      this.licenseFile = file
    } else {
      this.hospitalImg = file
    }
    return false
  },

  uploading(data, file, name, msg) {
    if (file) {
      this.ajaxFile(file).then(res => {
        if (res.code == 0) {
          data[name] = res.result.list[0].id
        } else {
          this.setState({loading: false})
          message.error(`上传${msg}失败`);
        }
      })
    }
  },

  ajaxSubmit(data) {
    ajax({
      url: `/hospital/${hospId
        ? 'update'
        : 'register'}`,
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
  },

  ajaxFile(file) {
    let data = new FormData();
    data.append('files', file)
    return new Promise((resolve, reject) => {
      uploadFile({
        url: `/resource/upload`,
        async: false,
        data
      }, (res) => {
        resolve(res)
      })
    });
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
    const {loading, hospital} = this.state
    const {getFieldDecorator} = this.props.form
    const ylDate = hospId
      ? hospital.businessDescribe.split('~')
      : []
    const yyDate = hospId
      ? hospital.licenseDescribe.split('~')
      : []
    return (<div className='tbdetail overhidden'>
      <Form onSubmit={this.handleSubmit}>
        {
          hospId
            ? null
            : [
              <FormItem {...formItemLayout} label="管理员手机">
                {
                  getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '请填写管理员手机号'
                      }
                    ]
                  })(<Input placeholder='该手机号用于登录医院后台' style={{
                      width: '200px'
                    }}/>)
                }
                <span style={{
                    marginLeft: '10px'
                  }} className='cgreen'>确定后将发送随机登录密码到管理员手机</span>
              </FormItem>,
              <FormItem {...formItemLayout} label="管理员姓名">
                {
                  getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请填写管理员姓名'
                      }
                    ]
                  })(<Input placeholder='请填写管理员姓名' style={{
                      width: '200px'
                    }}/>)
                }
              </FormItem>
            ]
        }
        <FormItem>
          <div className='tbbar'>医院信息</div>
        </FormItem>
        <FormItem {...formItemLayout} label="医院名称">
          {
            getFieldDecorator('hospitalName', {
              rules: [
                {
                  required: true,
                  message: '请填写医院名称'
                }
              ],
              initialValue: hospital.name
            })(<Input placeholder='请填写医院名称' style={{
                width: '300px'
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="医院地址">
          {
            getFieldDecorator('hospitalAddress', {
              rules: [
                {
                  required: true,
                  message: '请选择医院地址'
                }
              ],
              initialValue: hospId
                ? hospital.address.split(';')[0].split(',')
                : null
            })(<Cascader options={options} style={{
                width: 170
              }} placeholder='请选择医院地址'/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="详细地址">
          {
            getFieldDecorator('hospitalAdrsDetail', {
              rules: [
                {
                  required: true,
                  message: '请填写医院详细地址'
                }
              ],
              initialValue: hospId
                ? hospital.address.split(';')[1]
                : null
            })(<Input placeholder='请填写详情地址' style={{
                width: '300px'
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="医院类型">
          {
            getFieldDecorator('hospitalType', {
              rules: [
                {
                  required: true,
                  message: '请选择医院类型'
                }
              ],
              initialValue: hospital.type
            })(<Select placeholder='选择' style={{
                width: 80
              }}>
              {
                hospitalType.map((item, index) => {
                  return (<Option value={index}>{item}</Option>)
                })
              }
            </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="经营类型">
          {
            getFieldDecorator('hospitalStyle', {
              rules: [
                {
                  required: true,
                  message: '请选择经营类型'
                }
              ],
              initialValue: hospital.style
            })(<Select placeholder='选择' style={{
                width: 80
              }}>
              {
                hospitalStyle.map((item, index) => {
                  return (<Option value={index}>{item}</Option>)
                })
              }
            </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="医院等级">
          {
            getFieldDecorator('hospitalLevel', {
              rules: [
                {
                  required: true,
                  message: '请选择医院等级'
                }
              ],
              initialValue: hospital.level

            })(<Select placeholder='选择' style={{
                width: 80
              }}>
              {
                hospitalLevel.map((item, index) => {
                  return (<Option value={index}>{item}</Option>)
                })
              }
            </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系人1姓名">
          {
            getFieldDecorator('linkOneName', {
              rules: [
                {
                  required: true,
                  message: '请填写联系人1姓名'
                }
              ],
              initialValue: hospital.linkOneName
            })(<Input placeholder='请填写联系人1姓名' style={{
                width: '200px'
              }}/>)
          }
          {/*<span style={{
              fontSize: '24px',
              marginLeft: '20px',
              verticalAlign: 'middle'
            }}>
            <Icon className='cgreen' type="plus-square"/>
            <Icon style={{
                marginLeft: '10px'
              }} className='cred' type="minus-square"/>
          </span>*/
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系人1手机">
          {
            getFieldDecorator('linkOneCall', {
              rules: [
                {
                  required: true,
                  message: '请填写联系人1手机号'
                }
              ],
              initialValue: hospital.linkOneCall
            })(<Input placeholder='请填写联系人1手机号' style={{
                width: '200px'
              }} maxLength='11'/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系人2姓名">
          {
            getFieldDecorator('linkTwoName', {initialValue: hospital.linkTwoName})(<Input placeholder='请填写联系人2姓名' style={{
                width: '200px'
              }}/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系人2手机">
          {
            getFieldDecorator('linkTwoCall', {initialValue: hospital.linkTwoCall})(<Input placeholder='请填写联系人2手机号' style={{
                width: '200px'
              }} maxLength='11'/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="医院照片">
          {
            getFieldDecorator('hospitalImg', {})(<Upload beforeUpload={this.sltFile.bind(this, 2)} defaultFileList={hospId
                ? [
                  {
                    uid: 3,
                    name: '医院照片',
                    status: 'done',
                    url: fileUrl + hospital.hospitalImg.place
                  }
                ]
                : null}>
              <Button>
                <Icon type="upload"/>
                上传医院照片
              </Button>
            </Upload>)
          }
        </FormItem>
        <FormItem>
          <div className='tbbar'>证照信息</div>
        </FormItem>
        <FormItem {...formItemLayout} label="医疗许可证">
          {
            getFieldDecorator('business', {
              rules: [
                {
                  required: true,
                  message: '请上传医疗许可证文件'
                }
              ],
              initialValue: hospId
                ? true
                : null
            })(<Upload beforeUpload={this.sltFile.bind(this, 0)} defaultFileList={hospId
                ? [
                  {
                    uid: 1,
                    name: '医疗许可证图片',
                    status: 'done',
                    url: fileUrl + hospital.businessImg.place
                  }
                ]
                : null}>
              <Button>
                <Icon type="upload"/>
                上传医疗许可证
              </Button>
            </Upload>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="有效时间">
          {
            getFieldDecorator('businessDescribe', {
              rules: [
                {
                  required: true,
                  message: '请填写医疗许可证有效时间'
                }
              ],
              initialValue: hospId
                ? [
                  moment(ylDate[0]),
                  moment(ylDate[1])
                ]
                : null
            })(<RangePicker/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="营业执照">
          {
            getFieldDecorator('license', {
              rules: [
                {
                  required: true,
                  message: '请上传营业执照文件'
                }
              ],
              initialValue: hospId
                ? true
                : null
            })(<Upload beforeUpload={this.sltFile.bind(this, 1)} defaultFileList={hospId
                ? [
                  {
                    uid: 2,
                    name: '营业执照图片',
                    status: 'done',
                    url: fileUrl + hospital.licenseImg.place
                  }
                ]
                : null}>
              <Button>
                <Icon type="upload"/>
                上传营业执照
              </Button>
            </Upload>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="有效时间">
          {
            getFieldDecorator('licenseDescribe', {
              rules: [
                {
                  required: true,
                  message: '请填写营业执照有效时间'
                }
              ],
              initialValue: hospId
                ? [
                  moment(yyDate[0]),
                  moment(yyDate[1])
                ]
                : null
            })(<RangePicker/>)
          }
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{
            marginBottom: '100px'
          }}>
          <Button onClick={() => {
              hashHistory.go(-1)
            }}>取消</Button>
          <Button style={{
              marginLeft: '20px'
            }} type="primary" htmlType="submit" loading={loading}>确定</Button>
        </FormItem>
      </Form>
    </div>);
  }
});
Demo = createForm()(Demo);
export default class form extends Component {
  componentWillMount() {
    hospId = this.props.params.id
  }
  componentDidMount() {
    if (localStorage.hospitalId) {
      console.log(JSON.parse(localStorage.userinfo).hospital);
    }
  }
  render() {
    return <Demo/>
  }
}
