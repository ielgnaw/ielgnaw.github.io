title: nodejs打开浏览器
date: 2013-11-25 00:34:31
#categories: blog #文章文类
tags: [Node.js] #文章标签，多于一项时用这种格式
keywords: [Node.js,nodejs,node]
---


nodejs打开浏览器，代码如下：

<pre class="prettyprint">
var process = require('child_process');
process.exec("start http://www.baidu.com");
</pre>

以上代码是打开系统默认浏览器。如指定浏览器，如下：


<!-- more -->


<pre class="prettyprint">
var process = require('child_process');
var t = '"C:\\Program Files\\Internet Explorer\\iexplore.exe" "http://www.baidu.com"';
// var t = "'C:\\Program Files\\Internet Explorer\\iexplore.exe' 'http://www.baidu.com'";
process.exec(t);
</pre>

**注意：上面代码中第二行并不能执行，推测是在window下cmd命令的语法问题，只认双引号。**
