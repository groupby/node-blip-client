'use strict';

const blip   = require('../index');
const chai   = require('chai');
const expect = chai.expect;

describe('Blip Client Tests', () => {

  it('should make correct request to get blip server health', (done) => {
    const blipClient            = blip.createClient('http://testuri', 80, 'testService', 'testEnvironment');
    blipClient.blipResponseBody = (requestObject) => {
      expect(requestObject.method).to.eql('GET');
      expect(requestObject.uri).to.eql('http://testuri:80/health');
      done();
    };
    blipClient.getHealth();
  });

  it('should make correct request without protocol defined', (done) => {
    const blipClient            = blip.createClient('testuri', 80, 'testService', 'testEnvironment');
    blipClient.blipResponseBody = (requestObject) => {
      expect(requestObject.method).to.eql('GET');
      expect(requestObject.uri).to.eql('http://testuri:80/health');
      done();
    };
    blipClient.getHealth();
  });

  it('should make correct request to write to blip server', (done) => {
    const blipClient            = blip.createClient('http://testuri', 80, 'testService', 'testEnvironment');
    blipClient.blipResponseBody = (requestObject) => {
      expect(requestObject.method).to.eql('POST');
      expect(requestObject.uri).to.eql('http://testuri:80/write');
      expect(requestObject.body.data).to.eql('testData');
      expect(requestObject.body.service).to.eql('testService');
      expect(requestObject.body.environment).to.eql('testEnvironment');
      done();
    };
    blipClient.write({data: 'testData'});
  });

  it('should use ISO 8601 date if provided', (done) => {
    const testDate              = '2016-07-14T15:00:00.000Z';
    const blipClient            = blip.createClient('http://testuri', 80, 'testService', 'testEnvironment');
    blipClient.blipResponseBody = (requestObject) => {
      expect(requestObject.body.date).to.eql(testDate);
      done();
    };
    blipClient.write({
      data: 'testData',
      date: testDate
    });
  });

  it('throw error when provided with malformed test date', (done) => {
    const testDate   = 'badDate';
    const blipClient = blip.createClient('http://testuri', 80, 'testService', 'testEnvironment');

    blipClient.blipResponseBody = () => {
      done('blipResponseBody should not have been called');
    };

    expect(() => {
      blipClient.write({
        data: 'testData',
        date: testDate
      });
    }).to.throw();
    done();
  });

  it('should use given date if provided', (done) => {
    const testDate              = '2016-07-05T00:00:00-00:00';
    const blipClient            = blip.createClient('http://testuri', 80, 'testService', 'testEnvironment');
    blipClient.blipResponseBody = (requestObject) => {
      expect(requestObject.body.date).to.eql(testDate);
      expect(requestObject.body.service).to.eql('testService');
      expect(requestObject.body.environment).to.eql('testEnvironment');
      done();
    };
    blipClient.write({
      data: 'testData',
      date: testDate
    });
  });

  it('should put date in ISO 8601 if none provided', (done) => {
    const blipClient            = blip.createClient('http://testuri', 80, 'testService', 'testEnvironment');
    blipClient.blipResponseBody = (requestObject) => {
      expect(requestObject.body.date).to.match(/^(\d{4})-(0[1-9]|1[0-2]|[1-9])-(\3([12]\d|0[1-9]|3[01])|[1-9])[tT\s]([01]\d|2[0-3])\:(([0-5]\d)|\d)\:(([0-5]\d)|\d)([\.,]\d+)?([zZ]|([\+-])([01]\d|2[0-3]|\d):(([0-5]\d)|\d))$/);
      done();
    };
    blipClient.write({data: 'testData'});
  });

  it.skip('should write to blip server - integration test', (done) => {
    const blipClient = blip.createClient('localhost', 8080, 'testService', 'testEnvironment');
    blipClient.write({data: 'testData'})
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });

  it.skip('should get healthy status response - integration test', (done) => {
    const blipClient = blip.createClient('localhost', 8080, 'testService', 'testEnvironment');
    blipClient.getHealth()
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });

});

