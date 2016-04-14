title: 如何更新 nodejs
date: 2013-12-09 00:16:12
tags: [Node.js] #文章标签，多于一项时用这种格式
# categories:
keywords: [Node.js,nodejs,node]

---
有时候机器上的 nodejs 版本会导致一些奇怪的问题，比如我最近遇到的这么个问题，[Node causes uglify-js package to throw ReferenceError on parse.js line 53](https://github.com/joyent/node/issues/6235)，这个issue最后也没给出一个确切的答案，看了下我机器的node版本，是v0.11.7，然后更新我的nodejs。

更新nodejs用到了这个npm模块，[`n`](https://npmjs.org/package/n)，步骤如下：
<!--more-->

1. 清除npm的缓存
<pre class="prettyPrint">
[sudo] npm cache clean -f
</pre>

2. 安装`n`模块
<pre class="prettyPrint">
[sudo] npm install n -g
</pre>

3. 安装最新稳定版的nodejs
<pre class="prettyPrint">
sudo n stable
</pre>

4. 如果你要安装一个指定的nodejs版本，你需要这么使用：
<pre class="prettyPrint">
sudo n 0.8.20
</pre>
