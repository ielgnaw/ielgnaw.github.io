window.onload = function () {
    var $ = function (elem) {
        return typeof elem === 'string'
            ?
            document.getElementById(elem)
            :
            elem;
    }

    /**
     * 一个简单的观察者模式
     */
    function EventEmitter() {
        this.handlers = {};
    }
    EventEmitter.prototype = {
        constructor : EventEmitter,
        on : function (type, handler) {
            if (typeof this.handlers[type] == 'undefined') {
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
        },
        emit : function (type, data) {
            data = data || null;
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    data ? handlers[i](data) : handlers[i]();
                }
            }
        }
    };

    var view = {};
    view.shape = $('shape');
    view.export = $('export');
    view.exportImg = $('export-img-container');
    view.canvas = $('canvas');
    view.canvasCtx = view.canvas.getContext('2d');
    view.canvasTemp = $('canvas-temp');
    view.canvasTempCtx = view.canvasTemp.getContext('2d');

    var mouseDownX;
    var mouseDownY;
    var isDraw = false;

    var eventEmitter = new EventEmitter();
    eventEmitter.on('shape-change', shapeChangeFn);

    function shapeChangeFn (data) {
        isDraw = true;
        switch (data.shape) {
            case 'pen':
                drawPen();
            break;
            case 'line':
                drawLine();
            break;
            case 'rect':
                drawRect();
            break;
            case 'circle':
                drawCircle();
            break;
            case 'ellipse':
                drawEllipse();
            break;
            default:
                isDraw = false;
                return;
        }
    }

    function drawPen () {
        view.canvasTemp.onmousedown = function (_e) {
            mouseDownX = _e.layerX;
            mouseDownY = _e.layerY;
            var gradient = view.canvasTempCtx.createLinearGradient(0, 2, 420, 2);
            gradient.addColorStop(0, 'rgba(200,0,0,0.8)');
            gradient.addColorStop(0.5, 'rgba(0,200,0,0.7)');
            gradient.addColorStop(1, 'rgba(200,0,200,0.9)');
            view.canvasTempCtx.lineWidth = 10;
            view.canvasTempCtx.strokeStyle = gradient;
            view.canvasTempCtx.lineCap = 'round';
            view.canvasTempCtx.moveTo(mouseDownX, mouseDownY);
            view.canvasTemp.onmousemove = function (e) {
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvasTemp.width,
                    view.canvasTemp.height
                );
                view.canvasTempCtx.lineTo(e.layerX, e.layerY);
                view.canvasTempCtx.stroke();
            };
            view.canvasTemp.onmouseup = function (e) {
                view.canvasTemp.onmousemove = null;
                view.canvasTemp.onmouseup = null;
                view.canvasCtx.drawImage(view.canvasTemp, 0, 0);
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
            };
        }
    }

    function drawLine () {
        view.canvasTemp.onmousedown = function (_e) {
            mouseDownX = _e.layerX;
            mouseDownY = _e.layerY;
            view.canvasTempCtx.lineWidth = 5;
            view.canvasTempCtx.strokeStyle = '#000';
            view.canvasTempCtx.lineCap = 'butt';
            view.canvasTemp.onmousemove = function (e) {
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvasTemp.width,
                    view.canvasTemp.height
                );
                view.canvasTempCtx.beginPath();
                view.canvasTempCtx.moveTo(mouseDownX, mouseDownY);
                view.canvasTempCtx.lineTo(e.layerX, e.layerY);
                view.canvasTempCtx.stroke();
                view.canvasTempCtx.closePath();
            };
            view.canvasTemp.onmouseup = function (e) {
                view.canvasTempCtx.beginPath();
                view.canvasTemp.onmousemove = null;
                view.canvasTemp.onmouseup = null;

                view.canvasCtx.drawImage(view.canvasTemp, 0, 0);
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
            };
        }
    }

    function drawRect () {
        view.canvasTemp.onmousedown = function (e) {
            mouseDownX = e.layerX;
            mouseDownY = e.layerY;
            var gradient = view.canvasTempCtx.createLinearGradient(0, 2, 420, 2);
            gradient.addColorStop(0, 'rgba(200,0,0,0.8)');
            gradient.addColorStop(0.5, 'rgba(0,200,0,0.7)');
            gradient.addColorStop(1, 'rgba(200,0,200,0.9)');
            view.canvasTempCtx.fillStyle = gradient;
            view.canvasTemp.onmousemove = function (e) {
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
                view.canvasTempCtx.fillRect(
                    mouseDownX,
                    mouseDownY,
                    e.layerX - mouseDownX,
                    e.layerY - mouseDownY
                );
            };
            view.canvasTemp.onmouseup = function (e) {
                view.canvasTemp.onmousemove = null;
                view.canvasTemp.onmouseup = null;

                view.canvasCtx.drawImage(view.canvasTemp, 0, 0);
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
            };
        }
    }

    function drawCircle () {
        view.canvasTemp.onmousedown = function (e) {
            mouseDownX = e.layerX;
            mouseDownY = e.layerY;
            var gradient = view.canvasTempCtx.createLinearGradient(0, 2, 420, 2);
            gradient.addColorStop(0, 'rgba(200,0,0,0.8)');
            gradient.addColorStop(0.5, 'rgba(0,200,0,0.7)');
            gradient.addColorStop(1, 'rgba(200,0,200,0.9)');
            view.canvasTempCtx.fillStyle = gradient;
            view.canvasTemp.onmousemove = function (e) {
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
                view.canvasTempCtx.beginPath();
                view.canvasTempCtx.arc(
                    mouseDownX,
                    mouseDownY,
                    Math.abs(e.layerX - mouseDownX),
                    0,
                    Math.PI * 2,
                    false
                );
                view.canvasTempCtx.fill();
                view.canvasTempCtx.closePath();
            };
            view.canvasTemp.onmouseup = function (e) {
                view.canvasTemp.onmousemove = null;
                view.canvasTemp.onmouseup = null;

                view.canvasCtx.drawImage(view.canvasTemp, 0, 0);
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
            };
        }
    }

    function drawEllipse () {
        view.canvasTemp.onmousedown = function (e) {
            mouseDownX = e.layerX;
            mouseDownY = e.layerY;
            var gradient = view.canvasTempCtx.createLinearGradient(0, 2, 420, 2);
            gradient.addColorStop(0, 'rgba(200,0,0,0.8)');
            gradient.addColorStop(0.5, 'rgba(0,200,0,0.7)');
            gradient.addColorStop(1, 'rgba(200,0,200,0.9)');
            view.canvasTempCtx.fillStyle = gradient;
            view.canvasTemp.onmousemove = function (e) {
                var st = 0;
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
                view.canvasTempCtx.beginPath();
                view.canvasTempCtx.moveTo(
                    mouseDownX + (e.layerX - mouseDownX) * Math.cos(st),
                    mouseDownY + (e.layerX - mouseDownX) * Math.sin(st)
                );
                st += 1 / 180 * Math.PI;
                for (var i = 0; i < 360; i++) {
                    view.canvasTempCtx.lineTo(
                        mouseDownX + (e.layerX - mouseDownX) * Math.cos(st),
                        mouseDownY + (e.layerY - mouseDownY) * Math.sin(st)
                    );
                    st += 1 / 180 * Math.PI;
                }
                view.canvasTempCtx.fill();
                view.canvasTempCtx.closePath();
            };
            view.canvasTemp.onmouseup = function (e) {
                view.canvasTempCtx.beginPath();
                view.canvasTemp.onmousemove = null;
                view.canvasTemp.onmouseup = null;

                view.canvasCtx.drawImage(view.canvasTemp, 0, 0);
                view.canvasTempCtx.clearRect(
                    0,
                    0,
                    view.canvas.width,
                    view.canvas.height
                );
            };
        }
    }

    function init () {
        view.shape.value = 0;
        bindEvt();
    }

    function bindEvt () {
        view.shape.onchange = function (e) {
            var elem = e.target || e.srcElement;
            eventEmitter.emit('shape-change', {
                shape: elem.value
            });
        }

        view.export.onclick = function (e) {
            var url = view.canvas.toDataURL();
            if (isDraw) {
                var a = document.createElement('a');
                a.setAttribute('download', 'export.png');
                a.setAttribute('href', url);
                a.setAttribute('target', '_blank');
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    try {
                        a.parentNode.removeChild(a);
                    }
                    catch (e) {
                    }
                }, 200);
            }
        }
    }

    init();

}