"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5587],{60887:function(e,t,n){n.d(t,{LB:function(){return eN},g4:function(){return b},Lg:function(){return ex},we:function(){return eM},LO:function(){return eT},pE:function(){return J},ey:function(){return q},VK:function(){return $},_8:function(){return z},hI:function(){return G},Cj:function(){return eF},O1:function(){return eP},Zj:function(){return eU},VT:function(){return ef},Dy:function(){return eg}});var r,l,i,u,o,a,s,c,d,h,f,g,p,v,m,b,w,y=n(67294),x=n(73935),D=n(24285);let E={display:"none"};function C(e){let{id:t,value:n}=e;return y.createElement("div",{id:t,style:E},n)}function R(e){let{id:t,announcement:n,ariaLiveType:r="assertive"}=e;return y.createElement("div",{id:t,style:{position:"fixed",width:1,height:1,margin:-1,border:0,padding:0,overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(100%)",whiteSpace:"nowrap"},role:"status","aria-live":r,"aria-atomic":!0},n)}let M={draggable:`
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `},S={onDragStart:e=>`Picked up draggable item ${e}.`,onDragOver:(e,t)=>t?`Draggable item ${e} was moved over droppable area ${t}.`:`Draggable item ${e} is no longer over a droppable area.`,onDragEnd:(e,t)=>t?`Draggable item ${e} was dropped over droppable area ${t}`:`Draggable item ${e} was dropped.`,onDragCancel:e=>`Dragging was cancelled. Draggable item ${e} was dropped.`};function L(...e){}(r=d||(d={})).DragStart="dragStart",r.DragMove="dragMove",r.DragEnd="dragEnd",r.DragCancel="dragCancel",r.DragOver="dragOver",r.RegisterDroppable="registerDroppable",r.SetDroppableDisabled="setDroppableDisabled",r.UnregisterDroppable="unregisterDroppable";class k extends Map{get(e){var t;return null!=e&&null!=(t=super.get(e))?t:void 0}toArray(){return Array.from(this.values())}getEnabled(){return this.toArray().filter(({disabled:e})=>!e)}getNodeFor(e){var t,n;return null!=(t=null==(n=this.get(e))?void 0:n.node.current)?t:void 0}}let T={activatorEvent:null,active:null,activeNode:null,activeNodeRect:null,collisions:null,containerNodeRect:null,draggableNodes:{},droppableRects:new Map,droppableContainers:new k,over:null,dragOverlay:{nodeRef:{current:null},rect:null,setRef:L},scrollableAncestors:[],scrollableAncestorRects:[],measureDroppableContainers:L,windowRect:null,measuringScheduled:!1},I=(0,y.createContext)({activatorEvent:null,activators:[],active:null,activeNodeRect:null,ariaDescribedById:{draggable:""},dispatch:L,draggableNodes:{},over:null,measureDroppableContainers:L}),O=(0,y.createContext)(T);function j(){return{draggable:{active:null,initialCoordinates:{x:0,y:0},nodes:{},translate:{x:0,y:0}},droppable:{containers:new k}}}function N(e,t){switch(t.type){case d.DragStart:return{...e,draggable:{...e.draggable,initialCoordinates:t.initialCoordinates,active:t.active}};case d.DragMove:if(!e.draggable.active)return e;return{...e,draggable:{...e.draggable,translate:{x:t.coordinates.x-e.draggable.initialCoordinates.x,y:t.coordinates.y-e.draggable.initialCoordinates.y}}};case d.DragEnd:case d.DragCancel:return{...e,draggable:{...e.draggable,active:null,initialCoordinates:{x:0,y:0},translate:{x:0,y:0}}};case d.RegisterDroppable:{let{element:n}=t,{id:r}=n,l=new k(e.droppable.containers);return l.set(r,n),{...e,droppable:{...e.droppable,containers:l}}}case d.SetDroppableDisabled:{let{id:n,key:r,disabled:l}=t,i=e.droppable.containers.get(n);if(!i||r!==i.key)return e;let u=new k(e.droppable.containers);return u.set(n,{...i,disabled:l}),{...e,droppable:{...e.droppable,containers:u}}}case d.UnregisterDroppable:{let{id:n,key:r}=t,l=e.droppable.containers.get(n);if(!l||r!==l.key)return e;let i=new k(e.droppable.containers);return i.delete(n),{...e,droppable:{...e.droppable,containers:i}}}default:return e}}let A=(0,y.createContext)({type:null,event:null});function B({announcements:e=S,hiddenTextDescribedById:t,screenReaderInstructions:n}){let{announce:r,announcement:l}=function(){let[e,t]=(0,y.useState)(""),n=(0,y.useCallback)(e=>{null!=e&&t(e)},[]);return{announce:n,announcement:e}}(),i=(0,D.Ld)("DndLiveRegion"),[u,o]=(0,y.useState)(!1);return(0,y.useEffect)(()=>{o(!0)},[]),!function({onDragStart:e,onDragMove:t,onDragOver:n,onDragEnd:r,onDragCancel:l}){let i=(0,y.useContext)(A),u=(0,y.useRef)(i);(0,y.useEffect)(()=>{if(i!==u.current){let{type:o,event:a}=i;switch(o){case d.DragStart:null==e||e(a);break;case d.DragMove:null==t||t(a);break;case d.DragOver:null==n||n(a);break;case d.DragCancel:null==l||l(a);break;case d.DragEnd:null==r||r(a)}u.current=i}},[i,e,t,n,r,l])}((0,y.useMemo)(()=>({onDragStart({active:t}){r(e.onDragStart(t.id))},onDragMove({active:t,over:n}){e.onDragMove&&r(e.onDragMove(t.id,null==n?void 0:n.id))},onDragOver({active:t,over:n}){r(e.onDragOver(t.id,null==n?void 0:n.id))},onDragEnd({active:t,over:n}){r(e.onDragEnd(t.id,null==n?void 0:n.id))},onDragCancel({active:t}){r(e.onDragCancel(t.id))}}),[r,e])),u?(0,x.createPortal)(y.createElement(y.Fragment,null,y.createElement(C,{id:t,value:n.draggable}),y.createElement(R,{id:i,announcement:l})),document.body):null}let P=Object.freeze({x:0,y:0});function F(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function K({data:{value:e}},{data:{value:t}}){return e-t}function U({data:{value:e}},{data:{value:t}}){return t-e}function X({left:e,top:t,height:n,width:r}){return[{x:e,y:t},{x:e+r,y:t},{x:e,y:t+n},{x:e+r,y:t+n}]}function z(e,t){if(!e||0===e.length)return null;let[n]=e;return t?n[t]:n}function Y(e,t=e.left,n=e.top){return{x:t+.5*e.width,y:n+.5*e.height}}let J=({collisionRect:e,droppableContainers:t})=>{let n=Y(e,e.left,e.top),r=[];for(let e of t){let{id:t,rect:{current:l}}=e;if(l){let i=F(Y(l),n);r.push({id:t,data:{droppableContainer:e,value:i}})}}return r.sort(K)},q=({collisionRect:e,droppableContainers:t})=>{let n=X(e),r=[];for(let e of t){let{id:t,rect:{current:l}}=e;if(l){let i=X(l),u=n.reduce((e,t,n)=>e+F(i[n],t),0),o=Number((u/4).toFixed(4));r.push({id:t,data:{droppableContainer:e,value:o}})}}return r.sort(K)},H=({collisionRect:e,droppableContainers:t})=>{let n=[];for(let r of t){let{id:t,rect:{current:l}}=r;if(l){let i=function(e,t){let n=Math.max(t.top,e.top),r=Math.max(t.left,e.left),l=Math.min(t.left+t.width,e.left+e.width),i=Math.min(t.top+t.height,e.top+e.height);if(r<l&&n<i){let u=t.width*t.height,o=e.width*e.height,a=(l-r)*(i-n);return Number((a/(u+o-a)).toFixed(4))}return 0}(l,e);i>0&&n.push({id:t,data:{droppableContainer:r,value:i}})}}return n.sort(U)},W={ignoreTransform:!1};function $(e,t=W){let n=e.getBoundingClientRect();if(t.ignoreTransform){let{getComputedStyle:t}=(0,D.Jj)(e),{transform:r,transformOrigin:l}=t(e);r&&(n=function(e,t,n){let r,l,i,u,o;if(t.startsWith("matrix3d("))l=+(r=t.slice(9,-1).split(/, /))[0],i=+r[5],u=+r[12],o=+r[13];else{if(!t.startsWith("matrix("))return e;l=+(r=t.slice(7,-1).split(/, /))[0],i=+r[3],u=+r[4],o=+r[5]}let a=e.left-u-(1-l)*parseFloat(n),s=e.top-o-(1-i)*parseFloat(n.slice(n.indexOf(" ")+1)),c=l?e.width/l:e.width,d=i?e.height/i:e.height;return{width:c,height:d,top:s,right:a+c,bottom:s+d,left:a}}(n,r,l))}let{top:r,left:l,width:i,height:u,bottom:o,right:a}=n;return{top:r,left:l,width:i,height:u,bottom:o,right:a}}function _(e){return $(e,{ignoreTransform:!0})}function G(e){let t=[];return e?function n(r){if(!r)return t;if((0,D.qk)(r)&&null!=r.scrollingElement&&!t.includes(r.scrollingElement))return t.push(r.scrollingElement),t;if(!(0,D.Re)(r)||(0,D.vZ)(r)||t.includes(r))return t;let{getComputedStyle:l}=(0,D.Jj)(r),i=l(r);return(r!==e&&function(e,t=(0,D.Jj)(e).getComputedStyle(e)){let n=/(auto|scroll|overlay)/;return null!=["overflow","overflowX","overflowY"].find(e=>{let r=t[e];return"string"==typeof r&&n.test(r)})}(r,i)&&t.push(r),function(e,t=(0,D.Jj)(e).getComputedStyle(e)){return"fixed"===t.position}(r,i))?t:n(r.parentNode)}(e):t}function V(e){return D.Nq&&e?(0,D.FJ)(e)?e:(0,D.UG)(e)?(0,D.qk)(e)||e===(0,D.r3)(e).scrollingElement?window:(0,D.Re)(e)?e:null:null:null}function Z(e){return(0,D.FJ)(e)?e.scrollX:e.scrollLeft}function Q(e){return(0,D.FJ)(e)?e.scrollY:e.scrollTop}function ee(e){return{x:Z(e),y:Q(e)}}function et(e){let t={x:0,y:0},n={x:e.scrollWidth-e.clientWidth,y:e.scrollHeight-e.clientHeight},r=e.scrollTop<=t.y,l=e.scrollLeft<=t.x,i=e.scrollTop>=n.y,u=e.scrollLeft>=n.x;return{isTop:r,isLeft:l,isBottom:i,isRight:u,maxScroll:n,minScroll:t}}(l=h||(h={}))[l.Forward=1]="Forward",l[l.Backward=-1]="Backward";let en={x:.2,y:.2};function er(e){return e.reduce((e,t)=>(0,D.IH)(e,ee(t)),P)}let el=[["x",["left","right"],function(e){return e.reduce((e,t)=>e+Z(t),0)}],["y",["top","bottom"],function(e){return e.reduce((e,t)=>e+Q(t),0)}]];class ei{constructor(e,t){this.rect=void 0,this.width=void 0,this.height=void 0,this.top=void 0,this.bottom=void 0,this.right=void 0,this.left=void 0;let n=G(t),r=er(n);for(let[t,l,i]of(this.rect={...e},this.width=e.width,this.height=e.height,el))for(let e of l)Object.defineProperty(this,e,{get:()=>{let l=i(n),u=r[t]-l;return this.rect[e]+u},enumerable:!0});Object.defineProperty(this,"rect",{enumerable:!1})}}(i=f||(f={}))[i.Pointer=0]="Pointer",i[i.DraggableRect=1]="DraggableRect",(u=g||(g={}))[u.TreeOrder=0]="TreeOrder",u[u.ReversedTreeOrder=1]="ReversedTreeOrder",(o=p||(p={}))[o.Always=0]="Always",o[o.BeforeDragging=1]="BeforeDragging",o[o.WhileDragging=2]="WhileDragging",(v||(v={})).Optimized="optimized";let eu=new Map,eo={measure:_,strategy:p.WhileDragging,frequency:v.Optimized};function ea({onResize:e,disabled:t}){let n=(0,y.useMemo)(()=>{if(t||"undefined"==typeof window||void 0===window.ResizeObserver)return;let{ResizeObserver}=window;return new ResizeObserver(e)},[t,e]);return(0,y.useEffect)(()=>()=>null==n?void 0:n.disconnect(),[n]),n}let es=[],ec=(e,t)=>eh(e,_,t),ed=function(e){let t=[];return function(n,r){let l=(0,y.useRef)(n);return(0,D.Gj)(i=>n.length?r||!i&&n.length||n!==l.current?n.map(t=>new ei(e(t),t)):null!=i?i:t:t,[n,r])}}(_);function eh(e,t,n){let r=(0,y.useRef)(e);return(0,D.Gj)(l=>e?n||!l&&e||e!==r.current?(0,D.Re)(e)&&null==e.parentNode?null:new ei(t(e),e):null!=l?l:null:null,[e,n,t])}function ef(e,t){return(0,y.useMemo)(()=>({sensor:e,options:null!=t?t:{}}),[e,t])}function eg(...e){return(0,y.useMemo)(()=>[...e].filter(e=>null!=e),[...e])}class ep{constructor(e){this.target=void 0,this.listeners=[],this.removeAll=()=>{this.listeners.forEach(e=>{var t;return null==(t=this.target)?void 0:t.removeEventListener(...e)})},this.target=e}add(e,t,n){var r;null==(r=this.target)||r.addEventListener(e,t,n),this.listeners.push([e,t,n])}}function ev(e,t){let n=Math.abs(e.x),r=Math.abs(e.y);return"number"==typeof t?Math.sqrt(n**2+r**2)>t:"x"in t&&"y"in t?n>t.x&&r>t.y:"x"in t?n>t.x:"y"in t&&r>t.y}function em(e){e.preventDefault()}function eb(e){e.stopPropagation()}(a=m||(m={})).Click="click",a.DragStart="dragstart",a.Keydown="keydown",a.ContextMenu="contextmenu",a.Resize="resize",a.SelectionChange="selectionchange",a.VisibilityChange="visibilitychange",(s=b||(b={})).Space="Space",s.Down="ArrowDown",s.Right="ArrowRight",s.Left="ArrowLeft",s.Up="ArrowUp",s.Esc="Escape",s.Enter="Enter";let ew={start:[b.Space,b.Enter],cancel:[b.Esc],end:[b.Space,b.Enter]},ey=(e,{currentCoordinates:t})=>{switch(e.code){case b.Right:return{...t,x:t.x+25};case b.Left:return{...t,x:t.x-25};case b.Down:return{...t,y:t.y+25};case b.Up:return{...t,y:t.y-25}}};class ex{constructor(e){this.props=void 0,this.autoScrollEnabled=!1,this.coordinates=P,this.listeners=void 0,this.windowListeners=void 0,this.props=e;let{event:{target:t}}=e;this.props=e,this.listeners=new ep((0,D.r3)(t)),this.windowListeners=new ep((0,D.Jj)(t)),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleCancel=this.handleCancel.bind(this),this.attach()}attach(){this.handleStart(),this.windowListeners.add(m.Resize,this.handleCancel),this.windowListeners.add(m.VisibilityChange,this.handleCancel),setTimeout(()=>this.listeners.add(m.Keydown,this.handleKeyDown))}handleStart(){let{activeNode:e,onStart:t}=this.props;if(!e.node.current)throw Error("Active draggable node is undefined");let n=_(e.node.current),r={x:n.left,y:n.top};this.coordinates=r,t(r)}handleKeyDown(e){if((0,D.vd)(e)){let{coordinates:t}=this,{active:n,context:r,options:l}=this.props,{keyboardCodes:i=ew,coordinateGetter:u=ey,scrollBehavior:o="smooth"}=l,{code:a}=e;if(i.end.includes(a)){this.handleEnd(e);return}if(i.cancel.includes(a)){this.handleCancel(e);return}let s=u(e,{active:n,context:r.current,currentCoordinates:t});if(s){let n={x:0,y:0},{scrollableAncestors:l}=r.current;for(let r of l){let l=e.code,i=(0,D.$X)(s,t),{isTop:u,isRight:a,isLeft:c,isBottom:d,maxScroll:h,minScroll:f}=et(r),g=function(e){if(e===document.scrollingElement){let{innerWidth:e,innerHeight:t}=window;return{top:0,left:0,right:e,bottom:t,width:e,height:t}}let{top:t,left:n,right:r,bottom:l}=e.getBoundingClientRect();return{top:t,left:n,right:r,bottom:l,width:e.clientWidth,height:e.clientHeight}}(r),p={x:Math.min(l===b.Right?g.right-g.width/2:g.right,Math.max(l===b.Right?g.left:g.left+g.width/2,s.x)),y:Math.min(l===b.Down?g.bottom-g.height/2:g.bottom,Math.max(l===b.Down?g.top:g.top+g.height/2,s.y))},v=l===b.Right&&!a||l===b.Left&&!c,m=l===b.Down&&!d||l===b.Up&&!u;if(v&&p.x!==s.x){let e=l===b.Right&&r.scrollLeft+i.x<=h.x||l===b.Left&&r.scrollLeft+i.x>=f.x;if(e){r.scrollBy({left:i.x,behavior:o});return}n.x=l===b.Right?r.scrollLeft-h.x:r.scrollLeft-f.x,r.scrollBy({left:-n.x,behavior:o});break}if(m&&p.y!==s.y){let e=l===b.Down&&r.scrollTop+i.y<=h.y||l===b.Up&&r.scrollTop+i.y>=f.y;if(e){r.scrollBy({top:i.y,behavior:o});return}n.y=l===b.Down?r.scrollTop-h.y:r.scrollTop-f.y,r.scrollBy({top:-n.y,behavior:o});break}}this.handleMove(e,(0,D.IH)(s,n))}}}handleMove(e,t){let{onMove:n}=this.props;e.preventDefault(),n(t),this.coordinates=t}handleEnd(e){let{onEnd:t}=this.props;e.preventDefault(),this.detach(),t()}handleCancel(e){let{onCancel:t}=this.props;e.preventDefault(),this.detach(),t()}detach(){this.listeners.removeAll(),this.windowListeners.removeAll()}}function eD(e){return!!(e&&"distance"in e)}function eE(e){return!!(e&&"delay"in e)}ex.activators=[{eventName:"onKeyDown",handler:(e,{keyboardCodes:t=ew,onActivation:n})=>{let{code:r}=e.nativeEvent;return!!t.start.includes(r)&&(e.preventDefault(),null==n||n({event:e.nativeEvent}),!0)}}];class eC{constructor(e,t,n=function(e){let{EventTarget}=(0,D.Jj)(e);return e instanceof EventTarget?e:(0,D.r3)(e)}(e.event.target)){var r;this.props=void 0,this.events=void 0,this.autoScrollEnabled=!0,this.document=void 0,this.activated=!1,this.initialCoordinates=void 0,this.timeoutId=null,this.listeners=void 0,this.documentListeners=void 0,this.windowListeners=void 0,this.props=e,this.events=t;let{event:l}=e,{target:i}=l;this.props=e,this.events=t,this.document=(0,D.r3)(i),this.documentListeners=new ep(this.document),this.listeners=new ep(n),this.windowListeners=new ep((0,D.Jj)(i)),this.initialCoordinates=null!=(r=(0,D.DC)(l))?r:P,this.handleStart=this.handleStart.bind(this),this.handleMove=this.handleMove.bind(this),this.handleEnd=this.handleEnd.bind(this),this.handleCancel=this.handleCancel.bind(this),this.handleKeydown=this.handleKeydown.bind(this),this.removeTextSelection=this.removeTextSelection.bind(this),this.attach()}attach(){let{events:e,props:{options:{activationConstraint:t}}}=this;if(this.listeners.add(e.move.name,this.handleMove,{passive:!1}),this.listeners.add(e.end.name,this.handleEnd),this.windowListeners.add(m.Resize,this.handleCancel),this.windowListeners.add(m.DragStart,em),this.windowListeners.add(m.VisibilityChange,this.handleCancel),this.windowListeners.add(m.ContextMenu,em),this.documentListeners.add(m.Keydown,this.handleKeydown),t){if(eD(t))return;if(eE(t)){this.timeoutId=setTimeout(this.handleStart,t.delay);return}}this.handleStart()}detach(){this.listeners.removeAll(),this.windowListeners.removeAll(),setTimeout(this.documentListeners.removeAll,50),null!==this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null)}handleStart(){let{initialCoordinates:e}=this,{onStart:t}=this.props;e&&(this.activated=!0,this.documentListeners.add(m.Click,eb,{capture:!0}),this.removeTextSelection(),this.documentListeners.add(m.SelectionChange,this.removeTextSelection),t(e))}handleMove(e){var t;let{activated:n,initialCoordinates:r,props:l}=this,{onMove:i,options:{activationConstraint:u}}=l;if(!r)return;let o=null!=(t=(0,D.DC)(e))?t:P,a=(0,D.$X)(r,o);if(!n&&u){if(eE(u))return ev(a,u.tolerance)?this.handleCancel():void 0;if(eD(u))return null!=u.tolerance&&ev(a,u.tolerance)?this.handleCancel():ev(a,u.distance)?this.handleStart():void 0}e.cancelable&&e.preventDefault(),i(o)}handleEnd(){let{onEnd:e}=this.props;this.detach(),e()}handleCancel(){let{onCancel:e}=this.props;this.detach(),e()}handleKeydown(e){e.code===b.Esc&&this.handleCancel()}removeTextSelection(){var e;null==(e=this.document.getSelection())||e.removeAllRanges()}}let eR={move:{name:"pointermove"},end:{name:"pointerup"}};class eM extends eC{constructor(e){let{event:t}=e,n=(0,D.r3)(t.target);super(e,eR,n)}}eM.activators=[{eventName:"onPointerDown",handler:({nativeEvent:e},{onActivation:t})=>!!e.isPrimary&&0===e.button&&(null==t||t({event:e}),!0)}];let eS={move:{name:"mousemove"},end:{name:"mouseup"}};(c=w||(w={}))[c.RightClick=2]="RightClick";class eL extends eC{constructor(e){super(e,eS,(0,D.r3)(e.event.target))}}eL.activators=[{eventName:"onMouseDown",handler:({nativeEvent:e},{onActivation:t})=>e.button!==w.RightClick&&(null==t||t({event:e}),!0)}];let ek={move:{name:"touchmove"},end:{name:"touchend"}};class eT extends eC{constructor(e){super(e,ek)}static setup(){return window.addEventListener(ek.move.name,e,{capture:!1,passive:!1}),function(){window.removeEventListener(ek.move.name,e)};function e(){}}}eT.activators=[{eventName:"onTouchStart",handler:({nativeEvent:e},{onActivation:t})=>{let{touches:n}=e;return!(n.length>1)&&(null==t||t({event:e}),!0)}}];let eI=[{sensor:eM,options:{}},{sensor:ex,options:{}}],eO={current:{}},ej=(0,y.createContext)({...P,scaleX:1,scaleY:1}),eN=(0,y.memo)(function({id:e,autoScroll:t=!0,announcements:n,children:r,sensors:l=eI,collisionDetection:i=H,measuring:u,modifiers:o,screenReaderInstructions:a=M,...s}){var c,v,m,b,w,E,C,R,S;let L=(0,y.useReducer)(N,void 0,j),[k,T]=L,[F,K]=(0,y.useState)(()=>({type:null,event:null})),[U,X]=(0,y.useState)(!1),{draggable:{active:Y,nodes:J,translate:q},droppable:{containers:W}}=k,Z=Y?J[Y]:null,Q=(0,y.useRef)({initial:null,translated:null}),el=(0,y.useMemo)(()=>{var e;return null!=Y?{id:Y,data:null!=(e=null==Z?void 0:Z.data)?e:eO,rect:Q}:null},[Y,Z]),ef=(0,y.useRef)(null),[eg,ep]=(0,y.useState)(null),[ev,em]=(0,y.useState)(null),eb=(0,D.Ey)(s,Object.values(s)),ew=(0,D.Ld)("DndDescribedBy",e),ey=(0,y.useMemo)(()=>W.getEnabled(),[W]),{droppableRects:ex,measureDroppableContainers:eD,measuringScheduled:eE}=function(e,{dragging:t,dependencies:n,config:r}){let[l,i]=(0,y.useState)(null),u=null!=l,{frequency:o,measure:a,strategy:s}={...eo,...r},c=(0,y.useRef)(e),d=(0,y.useCallback)((e=[])=>i(t=>t?t.concat(e):e),[]),h=(0,y.useRef)(null),f=function(){switch(s){case p.Always:return!1;case p.BeforeDragging:return t;default:return!t}}(),g=(0,D.Gj)(n=>{if(f&&!t)return eu;if(!n||n===eu||c.current!==e||null!=l){let t=new Map;for(let n of e){if(!n)continue;if(l&&l.length>0&&!l.includes(n.id)&&n.rect.current){t.set(n.id,n.rect.current);continue}let e=n.node.current,r=e?new ei(a(e),e):null;n.rect.current=r,r&&t.set(n.id,r)}return t}return n},[e,l,t,f,a]);return(0,y.useEffect)(()=>{c.current=e},[e]),(0,y.useEffect)(()=>{f||requestAnimationFrame(()=>d())},[t,f]),(0,y.useEffect)(()=>{u&&i(null)},[u]),(0,y.useEffect)(()=>{f||"number"!=typeof o||null!==h.current||(h.current=setTimeout(()=>{d(),h.current=null},o))},[o,f,d,...n]),{droppableRects:g,measureDroppableContainers:d,measuringScheduled:u}}(ey,{dragging:U,dependencies:[q.x,q.y],config:null==u?void 0:u.droppable}),eC=function(e,t){let n=null!==t?e[t]:void 0,r=n?n.node.current:null;return(0,D.Gj)(e=>{var n;return null===t?null:null!=(n=null!=r?r:e)?n:null},[r,t])}(J,Y),eR=ev?(0,D.DC)(ev):null,eM=eh(eC,null!=(c=null==u?void 0:null==(v=u.draggable)?void 0:v.measure)?c:_),eS=ec(eC?eC.parentElement:null),eL=(0,y.useRef)({active:null,activeNode:eC,collisionRect:null,collisions:null,droppableRects:ex,draggableNodes:J,draggingNode:null,draggingNodeRect:null,droppableContainers:W,over:null,scrollableAncestors:[],scrollAdjustedTranslate:null}),ek=W.getNodeFor(null==(m=eL.current.over)?void 0:m.id),eT=function({measure:e=$}){let[t,n]=(0,y.useState)(null),r=(0,y.useCallback)(t=>{for(let{target:r}of t)if((0,D.Re)(r)){n(t=>{let n=e(r);return t?{...t,width:n.width,height:n.height}:n});break}},[e]),l=ea({onResize:r}),i=(0,y.useCallback)(t=>{let r=function(e){if(!e)return null;if(e.children.length>1)return e;let t=e.children[0];return(0,D.Re)(t)?t:e}(t);null==l||l.disconnect(),r&&(null==l||l.observe(r)),n(r?e(r):null)},[e,l]),[u,o]=(0,D.wm)(i);return(0,y.useMemo)(()=>({nodeRef:u,rect:t,setRef:o}),[t,u,o])}({measure:null==u?void 0:null==(b=u.dragOverlay)?void 0:b.measure}),eN=null!=(w=eT.nodeRef.current)?w:eC,eA=null!=(E=eT.rect)?E:eM,eB=(0,y.useRef)(null),eP=eB.current,eF=eA===eM&&eM&&eP?{x:eM.left-eP.left,y:eM.top-eP.top}:P,eK=(R=eN?eN.ownerDocument.defaultView:null,(0,y.useMemo)(()=>R?function(e){let t=e.innerWidth,n=e.innerHeight;return{top:0,left:0,right:t,bottom:n,width:t,height:n}}(R):null,[R])),eU=function(e){let t=(0,y.useRef)(e),n=(0,D.Gj)(n=>e?n&&e&&t.current&&e.parentNode===t.current.parentNode?n:G(e):es,[e]);return(0,y.useEffect)(()=>{t.current=e},[e]),n}(Y?null!=ek?ek:eN:null),eX=ed(eU),ez=function(e,{transform:t,...n}){return(null==e?void 0:e.length)?e.reduce((e,t)=>t({transform:e,...n}),t):t}(o,{transform:{x:q.x-eF.x,y:q.y-eF.y,scaleX:1,scaleY:1},activatorEvent:ev,active:el,activeNodeRect:eM,containerNodeRect:eS,draggingNodeRect:eA,over:eL.current.over,overlayNodeRect:eT.rect,scrollableAncestors:eU,scrollableAncestorRects:eX,windowRect:eK}),eY=eR?(0,D.IH)(eR,q):null,eJ=function(e){let[t,n]=(0,y.useState)(null),r=(0,y.useRef)(e),l=(0,y.useCallback)(e=>{let t=V(e.target);t&&n(e=>e?(e.set(t,ee(t)),new Map(e)):null)},[]);return(0,y.useEffect)(()=>{let t=r.current;if(e!==t){i(t);let u=e.map(e=>{let t=V(e);return t?(t.addEventListener("scroll",l,{passive:!0}),[t,ee(t)]):null}).filter(e=>null!=e);n(u.length?new Map(u):null),r.current=e}return()=>{i(e),i(t)};function i(e){e.forEach(e=>{let t=V(e);null==t||t.removeEventListener("scroll",l)})}},[l,e]),(0,y.useMemo)(()=>e.length?t?Array.from(t.values()).reduce((e,t)=>(0,D.IH)(e,t),P):er(e):P,[e,t])}(eU),eq=(0,D.IH)(ez,eJ),eH=eA?function(e,...t){return t.reduce((e,t)=>({...e,top:e.top+1*t.y,bottom:e.bottom+1*t.y,left:e.left+1*t.x,right:e.right+1*t.x}),{...e})}(eA,ez):null,eW=el&&eH?i({active:el,collisionRect:eH,droppableContainers:ey,pointerCoordinates:eY}):null,e$=z(eW,"id"),[e_,eG]=(0,y.useState)(null),eV=(S=null!=(C=null==e_?void 0:e_.rect)?C:null,{...ez,scaleX:S&&eM?S.width/eM.width:1,scaleY:S&&eM?S.height/eM.height:1}),eZ=(0,y.useCallback)((e,{sensor:t,options:n})=>{if(!ef.current)return;let r=J[ef.current];if(!r)return;let l=new t({active:ef.current,activeNode:r,event:e.nativeEvent,options:n,context:eL,onStart(e){let t=ef.current;if(!t)return;let n=J[t];if(!n)return;let{onDragStart:r}=eb.current,l={active:{id:t,data:n.data,rect:Q}};(0,x.unstable_batchedUpdates)(()=>{T({type:d.DragStart,initialCoordinates:e,active:t}),K({type:d.DragStart,event:l})}),null==r||r(l)},onMove(e){T({type:d.DragMove,coordinates:e})},onEnd:i(d.DragEnd),onCancel:i(d.DragCancel)});function i(e){return async function(){let{active:t,collisions:n,over:r,scrollAdjustedTranslate:l}=eL.current,i=null;if(t&&l){let{cancelDrop:u}=eb.current;if(i={active:t,collisions:n,delta:l,over:r},e===d.DragEnd&&"function"==typeof u){let t=await Promise.resolve(u(i));t&&(e=d.DragCancel)}}ef.current=null,(0,x.unstable_batchedUpdates)(()=>{if(T({type:e}),eG(null),X(!1),ep(null),em(null),i&&K({type:e,event:i}),i){let{onDragCancel:t,onDragEnd:n}=eb.current,r=e===d.DragEnd?n:t;null==r||r(i)}})}}(0,x.unstable_batchedUpdates)(()=>{ep(l),em(e.nativeEvent)})},[J]),eQ=(0,y.useCallback)((e,t)=>(n,r)=>{let l=n.nativeEvent;null!==ef.current||l.dndKit||l.defaultPrevented||!0!==e(n,t.options)||(l.dndKit={capturedBy:t.sensor},ef.current=r,eZ(n,t))},[eZ]),e0=(0,y.useMemo)(()=>l.reduce((e,t)=>{let{sensor:n}=t,r=n.activators.map(e=>({eventName:e.eventName,handler:eQ(e.handler,t)}));return[...e,...r]},[]),[l,eQ]);(0,y.useEffect)(()=>{if(!D.Nq)return;let e=l.map(({sensor:e})=>null==e.setup?void 0:e.setup());return()=>{for(let t of e)null==t||t()}},l.map(({sensor:e})=>e)),(0,y.useEffect)(()=>{null!=Y&&X(!0)},[Y]),(0,y.useEffect)(()=>{el||(eB.current=null),el&&eM&&!eB.current&&(eB.current=eM)},[eM,el]),(0,y.useEffect)(()=>{let{onDragMove:e}=eb.current,{active:t,collisions:n,over:r}=eL.current;if(!t)return;let l={active:t,collisions:n,delta:{x:eq.x,y:eq.y},over:r};K({type:d.DragMove,event:l}),null==e||e(l)},[eq.x,eq.y]),(0,y.useEffect)(()=>{let{active:e,collisions:t,droppableContainers:n,scrollAdjustedTranslate:r}=eL.current;if(!e||!ef.current||!r)return;let{onDragOver:l}=eb.current,i=n.get(e$),u=i&&i.rect.current?{id:i.id,rect:i.rect.current,data:i.data,disabled:i.disabled}:null,o={active:e,collisions:t,delta:{x:r.x,y:r.y},over:u};(0,x.unstable_batchedUpdates)(()=>{eG(u),K({type:d.DragOver,event:o}),null==l||l(o)})},[e$]),(0,D.LI)(()=>{eL.current={active:el,activeNode:eC,collisionRect:eH,collisions:eW,droppableRects:ex,draggableNodes:J,draggingNode:eN,draggingNodeRect:eA,droppableContainers:W,over:e_,scrollableAncestors:eU,scrollAdjustedTranslate:eq},Q.current={initial:eA,translated:eH}},[el,eC,eW,eH,J,eN,eA,ex,W,e_,eU,eq]),function({acceleration:e,activator:t=f.Pointer,canScroll:n,draggingRect:r,enabled:l,interval:i=5,order:u=g.TreeOrder,pointerCoordinates:o,scrollableAncestors:a,scrollableAncestorRects:s,threshold:c}){let[d,p]=(0,D.Yz)(),v=(0,y.useRef)({x:1,y:1}),m=(0,y.useMemo)(()=>{switch(t){case f.Pointer:return o?{top:o.y,bottom:o.y,left:o.x,right:o.x}:null;case f.DraggableRect:return r}return null},[t,r,o]),b=(0,y.useRef)(P),w=(0,y.useRef)(null),x=(0,y.useCallback)(()=>{let e=w.current;if(!e)return;let t=v.current.x*b.current.x,n=v.current.y*b.current.y;e.scrollBy(t,n)},[]),E=(0,y.useMemo)(()=>u===g.TreeOrder?[...a].reverse():a,[u,a]);(0,y.useEffect)(()=>{if(!l||!a.length||!m){p();return}for(let t of E){if((null==n?void 0:n(t))===!1)continue;let r=a.indexOf(t),l=s[r];if(!l)continue;let{direction:u,speed:o}=function(e,t,{top:n,left:r,right:l,bottom:i},u=10,o=en){let{clientHeight:a,clientWidth:s}=e,c=D.Nq&&e&&e===document.scrollingElement?{top:0,left:0,right:s,bottom:a,width:s,height:a}:t,{isTop:d,isBottom:f,isLeft:g,isRight:p}=et(e),v={x:0,y:0},m={x:0,y:0},b={height:c.height*o.y,width:c.width*o.x};return!d&&n<=c.top+b.height?(v.y=h.Backward,m.y=u*Math.abs((c.top+b.height-n)/b.height)):!f&&i>=c.bottom-b.height&&(v.y=h.Forward,m.y=u*Math.abs((c.bottom-b.height-i)/b.height)),!p&&l>=c.right-b.width?(v.x=h.Forward,m.x=u*Math.abs((c.right-b.width-l)/b.width)):!g&&r<=c.left+b.width&&(v.x=h.Backward,m.x=u*Math.abs((c.left+b.width-r)/b.width)),{direction:v,speed:m}}(t,l,m,e,c);if(o.x>0||o.y>0){p(),w.current=t,d(x,i),v.current=o,b.current=u;return}}v.current={x:0,y:0},b.current={x:0,y:0},p()},[e,x,n,p,l,i,JSON.stringify(m),d,a,E,s,JSON.stringify(c)])}({...function(){let e=(null==eg?void 0:eg.autoScrollEnabled)===!1,n="object"==typeof t?!1===t.enabled:!1===t,r=!e&&!n;return"object"==typeof t?{...t,enabled:r}:{enabled:r}}(),draggingRect:eH,pointerCoordinates:eY,scrollableAncestors:eU,scrollableAncestorRects:eX});let e1=(0,y.useMemo)(()=>({active:el,activeNode:eC,activeNodeRect:eM,activatorEvent:ev,collisions:eW,containerNodeRect:eS,dragOverlay:eT,draggableNodes:J,droppableContainers:W,droppableRects:ex,over:e_,measureDroppableContainers:eD,scrollableAncestors:eU,scrollableAncestorRects:eX,measuringScheduled:eE,windowRect:eK}),[el,eC,eM,ev,eW,eS,eT,J,W,ex,e_,eD,eU,eX,eE,eK]),e2=(0,y.useMemo)(()=>({activatorEvent:ev,activators:e0,active:el,activeNodeRect:eM,ariaDescribedById:{draggable:ew},dispatch:T,draggableNodes:J,over:e_,measureDroppableContainers:eD}),[ev,e0,el,eM,T,ew,J,e_,eD]);return y.createElement(A.Provider,{value:F},y.createElement(I.Provider,{value:e2},y.createElement(O.Provider,{value:e1},y.createElement(ej.Provider,{value:eV},r))),y.createElement(B,{announcements:n,hiddenTextDescribedById:ew,screenReaderInstructions:a}))}),eA=(0,y.createContext)(null),eB="button";function eP({id:e,data:t,disabled:n=!1,attributes:r}){let l=(0,D.Ld)("Droppable"),{activators:i,activatorEvent:u,active:o,activeNodeRect:a,ariaDescribedById:s,draggableNodes:c,over:d}=(0,y.useContext)(I),{role:h=eB,roleDescription:f="draggable",tabIndex:g=0}=null!=r?r:{},p=(null==o?void 0:o.id)===e,v=(0,y.useContext)(p?ej:eA),[m,b]=(0,D.wm)(),w=(0,y.useMemo)(()=>i.reduce((t,{eventName:n,handler:r})=>(t[n]=t=>{r(t,e)},t),{}),[i,e]),x=(0,D.Ey)(t);(0,D.LI)(()=>(c[e]={id:e,key:l,node:m,data:x},()=>{let t=c[e];t&&t.key===l&&delete c[e]}),[c,e]);let E=(0,y.useMemo)(()=>({role:h,tabIndex:g,"aria-pressed":!!p&&h===eB||void 0,"aria-roledescription":f,"aria-describedby":s.draggable}),[h,g,p,f,s.draggable]);return{active:o,activatorEvent:u,activeNodeRect:a,attributes:E,isDragging:p,listeners:n?void 0:w,node:m,over:d,setNodeRef:b,transform:v}}function eF(){return(0,y.useContext)(O)}let eK={timeout:25};function eU({data:e,disabled:t=!1,id:n,resizeObserverConfig:r}){let l=(0,D.Ld)("Droppable"),{active:i,dispatch:u,over:o,measureDroppableContainers:a}=(0,y.useContext)(I),s=(0,y.useRef)(!1),c=(0,y.useRef)(null),h=(0,y.useRef)(null),{disabled:f,updateMeasurementsFor:g,timeout:p}={...eK,...r},v=(0,D.Ey)(null!=g?g:n),m=(0,y.useCallback)(()=>{if(!s.current){s.current=!0;return}null!=h.current&&clearTimeout(h.current),h.current=setTimeout(()=>{a("string"==typeof v.current?[v.current]:v.current),h.current=null},p)},[p]),b=ea({onResize:m,disabled:f||!i}),w=(0,y.useCallback)((e,t)=>{b&&(t&&(b.unobserve(t),s.current=!1),e&&b.observe(e))},[b]),[x,E]=(0,D.wm)(w),C=(0,D.Ey)(e);return(0,y.useEffect)(()=>{b&&x.current&&(b.disconnect(),s.current=!1,b.observe(x.current))},[x,b]),(0,D.LI)(()=>(u({type:d.RegisterDroppable,element:{id:n,key:l,disabled:t,node:x,rect:c,data:C}}),()=>u({type:d.UnregisterDroppable,key:l,id:n})),[n]),(0,y.useEffect)(()=>{u({type:d.SetDroppableDisabled,id:n,key:l,disabled:t})},[t]),{active:i,rect:c,isOver:(null==o?void 0:o.id)===n,node:x,over:o,setNodeRef:E}}},45587:function(e,t,n){n.d(t,{Fo:function(){return f},Rp:function(){return u},is:function(){return D},nB:function(){return y},qw:function(){return c}});var r=n(67294),l=n(60887),i=n(24285);function u(e,t,n){let r=e.slice();return r.splice(n<0?r.length+n:n,0,r.splice(t,1)[0]),r}function o(e){return null!==e&&e>=0}let a=({rects:e,activeIndex:t,overIndex:n,index:r})=>{let l=u(e,n,t),i=e[r],o=l[r];return o&&i?{x:o.left-i.left,y:o.top-i.top,scaleX:o.width/i.width,scaleY:o.height/i.height}:null},s={scaleX:1,scaleY:1},c=({activeIndex:e,activeNodeRect:t,index:n,rects:r,overIndex:l})=>{var i;let u=null!=(i=r[e])?i:t;if(!u)return null;if(n===e){let t=r[l];return t?{x:0,y:e<l?t.top+t.height-(u.top+u.height):t.top-u.top,...s}:null}let o=function(e,t,n){let r=e[t],l=e[t-1],i=e[t+1];return r?n<t?l?r.top-(l.top+l.height):i?i.top-(r.top+r.height):0:i?i.top-(r.top+r.height):l?r.top-(l.top+l.height):0:0}(r,n,e);return n>e&&n<=l?{x:0,y:-u.height-o,...s}:n<e&&n>=l?{x:0,y:u.height+o,...s}:{x:0,y:0,...s}},d="Sortable",h=r.createContext({activeIndex:-1,containerId:d,disableTransforms:!1,items:[],overIndex:-1,useDragOverlay:!1,sortedRects:[],strategy:a});function f({children:e,id:t,items:n,strategy:u=a}){var o;let{active:s,dragOverlay:c,droppableRects:f,over:g,measureDroppableContainers:p,measuringScheduled:v}=(0,l.Cj)(),m=(0,i.Ld)(d,t),b=null!==c.rect,w=(0,r.useMemo)(()=>n.map(e=>"string"==typeof e?e:e.id),[n]),y=null!=s,x=s?w.indexOf(s.id):-1,D=g?w.indexOf(g.id):-1,E=(0,r.useRef)(w),C=(o=E.current,w.join()!==o.join()),R=-1!==D&&-1===x||C;(0,i.LI)(()=>{C&&y&&!v&&p(w)},[C,w,y,p,v]),(0,r.useEffect)(()=>{E.current=w},[w]);let M=(0,r.useMemo)(()=>({activeIndex:x,containerId:m,disableTransforms:R,items:w,overIndex:D,useDragOverlay:b,sortedRects:w.reduce((e,t,n)=>{let r=f.get(t);return r&&(e[n]=r),e},Array(w.length)),strategy:u}),[x,m,R,w,D,f,b,u]);return r.createElement(h.Provider,{value:M},e)}let g=({id:e,items:t,activeIndex:n,overIndex:r})=>u(t,n,r).indexOf(e),p=({containerId:e,isSorting:t,wasDragging:n,index:r,items:l,newIndex:i,previousItems:u,previousContainerId:o,transition:a})=>!!a&&!!n&&(u===l||r!==i)&&(!!t||i!==r&&e===o),v={duration:200,easing:"ease"},m="transform",b=i.ux.Transition.toString({property:m,duration:0,easing:"linear"}),w={roleDescription:"sortable"};function y({animateLayoutChanges:e=p,attributes:t,disabled:n,data:u,getNewIndex:a=g,id:s,strategy:c,resizeObserverConfig:d,transition:f=v}){let{items:y,containerId:x,activeIndex:D,disableTransforms:E,sortedRects:C,overIndex:R,useDragOverlay:M,strategy:S}=(0,r.useContext)(h),L=y.indexOf(s),k=(0,r.useMemo)(()=>({sortable:{containerId:x,index:L,items:y},...u}),[x,u,L,y]),T=(0,r.useMemo)(()=>y.slice(y.indexOf(s)),[y,s]),{rect:I,node:O,isOver:j,setNodeRef:N}=(0,l.Zj)({id:s,data:k,resizeObserverConfig:{updateMeasurementsFor:T,...d}}),{active:A,activatorEvent:B,activeNodeRect:P,attributes:F,setNodeRef:K,listeners:U,isDragging:X,over:z,transform:Y}=(0,l.O1)({id:s,data:k,attributes:{...w,...t},disabled:n}),J=(0,i.HB)(N,K),q=!!A,H=q&&!E&&o(D)&&o(R),W=!M&&X,$=W&&H?Y:null,_=H?null!=$?$:(null!=c?c:S)({rects:C,activeNodeRect:P,activeIndex:D,overIndex:R,index:L}):null,G=o(D)&&o(R)?a({id:s,items:y,activeIndex:D,overIndex:R}):L,V=null==A?void 0:A.id,Z=(0,r.useRef)({activeId:V,items:y,newIndex:G,containerId:x}),Q=y!==Z.current.items,ee=e({active:A,containerId:x,isDragging:X,isSorting:q,id:s,index:L,items:y,newIndex:Z.current.newIndex,previousItems:Z.current.items,previousContainerId:Z.current.containerId,transition:f,wasDragging:null!=Z.current.activeId}),et=function({disabled:e,index:t,node:n,rect:u}){let[o,a]=(0,r.useState)(null),s=(0,r.useRef)(t);return(0,i.LI)(()=>{if(!e&&t!==s.current&&n.current){let e=u.current;if(e){let t=(0,l.VK)(n.current,{ignoreTransform:!0}),r={x:e.left-t.left,y:e.top-t.top,scaleX:e.width/t.width,scaleY:e.height/t.height};(r.x||r.y)&&a(r)}}t!==s.current&&(s.current=t)},[e,t,n,u]),(0,r.useEffect)(()=>{o&&requestAnimationFrame(()=>{a(null)})},[o]),o}({disabled:!ee,index:L,node:O,rect:I});return(0,r.useEffect)(()=>{q&&Z.current.newIndex!==G&&(Z.current.newIndex=G),x!==Z.current.containerId&&(Z.current.containerId=x),y!==Z.current.items&&(Z.current.items=y),V!==Z.current.activeId&&(Z.current.activeId=V)},[V,q,G,x,y]),{active:A,activeIndex:D,attributes:F,rect:I,index:L,newIndex:G,items:y,isOver:j,isSorting:q,isDragging:X,listeners:U,node:O,overIndex:R,over:z,setNodeRef:J,setDroppableNodeRef:N,setDraggableNodeRef:K,transform:null!=et?et:_,transition:et||Q&&Z.current.newIndex===L?b:(!W||(0,i.vd)(B))&&f&&(q||ee)?i.ux.Transition.toString({...f,property:m}):void 0}}let x=[l.g4.Down,l.g4.Right,l.g4.Up,l.g4.Left],D=(e,{context:{active:t,droppableContainers:n,collisionRect:r,scrollableAncestors:i}})=>{if(x.includes(e.code)){if(e.preventDefault(),!t||!r)return;let u=[];n.getEnabled().forEach(t=>{if(!t||(null==t?void 0:t.disabled))return;let n=null==t?void 0:t.rect.current;if(n)switch(e.code){case l.g4.Down:r.top+r.height<=n.top&&u.push(t);break;case l.g4.Up:r.top>=n.top+n.height&&u.push(t);break;case l.g4.Left:r.left>=n.left+n.width&&u.push(t);break;case l.g4.Right:r.left+r.width<=n.left&&u.push(t)}});let o=(0,l.ey)({active:t,collisionRect:r,droppableContainers:u,pointerCoordinates:null}),a=(0,l._8)(o,"id");if(null!=a){let e=n.get(a),t=null==e?void 0:e.node.current,u=null==e?void 0:e.rect.current;if(t&&u){let e=(0,l.hI)(t),n=e.some((e,t)=>i[t]!==e),o=n?{x:0,y:0}:{x:r.width-u.width,y:r.height-u.height},a={x:u.left-o.x,y:u.top-o.y};return a}}}}},24285:function(e,t,n){n.d(t,{$X:function(){return D},DC:function(){return C},Ey:function(){return p},FJ:function(){return u},Gj:function(){return v},HB:function(){return l},IH:function(){return x},Jj:function(){return a},LI:function(){return f},Ld:function(){return w},Nq:function(){return i},Re:function(){return c},UG:function(){return o},Yz:function(){return g},qk:function(){return s},r3:function(){return h},ux:function(){return CSS},vZ:function(){return d},vd:function(){return E},wm:function(){return m}});var r=n(67294);function l(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,r.useMemo)(()=>e=>{t.forEach(t=>t(e))},t)}let i="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement;function u(e){let t=Object.prototype.toString.call(e);return"[object Window]"===t||"[object global]"===t}function o(e){return"nodeType"in e}function a(e){var t,n;return e?u(e)?e:o(e)&&null!=(t=null==(n=e.ownerDocument)?void 0:n.defaultView)?t:window:window}function s(e){let{Document}=a(e);return e instanceof Document}function c(e){return!u(e)&&e instanceof a(e).HTMLElement}function d(e){return e instanceof a(e).SVGElement}function h(e){return e?u(e)?e.document:o(e)?s(e)?e:c(e)||d(e)?e.ownerDocument:document:document:document}let f=i?r.useLayoutEffect:r.useEffect;function g(){let e=(0,r.useRef)(null),t=(0,r.useCallback)((t,n)=>{e.current=setInterval(t,n)},[]),n=(0,r.useCallback)(()=>{null!==e.current&&(clearInterval(e.current),e.current=null)},[]);return[t,n]}function p(e,t){void 0===t&&(t=[e]);let n=(0,r.useRef)(e);return f(()=>{n.current!==e&&(n.current=e)},t),n}function v(e,t){let n=(0,r.useRef)();return(0,r.useMemo)(()=>{let t=e(n.current);return n.current=t,t},[...t])}function m(e){let t=function(e){let t=(0,r.useRef)(e);return f(()=>{t.current=e}),(0,r.useCallback)(function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];return null==t.current?void 0:t.current(...n)},[])}(e),n=(0,r.useRef)(null),l=(0,r.useCallback)(e=>{e!==n.current&&(null==t||t(e,n.current)),n.current=e},[]);return[n,l]}let b={};function w(e,t){return(0,r.useMemo)(()=>{if(t)return t;let n=null==b[e]?0:b[e]+1;return b[e]=n,e+"-"+n},[e,t])}function y(e){return function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),l=1;l<n;l++)r[l-1]=arguments[l];return r.reduce((t,n)=>{let r=Object.entries(n);for(let[n,l]of r){let r=t[n];null!=r&&(t[n]=r+e*l)}return t},{...t})}}let x=y(1),D=y(-1);function E(e){if(!e)return!1;let{KeyboardEvent}=a(e.target);return KeyboardEvent&&e instanceof KeyboardEvent}function C(e){if(function(e){if(!e)return!1;let{TouchEvent}=a(e.target);return TouchEvent&&e instanceof TouchEvent}(e)){if(e.touches&&e.touches.length){let{clientX:t,clientY:n}=e.touches[0];return{x:t,y:n}}if(e.changedTouches&&e.changedTouches.length){let{clientX:t,clientY:n}=e.changedTouches[0];return{x:t,y:n}}}return"clientX"in e&&"clientY"in e?{x:e.clientX,y:e.clientY}:null}let CSS=Object.freeze({Translate:{toString(e){if(!e)return;let{x:t,y:n}=e;return"translate3d("+(t?Math.round(t):0)+"px, "+(n?Math.round(n):0)+"px, 0)"}},Scale:{toString(e){if(!e)return;let{scaleX:t,scaleY:n}=e;return"scaleX("+t+") scaleY("+n+")"}},Transform:{toString(e){if(e)return[CSS.Translate.toString(e),CSS.Scale.toString(e)].join(" ")}},Transition:{toString(e){let{property:t,duration:n,easing:r}=e;return t+" "+n+"ms "+r}}})}}]);