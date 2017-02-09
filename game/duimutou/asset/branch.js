/*! 2016 Baidu Inc. All Rights Reserved */
define("branch",["require","./util","./Event","./config"],function(require){function e(){this.items=[15,20],this.index=-1}function t(e){this.name=e.name||n.getTimestamp(),this.x=e.x||0,this.y=e.y||0,this.vx=e.vx||0,this.vy=e.vy||0,this.then=null,this.accumulateTime=null,this.width=e.width||0,this.middleWidth=e.middleWidth||(0===e.width?0:e.width-10),this.status=1,this._create(),this.dom=document.querySelector(".current"),this.domStyle=this.dom.style,this.dom.branch=this,this.on("removeSprite",function(){this.dom.parentNode.removeChild(this.dom)})}var n=require("./util"),r=require("./Event"),i=require("./config");e.prototype.pick=function(){if(this.index++,this.index===this.items.length)this.index=0;return this.items[this.index]};var s=document.querySelector(".branch-wrapper"),a='<div class="branch-item current" data-clsrandom="{{clsRandom}}" style="width: {{itemWidth}}px; z-index: {{zIndex}}; -webkit-transform: translateX({{translateX}}px) translateY({{top}}px) translateZ(0); transform: translateX({{translateX}}px) translateY({{top}}px) translateZ(0);"><div class="branch-left branch-left{{clsRandom}}"></div><div class="branch-middle branch-middle{{clsRandom}}" style="width: {{middleWidth}}px;"></div><div class="branch-right branch-right{{clsRandom}}" style="margin-left: {{middleWidth}}px;"></div></div>',o=1e3/60,l=new e,u=t.prototype;return u._create=function(){var e=document.createElement("div"),t=n.randomInt(1,4);e.innerHTML=n.render(a,{clsRandom:t,itemWidth:this.width,middleWidth:this.middleWidth,translateX:this.x,top:this.y,zIndex:l.pick()}),s.appendChild(e.childNodes[0])},u.move=function(){var e,t;if(!this.then)return this.accumulateTime=0,this.then=n.getTimestamp();for(e=n.getTimestamp(),t=e-this.then,this.accumulateTime+=t;this.accumulateTime>o;)this.update(),this.accumulateTime-=o;return this.then=e,this.draw(),this},u.update=function(){if(this.x+=this.vx,this.y+=this.vy,this.x>globalData.width-this.width||this.x<=0)this.vx=-this.vx;if(this.y>=i.dropDistance)this.vy=0},u.draw=function(){this.domStyle.webkitTransform=this.domStyle.transform="translateX("+this.x+"px) translateY("+this.y+"px) translateZ(0)"},u.changeStyle=function(e){this.domStyle.width=this.width-e+"px";for(var t=this.dom.childNodes,n=t.length,r=-1;++r<n;){var i=t[r];if(i.classList.contains("branch-middle"))i.style.width=this.width-e-10+"px";if(i.classList.contains("branch-right"))i.style.marginLeft=this.width-e-10+"px"}this.dom.classList.remove("current"),this.domStyle.left=0,this.domStyle.top=0},n.inherits(t,r),t});