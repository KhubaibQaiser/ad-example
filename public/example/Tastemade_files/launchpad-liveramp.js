var launchPad=document.createElement("script"),launchPadConfiguration=(launchPad.async=!0,launchPad.defer=!0,!function(){var o,c,t,a;"function"!=typeof window.__launchpad&&(o=[],c=window,t=c.document,a=c.__launchpad?c.__launchpad.start:function(){},!c.__launchpad)&&function a(){var e,n=!!c.frames.__launchpadLocator;return n||(t.body?((e=t.createElement("iframe")).style.cssText="display:none",e.name="__launchpadLocator",t.body.appendChild(e)):setTimeout(a,5)),!n}()&&(c.__launchpad=function(a,e,n,t){if(!(a=[a,e,n,t]).length)return o;"ping"===a[0]?"function"==typeof a[2]&&a[2]({loaded:!1,apiVersion:"1.0"},!0):o.push(a)},c.__launchpad.commandQueue=o,c.__launchpad.start=a,c.addEventListener("message",function(n){var t="string"==typeof n.data,a={};try{a=t?JSON.parse(n.data):n.data}catch(a){}var o=a.__launchpadCall;o&&c.__launchpad(o.command,o.version,function(a,e){n.source&&(a={__launchpadReturn:{returnValue:a,success:e,callId:o.callId,command:o.command}},t&&(a=JSON.stringify(a)),n.source.postMessage(a,"*"))},o.parameter)},!1))}(),{logging:!1,atsRules:[{id:"6a7e2fd5-bd5d-44ec-9d92-4173c322d548",triggers:[{type:"LOAD_EVENT",loadEvent:"DOM_READY"},{type:"PAGE_VIEW",rules:[{operation:"CONTAINS",value:"tastemade.com",attribute:"PAGE_URL"}]},{type:"GEO_TARGETING",geoTargeting:{includeSelection:!0,countries:["US"],allStates:!0}}],type:"ATS"}],configVersion:4,preload:!0,libraryVersion:"latest"}),nodeScript=(/MSIE/.test(navigator.userAgent)&&console.log("Your browser doesn't support LiveRamp's LaunchPad. Please update to a more recent one."),launchPad.src="https://launchpad.privacymanager.io/latest/launchpad.bundle.js",launchPad.onload=function(){window.__launchpad.start(launchPadConfiguration)},launchPad.onerror=function(a){console.log("Script not loaded due to: ",a)},document.getElementsByTagName("script")[0]);nodeScript.parentNode.insertBefore(launchPad,nodeScript);