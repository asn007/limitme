'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedQueue = require('./linkedqueue');

var RateLimiter = function () {
  function RateLimiter(ratelimit) {
    _classCallCheck(this, RateLimiter);

    this.totalQueuedTasks = 0;

    this.rateLimit = ratelimit;
    this.lastTime = 0;
    this.queues = [];
    for (var i = 0; i < Object.keys(RateLimiter.priorities).length; i++) {
      this.queues.push(new LinkedQueue());
    }
  }

  _createClass(RateLimiter, [{
    key: 'enqueue',
    value: function enqueue(priority, fn) {
      if (typeof priority === 'function') fn = priority;
      if (~~priority != priority) priority = RateLimiter.priorities.NORMAL;
      // FIXME: magic
      if (priority > RateLimiter.priorities.HIGHEST || priority < RateLimiter.priorities.LOWEST) priority = RateLimiter.priorities.NORMAL;
      if (!fn) return this.__plainPromise(priority);else this.__plainPromise(priority).then(function (timestampCreated) {
        return fn(timestampCreated);
      });
    }
  }, {
    key: 'runImmediate',
    value: function runImmediate(fn) {
      var _this = this;

      var promise = new RateLimiter.Promise(function (resolve) {
        var dNow = Date.now();
        _this.queues[RateLimiter.priorities.HIGHEST].addToTop({ task: resolve, created: dNow });
        _this.totalQueuedTasks++;
        if (_this.totalQueuedTasks == 1 && _this.lastTime + _this.rateLimit < dNow) _this._runLoop();
      });
      if (!fn) return promise;else promise.then(function (timeWaited) {
        return fn(timeWaited);
      });
    }
  }, {
    key: '_runLoop',
    value: function _runLoop() {
      var _this2 = this;

      var priorityIndex = 4;
      while (priorityIndex >= 0 && this.queues[priorityIndex].length == 0) {
        priorityIndex--;
      }if (priorityIndex > 0) {
        var taskData = this.queues[priorityIndex].shift();
        taskData.task(Date.now() - taskData.created);
        this.totalQueuedTasks--;
        this.lastTime = Date.now();
        setTimeout(function () {
          return _this2._runLoop();
        }, this.rateLimit);
      }
    }
  }, {
    key: '__plainPromise',
    value: function __plainPromise(priority) {
      var _this3 = this;

      return new RateLimiter.Promise(function (resolve) {
        var dNow = Date.now();
        _this3.queues[priority].push({ task: resolve, created: dNow });
        _this3.totalQueuedTasks++;
        if (_this3.totalQueuedTasks == 1 && _this3.lastTime + _this3.rateLimit < dNow) _this3._runLoop();
      });
    }
  }]);

  return RateLimiter;
}();

RateLimiter.priorities = {
  HIGHEST: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
  LOWEST: 0
};
RateLimiter.Promise = Promise;


module.exports = RateLimiter;