LimitMe
=======

A library for limiting the rate of execution of callbacks and Promises

```js
const RateLimiter = require('limitme');
const limiter = new RateLimiter(250); // one callback/Promise each 250ms
for(let i = 0; i < 10; i++) {
  limiter.enqueue()
           .then(() =>
             new Promise((resolve) => {
               console.log(`resolved Promise ${i}`);
               resolve();
             }));
  limiter.enqueue(() => {
    console.log(`Resolved Callback ${i}`)
  });
}
```

## Installation

  `npm install limitme`

## Usage

First, require and instantiate LimitMe
```js
const RateLimiter = require('limitme');
const limiter = new RateLimiter(msPerTask);
```

Where `msPerTask` is a variable specifying minimal delay between task executions.

Then... Use LimitMe!
```js
limiter.enqueue().then((timeWaited) => new Promise());
```

Where `new Promise()` is your API request you needed to execute for example, and `timeWaited` is the time your task had to wait since creation to actual execution

You can also use callback-style if you want to:
```js
limiter.enqueue((timeWaited) => {
  doYourTask(timeWaited);
})
```

Where `doYourTask(timeWaited)` is... Well, you guessed.

You may also use priorities:
```js
limiter.enqueue(RateLimiter.priority.HIGHEST).then((timeWaited) => new Promise());
```
This will be executed before all `HIGH`, `NORMAL`, `LOW` and `LOWEST` priority tasks

Callback-style is supported as well, with similar syntax:

```js
limiter.enqueue(RateLimiter.priority.HIGHEST, (timeWaited) => {
  doYourTask(timeWaited);
});
```

The priorities available are following:

`RateLimiter.priority.HIGHEST`,

`RateLimiter.priority.HIGH`,

`RateLimiter.priority.NORMAL`,

`RateLimiter.priority.LOW`,

`RateLimiter.priority.LOWEST`

Using an older node version which does not have `Promise`s, or you would like to use your own `Promise` implementation, like bluebird? Just set the `Promise` property of `RateLimiter` object!
```js
RateLimiter.Promise = require('bluebird'); // Wham, it now is on bluebird!
```

And lastly, you may also queue task for immediate execution (albeit this is not recommended), just replace `enqueue` with `immediate`, and the task will be pushed on top of `HIGHEST` priority queue.

If you want API, look below:

## API

### RateLimiter
`RateLimiter` is a root object that LimitMe exports. You need to instantiate it.

#### constructor(rateLimit)
 * `rateLimit` - an integer specifying how often tasks should be fired, for example, when you want tasks to be fired every 250ms you call `new RateLimiter(250)`

### Properties
* __static__ `priorities` - used for setting priority of a specific task, for example to execute the task with highest priorty, you call `RateLimiter.enqueue(RateLimiter.priorty.HIGHEST)`. LimitMe supports following priorities:
  * `HIGHEST`
  * `HIGH`
  * `NORMAL`
  * `LOWEST`
  * `LOW`
* __static__ `Promise` - Promise implementation you wish to use. By default uses vanilla Node promises
* `totalQueuedTasks` - number of total tasks awaiting processing

### Methods
The following methods are available for public:
* __enqueue([priority, callback])__ - is used to queue a task for execution. If you specify no parameters, this will return a promise, which will resolve when the task is allowed execution, if you specify callback, it will be called when you should proceed with your task (i.e. API request).
Both the callback and the promise are resolved with time waited before execution/resolve in milliseconds
* __runImmediate([callback])__ - is used to queue the task for first possible time slot, and by that I mean that the task will be put on top of `HIGHEST` priority queue

## Support

Please report bugs on the [issue tracker](http://github.com/asn007/limitme)
