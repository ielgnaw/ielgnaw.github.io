/**
 * @file clock
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {
    console.warn(34);
    console.warn(require('jquery'));
    console.warn(require('underscore'));

    var canvasControl = (function () {

        var FONT_HEIGHT = 15;
        var MARGIN = 100;

        var timer;

        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        // var canvas.width = canvas.width;
        var canvasHeight = canvas.height;
        var HAND_TRUNCATION = canvas.width / 25;
        var HOUR_HAND_TRUNCATION = canvas.width / 10;
        var NUMERAL_SPACING = 20;
        var RADIUS = canvas.width / 2 - MARGIN;
        var HAND_RADIUS = RADIUS + NUMERAL_SPACING;

        function drawCircle() {
            ctx.beginPath();
            ctx.arc(
                canvas.width / 2,
                canvasHeight / 2,
                RADIUS,
                0,
                Math.PI * 2,
                true
            );
            ctx.stroke();
        }

        function drawNumerals() {
            var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            var angle = 0;
            var numeralWidth = 0;
            numerals.forEach(
                function (numeral) {
                    angle = Math.PI / 6 * (numeral - 3);
                    numeralWidth = ctx.measureText(numeral).width;
                    ctx.fillText(
                        numeral,
                        canvas.width / 2 + Math.cos(angle) * (HAND_RADIUS) - numeralWidth / 2,
                        canvasHeight / 2 + Math.sin(angle) * (HAND_RADIUS) - FONT_HEIGHT / 2
                    );
                }
            );
        }

        function drawCenter() {
            ctx.beginPath();
            ctx.arc(
                canvas.width / 2,
                canvasHeight / 2,
                5,
                0,
                Math.PI * 2,
                true
            );
            ctx.fill();
        }

        function drawHand(loc, isHour) {
            var angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2;
            var handRadius = isHour
                ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION
                : RADIUS - HAND_TRUNCATION;
            ctx.moveTo(canvas.width / 2, canvasHeight / 2);
            ctx.lineTo(
                canvas.width / 2 + Math.cos(angle) * handRadius,
                canvasHeight / 2 + Math.sin(angle) * handRadius
            );
            ctx.stroke();
        }

        function drawHands() {
            var date = new Date();
            var hour = date.getHours();
            hour = hour > 12 ? (hour - 12) : hour;
            drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true, 0.5);
            drawHand(date.getMinutes(), false, 0.5);
            drawHand(date.getMinutes(), false, 0.3);
            drawHand(date.getSeconds(), false, 0.1);
        }

        function drawClock() {
            ctx.clearRect(0, 0, canvas.width, canvasHeight);
            drawCircle();
            drawCenter();
            drawHands();
            drawNumerals();
        }

        function start() {
            ctx.font = FONT_HEIGHT + 'px Arial';
            timer = setInterval(drawClock, 1000);
        }

        function stop() {
            clearInterval(timer);
        }

        return {
            start: start,
            stop: stop
        };

    })();

    function init() {
        canvasControl.start();
    }

    return {
        init: init
    };

});
