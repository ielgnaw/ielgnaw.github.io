title: 一些简单的算法
date: 2015-06-07 06:50:15
tags:
keywords: [algorithm-js,algorithm]
---

本文介绍一些简单的算法在 js 中的实现。

<!-- more -->

#### 冒泡排序

<pre class="prettyprint">
var arr = [8, 100, 50, 22, 15, 6, 1, 1000, 999, 0];
function bubbleSort(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        for (var j = 0, jLen = len - i; j < jLen; j++) {
            if (arr[j] > arr[j + 1]) {
                var tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
        console.warn(arr, 'process');
    }
    console.log(arr);
}
bubbleSort(arr);
</pre>

可以看出冒泡排序的核心是双重嵌套循环，时间复杂度为 O(N<sup>2</sup>);

#### 快速排序

<pre class="prettyprint">
var arr = [8, 100, 50, 22, 15, 6, 1, 1000, 999, 0];
function quickSort(arr, left, right) {
    if (left > right) {
        return
    }

    var i = left;
    var j = right;
    
    // 基准数
    var temp = arr[left]; 
    console.warn('基准数：' + temp);

    while (i !== j) {
        // 先从右往左找
        while (arr[j] >= temp && i &lt j) {
            j--;
        }
        // 再从左往右找
        while (arr[i] &lt= temp && i &lt j) {
            i++;
        }

        // 交换两个数的位置
        if (i &lt j) {
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    // 基准数归位
    arr[left] = arr[i];
    arr[i] = temp;

    console.warn(arr, 'process');

    // 继续左边
    quickSort(arr, left, i - 1);

    // 继续右边
    quickSort(arr, i + 1, right);
}

quickSort(arr, 0, arr.length - 1);
console.log(arr);
</pre>

相对于冒泡排序，quickSort 之所以比较快，是因为 quickSort 每次交换是跳跃式的。每次排序的时候设置一个基准数，将小于基准数的数全部放到基准数的左边，将大于基准数的数全部放到基准数的右边，不会像冒泡排序一样只能在相邻的数之间进行交换，交换的距离就大了，因此总的比较和交换的次数就少了，速度也就快了。当然最坏的情况下，仍有可能是相邻的两个数进行交换。因此快速排序的最差时间复杂度和冒泡排序是一样的，都是 O(N<sup>2</sup>)，它的平均时间复杂度是 O(NlogN)。

