var expect = require('chai').expect
  , through = require('../..');

describe('through:', function() {

  it('should export function', function(done) {
    expect(through).to.be.a('function');
    done();
  });

  it('should create cork class', function(done) {
    expect(through.cork()).to.be.a('function');
    done();
  });

  it('should create cork instance', function(done) {
    var Cork = through.cork()
      , buffer = new Cork();
    expect(buffer).to.be.an('object');
    expect('' + buffer).to.eql('[Buffer:PassThrough]');
    done();
  });

  it('should create passthrough class', function(done) {
    expect(through.passthrough()).to.be.a('function');
    done();
  });

  it('should create readable class', function(done) {
    expect(through(function read(size){})).to.be.a('function');
    done();
  });

  it('should create writable class', function(done) {
    expect(through(null, function write(chunk, encoding, cb){}))
      .to.be.a('function');
    done();
  });

  it('should create duplex class', function(done) {
    expect(through(
      function read(size){},
      function write(chunk, encoding, cb){}
    )).to.be.a('function');
    done();
  });

  it('should create with objectMode disabled (through)', function(done) {
    var Stream = through(
        function read(size){},
        function write(chunk, encoding, cb){},
        {objectMode: false}
      )
      , stream = new Stream();
    expect(stream._readableState.objectMode).to.eql(false);
    expect(stream._writableState.objectMode).to.eql(false);
    done();
  });

  it('should create with objectMode disabled (constructor)', function(done) {
    var Stream = through(
        function read(size){},
        function write(chunk, encoding, cb){}
      )
      , stream = new Stream({objectMode: false});
    expect(stream._readableState.objectMode).to.eql(false);
    expect(stream._writableState.objectMode).to.eql(false);
    done();
  });

  it('should create with objectMode disabled (function)', function(done) {
    var Stream = through(
        function read(size){},
        function write(chunk, encoding, cb){}
      )
      , stream = Stream({objectMode: false});
    expect(stream._readableState.objectMode).to.eql(false);
    expect(stream._writableState.objectMode).to.eql(false);
    done();
  });

  it('should create transform class w/ options', function(done) {
    expect(through.transform({})).to.be.a('function');
    done();
  });

  it('should create transform class w/ functions', function(done) {
    expect(through.transform(
      function transform(chunk, encoding, cb){},
      function flush(cb){}
    )).to.be.a('function');
    done();
  });

  it('should create transform class w/ constructor', function(done) {
    function SubClass() {
      this.id = SubClass.name;
    }
    SubClass.prototype.getBody = function getBody(){};

    var Stream = through.transform(
      function transform(chunk, encoding, cb){},
      function flush(cb){},
      {ctor: SubClass}
    )
      , stream = new Stream();
    expect(stream._readableState.objectMode).to.eql(true);
    expect(stream._writableState.objectMode).to.eql(true);
    expect(stream.getBody).to.be.a('function');
    expect(stream instanceof SubClass).to.eql(true);
    done();
  });
});
