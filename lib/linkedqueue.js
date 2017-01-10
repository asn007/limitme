"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedQueue = function () {
  // TODO: maximum size?
  function LinkedQueue() {
    _classCallCheck(this, LinkedQueue);

    this.__first = null;
    this.__last = null;
    this.length = 0;
  }

  _createClass(LinkedQueue, [{
    key: "addToTop",
    value: function addToTop(value) {
      if (!this.__first) this.push(value);
      this.length++;
      var node = { value: value, next: this.__first };
      this.__first = node;
    }
  }, {
    key: "push",
    value: function push(value) {
      this.length++;
      var node = { value: value, next: null };
      if (this.__last) {
        this.__last.next = node;
        this.__last = node;
      } else this.__first = this.__last = node;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (!this.__first) return undefined;else this.length--;
      var value = this.__first.value;
      var ref = void 0;
      this.__first = (ref = this.__first.next) != null ? ref : this.__last = null;
      return value;
    }
  }]);

  return LinkedQueue;
}();

module.exports = LinkedQueue;