'use strict';

module.exports = {
 
  secret: '',
  name: 'nodeStore',
  db: {
      uri: 'mongodb://localhost:27017/myapp',
      sessions: 'sessions'
  },
  locale: {
      lang: 'en-US',
      currency: 'USD'
  }
};