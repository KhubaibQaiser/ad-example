"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7729],{48117:function(e,t,n){n.d(t,{E:function(){return v}});var r=n(20567),o=n(14932),i=n(85893),a=n(86010),u=n(11163),s=n(14849),c=n(9419),l=n(18799),d=n(49821),f=n(17931),h=n(35097),p=n(44130),_=n(97436),w=n(96124),b=n(56187);let g="".concat(f.sb,"/api/account/login/apple"),m=new Set([h.K,d.k]),v=e=>{let{onClick:t,label:n,wantsNewsletter:d,client:h}=e,{asPath:v,query:k}=(0,u.useRouter)(),y=e=>{let n=v,i=(0,_.aX)(n).split("#")[0];m.has(i)&&(n=(0,w.Q2)(i,(0,o._)((0,r._)({},k),{appleRedirect:"true"}))),p.Y.setItem(l.uh,n),p.Y.setItem(l.QV,String(h||b.U)),p.Y.setItem(l.MT,String(d)),null==t||t(e)};return(0,i.jsx)(s.Z,{clientId:f.h0,redirectURI:g,render:e=>(0,i.jsxs)("button",(0,o._)((0,r._)({},e),{className:(0,a.Z)("w-full border-black","flex h-11 items-center justify-center text-sm font-medium sm:flex-1","rounded border border-solid disabled:border-gray-100","bg-white text-black hover:bg-gray-100 disabled:bg-white disabled:text-gray-400"),onClick:t=>{y(t),e.onClick(t)},type:"button",children:[(0,i.jsx)("div",{className:"mr-3 flex items-center",children:(0,i.jsx)(c.J,{icon:"apple"})}),n]})),responseMode:"form_post",responseType:"id_token code",scope:"name email"})}},74826:function(e,t,n){n.d(t,{k:function(){return m}});var r=n(85893),o=n(86010),i=n(25675),a=n.n(i),u=n(76469),s=n(17931),c=n(60822),l={src:"/_next/static/media/facebook-icon.32838665.svg",height:600,width:600,blurWidth:0,blurHeight:0},d=n(16262),f=n(11163),h=n(67294),p=n(98323),_=n(44130),w=n(18799);let b=e=>{let{appId:t,scope:n="public_profile, email",fields:o="name,email,picture",callback:i,onProfileSuccess:a,className:u,children:s,wantsNewsletter:c,useRedirect:l=!1,onClick:d}=e,{asPath:b}=(0,f.useRouter)(),g=(0,h.useCallback)(()=>{p.n9.login(e=>{i(e.authResponse),a&&p.n9.getProfile(a,{fields:o})},(0,p.Dv)(n))},[i,o,a,n]);return(0,h.useEffect)(()=>{p.n9.loadSdk().then(()=>{p.n9.init(()=>{let e=p.n9.isRedirected((0,p.Fj)(t));e&&l&&g()},(0,p.UI)(t))})},[t,g,l]),(0,r.jsx)("button",{className:u,onClick:e=>{if(null==d||d(e),l){_.Y.setItem(w.LP,b),void 0===c?_.Y.removeItem(w.MT):_.Y.setItem(w.MT,String(c)),p.n9.redirectToDialog((0,p.Fj)(t),(0,p.Dv)(n));return}g()},type:"button",children:s})};var g=n(20732);let m=e=>{let{onSuccess:t,onError:n,onClick:i,errorMessage:f,wantsNewsletter:h,label:p,mode:_}=e,[,w]=(0,g.Z9)(),m=async e=>{var r,o;if(!e||!e.accessToken)return n((0,d.YX)("facebook"));if(!(null==e?void 0:null===(o=e.grantedScopes)||void 0===o?void 0:null===(r=o.split(","))||void 0===r?void 0:r.includes("email")))return n("We require an email to create an account so we can keep you informed of important updates. Please use another signup method.");let{data:i,error:a}=await w({facebook_access_token:e.accessToken,expires_at:e.data_access_expiration_time,fb_user_id:e.userID,wants_newsletter:h||!1});if(a||!i||!(null==i?void 0:i.social_auth))return n(a?(0,u.Hl)(a,_).message:(0,d.YX)("facebook"));await t(i.social_auth,"facebook")},v=(0,c.WP)();return(0,r.jsxs)(b,{appId:s.g5,callback:e=>void m(e),className:(0,o.Z)(f?"border-red":"border-black","flex h-11 w-full items-center justify-center gap-3 text-sm font-medium sm:flex-1","rounded border border-solid disabled:border-gray-100","bg-white text-black hover:bg-gray-100 disabled:bg-white disabled:text-gray-400"),onClick:e=>{null==i||i(e)},useRedirect:v,children:[(0,r.jsx)(a(),{alt:"","aria-hidden":"true",height:20,src:l,width:20}),p]})}},89822:function(e,t,n){n.d(t,{$:function(){return h}});var r=n(85893),o=n(86426),i=n(86010),a=n(25675),u=n.n(a),s=n(76469),c=n(60822),l={src:"/_next/static/media/google-icon.811c5c6a.svg",height:24,width:24,blurWidth:0,blurHeight:0},d=n(16262),f=n(20732);let h=e=>{let{onSuccess:t,onError:n,onClick:a,errorMessage:h,wantsNewsletter:p,label:_,mode:w}=e,[,b]=(0,f.fE)(),g=async e=>{let{access_token:r}=e,{data:o,error:i}=await b({google_id_token:r,wants_newsletter:p||!1});if(i||!o||!o.social_auth)return n(i?(0,s.Hl)(i,w).message:(0,d.YX)("google"));await t(o.social_auth,"google")},m=(0,o.Nq)({flow:"implicit",onSuccess:e=>void g(e),onError:e=>{let{error_description:t}=e;n(t||(0,d.YX)("google"))}}),v=(0,c.WP)();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("button",{className:(0,i.Z)(h?"border-red":"border-black","flex h-11 w-full items-center justify-center gap-3 text-sm font-medium sm:flex-1","rounded border border-solid disabled:cursor-not-allowed disabled:border-gray-100","bg-white text-black hover:bg-gray-100 disabled:bg-white disabled:text-gray-400"),disabled:v,onClick:e=>{null==a||a(e),m()},type:"button",children:[(0,r.jsx)(u(),{alt:"","aria-hidden":"true",height:20,src:l,width:20}),_]}),v&&(0,r.jsx)("div",{className:"mt-1.5 text-center text-sm",children:"Authentication with Google isn't supported in in-app browsers."})]})}},56187:function(e,t,n){n.d(t,{U:function(){return o}});var r=n(31116);let o=r.LY.web},20732:function(e,t,n){n.d(t,{Z9:function(){return h},fE:function(){return d},yR:function(){return _}});var r=n(82729),o=n(26997),i=n(30358);function a(){let e=(0,r._)(["\n    fragment SocialAuthResponse on users_social_auth_response {\n  access_token\n  expires_at\n  is_signup\n}\n    "]);return a=function(){return e},e}function u(){let e=(0,r._)(['\n    mutation AuthenticateWithGoogle($google_id_token: String!, $wants_newsletter: Boolean = true) {\n  social_auth: users_auth_with_google(\n    id_token: $google_id_token\n    wants_newsletter: $wants_newsletter\n    client: "web"\n    partner: null\n  ) {\n    access_token\n    expires_at\n    is_signup\n  }\n}\n    ']);return u=function(){return e},e}function s(){let e=(0,r._)(['\n    mutation AuthenticateWithFacebook($facebook_access_token: String!, $expires_at: Int!, $fb_user_id: String!, $wants_newsletter: Boolean = true) {\n  social_auth: users_auth_with_facebook(\n    access_token: $facebook_access_token\n    expires_at: $expires_at\n    user_id: $fb_user_id\n    wants_newsletter: $wants_newsletter\n    client: "web"\n    partner: null\n  ) {\n    access_token\n    expires_at\n    is_signup\n  }\n}\n    ']);return s=function(){return e},e}function c(){let e=(0,r._)(['\n    mutation AuthenticateWithApple($code: String!, $wants_newsletter: Boolean = true) {\n  social_auth: users_auth_with_apple(\n    code: $code\n    wants_newsletter: $wants_newsletter\n    client: "web"\n    partner: null\n  ) {\n    access_token\n    expires_at\n    is_signup\n  }\n}\n    ']);return c=function(){return e},e}(0,o.Ps)(a());let l=(0,o.Ps)(u());function d(){return i.Db(l)}let f=(0,o.Ps)(s());function h(){return i.Db(f)}let p=(0,o.Ps)(c());function _(){return i.Db(p)}},18799:function(e,t,n){n.d(t,{DW:function(){return a},LP:function(){return s},MT:function(){return u},QV:function(){return l},RN:function(){return o},WP:function(){return i},uh:function(){return c},z:function(){return d}});var r=n(85893);let o="Log In",i="Sign Up",a=(0,r.jsxs)(r.Fragment,{children:["Join ",(0,r.jsx)("b",{children:"over 700,000"})," other tastemakers to view and save recipes and shows and subscribe to Tastemade+."]}),u="socialAuthNewsletterSubscription",s="fbRedirectAfterAuth",c="appleRedirectAfterAuth",l="loginPlatform",d="recipeToRedirect"},31116:function(e,t,n){n.d(t,{Io:function(){return a},LY:function(){return o},MH:function(){return u},at:function(){return d},fb:function(){return l},gf:function(){return f},x3:function(){return s},y1:function(){return c}});var r,o,i=n(16310);let a=i.Z_().trim().required("Please provide an email").email("Please provide a valid email").lowercase(),u=i.Z_().trim().required("Please provide a password").min(8,"Password must be at least eight characters").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).+$/,"Password must contain at least one capital letter and one number"),s=i.Z_().required("Please provide your password");(r=o||(o={})).app="ott",r.web="web";let c=i.Ry({email:a,client:i.nK().oneOf(Object.values(o)).default("web"),password:s,wants_newsletter:i.O7().default(!0)}),l=i.Ry({email:a,password:u,wants_newsletter:i.O7().default(!0),tag:i.Z_(),client:i.Z_(),partner:i.Z_()}),d=i.Ry({email:a}),f=i.Ry({password:u.default(""),password_confirmation:u.default("").oneOf([i.iH("password")],"Passwords do not match")})},49821:function(e,t,n){var r;n.d(t,{h:function(){return i},k:function(){return o}}),(r||(r={})).Verizon="verizon";let o="/partners",i=e=>(null==e?void 0:e.toLowerCase())===r.Verizon},16262:function(e,t,n){n.d(t,{ID:function(){return m},Tm:function(){return g},W9:function(){return y},Wy:function(){return _},YX:function(){return f},ZK:function(){return p},Zd:function(){return h},_b:function(){return v},f7:function(){return d},hT:function(){return x},jB:function(){return k},o6:function(){return P}});var r=n(20567),o=n(47702),i=n(48403),a=n.n(i),u=n(23435),s=n(30692),c=n(46216),l=n(76184);let d=e=>{let{backButtonPath:t,backButtonLabel:n,hasStickyFooter:r,hideBackButtonHeader:o=!1}=e;return{hideHeader:!0,showBackButtonHeaderV2:!o,hideFooter:!!r,footerVariant:"checkout-v2",hideGlobalNotification:!0,backButtonHeaderProps:o?null:{previousUrl:t,previousLabel:n,variant:"light"}}},f=e=>"Unable to authenticate with ".concat("email"===e?e:a()(e)),h=e=>{let t=e[l.hu];return t===s.i1o.Yearly?"yearly":t===s.i1o.Monthly?"monthly":l.vT},p=e=>{let t=e[l.MN];return"string"==typeof t?t:void 0},_=e=>{let t=e[l.AI];return"string"==typeof t?t:void 0},w=(e,t)=>{let n={};for(let{key:r,providedValue:o}of t){let t=e[r],i=null!=o?o:"string"==typeof t?t:void 0;i&&(n[r]=i)}return n},b=(e,t,n)=>{let{billingPeriod:o,redirect:i,promoCode:a}=t,u=w(e,[{key:l.hu,providedValue:o},{key:l.AI,providedValue:a},{key:l.MN,providedValue:i}]);return(null==n?void 0:n.allowOtherQueryParams)?(0,r._)({},e,u):u},g=(e,t,n)=>{let r=b(n,t,{allowOtherQueryParams:!0}),o=(0,c.I)(r);return o?"".concat(e,"?").concat(o):e},m=(e,t)=>{let n=(0,c.I)(t);return n?"".concat(e,"?").concat(n):e},v=e=>{let{query:t,toPath:n}=e;return{destination:m(n,t),permanent:!1}},k=e=>e?e.canceled_at?s.m0d.Reactivate:s.m0d.Upgrade:s.m0d.New,y=e=>{var{query:t,allowOtherQueryParams:n=!1}=e,r=(0,o._)(e,["query","allowOtherQueryParams"]);let i=l.Iy,a=b(t,r,{allowOtherQueryParams:n}),u=new URLSearchParams(a).toString();return"".concat(i).concat(u?"?".concat(u):"")},x=e=>{var t,n;let r=null==e?void 0:null===(n=e.users)||void 0===n?void 0:null===(t=n.user)||void 0===t?void 0:t.subscription;return r&&(0,u.$I)(r)?r:void 0},P=e=>({total:{label:"Total",amount:Math.floor(100*e)}})},98323:function(e,t,n){n.d(t,{Dv:function(){return _},Fj:function(){return d},UI:function(){return h},n9:function(){return c}});var r=n(20567),o=n(14932),i=n(17931),a=n(97436);let u="".concat(i.sb,"/account/login/facebook"),s=(e,t)=>new Promise(n=>{let r=document.querySelectorAll("script")[0];if(document.querySelector("#".concat(e))||!r.parentNode)return;let o=document.createElement("script");o.id=e,o.src=t,o.addEventListener("load",n),r.parentNode.insertBefore(o,r)}),c={getFB:()=>{if(window.FB)return window.FB},getLoginStatus(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.getFB();if(!n){e({status:"unknown"});return}n.getLoginStatus(e,t)},getProfile(e,t){var n;null===(n=this.getFB())||void 0===n||n.api("me",t,e)},init(e,t){window.fbAsyncInit=()=>{var n;null===(n=this.getFB())||void 0===n||n.init(t),e()}},isRedirected(e){var t;let n=(0,a.sz)(window.location.search||window.location.hash);return n.state===(null==e?void 0:e.state)&&(void 0!==n[null!==(t=null==e?void 0:e.response_type)&&void 0!==t?t:""]||void 0!==n["#access_token"])},loadSdk:async()=>{await s("facebook-jssdk","https://connect.facebook.net/".concat("en_US","/sdk.js"))},redirectToDialog(e,t){window.location.href="https://www.facebook.com/dialog/oauth?".concat((0,a.lj)((0,r._)({},e,t)))},login(e,t){var n;null===(n=this.getFB())||void 0===n||n.login(e,t)},logout(e){this.getLoginStatus(t=>{if("connected"===t.status){var n;null===(n=this.getFB())||void 0===n||n.logout(e)}else e()})}},l={redirect_uri:u,state:"facebookdirect",response_type:"token"},d=e=>(0,o._)((0,r._)({},l),{client_id:e}),f={version:"v13.0",xfbml:!1,cookie:!1},h=e=>(0,o._)((0,r._)({},f),{appId:e}),p={auth_type:"",return_scopes:!0},_=e=>(0,o._)((0,r._)({},p),{scope:e})},97436:function(e,t,n){n.d(t,{aX:function(){return a},lj:function(){return o},sz:function(){return i}});var r=n(86680);let o=e=>Object.keys(e).map(t=>"".concat(t,"=").concat(encodeURIComponent(e[t]))).join("&"),i=e=>{let t=new URLSearchParams(e);return(0,r.s)(t)},a=e=>e.split("?")[0]},60822:function(e,t,n){n.d(t,{WP:function(){return u},Yk:function(){return s},c4:function(){return c},n_:function(){return o},qk:function(){return r}});let r=/(https?:\/\/)?(www\.)?([\w#%+:=@~-]{1,256}\.)+[\d()a-z]{1,6}\b([\w#%&()+./:=?@~-]*)/i,o=/^\+(?:\d\s?){6,14}\d$/,i=[/WebView|Android.*wv/.source,/\bInstagram/.source,/\bFB\w+\//.source,/\bSnapchat/.source,/\[Pinterest/.source,/TikTok|\bBytedance/.source],a=RegExp("(".concat(i.join("|"),")"),"i"),u=()=>"undefined"!=typeof navigator&&a.test(navigator.userAgent),s=/((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?/gim,c=/^(https?:\/\/).*/}}]);