module.exports = {
  port: 8000,
  IPv4: 'localhost',
  agentSev: 'http://kysapi.tederen.com', //接口地址
  agentSevTest: 'http://wx.17find.com', //测试地址
  getAgent: function() {
    return {
      '/admin/*': {
        target: this.agentSev
      },
      '/access/*': {
        target: this.agentSev
      },
      '/app/*': {
        target: this.agentSevTest
      }
    }
  },
  getIP: function() {
    try {
      const network = require('os').networkInterfaces()
      this.IPv4 = network[Object.keys(network)[0]][1].address
      if (this.IPv4.length < 7)
        this.IPv4 = network[Object.keys(network)[1]][1].address
    } catch (e) {
      this.IPv4 = '127.0.0.1';
    } finally {
      const httpStr = 'http://' + this.IPv4 + ':' + this.port;
      const opn = require('opn');
      console.log(httpStr);
      setTimeout(function() {
        opn(httpStr);
      }, 20000);
      return this.IPv4;
    }
  }
}
