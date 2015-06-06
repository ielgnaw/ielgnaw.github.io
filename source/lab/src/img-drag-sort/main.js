(function () {

    var $ = function (id) {
        return 'string' === typeof id ? document.getElementById(id) : id;
    };

    var utils = {
        /**
         * 添加事件
         * @param elem
         * @param evtType
         * @param fn
         * @returns {boolean}
         */
        addEvent: function (elem, evtType, fn) {
            if (!elem) {
                return false;
            }
            if (elem.addEventListener) {
                elem.addEventListener(evtType, fn, false);
            } else if (elem.attachEvent) {
                elem.attachEvent('on' + evtType, fn);
            } else {
                elem['on' + type] = fn;
            }
            return true;
        },

        /**
         * 移除事件
         * @param elem
         * @param evtType
         * @param fn
         * @returns {boolean}
         */
        removeEvent: function (elem, evtType, fn) {
            if (!elem) {
                return false;
            }
            if (elem.removeEventListener) {
                elem.removeEventListener(evtType, fn, false);
            } else if (elem.detachEvent) {
                elem.detachEvent("on" + evtType, fn);
            }
            elem['on' + evtType] = null;
            return true;
        },

        /**
         * 阻止默认事件
         * @param e
         * @returns {boolean}
         */
        preventDefault: function (e) {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.returnValue = false;
                e.cancelBubble = true;
            }
            return false;
        },

        /**
         * 获取鼠标位置
         * @param e
         * @returns {{x: number, y: number}}
         */
        getMouseCoords: function (e) {
            var x = y = 0,
                doc = document.documentElement,
                body = document.body;
            e = e || window.event;
            if (window.pageYoffset) {// Netscape
                x = window.pageXOffset;
                y = window.pageYOffset;
            } else {
                x = (doc && doc.scrollLeft || body && body.scrollLeft || 0)
                    - (doc && doc.clientLeft || body && body.clientLeft || 0);

                y = (doc && doc.scrollTop || body && body.scrollTop || 0)
                    - (doc && doc.clientTop || body && body.clientTop || 0);
            }
            x += e.clientX;
            y += e.clientY;
            return {
                x: x,
                y: y
            };
        },

        /**
         * 获取元素位置
         * @param elem
         */
        getElemPos: function (elem) {
            var left = 0;
            var top = 0;
            while (elem) {
                left += elem.offsetLeft;
                top += elem.offsetTop;
                elem = elem.offsetParent;
            }
            return {
                x: left,
                y: top
            }
        },

        /**
         * 返回在数组中的索引
         * @param el
         * @param arr
         * @returns {*}
         */
        indexOf: function (el, arr) {
            if (arr.indexOf) {
                return arr.indexOf(el);
            }
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === el) {
                    return i;
                }
            }
            return -1;
        },


        /**
         * 根据索引从数组中删除元素
         * @param arr
         * @param index
         * @returns {*}
         */
        delArray: function (arr, index) {
            if (index < 0) {
                return arr;
            } else {
                return arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
            }
        },

        /**
         * 找出两个dom之间相邻的dom元素 这里需要找到img的父元素li
         * @param startDom      开始dom
         * @param endDom        结束dom
         * @param direction     方向
         */
        findBetweenDoms: function (startDom, endDom, direction) {
            if (startDom !== endDom.parentNode.parentNode) {
                var next;
                if (direction === 'prev') {
                    next = startDom.nextSibling;
                } else {
                    next = startDom.previousSibling;
                }
                if (next) {
                    if (next !== endDom.parentNode.parentNode) {
                        if (next.nodeType === 1) {
                            betweenDoms[next.getElementsByTagName('img')[0].getAttribute('prop-name')] = next;
                        }
                    }
                    arguments.callee(next, endDom, direction);
                }
            }
        }
    };

    var curDragElem = null,     // 当前移动的元素
        imgContainer,           // 图片容易
        separatorMarker,        // 放置当前拖动图片的位置的标识
        isDrag = false,                 // 是否正在拖动
        curSelectedElems = {    // 当前选中的元素
            elemList: [],
            lastClickDom: null    // 记录上一次点击的dom
        },
        betweenDoms = {};

    var checkDragOrClick = {   // 检测是拖动还是click
        mouseDownCoords: {},
        mouseUpCoords: {}
    };

    var bindEvtFunc = {
        mouseDown: function(e) {
            e = e || window.event;
            checkDragOrClick.mouseDownCoords = utils.getMouseCoords(e);
            curDragElem = e.srcElement || e.target;
            if (curDragElem.tagName.toLowerCase() == 'img') {
                curDragElem = curDragElem.parentNode.parentNode; //拖动的元素实际上是 li 元素
                isDrag = true;
                setTimeout(function () {
                    utils.addEvent(document, 'mousemove', bindEvtFunc.mouseMove);
                }, 0);
            } else {
                curDragElem = null;
            }
            utils.preventDefault(e);
        },

        mouseUp: function(e){
            e = e || window.event;
            checkDragOrClick.mouseUpCoords = utils.getMouseCoords(e);
            utils.removeEvent(document, 'mousemove', bindEvtFunc.mouseMove);
            isDrag = false;

            if (curSelectedElems.elemList.length > 1) {
                var j = 0;
                for (; j < curSelectedElems.elemList.length; j++) {
                    curSelectedElems.elemList[j].parentNode.parentNode.style.position = 'static';
                    curSelectedElems.elemList[j].parentNode.parentNode.style.zIndex = 0;
                }
            } else {
                if (!curDragElem) {
                    return;
                }
                curDragElem.style.position = 'static';
                curDragElem.style.zIndex = 0;
            }
            separatorMarker.style.display = 'none';
            utils.preventDefault(e);
        },

        click: function(e) {
            e = e || window.event;
            var elem = e.srcElement || e.target;
            if (checkDragOrClick.mouseDownCoords.x === checkDragOrClick.mouseUpCoords.x &&
                checkDragOrClick.mouseDownCoords.y === checkDragOrClick.mouseUpCoords.y) {
                isDrag = false;
                if (elem.tagName.toLowerCase() === 'img') {
                    if (curSelectedElems.elemList.length) {
                        if (elem.getAttribute('prop-name') in curSelectedElems) {  // 当前选择的元素在 curSelectedElems中
                            if (curSelectedElems.elemList.length > 1) { // 当前已经选择了多个，效果如同windows资源管理器
                                if (e.ctrlKey) {
                                    delete curSelectedElems[elem.getAttribute('prop-name')];
                                    curSelectedElems.elemList = utils.delArray(curSelectedElems.elemList, utils.indexOf(elem, curSelectedElems.elemList));
                                    elem.style.cssText = '';
                                    curSelectedElems.lastClickDom = elem;
                                } else if (!e.shiftKey) {
                                    handler.resetSelectedElems();
                                    elem.style.cssText = 'padding: 1px;border: 2px solid red';
                                    curSelectedElems[elem.getAttribute('prop-name')] = elem;
                                    curSelectedElems.elemList.push(elem);
                                    curSelectedElems.lastClickDom = elem;
                                }
                            } else {
                                delete curSelectedElems[elem.getAttribute('prop-name')];
                                curSelectedElems.elemList = utils.delArray(curSelectedElems.elemList, utils.indexOf(elem, curSelectedElems.elemList));
                                elem.style.cssText = '';
                            }
                        } else {
                            if (e.ctrlKey) {
                                elem.style.cssText = 'padding: 1px;border: 2px solid red';
                                curSelectedElems[elem.getAttribute('prop-name')] = elem;
                                curSelectedElems.elemList.push(elem);
                                curSelectedElems.lastClickDom = elem;
                            } else if (e.shiftKey) {
                                betweenDoms = {};
                                var startDomX = utils.getElemPos(curDragElem).x;
                                var startDomY = utils.getElemPos(curDragElem).y;
                                var endDomX = utils.getElemPos(curSelectedElems.lastClickDom).x;
                                var endDomY = utils.getElemPos(curSelectedElems.lastClickDom).y;
                                if (startDomY < endDomY) {
                                    utils.findBetweenDoms(curDragElem, curSelectedElems.lastClickDom, 'prev');
                                } else if (startDomY == endDomY) {
                                    if (startDomX < endDomX) {
                                        utils.findBetweenDoms(curDragElem, curSelectedElems.lastClickDom, 'prev');
                                    } else {
                                        utils.findBetweenDoms(curDragElem, curSelectedElems.lastClickDom, 'next');
                                    }
                                } else {
                                    utils.findBetweenDoms(curDragElem, curSelectedElems.lastClickDom, 'next');
                                }
                                elem.style.cssText = 'padding: 1px;border: 2px solid red';
                                for (var q in betweenDoms) {
                                    betweenDoms[q].getElementsByTagName('img')[0].style.cssText = 'padding: 1px;border: 2px solid red';
                                }

                                var tmp = curSelectedElems.lastClickDom;
                                handler.resetSelectedElems();

                                curSelectedElems[elem.getAttribute('prop-name')] = elem;
                                curSelectedElems.elemList.push(elem);

                                tmp.style.cssText = 'padding: 1px;border: 2px solid red';
                                curSelectedElems[tmp.getAttribute('prop-name')] = tmp;
                                curSelectedElems.elemList.push(tmp);
                                curSelectedElems.lastClickDom = tmp;
                                for (var x in betweenDoms) {
                                    var imgE = betweenDoms[x].getElementsByTagName('img')[0];
                                    imgE.style.cssText = 'padding: 1px;border: 2px solid red';
                                    curSelectedElems[imgE.getAttribute('prop-name')] = imgE;
                                    curSelectedElems.elemList.push(imgE);
                                }
                            } else {
                                handler.resetSelectedElems();
                                elem.style.cssText = 'padding: 1px;border: 2px solid red';
                                curSelectedElems[elem.getAttribute('prop-name')] = elem;
                                curSelectedElems.elemList.push(elem);
                                curSelectedElems.lastClickDom = elem;
                            }
                        }
                    } else {
                        elem.style.cssText = 'padding: 1px;border: 2px solid red';
                        curSelectedElems[elem.getAttribute('prop-name')] = elem;
                        curSelectedElems.elemList.push(elem);
                        curSelectedElems.lastClickDom = elem;
                    }
                }
            }
            utils.preventDefault(e);
        },

        mouseMove: function(e) {
            e = e || window.event;
            if (isDrag) {
                var coords = utils.getMouseCoords(e);
                if (curSelectedElems.elemList.length > 1) {
                    var i = 0;
                    var t;
                    for (; i < curSelectedElems.elemList.length; i++) {
                        t = curSelectedElems.elemList[i].parentNode.parentNode;
                        t.style.position = 'absolute';
                        t.style.left = coords.x - 30 + 'px';
                        t.style.top = coords.y - 30 + 'px';
                        t.style.zIndex = 1;
                    }
                } else {
                    if (curDragElem) {
                        curDragElem.style.position = 'absolute';
                        curDragElem.style.left = coords.x - 30 + 'px';
                        curDragElem.style.top = coords.y - 30 + 'px';
                        curDragElem.style.zIndex = 1;
                    }
                }
            }
            // 取消选择
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            handler.checkDropElem(coords);
            utils.preventDefault(e);
        }

    };

    var handler = {
        init: function(){
            imgContainer = $('img_container');
            separatorMarker = document.getElementById('separatorMarker');
            handler.bindEvt();
        },

        bindEvt: function(){
            utils.addEvent(imgContainer, 'mousedown', bindEvtFunc.mouseDown);
            utils.addEvent(document, 'mouseup', bindEvtFunc.mouseUp);
            utils.addEvent(imgContainer, 'click', bindEvtFunc.click);
        },

        /**
         * 重置curSelectedElems
         *
         * @return {[type]} [return description]
         */
        resetSelectedElems: function() {
            for (var m in curSelectedElems) {
                curSelectedElems[m] && curSelectedElems[m].style && (curSelectedElems[m].style.cssText = '');
            }
            curSelectedElems = {
                elemList: []
            };
        },

        /**
         * 检测当前位置是否能够放下鼠标正在拖动的元素
         * @param curCoords
         */
        checkDropElem: function(curCoords) {
            var pos = utils.getElemPos(imgContainer);
            // 判断拖动元素是否在目标元素的范围内，这里目标元素就是 imgContainer
            if ((curCoords.x > pos.x) &&
                (curCoords.x < pos.x + imgContainer.offsetWidth)) {
                handler.dropElem(curCoords);
            }
        },

        /**
         * 在当前位置放下元素
         *
         * @param {[type]} curCoords [curCoords description]
         * @return {[type]} [return description]
         */
        dropElem: function(curCoords) {
            var i = 0, child = null;
            for (; i < imgContainer.childNodes.length; i++) {
                child = imgContainer.childNodes[i];
                if (child.nodeType === 1) {
                    var childPos = utils.getElemPos(child);
                    var xPos = childPos.x + child.offsetWidth / 2;
                    var yPos = childPos.y + child.offsetHeight / 2;
                    var offsetX = Math.abs(xPos - curCoords.x);
                    var offsetY = Math.abs(yPos - curCoords.y);
                    if ((offsetX > 0 && offsetX < 30)
                        && (offsetY > 0 && offsetY < 30)) {
                        // separatorMarker.style.left = childPos.x - 7 + 'px';
                        // separatorMarker.style.top = childPos.y - 3 + 'px';
                        // separatorMarker.style.display = 'block';
                        if (curSelectedElems.elemList.length > 1) {
                            var j = 0, t;
                            for (; j < curSelectedElems.elemList.length; j++) {
                                t = curSelectedElems.elemList[j].parentNode.parentNode;
                                if (t != child) {
                                    separatorMarker.style.left = childPos.x - 7 + 'px';
                                    separatorMarker.style.top = childPos.y - 3 + 'px';
                                    separatorMarker.style.display = 'block';
                                    imgContainer.insertBefore(t, child);
                                }
                            }
                        } else {
                            if (curDragElem != child) {
                                separatorMarker.style.left = childPos.x - 7 + 'px';
                                separatorMarker.style.top = childPos.y - 3 + 'px';
                                separatorMarker.style.display = 'block';
                                imgContainer.insertBefore(curDragElem, child);
                            }
                        }
                    }
                }
            }
        }
    };

    handler.init();


})();
