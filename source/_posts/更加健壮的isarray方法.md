title: 更加健壮的isArray方法
date: 2014-02-12 17:47:37
tags:
# categories:
keywords: [isArray]
---

在实际项目开发过程中，我们经常会遇到检测一个对象是否是数组的情况，这里会有一些坑，现在来说一说。

javascript中，检测对象类型有下面这么几种方法：
<!--more-->

**1. typeof**

<pre class="prettyprint">
typeof function () {};    // 'function'
typeof 'hello';    // 'string'
typeof 123;    // 'number'
typeof undefined;    // 'undefined'
typeof null;    // 'object'
typeof {};    // 'object'
typeof [];    // 'object'
</pre>

可以看到，`typeof`在检测Array类型时无能为力……


**2. instanceof**

`instanceof`作符检测对象的原型链是否指向构造函数的prototype对象。于是我们可以这样检测：

<pre class="prettyprint">
[] instanceof Array;    // true
</pre>


**3. constructor属性**

<pre class="prettyprint">
[].constructor === Array;    // true
</pre>

`instanceof`和`constructor`看起来是可以的，但是我们看下面这个例子：

<pre class="prettyprint">
var iframe = document.createElement('iframe');
iframe.name = 'myFrame';
iframe.id = 'myFrame';
document.body.appendChild(iframe);
var frameObj = document.getElementById('myFrame');
var myArray = frameObj.contentWindow.Array;
var arr = new myArray(1, 2, 3);
arr instanceof Array;    // false
arr.constructor === Array;    // false
</pre>

这是由于每个iframe都有一套自己的执行环境，跨frame实例化的对象彼此之间是不会共享原型链的。

肿么办，可以看看各大类库的实现：

[**underscore的实现**](https://github.com/jashkenas/underscore/blob/master/underscore.js#L1016)

<pre class="prettyprint">
_.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
};
</pre>

[**lodash的实现**](https://github.com/lodash/lodash/blob/master/lodash.js#L5859)

<pre class="prettyprint">
var isArray = nativeIsArray || function(value) {
    return
        value
        &&
        typeof value == 'object'
        &&
        typeof value.length == 'number'
        &&
        toString.call(value) == arrayClass || false;
};
</pre>

从上面列举的两个类库可以看出，基本的套路就是返回待检测的对象的`toString()`，判断结果是否是`[object Array]`，如果是，则说明此对象是Array的实例，否则不是。
原理在此：[ECMA-262-3 15.2.4.2](http://bclary.com/2004/11/07/#a-15.2.4.2)。
当`Object.prototype.toString`被调用时，采用如下步骤：
1. 获取[[Class]] 内部属性的值
2. 计算把这三个字符串`'[object '`, `第1步的结果`, `']'`  连在一起的字符串值
3. 返回`第2步的结果`。

因此，不用任何类库的话，检测数组时，我们可以用如下方法：

<pre class="prettyprint">
var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}
</pre>
