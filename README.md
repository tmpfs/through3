Table of Contents
=================

* [Through](#through)
  * [Install](#install)
  * [API](#api)
    * [through3](#through3)
      * [extend](#extend)
      * [transform](#transform)
      * [cork](#cork)
      * [passthrough](#passthrough)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Documentation](#documentation)
    * [Readme](#readme)
  * [License](#license)

Through
=======

[<img src="https://travis-ci.org/tmpfs/through3.svg" alt="Build Status">](https://travis-ci.org/tmpfs/through3)
[<img src="http://img.shields.io/npm/v/through3.svg" alt="npm version">](https://npmjs.org/package/through3)
[<img src="https://coveralls.io/repos/tmpfs/through3/badge.svg?branch=master&service=github&v=1" alt="Coverage Status">](https://coveralls.io/github/tmpfs/through3?branch=master).

Stream extends library tracking latest stable [node](http://nodejs.org) with no external dependencies.

Requires [node](http://nodejs.org) (>=0.11).

## Install

```
npm i through3 --save
```

## API

### through3

Utilities for creating stream subclass functions.

#### extend

```javascript
extend(type, ctor[, opts])
```

Creates a stream subclass.

Returns a stream subclass.

* `type` Function The super class.
* `ctor` Function Constructor for the subclass.
* `opts` Object Default constructor options.

#### transform

```javascript
transform(fn[, flush][, opts])
```

Creates a transform stream subclass.

Returns transform stream subclass.

* `fn` Function The transform function.
* `flush` Function A flush function.
* `opts` Object Default constructor options.

#### cork

```javascript
cork()
```

Creates a pass through stream subclass that calls cork to buffer all
input and write on end.

Useful when you need all the data before operations can begin.

Returns stream class that buffers the input.

#### passthrough

```javascript
passthrough(opts)
```

Get a pass through stream class.

Returns a stream that passes through data.

* `opts` Object Stream construct options.

## Developer

### Test

Tests are not included in the package, clone the repository:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Documentation

To generate all documentation:

```
npm run docs
```

### Readme

To build the readme file from the partial definitions (requires [mdp](https://github.com/tmpfs/mdp)):

```
npm run readme
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/tmpfs/through3/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[mdp]: https://github.com/tmpfs/mdp
