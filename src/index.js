const LinkedQueue = require('./linkedqueue');

class RateLimiter {
  static priorities = {
    HIGHEST: 4,
    HIGH: 3,
    NORMAL: 2,
    LOW: 1,
    LOWEST: 0
  };
  static Promise = Promise;
  totalQueuedTasks = 0;

  constructor(ratelimit) {
    this.rateLimit = ratelimit;
    this.lastTime = 0;
    this.queues = [];
    for(let i = 1; i <= Object.keys(RateLimiter.priorities).length; i++) this.queues.push(new LinkedQueue());
  }

  enqueue(priority, fn) {
    if(typeof priority === 'function') fn = priority;
    if(~~priority != priority) priority = RateLimiter.priorities.NORMAL;
    // FIXME: magic
    if(priority > RateLimiter.priorities.HIGHEST || priority < RateLimiter.priorities.LOWEST) priority = RateLimiter.priorities.NORMAL;
    if(!fn) return this.__plainPromise(priority);
    else this.__plainPromise(priority).then((timestampCreated) => fn(timestampCreated));
  }

  runImmediate(fn) {
    const promise = new RateLimiter.Promise((resolve) => {
      const dNow = new Date.now();
      this.queues[RateLimiter.priorities.HIGHEST].addToTop({ task: resolve, created: dNow });
      this.totalQueuedTasks++;
      if(this.totalQueuedTasks == 1 && this.lastTime + this.rateLimit < dNow()) this._runLoop();
    });
    if(!fn) return promise;
    else promise.then((timeWaited) => fn(timeWaited));
  }

  _runLoop() {
    let priorityIndex = 4;
    while(priorityIndex >= 0 && this.queues[priorityIndex].length == 0) priorityIndex--;
    if(priorityIndex > 0) {
      let taskData = this.queues[priorityIndex].shift();
      taskData.task(Date.now() - taskData.created);
      this.totalQueuedTasks--;
      this.lastTime = Date.now();
      setTimeout(() => this._runLoop(), this.rateLimit);
    }
  }

  __plainPromise(priority) {
    return new RateLimiter.Promise((resolve) => {
      const dNow = Date.now();
      this.queues[priority].push({ task: resolve, created: dNow });
      this.totalQueuedTasks++;
      if(this.totalQueuedTasks == 1 && this.lastTime + this.rateLimit < dNow()) this._runLoop();
    });
  }
}

module.exports = RateLimiter;

