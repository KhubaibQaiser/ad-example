"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9228],{33913:function(e,n,t){t.d(n,{Z:function(){return o}});var r=t(19013),i=t(13882);function o(e){return(0,i.Z)(1,arguments),(0,r.Z)(e).getTime()<Date.now()}},31147:function(e,n,t){t.d(n,{q:function(){return o}});var r=t(67294),i=t(73781);function o(e,n,t){let[o,u]=(0,r.useState)(t),a=void 0!==e,c=(0,r.useRef)(a),f=(0,r.useRef)(!1),s=(0,r.useRef)(!1);return!a||c.current||f.current?a||!c.current||s.current||(s.current=!0,c.current=a,console.error("A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen.")):(f.current=!0,c.current=a,console.error("A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen.")),[a?e:o,(0,i.z)(e=>(a||u(e),null==n?void 0:n(e)))]}},18689:function(e,n,t){function r(e,n){return e?e+"["+n+"]":n}function i(e){var n,t;let r=null!=(n=null==e?void 0:e.form)?n:e.closest("form");if(r){for(let n of r.elements)if(n!==e&&("INPUT"===n.tagName&&"submit"===n.type||"BUTTON"===n.tagName&&"submit"===n.type||"INPUT"===n.nodeName&&"image"===n.type)){n.click();return}null==(t=r.requestSubmit)||t.call(r)}}t.d(n,{g:function(){return i},t:function(){return function e(n={},t=null,i=[]){for(let[o,u]of Object.entries(n))!function n(t,i,o){if(Array.isArray(o))for(let[e,u]of o.entries())n(t,r(i,e.toString()),u);else o instanceof Date?t.push([i,o.toISOString()]):"boolean"==typeof o?t.push([i,o?"1":"0"]):"string"==typeof o?t.push([i,o]):"number"==typeof o?t.push([i,`${o}`]):null==o?t.push([i,""]):e(o,i,t)}(i,r(t,o),u);return i}}})},8100:function(e,n,t){t.d(n,{ZP:function(){return z}});var r,i=t(67294);/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function o(e,n,t,r){return new(t||(t=Promise))(function(i,o){function u(e){try{c(r.next(e))}catch(e){o(e)}}function a(e){try{c(r.throw(e))}catch(e){o(e)}}function c(e){var n;e.done?i(e.value):((n=e.value)instanceof t?n:new t(function(e){e(n)})).then(u,a)}c((r=r.apply(e,n||[])).next())})}function u(e,n){var t,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(t)throw TypeError("Generator is already executing.");for(;u;)try{if(t=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=(i=u.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=n.call(e,u)}catch(e){o=[6,e],r=0}finally{t=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}var a=function(){},c=a(),f=Object,s=function(e){return e===c},l=function(e){return"function"==typeof e},d=function(e,n){return f.assign({},e,n)},v="undefined",h=function(){return typeof window!=v},g=new WeakMap,p=0,y=function(e){var n,t,r=typeof e,i=e&&e.constructor,o=i==Date;if(f(e)!==e||o||i==RegExp)n=o?e.toJSON():"symbol"==r?e.toString():"string"==r?JSON.stringify(e):""+e;else{if(n=g.get(e))return n;if(n=++p+"~",g.set(e,n),i==Array){for(t=0,n="@";t<e.length;t++)n+=y(e[t])+",";g.set(e,n)}if(i==f){n="#";for(var u=f.keys(e).sort();!s(t=u.pop());)s(e[t])||(n+=t+":"+y(e[t])+",");g.set(e,n)}}return n},b=!0,m=h(),w=typeof document!=v,R=m&&window.addEventListener?window.addEventListener.bind(window):a,E=w?document.addEventListener.bind(document):a,k=m&&window.removeEventListener?window.removeEventListener.bind(window):a,O=w?document.removeEventListener.bind(document):a,T={initFocus:function(e){return E("visibilitychange",e),R("focus",e),function(){O("visibilitychange",e),k("focus",e)}},initReconnect:function(e){var n=function(){b=!0,e()},t=function(){b=!1};return R("online",n),R("offline",t),function(){k("online",n),k("offline",t)}}},S=!h()||"Deno"in window,V=S?i.useEffect:i.useLayoutEffect,C="undefined"!=typeof navigator&&navigator.connection,I=!S&&C&&(["slow-2g","2g"].includes(C.effectiveType)||C.saveData),D=function(e){if(l(e))try{e=e()}catch(n){e=""}var n=[].concat(e),t=(e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?y(e):"")?"$swr$"+e:"";return[e,n,t]},x=new WeakMap,N=function(e,n,t,r,i,o,u){void 0===u&&(u=!0);var a=x.get(e),c=a[0],f=a[1],s=a[3],l=c[n],d=f[n];if(u&&d)for(var v=0;v<d.length;++v)d[v](t,r,i);return o&&(delete s[n],l&&l[0])?l[0](2).then(function(){return e.get(n)}):e.get(n)},P=0,A=function(){return++P},L=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return o(void 0,void 0,void 0,function(){var n,t,r,i,o,a,f,v,h,g,p,y,b,m,w,R,E,k,O,T;return u(this,function(u){switch(u.label){case 0:if(n=e[0],t=e[1],r=e[2],a=!!s((o="boolean"==typeof(i=e[3])?{revalidate:i}:i||{}).populateCache)||o.populateCache,f=!1!==o.revalidate,v=!1!==o.rollbackOnError,h=o.optimisticData,p=(g=D(t))[0],y=g[2],!p)return[2];if(b=x.get(n)[2],e.length<3)return[2,N(n,p,n.get(p),c,c,f,!0)];if(m=r,R=A(),b[p]=[R,0],E=!s(h),k=n.get(p),E&&(O=l(h)?h(k):h,n.set(p,O),N(n,p,O)),l(m))try{m=m(n.get(p))}catch(e){w=e}if(!(m&&l(m.then)))return[3,2];return[4,m.catch(function(e){w=e})];case 1:if(m=u.sent(),R!==b[p][0]){if(w)throw w;return[2,m]}w&&E&&v&&(a=!0,m=k,n.set(p,k)),u.label=2;case 2:return a&&(w||(l(a)&&(m=a(m,k)),n.set(p,m)),n.set(y,d(n.get(y),{error:w}))),b[p][1]=A(),[4,N(n,p,m,w,c,f,!!a)];case 3:if(T=u.sent(),w)throw w;return[2,a?T:m]}})})},F=function(e,n){for(var t in e)e[t][0]&&e[t][0](n)},M=function(e,n){if(!x.has(e)){var t=d(T,n),r={},i=L.bind(c,e),o=a;if(x.set(e,[r,{},{},{},i]),!S){var u=t.initFocus(setTimeout.bind(c,F.bind(c,r,0))),f=t.initReconnect(setTimeout.bind(c,F.bind(c,r,1)));o=function(){u&&u(),f&&f(),x.delete(e)}}return[e,i,o]}return[e,x.get(e)[4]]},q=M(new Map),W=q[0],Z=d({onLoadingSlow:a,onSuccess:a,onError:a,onErrorRetry:function(e,n,t,r,i){var o=t.errorRetryCount,u=i.retryCount,a=~~((Math.random()+.5)*(1<<(u<8?u:8)))*t.errorRetryInterval;(s(o)||!(u>o))&&setTimeout(r,a,i)},onDiscarded:a,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:I?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:I?5e3:3e3,compare:function(e,n){return y(e)==y(n)},isPaused:function(){return!1},cache:W,mutate:q[1],fallback:{}},{isOnline:function(){return b},isVisible:function(){var e=w&&document.visibilityState;return s(e)||"hidden"!==e}}),_=function(e,n){var t=d(e,n);if(n){var r=e.use,i=e.fallback,o=n.use,u=n.fallback;r&&o&&(t.use=r.concat(o)),i&&u&&(t.fallback=d(i,u))}return t},U=(0,i.createContext)({}),$=function(e,n){var t=(0,i.useState)({})[1],r=(0,i.useRef)(e),o=(0,i.useRef)({data:!1,error:!1,isValidating:!1}),u=(0,i.useCallback)(function(e){var i=!1,u=r.current;for(var a in e)u[a]!==e[a]&&(u[a]=e[a],o.current[a]&&(i=!0));i&&!n.current&&t({})},[]);return V(function(){r.current=e}),[r,o.current,u]},j=function(e,n,t){var r=n[e]||(n[e]=[]);return r.push(t),function(){var e=r.indexOf(t);e>=0&&(r[e]=r[r.length-1],r.pop())}},J={dedupe:!0};f.defineProperty(function(e){var n=e.value,t=_((0,i.useContext)(U),n),r=n&&n.provider,o=(0,i.useState)(function(){return r?M(r(t.cache||W),n):c})[0];return o&&(t.cache=o[0],t.mutate=o[1]),V(function(){return o?o[2]:c},[]),(0,i.createElement)(U.Provider,d(e,{value:t}))},"default",{value:Z});var z=(r=function(e,n,t){var r=t.cache,a=t.compare,f=t.fallbackData,g=t.suspense,p=t.revalidateOnMount,y=t.refreshInterval,b=t.refreshWhenHidden,m=t.refreshWhenOffline,w=x.get(r),R=w[0],E=w[1],k=w[2],O=w[3],T=D(e),C=T[0],I=T[1],P=T[2],F=(0,i.useRef)(!1),M=(0,i.useRef)(!1),q=(0,i.useRef)(C),W=(0,i.useRef)(n),Z=(0,i.useRef)(t),_=function(){return Z.current},U=function(){return _().isVisible()&&_().isOnline()},z=function(e){return r.set(P,d(r.get(P),e))},B=r.get(C),G=s(f)?t.fallback[C]:f,H=s(B)?G:B,K=r.get(P)||{},Q=K.error,X=!F.current,Y=function(){return X&&!s(p)?p:!_().isPaused()&&(g?!s(H)&&t.revalidateIfStale:s(H)||t.revalidateIfStale)},ee=!!C&&!!n&&(!!K.isValidating||X&&Y()),en=$({data:H,error:Q,isValidating:ee},M),et=en[0],er=en[1],ei=en[2],eo=(0,i.useCallback)(function(e){return o(void 0,void 0,void 0,function(){var n,i,o,f,d,v,h,g,p,y,b,m,w;return u(this,function(u){switch(u.label){case 0:if(n=W.current,!C||!n||M.current||_().isPaused())return[2,!1];f=!0,d=e||{},v=!O[C]||!d.dedupe,h=function(){return!M.current&&C===q.current&&F.current},g=function(){var e=O[C];e&&e[1]===o&&delete O[C]},p={isValidating:!1},y=function(){z({isValidating:!1}),h()&&ei(p)},z({isValidating:!0}),ei({isValidating:!0}),u.label=1;case 1:return u.trys.push([1,3,,4]),v&&(N(r,C,et.current.data,et.current.error,!0),t.loadingTimeout&&!r.get(C)&&setTimeout(function(){f&&h()&&_().onLoadingSlow(C,t)},t.loadingTimeout),O[C]=[n.apply(void 0,I),A()]),i=(w=O[C])[0],o=w[1],[4,i];case 2:if(i=u.sent(),v&&setTimeout(g,t.dedupingInterval),!O[C]||O[C][1]!==o)return v&&h()&&_().onDiscarded(C),[2,!1];if(z({error:c}),p.error=c,!s(b=k[C])&&(o<=b[0]||o<=b[1]||0===b[1]))return y(),v&&h()&&_().onDiscarded(C),[2,!1];return a(et.current.data,i)?p.data=et.current.data:p.data=i,a(r.get(C),i)||r.set(C,i),v&&h()&&_().onSuccess(i,C,t),[3,4];case 3:return m=u.sent(),g(),!_().isPaused()&&(z({error:m}),p.error=m,v&&h()&&(_().onError(m,C,t),("boolean"==typeof t.shouldRetryOnError&&t.shouldRetryOnError||l(t.shouldRetryOnError)&&t.shouldRetryOnError(m))&&U()&&_().onErrorRetry(m,C,t,eo,{retryCount:(d.retryCount||0)+1,dedupe:!0}))),[3,4];case 4:return f=!1,y(),h()&&v&&N(r,C,p.data,p.error,!1),[2,!0]}})})},[C]),eu=(0,i.useCallback)(L.bind(c,r,function(){return q.current}),[]);if(V(function(){W.current=n,Z.current=t}),V(function(){if(C){var e=C!==q.current,n=eo.bind(c,J),t=0,r=j(C,E,function(e,n,t){ei(d({error:n,isValidating:t},a(et.current.data,e)?c:{data:e}))}),i=j(C,R,function(e){if(0==e){var r=Date.now();_().revalidateOnFocus&&r>t&&U()&&(t=r+_().focusThrottleInterval,n())}else if(1==e)_().revalidateOnReconnect&&U()&&n();else if(2==e)return eo()});return M.current=!1,q.current=C,F.current=!0,e&&ei({data:H,error:Q,isValidating:ee}),Y()&&(s(H)||S?n():h()&&typeof window.requestAnimationFrame!=v?window.requestAnimationFrame(n):setTimeout(n,1)),function(){M.current=!0,r(),i()}}},[C,eo]),V(function(){var e;function n(){var n=l(y)?y(H):y;n&&-1!==e&&(e=setTimeout(t,n))}function t(){!et.current.error&&(b||_().isVisible())&&(m||_().isOnline())?eo(J).then(n):n()}return n(),function(){e&&(clearTimeout(e),e=-1)}},[y,b,m,eo]),(0,i.useDebugValue)(H),g&&s(H)&&C)throw W.current=n,Z.current=t,M.current=!1,s(Q)?eo(J):Q;return{mutate:eu,get data(){return er.data=!0,H},get error(){return er.error=!0,Q},get isValidating(){return er.isValidating=!0,ee}}},function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=d(Z,(0,i.useContext)(U)),o=l(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}],u=o[0],a=o[1],c=_(t,o[2]),f=r,s=c.use;if(s)for(var v=s.length;v-- >0;)f=s[v](f);return f(u,a||c.fetcher,c)})}}]);