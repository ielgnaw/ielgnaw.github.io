/*! 2016 Baidu Inc. All Rights Reserved */
define("Game",["require","./util","./Event"],function(require){function e(){this.sprites=[],this.timer=null}var t=require("./util"),n=require("./Event"),r=e.prototype;return r.render=function(){var e=this;!function t(){var n=e.sprites;e.sprites=[];for(var r=n.length,i=-1;++i<r;){var s=n[i];if(-1!==s.status){var s=n[i];e.sprites.push(s),s.move()}}e.timer=window.requestAnimationFrame(t)}()},r.addSprite=function(e){this.sprites.push(e),this.fire("addSprite",e)},r.removeSprite=function(e){e.status=-1,e.fire("removeSprite",e)},r.stop=function(){window.cancelAnimationFrame(this.timer)},t.inherits(e,n),e});