/*! 2016 Baidu Inc. All Rights Reserved */
define("config",["require"],function(){var exports={defaultBranchWidth:270,swingBranchTop:40,dropDistance:20,maxBranchNum:15,baseScore:10};return exports}),define("util",["require"],function(){var e=window.getComputedStyle,t=/matrix\(1, 0, 0, 1, (.*),[\s\S]*/,n=/(?:\{\{)([a-zA-Z][^\s\}]+)(?:\}\})/g,exports={};return exports.getPrev=function(e){for(var t=e.previousSibling;t;){if(1===t.nodeType)return t;if(t=t.previousSibling,!t)return null}},exports.render=function(e,t){return e.replace(n,function(e,n){var r=t[n];if(null!==r&&void 0!==r)return t[n];else return e})},exports.findKeyframesRule=function(e){for(var t=document.styleSheets,n=0;n<t.length;++n)for(var r=0;r<t[n].cssRules.length;++r)if(t[n].cssRules[r].type==window.CSSRule.WEBKIT_KEYFRAMES_RULE&&t[n].cssRules[r].name==e)return t[n].cssRules[r];return null},exports.getTranslateX=function(n){var r=e(n).transform||e(n).webkitTransform,i=r.match(t);if(i)return 0|i[1];else return 0},exports.randomInt=function(e,t){return Math.floor(Math.random()*(t-e+1)+e)},exports.inherits=function(e,t){var n=function(){};n.prototype=t.prototype;var r=e.prototype,i=e.prototype=new n;for(var a in r)if(r.hasOwnProperty(a))i[a]=r[a];return e.prototype.constructor=e,e.superClass=t.prototype,e},exports.getTimestamp=function(){return Date.now||function(){return(new Date).getTime()}}(),exports.fps=function(){var e=0;return function(){var t=e,n=e=exports.getTimestamp();return Math.floor(1e3/(n-t))}}(),exports}),define("Event",["require"],function(){function e(){this._events={}}var t="_observerGUID",n=e.prototype;return n.on=function(e,n){if(!this._events)this._events={};var r=this._events[e];if(!r)r=this._events[e]=[];if(!n.hasOwnProperty(t))n[t]=+new Date;return r.push(n),this},n.un=function(e,t){if(this._events){if(!t)return void(this._events[e]=[]);var n=this._events[e];if(n)for(var r=0;r<n.length;r++)if(n[r]===t)n.splice(r,1),r--;return this}},n.fire=function(e,n){if(1===arguments.length&&"object"==typeof e)n=e,e=n.type;var r=this["on"+e];if("function"==typeof r)r.call(this,n);if(this._events){if(null==n)n={};if("[object Object]"!==Object.prototype.toString.call(n))n={data:n};n.type=e,n.target=this;var i={},a=this._events[e];if(a){a=a.slice();for(var s=0;s<a.length;s++){var o=a[s];if(!i.hasOwnProperty(o[t]))o.call(this,n)}}if("*"!==e){var l=this._events["*"];if(!l)return;l=l.slice();for(var s=0;s<l.length;s++){var o=l[s];if(!i.hasOwnProperty(o[t]))o.call(this,n)}}}},n.clearEvents=function(){this._events={}},n.enable=function(t){t._events={},t.on=e.prototype.on,t.un=e.prototype.un,t.fire=e.prototype.fire},e}),define("Game",["require","./util","./Event"],function(require){function e(){this.sprites=[],this.timer=null}var t=require("./util"),n=require("./Event"),r=e.prototype;return r.render=function(){var e=this;!function t(){var n=e.sprites;e.sprites=[];for(var r=n.length,i=-1;++i<r;){var a=n[i];if(-1!==a.status){var a=n[i];e.sprites.push(a),a.move()}}e.timer=window.requestAnimationFrame(t)}()},r.addSprite=function(e){this.sprites.push(e),this.fire("addSprite",e)},r.removeSprite=function(e){e.status=-1,e.fire("removeSprite",e)},r.stop=function(){window.cancelAnimationFrame(this.timer)},t.inherits(e,n),e}),define("branch",["require","./util","./Event","./config"],function(require){function e(){this.items=[15,20],this.index=-1}function t(e){this.name=e.name||n.getTimestamp(),this.x=e.x||0,this.y=e.y||0,this.vx=e.vx||0,this.vy=e.vy||0,this.then=null,this.accumulateTime=null,this.width=e.width||0,this.middleWidth=e.middleWidth||(0===e.width?0:e.width-10),this.status=1,this._create(),this.dom=document.querySelector(".current"),this.domStyle=this.dom.style,this.dom.branch=this,this.on("removeSprite",function(){this.dom.parentNode.removeChild(this.dom)})}var n=require("./util"),r=require("./Event"),i=require("./config");e.prototype.pick=function(){if(this.index++,this.index===this.items.length)this.index=0;return this.items[this.index]};var a=document.querySelector(".branch-wrapper"),s='<div class="branch-item current" data-clsrandom="{{clsRandom}}" style="width: {{itemWidth}}px; z-index: {{zIndex}}; -webkit-transform: translateX({{translateX}}px) translateY({{top}}px) translateZ(0); transform: translateX({{translateX}}px) translateY({{top}}px) translateZ(0);"><div class="branch-left branch-left{{clsRandom}}"></div><div class="branch-middle branch-middle{{clsRandom}}" style="width: {{middleWidth}}px;"></div><div class="branch-right branch-right{{clsRandom}}" style="margin-left: {{middleWidth}}px;"></div></div>',o=1e3/60,l=new e,c=t.prototype;return c._create=function(){var e=document.createElement("div"),t=n.randomInt(1,4);e.innerHTML=n.render(s,{clsRandom:t,itemWidth:this.width,middleWidth:this.middleWidth,translateX:this.x,top:this.y,zIndex:l.pick()}),a.appendChild(e.childNodes[0])},c.move=function(){var e,t;if(!this.then)return this.accumulateTime=0,this.then=n.getTimestamp();for(e=n.getTimestamp(),t=e-this.then,this.accumulateTime+=t;this.accumulateTime>o;)this.update(),this.accumulateTime-=o;return this.then=e,this.draw(),this},c.update=function(){if(this.x+=this.vx,this.y+=this.vy,this.x>globalData.width-this.width||this.x<=0)this.vx=-this.vx;if(this.y>=i.dropDistance)this.vy=0},c.draw=function(){this.domStyle.webkitTransform=this.domStyle.transform="translateX("+this.x+"px) translateY("+this.y+"px) translateZ(0)"},c.changeStyle=function(e){this.domStyle.width=this.width-e+"px";for(var t=this.dom.childNodes,n=t.length,r=-1;++r<n;){var i=t[r];if(i.classList.contains("branch-middle"))i.style.width=this.width-e-10+"px";if(i.classList.contains("branch-right"))i.style.marginLeft=this.width-e-10+"px"}this.dom.classList.remove("current"),this.domStyle.left=0,this.domStyle.top=0},n.inherits(t,r),t}),define("index",["require","./config","./util","./Game","./branch"],function(require){function e(e){var t=e.target||e.srcElement;if(t.parentNode.removeChild(t),d.body.addEventListener(globalData.touchStartEvent,r),C%5===0)b.innerHTML=+b.innerHTML+1,q+=2}function t(e){e.stopPropagation(),e.preventDefault(),y.style.display="none",f.style.display="none",p.style.display="block",d.body.addEventListener(globalData.touchStartEvent,r),g.addEventListener("webkitAnimationEnd",function(){g.classList.remove("shake")}),g.addEventListener("animationend",function(){g.classList.remove("shake")});var t=d.querySelector(".branch-item").offsetTop;s=new u({x:0,y:t-o.swingBranchTop,vx:q,width:A});var n=d.querySelector(".fps");E.addSprite({count:0,move:function(){var e=l.fps();if(10===++this.count)this.count=0,n.innerHTML="FPS: "+e}}),E.addSprite(s),E.render()}function n(t,n){n=n||"left";var r=document.createElement("div");r.className="break-branch down";var i=r.style,a=0;if("left"===n)i.marginLeft=s.x+"px",i.width=t+"px",i.top=s.y+"px",r.innerHTML='<div class="branch-left branch-left1"></div><div class="branch-middle branch-middle1" style="width: '+t+'px;"></div>',A-=t,s.vx=0,s.dom.style.marginLeft=t+"px",s.dom.setAttribute("data-left",s.x+t),s.dom.setAttribute("data-right",s.x+t+A),a=globalData.width-A;else i.marginLeft=A-t-10+s.x+"px",i.width=t+"px",i.top=s.y+"px",r.innerHTML='<div class="branch-middle branch-middle1" style="width: '+t+'px;"></div><div class="branch-right branch-right1" style="margin-left: '+t+'px"></div>',A-=t,s.vx=0,s.dom.setAttribute("data-left",s.x),s.dom.setAttribute("data-right",s.x+A);if(r.addEventListener("webkitAnimationEnd",e),r.addEventListener("animationend",e),m.appendChild(r),s.changeStyle(t),C+1>o.maxBranchNum){{getComputedStyle(m).transform||getComputedStyle(m).webkitTransform}m.style.transform=m.style.webkitTransform="translateY("+20*(C+1-o.maxBranchNum)+"px)";var l=setTimeout(function(){clearTimeout(l);var e=document.querySelector(".branch-wrapper .branch-item");if(e.branch)E.removeSprite(e.branch)},0)}s=new u({x:a,y:offsetTop-o.swingBranchTop,vx:q,width:A}),E.addSprite(s)}function r(e){e.stopPropagation(),e.preventDefault(),d.body.removeEventListener(globalData.touchStartEvent,r),offsetTop=s.y+=o.dropDistance;var t=l.getPrev(s.dom),a=0|t.getAttribute("data-left"),c=a+A;if(s.x>c)i();else if(s.x+s.width<a)i();else{C++;var u=0,f=a-s.x;if(f-0>0)n(f,"left"),u=10;else if(0>f+0)f=s.x+A-(a+A),n(f,"right"),u=10;else n(0,"right"),u=50,g.classList.add("shake"),S+=1;g.innerHTML=+g.innerHTML+u,v.innerHTML=S}}function i(){E.stop(),y.style.display="block",w.innerHTML="本次得分 "+g.innerHTML+"，最大连击数 "+v.innerHTML+"。",document.title="我在堆木头中得到 "+g.innerHTML+"分，最大连击数 "+v.innerHTML+"。你也来试试吧~~~"}function a(e){document.title="堆木头",E=new c,A=o.defaultBranchWidth,m.style.transform=m.style.webkitTransform="translateY(0)";for(var n=d.querySelectorAll(".branch-wrapper .branch-item"),r=0,i=n.length;i>r;r++)if(!n[r].classList.contains("base"))n[r].parentNode.removeChild(n[r]);S=0,v.innerHTML=S,k=1,b.innerHTML=k,C=0,q=3,g.innerHTML=0,t(e)}var s,o=require("./config"),l=require("./util"),c=require("./Game"),u=require("./branch"),d=document,f=(Math.floor,d.querySelector(".guide-tip")),h=d.querySelector(".start"),p=d.querySelector(".game-content"),m=d.querySelector(".branch-wrapper"),g=d.querySelector(".score-panel .left span"),v=d.querySelector(".score-panel .right span"),b=d.querySelector(".score-panel .middle span"),y=d.querySelector(".end"),w=d.querySelector(".end .info"),x=d.querySelector(".end .play-again"),S=0,k=1,C=0,q=3,A=o.defaultBranchWidth,E=new c,exports={};return exports.init=function(){var e=d.querySelector(".base"),n=e.style;n.webkitTransform=n.transform="translate3d("+(globalData.width-A)/2+"px, 0, 0)",e.setAttribute("data-left",(globalData.width-A)/2),e.setAttribute("data-right",(globalData.width-A)/2+A),h.addEventListener(globalData.touchStartEvent,t),x.addEventListener(globalData.touchStartEvent,a)},exports});