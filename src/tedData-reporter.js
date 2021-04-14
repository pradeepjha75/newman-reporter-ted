'use strict';

const HttpService = require('./http.service');

class TedDataReporter {

  constructor(newmanEmitter, reporterOptions, options) {
    this.newmanEmitter = newmanEmitter;
    this.reporterOptions = reporterOptions;
    this.options = options;

    this.context = {
      id: `${new Date().getTime()}-${Math.random()}`,
      currentItem: { index: 0 },
      assertions: {
        total: 0,
        failed: [],
        skipped: []
      },
      list: [],
      debug: false
    };
    

    const events = 'start iteration beforeItem item script request test assertion console exception done'.split(' ');
    events.forEach((e) => { if (typeof this[e] == 'function') newmanEmitter.on(e, (err, args) => this[e](err, args)) });

    if (this.context.debug) {
      console.log('[+] Reporter Options', reporterOptions);
    }
  }

  start(error, args) {
    this.context.testRunName = this.reporterOptions.testRunName;
    this.context.accessKey = this.reporterOptions.accessKey;
    this.context.signatureKey = this.reporterOptions.signatureKey;
    this.context.user = this.reporterOptions.user;
    this.context.password = this.reporterOptions.password;
    this.context.serverBaseUrl = this.reporterOptions.serverBaseUrl;

    if (!this.context.testRunName) {
      throw new Error('[-] ERROR: TestRunName is missing! Add --reporter-tedutility-testRunName <testRunName>.');
    }
    if (!this.context.accessKey) {
      throw new Error('[-] ERROR: Access Key is missing! Add --reporter-tedutility-accessKey <access-key>.');
    }
    if (!this.context.signatureKey) {
      throw new Error('[-] ERROR: Signature key is missing! Add --reporter-tedutility-signatureKey <signature-key>.');
    }
    if (!this.context.user) {
      throw new Error('[-] ERROR: User name is missing! Add --reporter-tedutility-user <user-name>.');
    }
    if (!this.context.password) {
      throw new Error('[-] ERROR: Password is missing! Add --reporter-tedutility-password <password>.');
    }
    if (!this.context.serverBaseUrl) {
      throw new Error('[-] ERROR: Server base url is missing! Add --reporter-tedutility-serverBaseUrl <base-url>.');
    }

    console.log(`[+] Starting collection: ${this.options.collection.name} ${this.context.id}`);

    this.service = new HttpService(this.context);
  }

  beforeItem(error, args) {
    this.context.list.push(this.context.currentItem);

    this.context.currentItem = {
      index: (this.context.currentItem.index + 1),
      name: '',
      data: {}
    };
  }

  request(error, args) {
    const { cursor, item, request, response } = args;

    console.log(`[${this.context.currentItem.index}] Running test ${this.context.testRunName}`);

    let data = {
      collection_name: this.options.collection.name, 
      id: this.context.identifier,
      request_name: item.name,
      url: request.url.toString(),
      method: request.method,
      status: args.response.status,
      code: args.response.code,
      response_time: args.response.responseTime,
      response_size: args.response.responseSize,
      test_status: 'Passed',
      assertions: 0,
      failed_count: 0,
      skipped_count: 0,
      failed: [],
      skipped: [],
      testname: item.name,
      suitename: this.options.collection.name,
      timestamp: `${Math.floor(Date.now() / 1000)}`,
      tags: {},
      user_agent: {},
      type: 'API',
      message: ''
    };

    this.context.currentItem.data = data;
    this.context.currentItem.name = item.name;
  }

  exception(error, args) {
    // TODO: 
  }

  assertion(error, args) {
    
    this.context.currentItem.data.assertions++;

    if(error) {
      this.context.currentItem.data.status = 'Failed';

      let failMessage = `${error.test} | ${error.name}`;
      if (this.context.debug) {
        failMessage += `: ${error.message}`;
      }
      this.context.currentItem.data.message=failMessage;
      this.context.currentItem.data.failed.push(failMessage);
      this.context.currentItem.data.failed_count++;
      if (this.context.debug) {
        this.context.assertions.failed.push(failMessage);
      }
    } else if(args.skipped) {
      if(this.context.currentItem.data.status !== 'Failed') {
        this.context.currentItem.data.status = 'Skipped';
      }

      const skipMessage = args.assertion;
      this.context.currentItem.data.skipped.push(args.assertion);
      this.context.currentItem.data.skipped_count++;
      if (this.context.debug) {
        this.context.assertions.skipped.push(skipMessage); 
      }
    } else if (!error && args.skipped === false) {
      if(this.context.currentItem.data.status !== 'Failed' && this.context.currentItem.data.status !== 'Skipped') {
        this.context.currentItem.data.status = 'Passed';
      }
    }
  }

  async item(error, args) {
    const allowed = ['testname', 'suitename', 'timestamp', 'tags', 'user_agent', 'type', 'status', 'message'];

    const filtered = Object.keys(this.context.currentItem.data)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = this.context.currentItem.data[key];
        return obj;
      }, {});

    const updatedData = this.buildPayload(filtered);

    await this.service.sendData(updatedData);
  }

  done() {
    console.log(`[+] Finished collection: ${this.options.collection.name} (${this.context.id})`);
  }

  /// Private method starts here

  buildPayload(data) {
    data.name = this.context.testRunName;
    data.accesskey = this.context.accessKey;
    data.signature = this.context.signatureKey;

    return data;
  }
};

module.exports = TedDataReporter;
