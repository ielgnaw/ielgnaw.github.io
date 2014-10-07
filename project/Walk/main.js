window.onload = function () {
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

    function getStyle(elem, name) {
        if (elem.style[name]) {
            return elem.style[name];
        }
        else if (elem.currentStyle) {
            return elem.currentStyle[name];
        }
        else if (document.defaultView && document.defaultView.getComputedStyle) {
            name = name.replace(/([A-Z])/g, "-$1");
            name = name.toLowerCase();
            var s = document.defaultView.getComputedStyle(elem, "");
            return s && s.getPropertyValue(name);
        }
        else {
            return null
        }
    }

    var framePos = []; // 记录每一帧动画的position
    framePos[0] = [ // up
        {
            left: '-2px',
            top: '-196px'
        },
        {
            left: '-49px',
            top: '-196px'
        },
        {
            left: '-98px',
            top: '-196px'
        },
        {
            left: '-147px',
            top: '-196px'
        },
        {
            left: '-194px',
            top: '-196px'
        }
    ];
    framePos[1] = [ // down
        {
            left: '2px',
            top: '0'
        },
        {
            left: '-48px',
            top: '0'
        },
        {
            left: '-95px',
            top: '0'
        },
        {
            left: '-142px',
            top: '0'
        },
        {
            left: '-190px',
            top: '0'
        }
    ];
    framePos[2] = [ // left
        {
            left: '2px',
            top: '-63px'
        },
        {
            left: '-48px',
            top: '-63px'
        },
        {
            left: '-96px',
            top: '-63px'
        },
        {
            left: '-142px',
            top: '-63px'
        },
        {
            left: '-190px',
            top: '-63px'
        }
    ];
    framePos[3] = [ // right
        {
            left: '-1px',
            top: '-129px'
        },
        {
            left: '-49px',
            top: '-129px'
        },
        {
            left: '-96px',
            top: '-129px'
        },
        {
            left: '-144px',
            top: '-129px'
        },
        {
            left: '-193px',
            top: '-129px'
        }
    ];

    var step = 0;
    var timer = null;
    var npc = $('npc');

    addEvent(document.body, 'keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        if (!timer) {
            if (keyCode == 87 || keyCode == 38) { // up
                move(e, 'up');
            }
            else if (keyCode == 83 || keyCode == 40) { // down
                move(e, 'down');
            }
            else if (keyCode == 65 || keyCode == 37) { // left
                move(e, 'left');
            }
            else if (keyCode == 68 || keyCode == 39) { // right
                move(e, 'right');
            }
        }
    });

    function move (e, direction) {
        stopEvent(e);
        var curFrame = null;
        if (direction == 'up') {
            curFrame = framePos[0];
        }
        else if (direction == 'down') {
            curFrame = framePos[1];
        }
        else if (direction == 'left') {
            curFrame = framePos[2];
        }
        else if (direction == 'right') {
            curFrame = framePos[3];
        }

        timer = setInterval(function () {
            var top = parseInt(getStyle(npc, 'top'), 10);
            var left = parseInt(getStyle(npc, 'left'), 10);
            npc.style.backgroundPosition =
                curFrame[step].left + ' ' + curFrame[step].top;
            step = step + 1;
            switch (direction) {
                case 'up':
                    npc.style.top = top - step * 3 + 'px';
                break;
                case 'down':
                    npc.style.top = top + step * 3 + 'px';
                break;
                case 'left':
                    npc.style.left = left - step * 3 + 'px';
                break;
                case 'right':
                    npc.style.left = left + step * 3 + 'px';
                break;
                default:
                    return;
            }
            if (step == 5) {
                step = 0;
                timer && clearInterval(timer);
                timer = null;
            }
        }, 200);

    }
}