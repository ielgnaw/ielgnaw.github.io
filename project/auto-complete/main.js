window.onload = function () {

    var TMPDOM =  document.createDocumentFragment();

    var $ = function (elem) {
        return typeof elem === 'string'
            ?
            document.getElementById(elem)
            :
            elem;
    }

    function addEvent (elem, type, fn) {
        elem = $(elem);
        if (elem == null) {
            return false;
        }
        if (typeof fn !== 'function') {
            return false;
        }
        if (elem.addEventListener) {
            elem.addEventListener(type, fn, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, fn);
        } else {
            elem['on' + type] = fn;
        }
        return true;
    }

    function removeEvent (elem, type, fn) {
        elem = $(elem);
        if (elem == null) {
            return false;
        }
        if (typeof fn !== 'function') {
            return false;
        }
        if (elem.removeEventListener) {
            elem.removeEventListener(type, fn, false);
        } else if (elem.detachEvent) {
            elem.detachEvent("on" + type, fn);
        }
        elem['on' + type] = null;
        return true;
    }

    function stopEvent (e) {
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
            e.returnValue = false;
        }
        return false;
    }

    function extend (target) {
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (!src) {
                continue;
            }
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    target[key] = src[key];
                }
            }
        }
        return target;
    }

    function trim (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    function hasClass (elem, className) {
        return new RegExp('(^|\\s)' + className + '($|\\s)').test(elem.className);
    }

    function addClass (elem, className) {
        if(elem.nodeType === 1){
            if (!hasClass(elem,className)) {
                elem.className = trim(elem.className) + ' ' + className;
            }
        }
    }

    function removeClass(elem,className){
        if(elem.nodeType === 1){
            if(hasClass(elem,className)){
                elem.className = elem.className.replace(new RegExp('(^|\\s)' + className + '($|\\s)'),' ');
            }
        }
    }



    var defaultOpts = {
        showMaxNum: 10,
        interval: 300
    }

    var conf = {};
    var curSelected = -1;
    var curChilds = null;

    function init (triggerElem, suggestContainer, opts) {
        if (!triggerElem || !suggestContainer) {
            throw new Error('triggerElem and suggestContainer must be required.');
        }
        conf = extend({}, defaultOpts, opts);
        conf.triggerElem = triggerElem;
        conf.suggestContainer = suggestContainer;
        conf.data = opts.data;
        conf.oldText = '';
        conf.timer = null;
        bindEvt();
        resetContainer();
    }

    function bindEvt () {
        addEvent(conf.triggerElem, 'focus', checkTimer);
        addEvent(conf.triggerElem, 'blur', blurFunc);
        addEvent(conf.suggestContainer, 'blur', blurFunc);
    }

    function blurFunc (e) {
        if (
            document.activeElement == conf.suggestContainer
            ||
            document.activeElement == conf.triggerElem
        ) {
            return;
        }
        conf.oldText = conf.triggerElem.value;
        conf.timer && clearTimeout(conf.timer);
        conf.timer = null;
        setTimeout(resetContainer, 500);
    }

    function checkTimer (e) {
        var text = conf.triggerElem.value;
        if (text != conf.oldText) {
            conf.oldText = text;
            showSuggest();
        }
        conf.timer && clearTimeout(conf.timer);
        conf.timer = setTimeout(checkTimer, conf.interval);
    }

    function resetContainer () {
        conf.suggestContainer.innerHTML = '';
        conf.suggestContainer.style.display = 'none';
        removeEvent(conf.triggerElem, 'keydown', keydownFn);
        curSelected = -1;
        curChilds = null;
    }

    function showSuggest () {
        resetContainer();
        var text = conf.triggerElem.value;

        if (text) {
            var resultList = find(text);
            if (resultList.length) {
                for (var i = 0, length = resultList.length; i < length; i++) {
                    var element = document.createElement('div');
                    element.innerHTML = resultList[i];
                    TMPDOM.appendChild(element);
                }

                conf.suggestContainer.appendChild(TMPDOM);

                conf.suggestContainer.style.display = '';
                conf.suggestContainer.style.left = '402px';
                conf.suggestContainer.style.top = (230 + 16 + 7) + 'px';
                conf.suggestContainer.scrollTop = 0;
                curChilds = conf.suggestContainer.childNodes;
                addEvent(conf.triggerElem, 'keydown', keydownFn);
            }
        }
    }

    function keydownFn (e) {
        function _inner (_curSelected) {
            for (var i = 0, len = curChilds.length; i < len; i++) {
                if (i != _curSelected) {
                    removeClass(curChilds[i], 'selected');
                }
                else {
                    addClass(curChilds[i], 'selected');
                }
            }
        }
        var keyCode = e.keyCode || e.which;
        if (keyCode == 40) { // down
            if (curSelected < curChilds.length - 1) {
                curSelected++;
            }
            else {
                curSelected = 0;
            }
            _inner(curSelected);
            stopEvent(e);
        }
        else if (keyCode == 38) { // up
            if (curSelected > 0) {
                curSelected--;
            }
            else {
                curSelected = curChilds.length - 1;
            }
            _inner(curSelected);
            stopEvent(e);
        }
        else if (keyCode == 13) { // enter
            var tmp = curChilds[curSelected];
            if (tmp) {
                conf.triggerElem.value = tmp.innerHTML;
                resetContainer();
                conf.oldText = conf.triggerElem.value;
                checkTimer();
            }
        }
    }

    function find (text) {
        var result = {
            tmp: {},
            firstChineseIndex: -1, // 最开始的那个中文字符索引
            list: []
        };
        var lastEnglishIndex = 0;
        var temp;
        for (var i = 0, length = conf.data.length; i < length; i++) {
            temp = checkMatch(conf.data[i], text);
            if (temp) {
                for (var j = 0, len = temp.length; j < len; j++) {
                    if (/^[\u4e00-\u9fa5]/.test(temp[j])) { // 是中文，且中文开头
                        // 需求4 输入hua的时候
                        // 例如`花心`结果项目应该在所有中文字符的第一个
                        var reg = '/\\b' + text + '(\\w)?/';
                        if (eval(reg).test(PY.convertPYs(conf.data[i])[0])) {
                            if (
                                PY.convertPYs(conf.data[i])[1].substring(1)
                                    == RegExp.$1
                            ) {
                                result.list.splice(
                                    lastEnglishIndex,
                                    // result.firstChineseIndex,
                                    0,
                                    temp[j]
                                );
                                continue;
                            }
                        }

                        result.list.push(temp[j]);

                        if (result.firstChineseIndex == -1) {
                            result.firstChineseIndex = result.list.length - 1;
                        }
                    }
                    else {
                        if (result.firstChineseIndex != -1) {
                            result.list.splice(
                                result.firstChineseIndex,
                                0,
                                temp[j]
                            );
                        }
                        else {
                            result.list.push(temp[j]);
                        }
                        lastEnglishIndex++;
                    }
                }
            }
            if (result.list.length >= conf.showMaxNum) {
                break;
            }
        }
        return result.list;
    }

    function checkMatch (str, patternStr) {
        var ret = [];
        if (!str) {
            return null;
        }

        var pyStr = PY.convertPYs(str)[0];

        // 先匹配英文，不区分大小写
        var pos = str.indexOf(patternStr);
        if (pos == 0) { //只匹配第一个
            ret.push(escapeHTML(str));
        }

        if (str != pyStr) {
            // 匹配中文
            var posPY = PY.convertPYs(str)[0].indexOf(patternStr);
            if (posPY == 0) { //只匹配第一个
                ret.push(escapeHTML(str));
            }
        }

        if (!ret.length) {
            return null;
        }

        return ret;
    }

    function escapeHTML (str) {
        return str.replace(/\&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/\'/g, '&#39;');
    }

    init($('text'), $('suggest'), {
        data: FriendNicknameList
    });

}