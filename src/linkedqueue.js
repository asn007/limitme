class LinkedQueue {
  __first = null;
  __last = null;
  length = 0;
  // TODO: maximum size?
  constructor() { }
  addToTop(value) {
    if(!this.__first) this.push(value);
    this.length++;
    let node = { value, next: this.__first };
    this.__first = node;
  }
  push(value) {
    this.length++;
    let node = { value, next: null };
    if(this.__last) {
      this.__last.next = node;
      this.__last = node;
    }
    else this.__first = this.__last = node;
  }

  shift() {
    if(!this.__first) return undefined;
    else this.length--;
    let value = this.__first.value;
    let ref;
    this.__first = (ref = this.__first.next) != null ? ref : (this.__last = null);
    return value;
  }
}

module.exports = LinkedQueue;
