import React, {Component} from 'react'
import {hashHistory} from 'react-router'

export default class index extends Component {
  componentWillMount() {
    hashHistory.go(-1)
  }
  render() {
    return (<div></div>)
  }
}
