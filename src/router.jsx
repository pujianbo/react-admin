import React, {Component} from 'react';
import {
  Router,
  Route,
  Redirect,
  IndexRoute,
  browserHistory,
  hashHistory
} from 'react-router';

const history = process.env.NODE_ENV !== 'production'
  ? browserHistory
  : hashHistory;

// 组件部分
// 公共组件
const roots = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/roots').default)
  }, 'roots')
}
const error = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/error').default)
  }, 'error')
}
const form = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/form').default)
  }, 'form')
}
const datalist = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/datalist').default)
  }, 'datalist')
}
// 测试组件
const test = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/test').default)
  }, 'test')
}
const test2 = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/test2').default)
  }, 'test2')
}
const test3 = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./Component/test3').default)
  }, 'test3')
}
// 页面组件
const index = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/index').default)
  }, 'index')
}
const login = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/login').default)
  }, 'login')
}
const pwdfind = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/pwdfind').default)
  }, 'pwdfind')
}

//system moudle
const config = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/system/config').default)
  }, 'config')
}
const role = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/system/role').default)
  }, 'role')
}
const datalog = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/system/datalog').default)
  }, 'datalog')
}
const version = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/system/version').default)
  }, 'version')
}
const feedback = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/system/feedback').default)
  }, 'feedback')
}

//team moudle
const person = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/team/person').default)
  }, 'person')
}
const teamdoc = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/team/doc').default)
  }, 'teamdoc')
}
const unit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/team/unit').default)
  }, 'unit')
}
const group = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/team/group').default)
  }, 'group')
}
const authen = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/team/authen').default)
  }, 'authen')
}
const buyservice = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/team/buyservice').default)
  }, 'buyservice')
}

//account moudle
const account = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/index').default)
  }, 'account')
}
const accountdoc = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/doc').default)
  }, 'accountdoc')
}
const accounthosp = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/hosp').default)
  }, 'accounthosp')
}
const accountadmin = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/admin').default)
  }, 'accountadmin')
}
const accountdetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/detail').default)
  }, 'accountdetail')
}
const hospdetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/hospdetail').default)
  }, 'hospdetail')
}
const hospedit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/account/hospedit').default)
  }, 'hospedit')
}

//find moudle (test)
const analysis = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/find/analysis').default)
  }, 'analysis')
}
const analysisMult = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/find/analysisMult').default)
  }, 'analysisMult')
}
const note = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/find/note').default)
  }, 'note')
}

//medicineChina moudle
const symptommain = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/symptomMain').default)
  }, 'symptommain')
}
const symptomMEdit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/symptomMEdit').default)
  }, 'symptomMEdit')
}
const symptomsecond = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/symptomSecond').default)
  }, 'symptomsecond')
}
const symptomSEdit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/symptomSEdit').default)
  }, 'symptomSEdit')
}
const symptomdetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/symptomDetail').default)
  }, 'symptomdetail')
}

const drug = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/drug').default)
  }, 'drug')
}
const drugedit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/drugEdit').default)
  }, 'drugedit')
}
const advice = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/advice').default)
  }, 'advice')
}
const adviceedit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/adviceEdit').default)
  }, 'adviceedit')
}
const illness = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/illness').default)
  }, 'illness')
}
const illnessedit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/illnessEdit').default)
  }, 'illnessedit')
}
const illnesszh = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/illnesszh').default)
  }, 'illnesszh')
}
const illnesszhedit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/illnesszhEdit').default)
  }, 'illnesszhedit')
}

//medicineWest moudle
const conclusion = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/west/conclusion').default)
  }, 'conclusion')
}
const conclusionedit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/west/conclusionEdit').default)
  }, 'conclusionedit')
}
const conclusiondetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/west/conclusionDetail').default)
  }, 'conclusiondetail')
}
// const illnessWest = (location, cb) => {
//   require.ensure([], require => {
//     cb(null, require('./views/medicine/west/illness').default)
//   }, 'illnessWest')
// }
// const illnesseditWest = (location, cb) => {
//   require.ensure([], require => {
//     cb(null, require('./views/medicine/west/illnessEdit').default)
//   }, 'illnesseditWest')
// }
// const illnesseditWestdetail = (location, cb) => {
//   require.ensure([], require => {
//     cb(null, require('./views/medicine/west/illnessDetail').default)
//   }, 'illnesseditWestdetail')
// }
const medChinadetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/medicine/china/detail').default)
  }, 'medChinadetail')
}

//pserson moudle
const personinfo = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/person/index').default)
  }, 'personinfo')
}
const personmsg = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/person/msg').default)
  }, 'personmsg')
}

//message moudle
const messageList = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/message/index').default)
  }, 'personinfo')
}
const messageFeedback = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/message/feedback').default)
  }, 'messageFeedback')
}
const feedbackDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/message/feedbackDetail').default)
  }, 'feedbackDetail')
}
const messageEdit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/message/edit').default)
  }, 'messageEdit')
}
const messageDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/message/detail').default)
  }, 'messageDetail')
}

//examine moudle
const doctorstation = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/examine/doctorstation').default)
  }, 'doctorstation')
}
const docStationDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/examine/docStationDetail').default)
  }, 'docStationDetail')
}
const report = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/examine/report').default)
  }, 'report')
}
const reportDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/examine/reportDetail').default)
  }, 'reportDetail')
}

//order moudle
const inquiry = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/order/inquiry').default)
  }, 'inquiry')
}
const inquiryDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/order/inquiryDetail').default)
  }, 'inquiryDetail')
}

//money moudle
const moneyBill = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/bill').default)
  }, 'moneyBill')
}
const billDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/billDetail').default)
  }, 'billDetail')
}
const moneyDoctor = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/doctor').default)
  }, 'moneyDoctor')
}
const doctorDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/doctorDetail').default)
  }, 'doctorDetail')
}
const moneyHosp = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/hosp').default)
  }, 'moneyHosp')
}
const moneyHospDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/hospDetail').default)
  }, 'moneyHospDetail')
}
const moneyPlatform = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/platform').default)
  }, 'moneyPlatform')
}
const moneyCash = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/money/cash').default)
  }, 'moneyCash')
}

//content moudle
const apphelp = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/content/apphelp').default)
  }, 'apphelp')
}
const apphelpEdit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/content/apphelpEdit').default)
  }, 'apphelpEdit')
}
const apphelpDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./views/content/apphelpDetail').default)
  }, 'apphelpDetail')
}

const RouteConfig = (<Router history={hashHistory}>
  <Route path='/login' getComponent={login}/>
  <Route path='/pwdfind' getComponent={pwdfind}/>
  <Route path='/' getComponent={roots}>
    <IndexRoute getComponent={index}/>

    <Route path='account/'>
      <IndexRoute getComponent={account}/>
      <Route path='doc' getComponent={accountdoc}/>
      <Route path='hosp' getComponent={accounthosp}/>
      <Route path='admin' getComponent={accountadmin}/>
      <Route path='detail/:type/:id' getComponent={accountdetail}/>
      <Route path='hospdetail/:id(/:sign)' getComponent={hospdetail}/>
      <Route path='hospedit(/:id)' getComponent={hospedit}/>
    </Route>

    <Route path='message/'>
      <IndexRoute getComponent={messageList}/>
      <Route path='list' getComponent={messageList}/>
      <Route path='feedback' getComponent={messageFeedback}/>
      <Route path='feedback/detail/:id' getComponent={feedbackDetail}/>
      <Route path='edit(/:id)' getComponent={messageEdit}/>
      <Route path='detail/:id' getComponent={messageDetail}/>
    </Route>

    <Route path='person/'>
      <IndexRoute getComponent={personinfo}/>
      <Route path='info' getComponent={personinfo}/>
      <Route path='msg' getComponent={personmsg}/>
    </Route>

    <Route path='medicine/'>
      <Route path='west/'>
        <IndexRoute getComponent={conclusion}/>
        <Route path='conclusion' getComponent={conclusion}/>
        <Route path='conclusion/edit(/:id)' getComponent={conclusionedit}/>
        <Route path='conclusion/detail/:id' getComponent={conclusiondetail}/>
        {/*<Route path='illness' getComponent={illnessWest}/>
        <Route path='illness/edit(/:id)' getComponent={illnesseditWest}/>
        <Route path='illness/detail/:id' getComponent={illnesseditWestdetail}/>*/}
      </Route>
      <Route path='china/'>
        <IndexRoute getComponent={drug}/>
        <Route path='drug' getComponent={drug}/>
        <Route path='drug/edit(/:tabindex)(/:id)' getComponent={drugedit}/>
        <Route path='advice' getComponent={advice}/>
        <Route path='advice/edit(/:id)' getComponent={adviceedit}/>
        <Route path='illness' getComponent={illness}/>
        <Route path='illness/edit(/:id)' getComponent={illnessedit}/>
        <Route path='illnesszh' getComponent={illnesszh}/>
        <Route path='illnesszh/edit(/:id)' getComponent={illnesszhedit}/>
        <Route path='symptommain' getComponent={symptommain}/>
        <Route path='symptommain/edit(/:id)' getComponent={symptomMEdit}/>
        <Route path='symptomsecond' getComponent={symptomsecond}/>
        <Route path='symptomsecond/edit(/:id)' getComponent={symptomSEdit}/>
        <Route path='detail/:id/:type' getComponent={medChinadetail}/>
      </Route>
    </Route>

    <Route path='examine/'>
      <IndexRoute getComponent={doctorstation}/>
      <Route path='doctorstation' getComponent={doctorstation}/>
      <Route path='doctorstation/detail/:id' getComponent={docStationDetail}/>
      <Route path='report' getComponent={report}/>
      <Route path='report/detail/:id' getComponent={reportDetail}/>
    </Route>

    <Route path='order/'>
      <IndexRoute getComponent={inquiry}/>
      <Route path='inquiry' getComponent={inquiry}/>
      <Route path='inquiry/detail/:type/:id' getComponent={inquiryDetail}/>
    </Route>

    <Route path='money/'>
      <IndexRoute getComponent={moneyBill}/>
      <Route path='bill' getComponent={moneyBill}/>
      <Route path='bill/detail/:type/:id' getComponent={billDetail}/>
      <Route path='platform' getComponent={moneyPlatform}/>
      <Route path='cash' getComponent={moneyCash}/>
      <Route path='doctor' getComponent={moneyDoctor}/>
      <Route path='doctor/detail/:id' getComponent={doctorDetail}/>
      <Route path='hosp' getComponent={moneyHosp}/>
      <Route path='hosp/detail/:id' getComponent={moneyHospDetail}/>
    </Route>

    <Route path='content/'>
      <IndexRoute getComponent={apphelp}/>
      <Route path='apphelp' getComponent={apphelp}/>
      <Route path='apphelp/edit/:type(/:id)' getComponent={apphelpEdit}/>
      <Route path='apphelp/detail/:type/:id' getComponent={apphelpDetail}/>
    </Route>

    <Route path='system/'>
      <IndexRoute getComponent={role}/>
      <Route path='role' getComponent={role}/>
      <Route path='config' getComponent={config}/>
      <Route path='version' getComponent={version}/>
      <Route path='feedback' getComponent={feedback}/>
      <Route path='datalog' getComponent={datalog}/>
    </Route>

    <Route path='team/'>
      <IndexRoute getComponent={unit}/>
      <Route path='unit' getComponent={unit}/>
      <Route path='person(/:groupid)' getComponent={person}/>
      <Route path='doc(/:groupname)' getComponent={teamdoc}/>
      <Route path='group' getComponent={group}/>
      <Route path='authen(/:id)' getComponent={authen}/>
      <Route path='buyservice/:id(/:active)' getComponent={buyservice}/>
    </Route>

    <Route path='find/'>
      <IndexRoute getComponent={analysis}/>
      <Route path='note' getComponent={note}/>
      <Route path='analysis' getComponent={analysis}/>
      <Route path='analysismult' getComponent={analysisMult}/>
    </Route>

    <Route path='form' getComponent={form}/>
    <Route path='datalist' getComponent={datalist}/>
    <Route path='test' getComponent={test}/>
    <Route path='test2' getComponent={test2}/>
    <Route path='test3' getComponent={test3}/>
    <Route path='error' getComponent={error}/>
    <Route path='*' getComponent={error}/>
  </Route>
</Router>)
export default RouteConfig;
