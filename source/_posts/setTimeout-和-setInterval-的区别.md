title: setTimeout 和 setInterval 的区别
date: 2015-05-10 21:55:18
tags:
keywords: [setTimeout,setInterval,setTimeout的setInterval区别,区别]
---

setTimeout 和 setInterval 是 js 中延迟执行的两个方法，这两个方法大家经常会用到，下面我们来详细说说这两个方法。

####定义

先来看看定义，MDN 对这两个方法给出的定义如下：

[setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout): Calls a function or executes a code snippet after a specified delay.

[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval): Calls a function or executes a code snippet repeatedly, with a fixed time delay between each call to that function. Returns an intervalID.

从定义中我们可以看出基本区别，`setTimeout` 在指定的时间 `delay` 后，执行一次；而`setInterval` 是每隔 `delay` 时间后就执行一次。

这两个方法对应的清除延迟的方法分别是 `clearTimeout` 和 `clearInterval`

<!-- more -->

####语法

<pre class="prettyprint">
// setTimeout
var timeoutID = window.setTimeout(func, [delay, param1, param2, ...]);
var timeoutID = window.setTimeout(code, [delay]);
// timeoutID: setTimeout 返回的标识，用来 clearTimeout
// func: 要执行的函数
// code: 字符串，表示要执行的代码（不推荐，同 eval()）
// [param1, param2, ...]: 可选的参数列表，IE9 以下不支持

// setInterval
var intervalID = window.setInterval(func, delay[, param1, param2, ...]);
var intervalID = window.setInterval(code, delay);
// intervalID: setInterval 返回的标识，用来 clearInterval
// func: 要执行的函数
// code: 字符串，表示要执行的代码（不推荐，同 eval()）
// [param1, param2, ...]: 可选的参数列表，IE9 以下不支持
</pre>

####区别

表面来看，`setTimeout` 和 `setInterval` 之间的区别就是：`setTimeout` 在 `delay` 时间后只执行一次，而 `setInterval` 会间隔 `delay`  时间重复执行，直到被清除。
如果想要 `setTimeout` 重复执行的话，只需要在函数内延时调用自己即可，所以一般来说，能用 `setInterval` 的地方就能用 `setTimeout` 代替。

基本区别:

<pre class="prettyprint">
// 大约 1000ms 后输出: during: 1003, hehe 
// during 的数字可能会有偏差，但都是 1000 多一点，不会少于 1000
var start = Date.now();
setTimeout(function () {
    var end = Date.now();
    console.log('during: %s, %s', end - start, 'hehe');
}, 1000);
</pre>

<pre class="prettyprint">
// 大约 1000ms 后开始输出: 
// during: 1003, hehe 
// during: 2011, hehe 
// during: 3016, hehe 
// during: 4022, hehe 
// ...
// during 的数字可能会有偏差，但每次都是增加 1000 多一点
var start = Date.now();
setInterval(function () {
    var end = Date.now();
    console.error('during: %s, %s', end - start, 'hehe');
}, 1000);
</pre>

上面两段代码比较简单，我们再来看看下面这段代码：

<pre class="prettyprint">
/**
 * 辅助方法，实现一个简单的 sleep 
 *
 * @param {number} ms 毫秒数
 */
function sleep(ms) {
    var start = Date.now();
    while (true) {
        if ((Date.now() - start) > ms) {
            return;
        }
    }
}

var start = Date.now();
setTimeout(function () {
    sleep(2000);
    var end = Date.now();
    console.log('during: %s, %s', end - start, 'hehe');
    setTimeout(arguments.callee, 1000);
}, 1000);

var start = Date.now();
setInterval(function () {
    sleep(2000);
    var end = Date.now();
    console.log('during: %s, %s', end - start, 'hehe');
}, 1000);
</pre>

初看上去，这两段代码在功能上貌似是相同的，但实际运行一下就知道并非如此：

`setTimeout` 的时间间隔是 1000ms，但是要执行的方法需要执行 2000ms，输出如下: 

    // 时间间隔是 3000ms
    during: 3005, hehe
    during: 6011, hehe
    during: 9017, hehe
    during: 12021, hehe
    during: 15026, hehe
    during: 18027, hehe
    ...

同样，`setInterval` 的时间间隔也是是 1ms，要执行的方法同样需要执行 2000ms，输出如下: 

    // 时间间隔是 2000ms
    during: 3006, hehe
    during: 5007, hehe
    during: 7008, hehe
    during: 9009, hehe
    during: 11010, hehe
    during: 13011, hehe
    ...


我们再来修改一下代码，把上述代码中的 `sleep(2000)` 改为 `sleep(500)` 即让代码执行的时间小于 `setTimeout` 和 `setInterval` 时间间隔，再来看看，

`setTimeout` 的输出： 

    // 时间间隔是 1500ms
    during: 1504, hehe
    during: 3008, hehe
    during: 4514, hehe
    during: 6020, hehe
    during: 7525, hehe
    during: 9028, hehe
    ...


`setInterval` 的输出：

    // 时间间隔是 1000ms
    during: 1503, hehe
    during: 2505, hehe
    during: 3508, hehe
    during: 4513, hehe
    during: 5515, hehe
    during: 6516, hehe
    ...


由以上两个例子，可以看出：

**`setTimeout` 里的代码无论需要执行多长时间，在前一次的回调执行完成之后，至少会延迟 1000ms（setTimeout 方法的第二个参数），有可能会有误差，但一定会更多，不会更少。**

**`setInterval` 里的代码无论需要执行多长时间，总是在每 1000ms（setInterval 方法的第二个参数） 的时候尝试去执行回调函数，有可能会有误差，但一定会更多，不会更少，不会关心前一次回调什么时候执行以及是否执行完毕。如果到达 1000ms 的时候，前一次回调函数还未执行完，那么会继续接着执行前一次回调函数，这一次的回调函数实际上就不会执行了。等前一次回调执行完成并且时间又一次到达下一个 1000ms 的时候，就会再次执行回调函数。**

####延伸

从上面我们可以看出，js 的定时器的延时是没有保证的。这是因为浏览器中执行的所有的 js 都是单线程的（定时器、dom 事件触发等等），在执行过程中只有 js 引擎线程空闲的时候才会执行。
引用 jQuery 作者[一篇文章](http://ejohn.org/blog/how-javascript-timers-work/ )的一幅图

![Timers](/posts-asset/setTimeout-setInterval/timers.png)

这幅图应该很熟悉了：垂直表示时间，按毫秒计算。蓝色的盒子表示正在执行的 js。如第一个 js 块执行的时间大约为 18ms，鼠标点击块执行的时间大约为 11ms 等等。

上面我们说过，js 是单线程的，因此在某一时刻只能执行一段代码，这段代码在被执行的时候会阻塞其他事件的执行。这就说明，当一个事件发生的时候，例如 dom 事件、定时器触发等，js 引擎会把事件放入一个队列中，排队等待执行。

我们按时间顺序解释上面那幅图

1、当代码执行到大约 3ms 时，调用了一个延时为 10ms 的 setTimeout，假设这个 setTimeout 要延时执行的方法是 timeoutFunc。

2、当代码执行到大约 7ms 时，发生了鼠标点击的事件，正常来说，发生点击事件，那么绑定的点击事件回调函数 clickFunc 就要被执行了，但是由于第一个 js 代码块还未执行完，由于 js 是单线程的，所以这个回调函数被加入事件处理队列等待执行。

3、当代码执行到大约 10ms 时，调用了一个延时 10ms 的 setInterval，假设这个 setInterval 执行的是 intervalFunc1。

4、当代码执行到大约 13ms 时，我们在第一步（3ms）里调用那个 setTimeout 到延时了，这个时候按照正常情况，我们应该执行 timeoutFunc 了。但是由于第一个 js 代码块还未执行完，因此浏览器把延时事件 timeoutFunc 放入事件处理队列了，这个时候事件处理队列里面有两个值了（clickFunc 和 timeoutFunc）。

5、当代码执行到大约 18ms 时，第一个 js 代码块终于执行完了。这个时候，js 线程空闲了，于是去事件处理队列里面找自己该执行的事件了，根据顺序，这个时候应该执行我们在第二步（7ms）放入事件处理队列的那个点击事件的回调函数（clickFunc）。于是就开始执行鼠标点击事件的回调，这个时候事件处理队列里面只剩下我们在第四步（13ms）放入的延时事件 timeoutFunc。

6、当代码执行到大约 20ms 时，这个时候第三步（10ms）放入的 intervalFunc1 也到要执行的时间了，但是这个时候，浏览器还在执行 clickFunc，因此 intervalFunc1 也被放入到事件处理队列，这个时候事件处理队列里面的值为 timeoutFunc 和 intervalFunc1。

7、当代码执行到大约 29ms 时，clickFunc 执行完毕。js 线程继续去事件处理队列里面找自己该执行的事件，这个时候事件处理队列里面排在第一位的时候 timeoutFunc，因此 js 线程开始执行 timeoutFunc 了。这个时候事件处理队列里面执行只剩下 intervalFunc1 了。

8、当代码执行到大约 30ms 时，我们在第三步（10ms）里面的 setInterval 又一次触发了，假设这次触发的事件叫做 intervalFunc2。但是由于这个时候 js 线程在执行 timeoutFunc，因此需要把 intervalFunc2 也放入到事件处理队列。这个时候，浏览器发现事件处理队列中已经存在 intervalFunc2 的兄弟 intervalFunc1 了，这个时候，浏览器的做法是抛弃掉 intervalFunc2。**对于每一个 setInterval，事件处理队列中只能存在一个回调事件**。

9、当代码执行到 36ms 时，timeoutFunc 执行完毕，这个时候，js 线程在事件处理队列中发现 intervalFunc1，因此就去执行 intervalFunc1 了。同时，事件处理队列已经空了。

10、当代码执行到 40ms 时，我们在第三步（10ms）里面的 setInterval 又一次触发了，这次的事件叫做 intervalFunc3，intervalFunc3 被加入到事件处理队列中。

11、当代码执行到 41ms 时，js 线程开始处理 intervalFunc3 了；46ms 时，intervalFunc3 处理完毕，事件处理队列中也是空的，js 线程终于休息了；第 50ms 时，由于 js 线程已经在休息了，因此直接就执行我们在第三步（10ms）里面的 setInterval 所触发的事件 intervalFunc4。再往后，只要浏览器没有其他的事件发生的话，就会每隔 10ms 去处理一次 intervalFunc....

我们得到如下几个结论：

1. js 引擎只有一个线程，这使得异步事件必需列队等待执行。(JavaScript engines only have a single thread, forcing asynchronous events to queue waiting for execution.)
2. setTimeout 和 setInterval 在他们如何执行异步代码上有着本质地区别。(setTimeout and setInterval are fundamentally different in how they execute asynchronous code.)
3. 如果一个 timer 在将要执行的时候被阻塞，那么他会被推迟到下一个可能的执行点（会超过所需的延时）(If a timer is blocked from immediately executing it will be delayed until the next possible point of execution (which will be longer than the desired delay).)
4. 如果 interval 的执行时间比指定的延时（delay）要长，那么它们将会连续的执行，就像没有延时一样(Intervals may execute back-to-back with no delay if they take long enough to execute (longer than the specified delay).)
5. setTimeout 和 setInterval 触发时，如果 js 线程不空闲，那么都得去排队等待执行。区别是，setTimeout 只需排一次队，setInterval 则要按照设置的间隔时间，每个时间点都去排一下。当 setInterval 去排队时，如果发现自己还在队列中未执行，则会被浏览器抛弃。即对于每一个 setInterval，浏览器的事件处理队列中只能存在一个回调事件。
6. 由于队列的存在，setTimeout 和 setInterval 第一次触发时的时间，只会大于等于设置的间隔时间，不可能小于。
7. 对于 setInterval 来说，如果执行时间大于设置的间隔时间，很可能导致连续执行，中间没有时间间隔，很可能会耗费大量 cpu。

####参考
https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout
https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
http://ejohn.org/blog/how-javascript-timers-work/
http://www.laruence.com/2009/09/23/1089.html
http://www.cnblogs.com/youxin/p/3354924.html
http://www.zhihu.com/question/20866267
