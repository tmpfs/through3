var util = require('util')
  , stream = require('stream')
  , Readable = stream.Readable
  , Writable = stream.Writable
  , PassThrough = stream.PassThrough
  , Duplex = stream.Duplex
  , Transform = stream.Transform;

/**
 *  Utilities for creating stream subclass functions.
 *
 *  @module through3
 */

/**
 *  Utility to find the options object argument.
 *
 *  @private
 *  @function options
 *  @param {Array} args The arguments list.
 *  @returns An options object when available.
 */
function options(args) {
  var i = args.length - 1, opts;
  for(;i >= 0;i--) {
    if(typeof args[i] === 'object') {
      opts = args[i];
      break;
    }
  }
  return opts;
}

/**
 *  Creates a stream subclass.
 *
 *  @function extend
 *
 *  @param {Function} type The super class.
 *  @param {Function} ctor Constructor for the subclass.
 *  @param {Object} [opts] Default constructor options.
 *
 *  @returns a stream subclass.
 */
function extend(type, ctor, opts) {
  opts = opts || {};

  function Stream() {

    // allow non-new invocation
    if(!(this instanceof Stream)) {
      var args = [null].concat(Array.prototype.slice.call(arguments));
      return new (Function.prototype.bind.apply(Stream, args))();
    }

    // set up options
    opts = options(arguments) || opts;
    opts.objectMode = opts.objectMode !== undefined
      ? opts.objectMode : true;

    // call stream super class constructor
    type.call(this, opts);

    // ensure object mode
    if(opts.objectMode && this._writableState) {
      this._writableState.objectMode = true;
    }
    if(opts.objectMode && this._readableState) {
      this._readableState.objectMode = true;
    }

    if(opts.highWaterMark !== undefined) {
      if(this._writableState) {
        this._writableState.highWaterMark = opts.highWaterMark;
      }
      if(this._readableState) {
        this._readableState.highWaterMark = opts.highWaterMark;
      }
    }
  }

  util.inherits(Stream, type);

  var Type = Stream;

  function toString() {
    var parts = [];
    parts.push(
      util.format('[%s:%s]', ctor ? ctor.name : Stream.name, type.name));
    if(this.id) {
      parts.push(this.id);
    }
    return parts.join(' ');
  }

  Stream.prototype.toString = toString;

  // wrapper final constructor supplied so
  // constructors do not need to call super
  function StreamCaller() {
    // call stream subclass constructor
    Stream.apply(this, arguments);
    // call custom constructor (super class)
    ctor.apply(this, arguments);
  }

  // inherit from constructor prototype
  if(typeof ctor === 'function') {
    // pass through prototype of constructor
    for(var k in ctor.prototype) {
      Stream.prototype[k] = ctor.prototype[k];
    }

    // constructor extends stream subclass
    util.inherits(ctor, Stream);

    util.inherits(StreamCaller, ctor);
    Type = StreamCaller;
  }

  return Type;
}

/**
 *  Creates a transform stream subclass.
 *
 *  @function transform
 *  @param {Function} fn The transform function.
 *  @param {Function} [flush] A flush function.
 *  @param {Object} [opts] Default constructor options.
 *
 *  @returns transform stream subclass.
 */
function transform(fn, flush, opts) {
  var type;
  opts = options(arguments) || {};
  type = extend(Transform, opts.ctor, opts);
  if(typeof fn === 'function') {
    type.prototype._transform = fn;
  }
  if(typeof flush === 'function') {
    type.prototype._flush = flush;
  }
  return type;
}

/**
 *  Creates a passthrough, read, write or duplex stream subclass.
 *
 *  @param {Function} read The read side of the stream.
 *  @param {Function} write The write side of the stream.
 *  @param {Object} opts Options to use when subclassing.
 *
 *  @returns a stream subclass.
 */
function through(read, write, opts) {
  opts = options(arguments);
  var type
    , ctor = opts ? opts.ctor : null;
  read = typeof read === 'function' ? read : null;
  write = typeof write === 'function' ? write : null;
  if(!read && !write) {
    type = extend(PassThrough, ctor, opts);
  }else if(read && !write) {
    type = extend(Readable, ctor, opts);
    type.prototype._read = read;
  }else if(!read && write) {
    type = extend(Writable, ctor, opts);
    type.prototype._write = write;
  }else{
    type = extend(Duplex, ctor, opts);
    type.prototype._read = read;
    type.prototype._write = write;
  }
  return type;
}

/**
 *  Creates a pass through stream subclass that calls cork to buffer all
 *  input and write on end.
 *
 *  Useful when you need all the data before operations can begin.
 *
 *  @function cork
 *
 *  @returns stream class that buffers the input.
 */
function cork() {
  return through({ctor: function Buffer(){this.cork()}});
}

/**
 *  Get a pass through stream class.
 *
 *  @function passthrough
 *
 *  @param {Object} opts Stream construct options.
 *
 *  @returns a stream that passes through data.
 */
function passthrough(opts) {
  return through(opts);
}

through.extend = extend;
through.transform = transform;
through.cork = cork;
through.passthrough = passthrough;

module.exports = through;
