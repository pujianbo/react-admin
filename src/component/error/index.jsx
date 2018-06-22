'user strict';
import React, {Component} from 'react';

import './index.scss'
import imgLightbulb from '../../img/icon/lightbulb.png'

export default class error extends Component {
  render() {
    return (<div className='errorpage text-center'>
      <div className='msg'>
        <h1>
          What have you done?
        </h1>
        <h5>
          Now Go Back Using Below LInk</h5>
        <span id="error-link">404</span>
        <h2>! ERROR DECETED !</h2>
        <p><img src={imgLightbulb}/></p>
        <a href="/" className="gohomelink">GO TO HOME PAGE</a>
      </div>
    </div>)
  }
}
