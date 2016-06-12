var SG_Hooks={debug:!0,getLanguage:function(e){return SG.initLangs(e)},getGameConfig:function(){return SG.getGameConfig()},isEnabledIncentiviseButton:function(){return SG.isEnabledIncentiviseButton()},start:function(){SG_Hooks.debug&&console.log("game started"),SG.trigger({type:"start"})},levelStarted:function(e){SG_Hooks.debug&&console.log("level started:"+e),SG.trigger({type:"levelStarted",level:e})},levelFinished:function(e,t){SG_Hooks.debug&&console.log("level finished:"+e+" score: "+t),SG.trigger({type:"levelFinished",level:e,score:t})},levelUp:function(e,t,o){SG_Hooks.debug&&console.log("level up:"+e+"/"+t),SG.trigger({type:"levelUp",level:e,lastLevelScore:t},o)},gameOver:function(e,t,o){SG_Hooks.debug&&console.log("game over:"+e+"/"+t),SG.trigger({type:"gameOver",score:t},o)},gameCompleted:function(e,t){SG_Hooks.debug&&console.log("game completed:"+e),SG.trigger({type:"gameCompleted",score:e},t)},gamePause:function(e,t){SG_Hooks.debug&&console.log("game pause:"+e),SG.trigger({type:"gamePause",state:e},t)},gameRestart:function(e){SG_Hooks.debug&&console.log("game restart:"),SG.trigger({type:"gameRestart"},e)},selectMainMenu:function(e){SG_Hooks.debug&&console.log("selectMainMenu:"),SG.trigger({type:"selectMainMenu"},e)},selectLevel:function(e,t){SG_Hooks.debug&&console.log("selectLevel:"+e),SG.trigger({type:"selectLevel",level:e},t)},setSound:function(e,t){SG_Hooks.debug&&console.log("setSound:"+e),SG.trigger({type:"gameCompleted",state:e},t)},triggerIncentivise:function(e){SG_Hooks.debug&&console.log("triggerIncentivise"),SG.trigger({type:"incentiviseTriggered"},e)},setOrientationHandler:function(e){SG.setOrientationHandler(e)},setResizeHandler:function(e){SG.setResizeHandler(e)},setPauseHandler:function(e){SG.setPauseHandler(e)},setUnpauseHandler:function(e){SG.setUnpauseHandler(e)},buildKey:function(e){return SG.getGameId()+"."+e},getStorageItem:function(e){var t;try{t=localStorage.getItem(SG_Hooks.buildKey(e))}catch(o){return void 0}return void 0!==t&&(t=window.atob(t)),t},setStorageItem:function(e,t){var o=t;void 0!==o&&(o=window.btoa(o));try{return localStorage.setItem(SG_Hooks.buildKey(e),o),t}catch(n){return void 0}}};