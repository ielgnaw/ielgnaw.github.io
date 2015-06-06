title: LazyMan
date: 2015-05-08 00:01:26
tags:
keywords: [LazyMan,题目]
---
实现一个 LazyMan，可以按照以下方式分别调用：

<pre class="prettyprint">
LazyMan('Jim');
// 输出 Hi! This is Jim!

LazyMan('Jim').sleep(3).eat('aaa');
// 输出
// Hi! This is Jim!
// 等待 3 秒..
// Wake up after 3
// Eat aaa~

LazyMan('Jim').eat('aaa').eat('bbb');
// 输出
// Hi This is Jim!
// Eat aaa~
// Eat bbb~

LazyMan('Jim').sleepFirst(3).eat('bbb');
// 等待 3 秒
// Wake up after 3
// Hi This is Jim!
// Eat bbb
</pre>

<!-- more -->

实现代码如下：

<pre class="prettyprint">
function sleep(ms) {
    var start = new Date().getTime();
    while (true) {
        if ((new Date().getTime() - start) > ms){
            return;
        }
    }
}

var funcPool = [];
var LazyMan = (function LazyMan() {
    LazyMan.eat = function (d) {
        funcPool.push(function () {
            console.warn('Eat ' + d + '~');
        });
        return LazyMan;
    };
    LazyMan.sleep = function (interval) {
        funcPool.push(function () {
            sleep(interval * 1000);
            console.warn('Wake up after ' + interval);
        });
        return LazyMan;
    };
    LazyMan.sleepFirst = function (interval) {
        funcPool.unshift(function () {
            sleep(interval * 1000);
            console.warn('Wake up after ' + interval);
        });
        return LazyMan;
    };
    return function (name) {
        funcPool.push(function () {
            console.log('Hi! This is ' + name + '!');
        });
        setTimeout(function () {
            var curFunc;
            while (curFunc = funcPool.shift()) {
                curFunc();
            }
        }, 0);
        return LazyMan;
    }
})();
</pre>
