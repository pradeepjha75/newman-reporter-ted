'use strict';

const axios = require('axios');

class HttpService {

  constructor(context) {
    this.context = context;
    const axiosOptions = {
      baseURL: this.context.serverBaseUrl,
    };

    axiosOptions.auth = {
      username: this.context.user,
      password: this.context.password,
    }

    this.client = axios.create(axiosOptions);
    this.sendData({})
  }


  async sendData(data) {
    let url;
    url = '/api/automation/create';

    try {
      await this.client.post(url, data);
    } catch (error) {
      console.log('[-] ERROR: while sending data to InfluxDB', this.context.debug ? error : error.message);
    }
  }
};

module.exports = HttpService;
