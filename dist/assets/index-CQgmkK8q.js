(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function xw(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Cg={exports:{}},El={},kg={exports:{}},X={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lo=Symbol.for("react.element"),Lw=Symbol.for("react.portal"),Mw=Symbol.for("react.fragment"),Fw=Symbol.for("react.strict_mode"),Uw=Symbol.for("react.profiler"),bw=Symbol.for("react.provider"),jw=Symbol.for("react.context"),zw=Symbol.for("react.forward_ref"),Bw=Symbol.for("react.suspense"),$w=Symbol.for("react.memo"),Ww=Symbol.for("react.lazy"),ip=Symbol.iterator;function Hw(t){return t===null||typeof t!="object"?null:(t=ip&&t[ip]||t["@@iterator"],typeof t=="function"?t:null)}var Ng={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Dg=Object.assign,Vg={};function Vi(t,e,n){this.props=t,this.context=e,this.refs=Vg,this.updater=n||Ng}Vi.prototype.isReactComponent={};Vi.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Vi.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Og(){}Og.prototype=Vi.prototype;function Th(t,e,n){this.props=t,this.context=e,this.refs=Vg,this.updater=n||Ng}var Ih=Th.prototype=new Og;Ih.constructor=Th;Dg(Ih,Vi.prototype);Ih.isPureReactComponent=!0;var sp=Array.isArray,xg=Object.prototype.hasOwnProperty,Sh={current:null},Lg={key:!0,ref:!0,__self:!0,__source:!0};function Mg(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)xg.call(e,r)&&!Lg.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:lo,type:t,key:s,ref:o,props:i,_owner:Sh.current}}function qw(t,e){return{$$typeof:lo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Ah(t){return typeof t=="object"&&t!==null&&t.$$typeof===lo}function Kw(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var op=/\/+/g;function Su(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Kw(""+t.key):e.toString(36)}function fa(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case lo:case Lw:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Su(o,0):r,sp(i)?(n="",t!=null&&(n=t.replace(op,"$&/")+"/"),fa(i,e,n,"",function(h){return h})):i!=null&&(Ah(i)&&(i=qw(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(op,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",sp(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+Su(s,l);o+=fa(s,e,n,u,i)}else if(u=Hw(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+Su(s,l++),o+=fa(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Wo(t,e,n){if(t==null)return t;var r=[],i=0;return fa(t,r,"","",function(s){return e.call(n,s,i++)}),r}function Gw(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var rt={current:null},pa={transition:null},Qw={ReactCurrentDispatcher:rt,ReactCurrentBatchConfig:pa,ReactCurrentOwner:Sh};function Fg(){throw Error("act(...) is not supported in production builds of React.")}X.Children={map:Wo,forEach:function(t,e,n){Wo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Wo(t,function(){e++}),e},toArray:function(t){return Wo(t,function(e){return e})||[]},only:function(t){if(!Ah(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};X.Component=Vi;X.Fragment=Mw;X.Profiler=Uw;X.PureComponent=Th;X.StrictMode=Fw;X.Suspense=Bw;X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Qw;X.act=Fg;X.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Dg({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Sh.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)xg.call(e,u)&&!Lg.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:lo,type:t.type,key:i,ref:s,props:r,_owner:o}};X.createContext=function(t){return t={$$typeof:jw,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:bw,_context:t},t.Consumer=t};X.createElement=Mg;X.createFactory=function(t){var e=Mg.bind(null,t);return e.type=t,e};X.createRef=function(){return{current:null}};X.forwardRef=function(t){return{$$typeof:zw,render:t}};X.isValidElement=Ah;X.lazy=function(t){return{$$typeof:Ww,_payload:{_status:-1,_result:t},_init:Gw}};X.memo=function(t,e){return{$$typeof:$w,type:t,compare:e===void 0?null:e}};X.startTransition=function(t){var e=pa.transition;pa.transition={};try{t()}finally{pa.transition=e}};X.unstable_act=Fg;X.useCallback=function(t,e){return rt.current.useCallback(t,e)};X.useContext=function(t){return rt.current.useContext(t)};X.useDebugValue=function(){};X.useDeferredValue=function(t){return rt.current.useDeferredValue(t)};X.useEffect=function(t,e){return rt.current.useEffect(t,e)};X.useId=function(){return rt.current.useId()};X.useImperativeHandle=function(t,e,n){return rt.current.useImperativeHandle(t,e,n)};X.useInsertionEffect=function(t,e){return rt.current.useInsertionEffect(t,e)};X.useLayoutEffect=function(t,e){return rt.current.useLayoutEffect(t,e)};X.useMemo=function(t,e){return rt.current.useMemo(t,e)};X.useReducer=function(t,e,n){return rt.current.useReducer(t,e,n)};X.useRef=function(t){return rt.current.useRef(t)};X.useState=function(t){return rt.current.useState(t)};X.useSyncExternalStore=function(t,e,n){return rt.current.useSyncExternalStore(t,e,n)};X.useTransition=function(){return rt.current.useTransition()};X.version="18.3.1";kg.exports=X;var ht=kg.exports;const Yw=xw(ht);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xw=ht,Jw=Symbol.for("react.element"),Zw=Symbol.for("react.fragment"),e0=Object.prototype.hasOwnProperty,t0=Xw.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n0={key:!0,ref:!0,__self:!0,__source:!0};function Ug(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)e0.call(e,r)&&!n0.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:Jw,type:t,key:s,ref:o,props:i,_owner:t0.current}}El.Fragment=Zw;El.jsx=Ug;El.jsxs=Ug;Cg.exports=El;var J=Cg.exports,ac={},bg={exports:{}},yt={},jg={exports:{}},zg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(j,K){var Y=j.length;j.push(K);e:for(;0<Y;){var me=Y-1>>>1,ae=j[me];if(0<i(ae,K))j[me]=K,j[Y]=ae,Y=me;else break e}}function n(j){return j.length===0?null:j[0]}function r(j){if(j.length===0)return null;var K=j[0],Y=j.pop();if(Y!==K){j[0]=Y;e:for(var me=0,ae=j.length,Te=ae>>>1;me<Te;){var Xt=2*(me+1)-1,Jt=j[Xt],Zt=Xt+1,en=j[Zt];if(0>i(Jt,Y))Zt<ae&&0>i(en,Jt)?(j[me]=en,j[Zt]=Y,me=Zt):(j[me]=Jt,j[Xt]=Y,me=Xt);else if(Zt<ae&&0>i(en,Y))j[me]=en,j[Zt]=Y,me=Zt;else break e}}return K}function i(j,K){var Y=j.sortIndex-K.sortIndex;return Y!==0?Y:j.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],h=[],f=1,g=null,y=3,R=!1,N=!1,k=!1,O=typeof setTimeout=="function"?setTimeout:null,I=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function S(j){for(var K=n(h);K!==null;){if(K.callback===null)r(h);else if(K.startTime<=j)r(h),K.sortIndex=K.expirationTime,e(u,K);else break;K=n(h)}}function V(j){if(k=!1,S(j),!N)if(n(u)!==null)N=!0,Bi(b);else{var K=n(h);K!==null&&Yt(V,K.startTime-j)}}function b(j,K){N=!1,k&&(k=!1,I(m),m=-1),R=!0;var Y=y;try{for(S(K),g=n(u);g!==null&&(!(g.expirationTime>K)||j&&!A());){var me=g.callback;if(typeof me=="function"){g.callback=null,y=g.priorityLevel;var ae=me(g.expirationTime<=K);K=t.unstable_now(),typeof ae=="function"?g.callback=ae:g===n(u)&&r(u),S(K)}else r(u);g=n(u)}if(g!==null)var Te=!0;else{var Xt=n(h);Xt!==null&&Yt(V,Xt.startTime-K),Te=!1}return Te}finally{g=null,y=Y,R=!1}}var U=!1,v=null,m=-1,_=5,w=-1;function A(){return!(t.unstable_now()-w<_)}function C(){if(v!==null){var j=t.unstable_now();w=j;var K=!0;try{K=v(!0,j)}finally{K?T():(U=!1,v=null)}}else U=!1}var T;if(typeof E=="function")T=function(){E(C)};else if(typeof MessageChannel<"u"){var vt=new MessageChannel,lr=vt.port2;vt.port1.onmessage=C,T=function(){lr.postMessage(null)}}else T=function(){O(C,0)};function Bi(j){v=j,U||(U=!0,T())}function Yt(j,K){m=O(function(){j(t.unstable_now())},K)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(j){j.callback=null},t.unstable_continueExecution=function(){N||R||(N=!0,Bi(b))},t.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):_=0<j?Math.floor(1e3/j):5},t.unstable_getCurrentPriorityLevel=function(){return y},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(j){switch(y){case 1:case 2:case 3:var K=3;break;default:K=y}var Y=y;y=K;try{return j()}finally{y=Y}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(j,K){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var Y=y;y=j;try{return K()}finally{y=Y}},t.unstable_scheduleCallback=function(j,K,Y){var me=t.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?me+Y:me):Y=me,j){case 1:var ae=-1;break;case 2:ae=250;break;case 5:ae=1073741823;break;case 4:ae=1e4;break;default:ae=5e3}return ae=Y+ae,j={id:f++,callback:K,priorityLevel:j,startTime:Y,expirationTime:ae,sortIndex:-1},Y>me?(j.sortIndex=Y,e(h,j),n(u)===null&&j===n(h)&&(k?(I(m),m=-1):k=!0,Yt(V,Y-me))):(j.sortIndex=ae,e(u,j),N||R||(N=!0,Bi(b))),j},t.unstable_shouldYield=A,t.unstable_wrapCallback=function(j){var K=y;return function(){var Y=y;y=K;try{return j.apply(this,arguments)}finally{y=Y}}}})(zg);jg.exports=zg;var r0=jg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var i0=ht,mt=r0;function M(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Bg=new Set,xs={};function Or(t,e){mi(t,e),mi(t+"Capture",e)}function mi(t,e){for(xs[t]=e,t=0;t<e.length;t++)Bg.add(e[t])}var fn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),lc=Object.prototype.hasOwnProperty,s0=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ap={},lp={};function o0(t){return lc.call(lp,t)?!0:lc.call(ap,t)?!1:s0.test(t)?lp[t]=!0:(ap[t]=!0,!1)}function a0(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function l0(t,e,n,r){if(e===null||typeof e>"u"||a0(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function it(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var je={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){je[t]=new it(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];je[e]=new it(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){je[t]=new it(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){je[t]=new it(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){je[t]=new it(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){je[t]=new it(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){je[t]=new it(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){je[t]=new it(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){je[t]=new it(t,5,!1,t.toLowerCase(),null,!1,!1)});var Rh=/[\-:]([a-z])/g;function Ph(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Rh,Ph);je[e]=new it(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Rh,Ph);je[e]=new it(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Rh,Ph);je[e]=new it(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){je[t]=new it(t,1,!1,t.toLowerCase(),null,!1,!1)});je.xlinkHref=new it("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){je[t]=new it(t,1,!1,t.toLowerCase(),null,!0,!0)});function Ch(t,e,n,r){var i=je.hasOwnProperty(e)?je[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(l0(e,n,i,r)&&(n=null),r||i===null?o0(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var wn=i0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ho=Symbol.for("react.element"),qr=Symbol.for("react.portal"),Kr=Symbol.for("react.fragment"),kh=Symbol.for("react.strict_mode"),uc=Symbol.for("react.profiler"),$g=Symbol.for("react.provider"),Wg=Symbol.for("react.context"),Nh=Symbol.for("react.forward_ref"),cc=Symbol.for("react.suspense"),hc=Symbol.for("react.suspense_list"),Dh=Symbol.for("react.memo"),Cn=Symbol.for("react.lazy"),Hg=Symbol.for("react.offscreen"),up=Symbol.iterator;function ns(t){return t===null||typeof t!="object"?null:(t=up&&t[up]||t["@@iterator"],typeof t=="function"?t:null)}var _e=Object.assign,Au;function hs(t){if(Au===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Au=e&&e[1]||""}return`
`+Au+t}var Ru=!1;function Pu(t,e){if(!t||Ru)return"";Ru=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var r=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){r=h}t.call(e.prototype)}else{try{throw Error()}catch(h){r=h}t()}}catch(h){if(h&&r&&typeof h.stack=="string"){for(var i=h.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{Ru=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?hs(t):""}function u0(t){switch(t.tag){case 5:return hs(t.type);case 16:return hs("Lazy");case 13:return hs("Suspense");case 19:return hs("SuspenseList");case 0:case 2:case 15:return t=Pu(t.type,!1),t;case 11:return t=Pu(t.type.render,!1),t;case 1:return t=Pu(t.type,!0),t;default:return""}}function dc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Kr:return"Fragment";case qr:return"Portal";case uc:return"Profiler";case kh:return"StrictMode";case cc:return"Suspense";case hc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Wg:return(t.displayName||"Context")+".Consumer";case $g:return(t._context.displayName||"Context")+".Provider";case Nh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Dh:return e=t.displayName||null,e!==null?e:dc(t.type)||"Memo";case Cn:e=t._payload,t=t._init;try{return dc(t(e))}catch{}}return null}function c0(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return dc(e);case 8:return e===kh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Zn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function qg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function h0(t){var e=qg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function qo(t){t._valueTracker||(t._valueTracker=h0(t))}function Kg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=qg(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function xa(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function fc(t,e){var n=e.checked;return _e({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function cp(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=Zn(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Gg(t,e){e=e.checked,e!=null&&Ch(t,"checked",e,!1)}function pc(t,e){Gg(t,e);var n=Zn(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?mc(t,e.type,n):e.hasOwnProperty("defaultValue")&&mc(t,e.type,Zn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function hp(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function mc(t,e,n){(e!=="number"||xa(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var ds=Array.isArray;function si(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+Zn(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function gc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(M(91));return _e({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function dp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(M(92));if(ds(n)){if(1<n.length)throw Error(M(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Zn(n)}}function Qg(t,e){var n=Zn(e.value),r=Zn(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function fp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Yg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function yc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Yg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ko,Xg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ko=Ko||document.createElement("div"),Ko.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ko.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ls(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Es={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},d0=["Webkit","ms","Moz","O"];Object.keys(Es).forEach(function(t){d0.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Es[e]=Es[t]})});function Jg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Es.hasOwnProperty(t)&&Es[t]?(""+e).trim():e+"px"}function Zg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Jg(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var f0=_e({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function _c(t,e){if(e){if(f0[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(M(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(M(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(M(61))}if(e.style!=null&&typeof e.style!="object")throw Error(M(62))}}function vc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ec=null;function Vh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var wc=null,oi=null,ai=null;function pp(t){if(t=ho(t)){if(typeof wc!="function")throw Error(M(280));var e=t.stateNode;e&&(e=Al(e),wc(t.stateNode,t.type,e))}}function ey(t){oi?ai?ai.push(t):ai=[t]:oi=t}function ty(){if(oi){var t=oi,e=ai;if(ai=oi=null,pp(t),e)for(t=0;t<e.length;t++)pp(e[t])}}function ny(t,e){return t(e)}function ry(){}var Cu=!1;function iy(t,e,n){if(Cu)return t(e,n);Cu=!0;try{return ny(t,e,n)}finally{Cu=!1,(oi!==null||ai!==null)&&(ry(),ty())}}function Ms(t,e){var n=t.stateNode;if(n===null)return null;var r=Al(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(M(231,e,typeof n));return n}var Tc=!1;if(fn)try{var rs={};Object.defineProperty(rs,"passive",{get:function(){Tc=!0}}),window.addEventListener("test",rs,rs),window.removeEventListener("test",rs,rs)}catch{Tc=!1}function p0(t,e,n,r,i,s,o,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(f){this.onError(f)}}var ws=!1,La=null,Ma=!1,Ic=null,m0={onError:function(t){ws=!0,La=t}};function g0(t,e,n,r,i,s,o,l,u){ws=!1,La=null,p0.apply(m0,arguments)}function y0(t,e,n,r,i,s,o,l,u){if(g0.apply(this,arguments),ws){if(ws){var h=La;ws=!1,La=null}else throw Error(M(198));Ma||(Ma=!0,Ic=h)}}function xr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function sy(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function mp(t){if(xr(t)!==t)throw Error(M(188))}function _0(t){var e=t.alternate;if(!e){if(e=xr(t),e===null)throw Error(M(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return mp(i),t;if(s===r)return mp(i),e;s=s.sibling}throw Error(M(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error(M(189))}}if(n.alternate!==r)throw Error(M(190))}if(n.tag!==3)throw Error(M(188));return n.stateNode.current===n?t:e}function oy(t){return t=_0(t),t!==null?ay(t):null}function ay(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=ay(t);if(e!==null)return e;t=t.sibling}return null}var ly=mt.unstable_scheduleCallback,gp=mt.unstable_cancelCallback,v0=mt.unstable_shouldYield,E0=mt.unstable_requestPaint,Se=mt.unstable_now,w0=mt.unstable_getCurrentPriorityLevel,Oh=mt.unstable_ImmediatePriority,uy=mt.unstable_UserBlockingPriority,Fa=mt.unstable_NormalPriority,T0=mt.unstable_LowPriority,cy=mt.unstable_IdlePriority,wl=null,zt=null;function I0(t){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(wl,t,void 0,(t.current.flags&128)===128)}catch{}}var xt=Math.clz32?Math.clz32:R0,S0=Math.log,A0=Math.LN2;function R0(t){return t>>>=0,t===0?32:31-(S0(t)/A0|0)|0}var Go=64,Qo=4194304;function fs(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Ua(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~i;l!==0?r=fs(l):(s&=o,s!==0&&(r=fs(s)))}else o=n&~i,o!==0?r=fs(o):s!==0&&(r=fs(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-xt(e),i=1<<n,r|=t[n],e&=~i;return r}function P0(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function C0(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-xt(s),l=1<<o,u=i[o];u===-1?(!(l&n)||l&r)&&(i[o]=P0(l,e)):u<=e&&(t.expiredLanes|=l),s&=~l}}function Sc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function hy(){var t=Go;return Go<<=1,!(Go&4194240)&&(Go=64),t}function ku(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function uo(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-xt(e),t[e]=n}function k0(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-xt(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function xh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-xt(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var se=0;function dy(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var fy,Lh,py,my,gy,Ac=!1,Yo=[],bn=null,jn=null,zn=null,Fs=new Map,Us=new Map,Nn=[],N0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function yp(t,e){switch(t){case"focusin":case"focusout":bn=null;break;case"dragenter":case"dragleave":jn=null;break;case"mouseover":case"mouseout":zn=null;break;case"pointerover":case"pointerout":Fs.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Us.delete(e.pointerId)}}function is(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=ho(e),e!==null&&Lh(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function D0(t,e,n,r,i){switch(e){case"focusin":return bn=is(bn,t,e,n,r,i),!0;case"dragenter":return jn=is(jn,t,e,n,r,i),!0;case"mouseover":return zn=is(zn,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Fs.set(s,is(Fs.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Us.set(s,is(Us.get(s)||null,t,e,n,r,i)),!0}return!1}function yy(t){var e=gr(t.target);if(e!==null){var n=xr(e);if(n!==null){if(e=n.tag,e===13){if(e=sy(n),e!==null){t.blockedOn=e,gy(t.priority,function(){py(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function ma(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Rc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Ec=r,n.target.dispatchEvent(r),Ec=null}else return e=ho(n),e!==null&&Lh(e),t.blockedOn=n,!1;e.shift()}return!0}function _p(t,e,n){ma(t)&&n.delete(e)}function V0(){Ac=!1,bn!==null&&ma(bn)&&(bn=null),jn!==null&&ma(jn)&&(jn=null),zn!==null&&ma(zn)&&(zn=null),Fs.forEach(_p),Us.forEach(_p)}function ss(t,e){t.blockedOn===e&&(t.blockedOn=null,Ac||(Ac=!0,mt.unstable_scheduleCallback(mt.unstable_NormalPriority,V0)))}function bs(t){function e(i){return ss(i,t)}if(0<Yo.length){ss(Yo[0],t);for(var n=1;n<Yo.length;n++){var r=Yo[n];r.blockedOn===t&&(r.blockedOn=null)}}for(bn!==null&&ss(bn,t),jn!==null&&ss(jn,t),zn!==null&&ss(zn,t),Fs.forEach(e),Us.forEach(e),n=0;n<Nn.length;n++)r=Nn[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Nn.length&&(n=Nn[0],n.blockedOn===null);)yy(n),n.blockedOn===null&&Nn.shift()}var li=wn.ReactCurrentBatchConfig,ba=!0;function O0(t,e,n,r){var i=se,s=li.transition;li.transition=null;try{se=1,Mh(t,e,n,r)}finally{se=i,li.transition=s}}function x0(t,e,n,r){var i=se,s=li.transition;li.transition=null;try{se=4,Mh(t,e,n,r)}finally{se=i,li.transition=s}}function Mh(t,e,n,r){if(ba){var i=Rc(t,e,n,r);if(i===null)bu(t,e,r,ja,n),yp(t,r);else if(D0(i,t,e,n,r))r.stopPropagation();else if(yp(t,r),e&4&&-1<N0.indexOf(t)){for(;i!==null;){var s=ho(i);if(s!==null&&fy(s),s=Rc(t,e,n,r),s===null&&bu(t,e,r,ja,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else bu(t,e,r,null,n)}}var ja=null;function Rc(t,e,n,r){if(ja=null,t=Vh(r),t=gr(t),t!==null)if(e=xr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=sy(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return ja=t,null}function _y(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(w0()){case Oh:return 1;case uy:return 4;case Fa:case T0:return 16;case cy:return 536870912;default:return 16}default:return 16}}var Mn=null,Fh=null,ga=null;function vy(){if(ga)return ga;var t,e=Fh,n=e.length,r,i="value"in Mn?Mn.value:Mn.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return ga=i.slice(t,1<r?1-r:void 0)}function ya(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Xo(){return!0}function vp(){return!1}function _t(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Xo:vp,this.isPropagationStopped=vp,this}return _e(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Xo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Xo)},persist:function(){},isPersistent:Xo}),e}var Oi={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Uh=_t(Oi),co=_e({},Oi,{view:0,detail:0}),L0=_t(co),Nu,Du,os,Tl=_e({},co,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:bh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==os&&(os&&t.type==="mousemove"?(Nu=t.screenX-os.screenX,Du=t.screenY-os.screenY):Du=Nu=0,os=t),Nu)},movementY:function(t){return"movementY"in t?t.movementY:Du}}),Ep=_t(Tl),M0=_e({},Tl,{dataTransfer:0}),F0=_t(M0),U0=_e({},co,{relatedTarget:0}),Vu=_t(U0),b0=_e({},Oi,{animationName:0,elapsedTime:0,pseudoElement:0}),j0=_t(b0),z0=_e({},Oi,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),B0=_t(z0),$0=_e({},Oi,{data:0}),wp=_t($0),W0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},H0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},q0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function K0(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=q0[t])?!!e[t]:!1}function bh(){return K0}var G0=_e({},co,{key:function(t){if(t.key){var e=W0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=ya(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?H0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:bh,charCode:function(t){return t.type==="keypress"?ya(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ya(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Q0=_t(G0),Y0=_e({},Tl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Tp=_t(Y0),X0=_e({},co,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:bh}),J0=_t(X0),Z0=_e({},Oi,{propertyName:0,elapsedTime:0,pseudoElement:0}),eT=_t(Z0),tT=_e({},Tl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),nT=_t(tT),rT=[9,13,27,32],jh=fn&&"CompositionEvent"in window,Ts=null;fn&&"documentMode"in document&&(Ts=document.documentMode);var iT=fn&&"TextEvent"in window&&!Ts,Ey=fn&&(!jh||Ts&&8<Ts&&11>=Ts),Ip=" ",Sp=!1;function wy(t,e){switch(t){case"keyup":return rT.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ty(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Gr=!1;function sT(t,e){switch(t){case"compositionend":return Ty(e);case"keypress":return e.which!==32?null:(Sp=!0,Ip);case"textInput":return t=e.data,t===Ip&&Sp?null:t;default:return null}}function oT(t,e){if(Gr)return t==="compositionend"||!jh&&wy(t,e)?(t=vy(),ga=Fh=Mn=null,Gr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Ey&&e.locale!=="ko"?null:e.data;default:return null}}var aT={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ap(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!aT[t.type]:e==="textarea"}function Iy(t,e,n,r){ey(r),e=za(e,"onChange"),0<e.length&&(n=new Uh("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var Is=null,js=null;function lT(t){xy(t,0)}function Il(t){var e=Xr(t);if(Kg(e))return t}function uT(t,e){if(t==="change")return e}var Sy=!1;if(fn){var Ou;if(fn){var xu="oninput"in document;if(!xu){var Rp=document.createElement("div");Rp.setAttribute("oninput","return;"),xu=typeof Rp.oninput=="function"}Ou=xu}else Ou=!1;Sy=Ou&&(!document.documentMode||9<document.documentMode)}function Pp(){Is&&(Is.detachEvent("onpropertychange",Ay),js=Is=null)}function Ay(t){if(t.propertyName==="value"&&Il(js)){var e=[];Iy(e,js,t,Vh(t)),iy(lT,e)}}function cT(t,e,n){t==="focusin"?(Pp(),Is=e,js=n,Is.attachEvent("onpropertychange",Ay)):t==="focusout"&&Pp()}function hT(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Il(js)}function dT(t,e){if(t==="click")return Il(e)}function fT(t,e){if(t==="input"||t==="change")return Il(e)}function pT(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Mt=typeof Object.is=="function"?Object.is:pT;function zs(t,e){if(Mt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!lc.call(e,i)||!Mt(t[i],e[i]))return!1}return!0}function Cp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function kp(t,e){var n=Cp(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Cp(n)}}function Ry(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Ry(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Py(){for(var t=window,e=xa();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=xa(t.document)}return e}function zh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function mT(t){var e=Py(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Ry(n.ownerDocument.documentElement,n)){if(r!==null&&zh(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=kp(n,s);var o=kp(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var gT=fn&&"documentMode"in document&&11>=document.documentMode,Qr=null,Pc=null,Ss=null,Cc=!1;function Np(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Cc||Qr==null||Qr!==xa(r)||(r=Qr,"selectionStart"in r&&zh(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ss&&zs(Ss,r)||(Ss=r,r=za(Pc,"onSelect"),0<r.length&&(e=new Uh("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=Qr)))}function Jo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Yr={animationend:Jo("Animation","AnimationEnd"),animationiteration:Jo("Animation","AnimationIteration"),animationstart:Jo("Animation","AnimationStart"),transitionend:Jo("Transition","TransitionEnd")},Lu={},Cy={};fn&&(Cy=document.createElement("div").style,"AnimationEvent"in window||(delete Yr.animationend.animation,delete Yr.animationiteration.animation,delete Yr.animationstart.animation),"TransitionEvent"in window||delete Yr.transitionend.transition);function Sl(t){if(Lu[t])return Lu[t];if(!Yr[t])return t;var e=Yr[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Cy)return Lu[t]=e[n];return t}var ky=Sl("animationend"),Ny=Sl("animationiteration"),Dy=Sl("animationstart"),Vy=Sl("transitionend"),Oy=new Map,Dp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ir(t,e){Oy.set(t,e),Or(e,[t])}for(var Mu=0;Mu<Dp.length;Mu++){var Fu=Dp[Mu],yT=Fu.toLowerCase(),_T=Fu[0].toUpperCase()+Fu.slice(1);ir(yT,"on"+_T)}ir(ky,"onAnimationEnd");ir(Ny,"onAnimationIteration");ir(Dy,"onAnimationStart");ir("dblclick","onDoubleClick");ir("focusin","onFocus");ir("focusout","onBlur");ir(Vy,"onTransitionEnd");mi("onMouseEnter",["mouseout","mouseover"]);mi("onMouseLeave",["mouseout","mouseover"]);mi("onPointerEnter",["pointerout","pointerover"]);mi("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ps="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vT=new Set("cancel close invalid load scroll toggle".split(" ").concat(ps));function Vp(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,y0(r,e,void 0,t),t.currentTarget=null}function xy(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;Vp(i,l,h),s=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,h=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;Vp(i,l,h),s=u}}}if(Ma)throw t=Ic,Ma=!1,Ic=null,t}function he(t,e){var n=e[Oc];n===void 0&&(n=e[Oc]=new Set);var r=t+"__bubble";n.has(r)||(Ly(e,t,2,!1),n.add(r))}function Uu(t,e,n){var r=0;e&&(r|=4),Ly(n,t,r,e)}var Zo="_reactListening"+Math.random().toString(36).slice(2);function Bs(t){if(!t[Zo]){t[Zo]=!0,Bg.forEach(function(n){n!=="selectionchange"&&(vT.has(n)||Uu(n,!1,t),Uu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Zo]||(e[Zo]=!0,Uu("selectionchange",!1,e))}}function Ly(t,e,n,r){switch(_y(e)){case 1:var i=O0;break;case 4:i=x0;break;default:i=Mh}n=i.bind(null,e,n,t),i=void 0,!Tc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function bu(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;l!==null;){if(o=gr(l),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}l=l.parentNode}}r=r.return}iy(function(){var h=s,f=Vh(n),g=[];e:{var y=Oy.get(t);if(y!==void 0){var R=Uh,N=t;switch(t){case"keypress":if(ya(n)===0)break e;case"keydown":case"keyup":R=Q0;break;case"focusin":N="focus",R=Vu;break;case"focusout":N="blur",R=Vu;break;case"beforeblur":case"afterblur":R=Vu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":R=Ep;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":R=F0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":R=J0;break;case ky:case Ny:case Dy:R=j0;break;case Vy:R=eT;break;case"scroll":R=L0;break;case"wheel":R=nT;break;case"copy":case"cut":case"paste":R=B0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":R=Tp}var k=(e&4)!==0,O=!k&&t==="scroll",I=k?y!==null?y+"Capture":null:y;k=[];for(var E=h,S;E!==null;){S=E;var V=S.stateNode;if(S.tag===5&&V!==null&&(S=V,I!==null&&(V=Ms(E,I),V!=null&&k.push($s(E,V,S)))),O)break;E=E.return}0<k.length&&(y=new R(y,N,null,n,f),g.push({event:y,listeners:k}))}}if(!(e&7)){e:{if(y=t==="mouseover"||t==="pointerover",R=t==="mouseout"||t==="pointerout",y&&n!==Ec&&(N=n.relatedTarget||n.fromElement)&&(gr(N)||N[pn]))break e;if((R||y)&&(y=f.window===f?f:(y=f.ownerDocument)?y.defaultView||y.parentWindow:window,R?(N=n.relatedTarget||n.toElement,R=h,N=N?gr(N):null,N!==null&&(O=xr(N),N!==O||N.tag!==5&&N.tag!==6)&&(N=null)):(R=null,N=h),R!==N)){if(k=Ep,V="onMouseLeave",I="onMouseEnter",E="mouse",(t==="pointerout"||t==="pointerover")&&(k=Tp,V="onPointerLeave",I="onPointerEnter",E="pointer"),O=R==null?y:Xr(R),S=N==null?y:Xr(N),y=new k(V,E+"leave",R,n,f),y.target=O,y.relatedTarget=S,V=null,gr(f)===h&&(k=new k(I,E+"enter",N,n,f),k.target=S,k.relatedTarget=O,V=k),O=V,R&&N)t:{for(k=R,I=N,E=0,S=k;S;S=Br(S))E++;for(S=0,V=I;V;V=Br(V))S++;for(;0<E-S;)k=Br(k),E--;for(;0<S-E;)I=Br(I),S--;for(;E--;){if(k===I||I!==null&&k===I.alternate)break t;k=Br(k),I=Br(I)}k=null}else k=null;R!==null&&Op(g,y,R,k,!1),N!==null&&O!==null&&Op(g,O,N,k,!0)}}e:{if(y=h?Xr(h):window,R=y.nodeName&&y.nodeName.toLowerCase(),R==="select"||R==="input"&&y.type==="file")var b=uT;else if(Ap(y))if(Sy)b=fT;else{b=hT;var U=cT}else(R=y.nodeName)&&R.toLowerCase()==="input"&&(y.type==="checkbox"||y.type==="radio")&&(b=dT);if(b&&(b=b(t,h))){Iy(g,b,n,f);break e}U&&U(t,y,h),t==="focusout"&&(U=y._wrapperState)&&U.controlled&&y.type==="number"&&mc(y,"number",y.value)}switch(U=h?Xr(h):window,t){case"focusin":(Ap(U)||U.contentEditable==="true")&&(Qr=U,Pc=h,Ss=null);break;case"focusout":Ss=Pc=Qr=null;break;case"mousedown":Cc=!0;break;case"contextmenu":case"mouseup":case"dragend":Cc=!1,Np(g,n,f);break;case"selectionchange":if(gT)break;case"keydown":case"keyup":Np(g,n,f)}var v;if(jh)e:{switch(t){case"compositionstart":var m="onCompositionStart";break e;case"compositionend":m="onCompositionEnd";break e;case"compositionupdate":m="onCompositionUpdate";break e}m=void 0}else Gr?wy(t,n)&&(m="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(m="onCompositionStart");m&&(Ey&&n.locale!=="ko"&&(Gr||m!=="onCompositionStart"?m==="onCompositionEnd"&&Gr&&(v=vy()):(Mn=f,Fh="value"in Mn?Mn.value:Mn.textContent,Gr=!0)),U=za(h,m),0<U.length&&(m=new wp(m,t,null,n,f),g.push({event:m,listeners:U}),v?m.data=v:(v=Ty(n),v!==null&&(m.data=v)))),(v=iT?sT(t,n):oT(t,n))&&(h=za(h,"onBeforeInput"),0<h.length&&(f=new wp("onBeforeInput","beforeinput",null,n,f),g.push({event:f,listeners:h}),f.data=v))}xy(g,e)})}function $s(t,e,n){return{instance:t,listener:e,currentTarget:n}}function za(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Ms(t,n),s!=null&&r.unshift($s(t,s,i)),s=Ms(t,e),s!=null&&r.push($s(t,s,i))),t=t.return}return r}function Br(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Op(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,i?(u=Ms(n,s),u!=null&&o.unshift($s(n,u,l))):i||(u=Ms(n,s),u!=null&&o.push($s(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var ET=/\r\n?/g,wT=/\u0000|\uFFFD/g;function xp(t){return(typeof t=="string"?t:""+t).replace(ET,`
`).replace(wT,"")}function ea(t,e,n){if(e=xp(e),xp(t)!==e&&n)throw Error(M(425))}function Ba(){}var kc=null,Nc=null;function Dc(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Vc=typeof setTimeout=="function"?setTimeout:void 0,TT=typeof clearTimeout=="function"?clearTimeout:void 0,Lp=typeof Promise=="function"?Promise:void 0,IT=typeof queueMicrotask=="function"?queueMicrotask:typeof Lp<"u"?function(t){return Lp.resolve(null).then(t).catch(ST)}:Vc;function ST(t){setTimeout(function(){throw t})}function ju(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),bs(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);bs(e)}function Bn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Mp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var xi=Math.random().toString(36).slice(2),jt="__reactFiber$"+xi,Ws="__reactProps$"+xi,pn="__reactContainer$"+xi,Oc="__reactEvents$"+xi,AT="__reactListeners$"+xi,RT="__reactHandles$"+xi;function gr(t){var e=t[jt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[pn]||n[jt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Mp(t);t!==null;){if(n=t[jt])return n;t=Mp(t)}return e}t=n,n=t.parentNode}return null}function ho(t){return t=t[jt]||t[pn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Xr(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(M(33))}function Al(t){return t[Ws]||null}var xc=[],Jr=-1;function sr(t){return{current:t}}function de(t){0>Jr||(t.current=xc[Jr],xc[Jr]=null,Jr--)}function ue(t,e){Jr++,xc[Jr]=t.current,t.current=e}var er={},Xe=sr(er),at=sr(!1),Ir=er;function gi(t,e){var n=t.type.contextTypes;if(!n)return er;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function lt(t){return t=t.childContextTypes,t!=null}function $a(){de(at),de(Xe)}function Fp(t,e,n){if(Xe.current!==er)throw Error(M(168));ue(Xe,e),ue(at,n)}function My(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(M(108,c0(t)||"Unknown",i));return _e({},n,r)}function Wa(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||er,Ir=Xe.current,ue(Xe,t),ue(at,at.current),!0}function Up(t,e,n){var r=t.stateNode;if(!r)throw Error(M(169));n?(t=My(t,e,Ir),r.__reactInternalMemoizedMergedChildContext=t,de(at),de(Xe),ue(Xe,t)):de(at),ue(at,n)}var sn=null,Rl=!1,zu=!1;function Fy(t){sn===null?sn=[t]:sn.push(t)}function PT(t){Rl=!0,Fy(t)}function or(){if(!zu&&sn!==null){zu=!0;var t=0,e=se;try{var n=sn;for(se=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}sn=null,Rl=!1}catch(i){throw sn!==null&&(sn=sn.slice(t+1)),ly(Oh,or),i}finally{se=e,zu=!1}}return null}var Zr=[],ei=0,Ha=null,qa=0,Et=[],wt=0,Sr=null,on=1,an="";function fr(t,e){Zr[ei++]=qa,Zr[ei++]=Ha,Ha=t,qa=e}function Uy(t,e,n){Et[wt++]=on,Et[wt++]=an,Et[wt++]=Sr,Sr=t;var r=on;t=an;var i=32-xt(r)-1;r&=~(1<<i),n+=1;var s=32-xt(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,on=1<<32-xt(e)+i|n<<i|r,an=s+t}else on=1<<s|n<<i|r,an=t}function Bh(t){t.return!==null&&(fr(t,1),Uy(t,1,0))}function $h(t){for(;t===Ha;)Ha=Zr[--ei],Zr[ei]=null,qa=Zr[--ei],Zr[ei]=null;for(;t===Sr;)Sr=Et[--wt],Et[wt]=null,an=Et[--wt],Et[wt]=null,on=Et[--wt],Et[wt]=null}var pt=null,ft=null,fe=!1,Vt=null;function by(t,e){var n=It(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function bp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,pt=t,ft=Bn(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,pt=t,ft=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Sr!==null?{id:on,overflow:an}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=It(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,pt=t,ft=null,!0):!1;default:return!1}}function Lc(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Mc(t){if(fe){var e=ft;if(e){var n=e;if(!bp(t,e)){if(Lc(t))throw Error(M(418));e=Bn(n.nextSibling);var r=pt;e&&bp(t,e)?by(r,n):(t.flags=t.flags&-4097|2,fe=!1,pt=t)}}else{if(Lc(t))throw Error(M(418));t.flags=t.flags&-4097|2,fe=!1,pt=t}}}function jp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;pt=t}function ta(t){if(t!==pt)return!1;if(!fe)return jp(t),fe=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Dc(t.type,t.memoizedProps)),e&&(e=ft)){if(Lc(t))throw jy(),Error(M(418));for(;e;)by(t,e),e=Bn(e.nextSibling)}if(jp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(M(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){ft=Bn(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}ft=null}}else ft=pt?Bn(t.stateNode.nextSibling):null;return!0}function jy(){for(var t=ft;t;)t=Bn(t.nextSibling)}function yi(){ft=pt=null,fe=!1}function Wh(t){Vt===null?Vt=[t]:Vt.push(t)}var CT=wn.ReactCurrentBatchConfig;function as(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(M(309));var r=n.stateNode}if(!r)throw Error(M(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=i.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(M(284));if(!n._owner)throw Error(M(290,t))}return t}function na(t,e){throw t=Object.prototype.toString.call(e),Error(M(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function zp(t){var e=t._init;return e(t._payload)}function zy(t){function e(I,E){if(t){var S=I.deletions;S===null?(I.deletions=[E],I.flags|=16):S.push(E)}}function n(I,E){if(!t)return null;for(;E!==null;)e(I,E),E=E.sibling;return null}function r(I,E){for(I=new Map;E!==null;)E.key!==null?I.set(E.key,E):I.set(E.index,E),E=E.sibling;return I}function i(I,E){return I=qn(I,E),I.index=0,I.sibling=null,I}function s(I,E,S){return I.index=S,t?(S=I.alternate,S!==null?(S=S.index,S<E?(I.flags|=2,E):S):(I.flags|=2,E)):(I.flags|=1048576,E)}function o(I){return t&&I.alternate===null&&(I.flags|=2),I}function l(I,E,S,V){return E===null||E.tag!==6?(E=Gu(S,I.mode,V),E.return=I,E):(E=i(E,S),E.return=I,E)}function u(I,E,S,V){var b=S.type;return b===Kr?f(I,E,S.props.children,V,S.key):E!==null&&(E.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Cn&&zp(b)===E.type)?(V=i(E,S.props),V.ref=as(I,E,S),V.return=I,V):(V=Sa(S.type,S.key,S.props,null,I.mode,V),V.ref=as(I,E,S),V.return=I,V)}function h(I,E,S,V){return E===null||E.tag!==4||E.stateNode.containerInfo!==S.containerInfo||E.stateNode.implementation!==S.implementation?(E=Qu(S,I.mode,V),E.return=I,E):(E=i(E,S.children||[]),E.return=I,E)}function f(I,E,S,V,b){return E===null||E.tag!==7?(E=wr(S,I.mode,V,b),E.return=I,E):(E=i(E,S),E.return=I,E)}function g(I,E,S){if(typeof E=="string"&&E!==""||typeof E=="number")return E=Gu(""+E,I.mode,S),E.return=I,E;if(typeof E=="object"&&E!==null){switch(E.$$typeof){case Ho:return S=Sa(E.type,E.key,E.props,null,I.mode,S),S.ref=as(I,null,E),S.return=I,S;case qr:return E=Qu(E,I.mode,S),E.return=I,E;case Cn:var V=E._init;return g(I,V(E._payload),S)}if(ds(E)||ns(E))return E=wr(E,I.mode,S,null),E.return=I,E;na(I,E)}return null}function y(I,E,S,V){var b=E!==null?E.key:null;if(typeof S=="string"&&S!==""||typeof S=="number")return b!==null?null:l(I,E,""+S,V);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Ho:return S.key===b?u(I,E,S,V):null;case qr:return S.key===b?h(I,E,S,V):null;case Cn:return b=S._init,y(I,E,b(S._payload),V)}if(ds(S)||ns(S))return b!==null?null:f(I,E,S,V,null);na(I,S)}return null}function R(I,E,S,V,b){if(typeof V=="string"&&V!==""||typeof V=="number")return I=I.get(S)||null,l(E,I,""+V,b);if(typeof V=="object"&&V!==null){switch(V.$$typeof){case Ho:return I=I.get(V.key===null?S:V.key)||null,u(E,I,V,b);case qr:return I=I.get(V.key===null?S:V.key)||null,h(E,I,V,b);case Cn:var U=V._init;return R(I,E,S,U(V._payload),b)}if(ds(V)||ns(V))return I=I.get(S)||null,f(E,I,V,b,null);na(E,V)}return null}function N(I,E,S,V){for(var b=null,U=null,v=E,m=E=0,_=null;v!==null&&m<S.length;m++){v.index>m?(_=v,v=null):_=v.sibling;var w=y(I,v,S[m],V);if(w===null){v===null&&(v=_);break}t&&v&&w.alternate===null&&e(I,v),E=s(w,E,m),U===null?b=w:U.sibling=w,U=w,v=_}if(m===S.length)return n(I,v),fe&&fr(I,m),b;if(v===null){for(;m<S.length;m++)v=g(I,S[m],V),v!==null&&(E=s(v,E,m),U===null?b=v:U.sibling=v,U=v);return fe&&fr(I,m),b}for(v=r(I,v);m<S.length;m++)_=R(v,I,m,S[m],V),_!==null&&(t&&_.alternate!==null&&v.delete(_.key===null?m:_.key),E=s(_,E,m),U===null?b=_:U.sibling=_,U=_);return t&&v.forEach(function(A){return e(I,A)}),fe&&fr(I,m),b}function k(I,E,S,V){var b=ns(S);if(typeof b!="function")throw Error(M(150));if(S=b.call(S),S==null)throw Error(M(151));for(var U=b=null,v=E,m=E=0,_=null,w=S.next();v!==null&&!w.done;m++,w=S.next()){v.index>m?(_=v,v=null):_=v.sibling;var A=y(I,v,w.value,V);if(A===null){v===null&&(v=_);break}t&&v&&A.alternate===null&&e(I,v),E=s(A,E,m),U===null?b=A:U.sibling=A,U=A,v=_}if(w.done)return n(I,v),fe&&fr(I,m),b;if(v===null){for(;!w.done;m++,w=S.next())w=g(I,w.value,V),w!==null&&(E=s(w,E,m),U===null?b=w:U.sibling=w,U=w);return fe&&fr(I,m),b}for(v=r(I,v);!w.done;m++,w=S.next())w=R(v,I,m,w.value,V),w!==null&&(t&&w.alternate!==null&&v.delete(w.key===null?m:w.key),E=s(w,E,m),U===null?b=w:U.sibling=w,U=w);return t&&v.forEach(function(C){return e(I,C)}),fe&&fr(I,m),b}function O(I,E,S,V){if(typeof S=="object"&&S!==null&&S.type===Kr&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case Ho:e:{for(var b=S.key,U=E;U!==null;){if(U.key===b){if(b=S.type,b===Kr){if(U.tag===7){n(I,U.sibling),E=i(U,S.props.children),E.return=I,I=E;break e}}else if(U.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Cn&&zp(b)===U.type){n(I,U.sibling),E=i(U,S.props),E.ref=as(I,U,S),E.return=I,I=E;break e}n(I,U);break}else e(I,U);U=U.sibling}S.type===Kr?(E=wr(S.props.children,I.mode,V,S.key),E.return=I,I=E):(V=Sa(S.type,S.key,S.props,null,I.mode,V),V.ref=as(I,E,S),V.return=I,I=V)}return o(I);case qr:e:{for(U=S.key;E!==null;){if(E.key===U)if(E.tag===4&&E.stateNode.containerInfo===S.containerInfo&&E.stateNode.implementation===S.implementation){n(I,E.sibling),E=i(E,S.children||[]),E.return=I,I=E;break e}else{n(I,E);break}else e(I,E);E=E.sibling}E=Qu(S,I.mode,V),E.return=I,I=E}return o(I);case Cn:return U=S._init,O(I,E,U(S._payload),V)}if(ds(S))return N(I,E,S,V);if(ns(S))return k(I,E,S,V);na(I,S)}return typeof S=="string"&&S!==""||typeof S=="number"?(S=""+S,E!==null&&E.tag===6?(n(I,E.sibling),E=i(E,S),E.return=I,I=E):(n(I,E),E=Gu(S,I.mode,V),E.return=I,I=E),o(I)):n(I,E)}return O}var _i=zy(!0),By=zy(!1),Ka=sr(null),Ga=null,ti=null,Hh=null;function qh(){Hh=ti=Ga=null}function Kh(t){var e=Ka.current;de(Ka),t._currentValue=e}function Fc(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function ui(t,e){Ga=t,Hh=ti=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(ot=!0),t.firstContext=null)}function Rt(t){var e=t._currentValue;if(Hh!==t)if(t={context:t,memoizedValue:e,next:null},ti===null){if(Ga===null)throw Error(M(308));ti=t,Ga.dependencies={lanes:0,firstContext:t}}else ti=ti.next=t;return e}var yr=null;function Gh(t){yr===null?yr=[t]:yr.push(t)}function $y(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Gh(e)):(n.next=i.next,i.next=n),e.interleaved=n,mn(t,r)}function mn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var kn=!1;function Qh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Wy(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function dn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function $n(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,ne&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,mn(t,n)}return i=r.interleaved,i===null?(e.next=e,Gh(r)):(e.next=i.next,i.next=e),r.interleaved=e,mn(t,n)}function _a(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,xh(t,n)}}function Bp(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Qa(t,e,n,r){var i=t.updateQueue;kn=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,h=u.next;u.next=null,o===null?s=h:o.next=h,o=u;var f=t.alternate;f!==null&&(f=f.updateQueue,l=f.lastBaseUpdate,l!==o&&(l===null?f.firstBaseUpdate=h:l.next=h,f.lastBaseUpdate=u))}if(s!==null){var g=i.baseState;o=0,f=h=u=null,l=s;do{var y=l.lane,R=l.eventTime;if((r&y)===y){f!==null&&(f=f.next={eventTime:R,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var N=t,k=l;switch(y=e,R=n,k.tag){case 1:if(N=k.payload,typeof N=="function"){g=N.call(R,g,y);break e}g=N;break e;case 3:N.flags=N.flags&-65537|128;case 0:if(N=k.payload,y=typeof N=="function"?N.call(R,g,y):N,y==null)break e;g=_e({},g,y);break e;case 2:kn=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,y=i.effects,y===null?i.effects=[l]:y.push(l))}else R={eventTime:R,lane:y,tag:l.tag,payload:l.payload,callback:l.callback,next:null},f===null?(h=f=R,u=g):f=f.next=R,o|=y;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;y=l,l=y.next,y.next=null,i.lastBaseUpdate=y,i.shared.pending=null}}while(!0);if(f===null&&(u=g),i.baseState=u,i.firstBaseUpdate=h,i.lastBaseUpdate=f,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Rr|=o,t.lanes=o,t.memoizedState=g}}function $p(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(M(191,i));i.call(r)}}}var fo={},Bt=sr(fo),Hs=sr(fo),qs=sr(fo);function _r(t){if(t===fo)throw Error(M(174));return t}function Yh(t,e){switch(ue(qs,e),ue(Hs,t),ue(Bt,fo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:yc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=yc(e,t)}de(Bt),ue(Bt,e)}function vi(){de(Bt),de(Hs),de(qs)}function Hy(t){_r(qs.current);var e=_r(Bt.current),n=yc(e,t.type);e!==n&&(ue(Hs,t),ue(Bt,n))}function Xh(t){Hs.current===t&&(de(Bt),de(Hs))}var ge=sr(0);function Ya(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Bu=[];function Jh(){for(var t=0;t<Bu.length;t++)Bu[t]._workInProgressVersionPrimary=null;Bu.length=0}var va=wn.ReactCurrentDispatcher,$u=wn.ReactCurrentBatchConfig,Ar=0,ye=null,Pe=null,Ve=null,Xa=!1,As=!1,Ks=0,kT=0;function He(){throw Error(M(321))}function Zh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Mt(t[n],e[n]))return!1;return!0}function ed(t,e,n,r,i,s){if(Ar=s,ye=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,va.current=t===null||t.memoizedState===null?OT:xT,t=n(r,i),As){s=0;do{if(As=!1,Ks=0,25<=s)throw Error(M(301));s+=1,Ve=Pe=null,e.updateQueue=null,va.current=LT,t=n(r,i)}while(As)}if(va.current=Ja,e=Pe!==null&&Pe.next!==null,Ar=0,Ve=Pe=ye=null,Xa=!1,e)throw Error(M(300));return t}function td(){var t=Ks!==0;return Ks=0,t}function bt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ve===null?ye.memoizedState=Ve=t:Ve=Ve.next=t,Ve}function Pt(){if(Pe===null){var t=ye.alternate;t=t!==null?t.memoizedState:null}else t=Pe.next;var e=Ve===null?ye.memoizedState:Ve.next;if(e!==null)Ve=e,Pe=t;else{if(t===null)throw Error(M(310));Pe=t,t={memoizedState:Pe.memoizedState,baseState:Pe.baseState,baseQueue:Pe.baseQueue,queue:Pe.queue,next:null},Ve===null?ye.memoizedState=Ve=t:Ve=Ve.next=t}return Ve}function Gs(t,e){return typeof e=="function"?e(t):e}function Wu(t){var e=Pt(),n=e.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=t;var r=Pe,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=o=null,u=null,h=s;do{var f=h.lane;if((Ar&f)===f)u!==null&&(u=u.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),r=h.hasEagerState?h.eagerState:t(r,h.action);else{var g={lane:f,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};u===null?(l=u=g,o=r):u=u.next=g,ye.lanes|=f,Rr|=f}h=h.next}while(h!==null&&h!==s);u===null?o=r:u.next=l,Mt(r,e.memoizedState)||(ot=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,ye.lanes|=s,Rr|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Hu(t){var e=Pt(),n=e.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);Mt(s,e.memoizedState)||(ot=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function qy(){}function Ky(t,e){var n=ye,r=Pt(),i=e(),s=!Mt(r.memoizedState,i);if(s&&(r.memoizedState=i,ot=!0),r=r.queue,nd(Yy.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||Ve!==null&&Ve.memoizedState.tag&1){if(n.flags|=2048,Qs(9,Qy.bind(null,n,r,i,e),void 0,null),Oe===null)throw Error(M(349));Ar&30||Gy(n,e,i)}return i}function Gy(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=ye.updateQueue,e===null?(e={lastEffect:null,stores:null},ye.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Qy(t,e,n,r){e.value=n,e.getSnapshot=r,Xy(e)&&Jy(t)}function Yy(t,e,n){return n(function(){Xy(e)&&Jy(t)})}function Xy(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Mt(t,n)}catch{return!0}}function Jy(t){var e=mn(t,1);e!==null&&Lt(e,t,1,-1)}function Wp(t){var e=bt();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Gs,lastRenderedState:t},e.queue=t,t=t.dispatch=VT.bind(null,ye,t),[e.memoizedState,t]}function Qs(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=ye.updateQueue,e===null?(e={lastEffect:null,stores:null},ye.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function Zy(){return Pt().memoizedState}function Ea(t,e,n,r){var i=bt();ye.flags|=t,i.memoizedState=Qs(1|e,n,void 0,r===void 0?null:r)}function Pl(t,e,n,r){var i=Pt();r=r===void 0?null:r;var s=void 0;if(Pe!==null){var o=Pe.memoizedState;if(s=o.destroy,r!==null&&Zh(r,o.deps)){i.memoizedState=Qs(e,n,s,r);return}}ye.flags|=t,i.memoizedState=Qs(1|e,n,s,r)}function Hp(t,e){return Ea(8390656,8,t,e)}function nd(t,e){return Pl(2048,8,t,e)}function e_(t,e){return Pl(4,2,t,e)}function t_(t,e){return Pl(4,4,t,e)}function n_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function r_(t,e,n){return n=n!=null?n.concat([t]):null,Pl(4,4,n_.bind(null,e,t),n)}function rd(){}function i_(t,e){var n=Pt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Zh(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function s_(t,e){var n=Pt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Zh(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function o_(t,e,n){return Ar&21?(Mt(n,e)||(n=hy(),ye.lanes|=n,Rr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,ot=!0),t.memoizedState=n)}function NT(t,e){var n=se;se=n!==0&&4>n?n:4,t(!0);var r=$u.transition;$u.transition={};try{t(!1),e()}finally{se=n,$u.transition=r}}function a_(){return Pt().memoizedState}function DT(t,e,n){var r=Hn(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},l_(t))u_(e,n);else if(n=$y(t,e,n,r),n!==null){var i=nt();Lt(n,t,r,i),c_(n,e,r)}}function VT(t,e,n){var r=Hn(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(l_(t))u_(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(i.hasEagerState=!0,i.eagerState=l,Mt(l,o)){var u=e.interleaved;u===null?(i.next=i,Gh(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=$y(t,e,i,r),n!==null&&(i=nt(),Lt(n,t,r,i),c_(n,e,r))}}function l_(t){var e=t.alternate;return t===ye||e!==null&&e===ye}function u_(t,e){As=Xa=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function c_(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,xh(t,n)}}var Ja={readContext:Rt,useCallback:He,useContext:He,useEffect:He,useImperativeHandle:He,useInsertionEffect:He,useLayoutEffect:He,useMemo:He,useReducer:He,useRef:He,useState:He,useDebugValue:He,useDeferredValue:He,useTransition:He,useMutableSource:He,useSyncExternalStore:He,useId:He,unstable_isNewReconciler:!1},OT={readContext:Rt,useCallback:function(t,e){return bt().memoizedState=[t,e===void 0?null:e],t},useContext:Rt,useEffect:Hp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Ea(4194308,4,n_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Ea(4194308,4,t,e)},useInsertionEffect:function(t,e){return Ea(4,2,t,e)},useMemo:function(t,e){var n=bt();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=bt();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=DT.bind(null,ye,t),[r.memoizedState,t]},useRef:function(t){var e=bt();return t={current:t},e.memoizedState=t},useState:Wp,useDebugValue:rd,useDeferredValue:function(t){return bt().memoizedState=t},useTransition:function(){var t=Wp(!1),e=t[0];return t=NT.bind(null,t[1]),bt().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=ye,i=bt();if(fe){if(n===void 0)throw Error(M(407));n=n()}else{if(n=e(),Oe===null)throw Error(M(349));Ar&30||Gy(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,Hp(Yy.bind(null,r,s,t),[t]),r.flags|=2048,Qs(9,Qy.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=bt(),e=Oe.identifierPrefix;if(fe){var n=an,r=on;n=(r&~(1<<32-xt(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ks++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=kT++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},xT={readContext:Rt,useCallback:i_,useContext:Rt,useEffect:nd,useImperativeHandle:r_,useInsertionEffect:e_,useLayoutEffect:t_,useMemo:s_,useReducer:Wu,useRef:Zy,useState:function(){return Wu(Gs)},useDebugValue:rd,useDeferredValue:function(t){var e=Pt();return o_(e,Pe.memoizedState,t)},useTransition:function(){var t=Wu(Gs)[0],e=Pt().memoizedState;return[t,e]},useMutableSource:qy,useSyncExternalStore:Ky,useId:a_,unstable_isNewReconciler:!1},LT={readContext:Rt,useCallback:i_,useContext:Rt,useEffect:nd,useImperativeHandle:r_,useInsertionEffect:e_,useLayoutEffect:t_,useMemo:s_,useReducer:Hu,useRef:Zy,useState:function(){return Hu(Gs)},useDebugValue:rd,useDeferredValue:function(t){var e=Pt();return Pe===null?e.memoizedState=t:o_(e,Pe.memoizedState,t)},useTransition:function(){var t=Hu(Gs)[0],e=Pt().memoizedState;return[t,e]},useMutableSource:qy,useSyncExternalStore:Ky,useId:a_,unstable_isNewReconciler:!1};function Nt(t,e){if(t&&t.defaultProps){e=_e({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Uc(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:_e({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Cl={isMounted:function(t){return(t=t._reactInternals)?xr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=nt(),i=Hn(t),s=dn(r,i);s.payload=e,n!=null&&(s.callback=n),e=$n(t,s,i),e!==null&&(Lt(e,t,i,r),_a(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=nt(),i=Hn(t),s=dn(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=$n(t,s,i),e!==null&&(Lt(e,t,i,r),_a(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=nt(),r=Hn(t),i=dn(n,r);i.tag=2,e!=null&&(i.callback=e),e=$n(t,i,r),e!==null&&(Lt(e,t,r,n),_a(e,t,r))}};function qp(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!zs(n,r)||!zs(i,s):!0}function h_(t,e,n){var r=!1,i=er,s=e.contextType;return typeof s=="object"&&s!==null?s=Rt(s):(i=lt(e)?Ir:Xe.current,r=e.contextTypes,s=(r=r!=null)?gi(t,i):er),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Cl,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Kp(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Cl.enqueueReplaceState(e,e.state,null)}function bc(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},Qh(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Rt(s):(s=lt(e)?Ir:Xe.current,i.context=gi(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Uc(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Cl.enqueueReplaceState(i,i.state,null),Qa(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Ei(t,e){try{var n="",r=e;do n+=u0(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function qu(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function jc(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var MT=typeof WeakMap=="function"?WeakMap:Map;function d_(t,e,n){n=dn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){el||(el=!0,Yc=r),jc(t,e)},n}function f_(t,e,n){n=dn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){jc(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){jc(t,e),typeof r!="function"&&(Wn===null?Wn=new Set([this]):Wn.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Gp(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new MT;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=YT.bind(null,t,e,n),e.then(t,t))}function Qp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Yp(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=dn(-1,1),e.tag=2,$n(n,e,1))),n.lanes|=1),t)}var FT=wn.ReactCurrentOwner,ot=!1;function tt(t,e,n,r){e.child=t===null?By(e,null,n,r):_i(e,t.child,n,r)}function Xp(t,e,n,r,i){n=n.render;var s=e.ref;return ui(e,i),r=ed(t,e,n,r,s,i),n=td(),t!==null&&!ot?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,gn(t,e,i)):(fe&&n&&Bh(e),e.flags|=1,tt(t,e,r,i),e.child)}function Jp(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!hd(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,p_(t,e,s,r,i)):(t=Sa(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:zs,n(o,r)&&t.ref===e.ref)return gn(t,e,i)}return e.flags|=1,t=qn(s,r),t.ref=e.ref,t.return=e,e.child=t}function p_(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(zs(s,r)&&t.ref===e.ref)if(ot=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(ot=!0);else return e.lanes=t.lanes,gn(t,e,i)}return zc(t,e,n,r,i)}function m_(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ue(ri,dt),dt|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ue(ri,dt),dt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,ue(ri,dt),dt|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,ue(ri,dt),dt|=r;return tt(t,e,i,n),e.child}function g_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function zc(t,e,n,r,i){var s=lt(n)?Ir:Xe.current;return s=gi(e,s),ui(e,i),n=ed(t,e,n,r,s,i),r=td(),t!==null&&!ot?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,gn(t,e,i)):(fe&&r&&Bh(e),e.flags|=1,tt(t,e,n,i),e.child)}function Zp(t,e,n,r,i){if(lt(n)){var s=!0;Wa(e)}else s=!1;if(ui(e,i),e.stateNode===null)wa(t,e),h_(e,n,r),bc(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,h=n.contextType;typeof h=="object"&&h!==null?h=Rt(h):(h=lt(n)?Ir:Xe.current,h=gi(e,h));var f=n.getDerivedStateFromProps,g=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";g||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==h)&&Kp(e,o,r,h),kn=!1;var y=e.memoizedState;o.state=y,Qa(e,r,o,i),u=e.memoizedState,l!==r||y!==u||at.current||kn?(typeof f=="function"&&(Uc(e,n,f,r),u=e.memoizedState),(l=kn||qp(e,n,l,r,y,u,h))?(g||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=h,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,Wy(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Nt(e.type,l),o.props=h,g=e.pendingProps,y=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Rt(u):(u=lt(n)?Ir:Xe.current,u=gi(e,u));var R=n.getDerivedStateFromProps;(f=typeof R=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==g||y!==u)&&Kp(e,o,r,u),kn=!1,y=e.memoizedState,o.state=y,Qa(e,r,o,i);var N=e.memoizedState;l!==g||y!==N||at.current||kn?(typeof R=="function"&&(Uc(e,n,R,r),N=e.memoizedState),(h=kn||qp(e,n,h,r,y,N,u)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,N,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,N,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=N),o.props=r,o.state=N,o.context=u,r=h):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=1024),r=!1)}return Bc(t,e,n,r,s,i)}function Bc(t,e,n,r,i,s){g_(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&Up(e,n,!1),gn(t,e,s);r=e.stateNode,FT.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=_i(e,t.child,null,s),e.child=_i(e,null,l,s)):tt(t,e,l,s),e.memoizedState=r.state,i&&Up(e,n,!0),e.child}function y_(t){var e=t.stateNode;e.pendingContext?Fp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Fp(t,e.context,!1),Yh(t,e.containerInfo)}function em(t,e,n,r,i){return yi(),Wh(i),e.flags|=256,tt(t,e,n,r),e.child}var $c={dehydrated:null,treeContext:null,retryLane:0};function Wc(t){return{baseLanes:t,cachePool:null,transitions:null}}function __(t,e,n){var r=e.pendingProps,i=ge.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),ue(ge,i&1),t===null)return Mc(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Dl(o,r,0,null),t=wr(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Wc(n),e.memoizedState=$c,t):id(e,o));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return UT(t,e,o,r,l,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,l=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=qn(i,u),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=qn(l,s):(s=wr(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?Wc(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=$c,r}return s=t.child,t=s.sibling,r=qn(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function id(t,e){return e=Dl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function ra(t,e,n,r){return r!==null&&Wh(r),_i(e,t.child,null,n),t=id(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function UT(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=qu(Error(M(422))),ra(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Dl({mode:"visible",children:r.children},i,0,null),s=wr(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&_i(e,t.child,null,o),e.child.memoizedState=Wc(o),e.memoizedState=$c,s);if(!(e.mode&1))return ra(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(M(419)),r=qu(s,r,void 0),ra(t,e,o,r)}if(l=(o&t.childLanes)!==0,ot||l){if(r=Oe,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,mn(t,i),Lt(r,t,i,-1))}return cd(),r=qu(Error(M(421))),ra(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=XT.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,ft=Bn(i.nextSibling),pt=e,fe=!0,Vt=null,t!==null&&(Et[wt++]=on,Et[wt++]=an,Et[wt++]=Sr,on=t.id,an=t.overflow,Sr=e),e=id(e,r.children),e.flags|=4096,e)}function tm(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),Fc(t.return,e,n)}function Ku(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function v_(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(tt(t,e,r.children,n),r=ge.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&tm(t,n,e);else if(t.tag===19)tm(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(ue(ge,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&Ya(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Ku(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Ya(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Ku(e,!0,n,null,s);break;case"together":Ku(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function wa(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function gn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Rr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(M(153));if(e.child!==null){for(t=e.child,n=qn(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=qn(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function bT(t,e,n){switch(e.tag){case 3:y_(e),yi();break;case 5:Hy(e);break;case 1:lt(e.type)&&Wa(e);break;case 4:Yh(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;ue(Ka,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(ue(ge,ge.current&1),e.flags|=128,null):n&e.child.childLanes?__(t,e,n):(ue(ge,ge.current&1),t=gn(t,e,n),t!==null?t.sibling:null);ue(ge,ge.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return v_(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),ue(ge,ge.current),r)break;return null;case 22:case 23:return e.lanes=0,m_(t,e,n)}return gn(t,e,n)}var E_,Hc,w_,T_;E_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Hc=function(){};w_=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,_r(Bt.current);var s=null;switch(n){case"input":i=fc(t,i),r=fc(t,r),s=[];break;case"select":i=_e({},i,{value:void 0}),r=_e({},r,{value:void 0}),s=[];break;case"textarea":i=gc(t,i),r=gc(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=Ba)}_c(n,r);var o;n=null;for(h in i)if(!r.hasOwnProperty(h)&&i.hasOwnProperty(h)&&i[h]!=null)if(h==="style"){var l=i[h];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(xs.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in r){var u=r[h];if(l=i!=null?i[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(xs.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&he("scroll",t),s||l===u||(s=[])):(s=s||[]).push(h,u))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}};T_=function(t,e,n,r){n!==r&&(e.flags|=4)};function ls(t,e){if(!fe)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function qe(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function jT(t,e,n){var r=e.pendingProps;switch($h(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return qe(e),null;case 1:return lt(e.type)&&$a(),qe(e),null;case 3:return r=e.stateNode,vi(),de(at),de(Xe),Jh(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(ta(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Vt!==null&&(Zc(Vt),Vt=null))),Hc(t,e),qe(e),null;case 5:Xh(e);var i=_r(qs.current);if(n=e.type,t!==null&&e.stateNode!=null)w_(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(M(166));return qe(e),null}if(t=_r(Bt.current),ta(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[jt]=e,r[Ws]=s,t=(e.mode&1)!==0,n){case"dialog":he("cancel",r),he("close",r);break;case"iframe":case"object":case"embed":he("load",r);break;case"video":case"audio":for(i=0;i<ps.length;i++)he(ps[i],r);break;case"source":he("error",r);break;case"img":case"image":case"link":he("error",r),he("load",r);break;case"details":he("toggle",r);break;case"input":cp(r,s),he("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},he("invalid",r);break;case"textarea":dp(r,s),he("invalid",r)}_c(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&ea(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&ea(r.textContent,l,t),i=["children",""+l]):xs.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&he("scroll",r)}switch(n){case"input":qo(r),hp(r,s,!0);break;case"textarea":qo(r),fp(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Ba)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Yg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[jt]=e,t[Ws]=r,E_(t,e,!1,!1),e.stateNode=t;e:{switch(o=vc(n,r),n){case"dialog":he("cancel",t),he("close",t),i=r;break;case"iframe":case"object":case"embed":he("load",t),i=r;break;case"video":case"audio":for(i=0;i<ps.length;i++)he(ps[i],t);i=r;break;case"source":he("error",t),i=r;break;case"img":case"image":case"link":he("error",t),he("load",t),i=r;break;case"details":he("toggle",t),i=r;break;case"input":cp(t,r),i=fc(t,r),he("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=_e({},r,{value:void 0}),he("invalid",t);break;case"textarea":dp(t,r),i=gc(t,r),he("invalid",t);break;default:i=r}_c(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?Zg(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Xg(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Ls(t,u):typeof u=="number"&&Ls(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(xs.hasOwnProperty(s)?u!=null&&s==="onScroll"&&he("scroll",t):u!=null&&Ch(t,s,u,o))}switch(n){case"input":qo(t),hp(t,r,!1);break;case"textarea":qo(t),fp(t);break;case"option":r.value!=null&&t.setAttribute("value",""+Zn(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?si(t,!!r.multiple,s,!1):r.defaultValue!=null&&si(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Ba)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return qe(e),null;case 6:if(t&&e.stateNode!=null)T_(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(M(166));if(n=_r(qs.current),_r(Bt.current),ta(e)){if(r=e.stateNode,n=e.memoizedProps,r[jt]=e,(s=r.nodeValue!==n)&&(t=pt,t!==null))switch(t.tag){case 3:ea(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ea(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[jt]=e,e.stateNode=r}return qe(e),null;case 13:if(de(ge),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(fe&&ft!==null&&e.mode&1&&!(e.flags&128))jy(),yi(),e.flags|=98560,s=!1;else if(s=ta(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(M(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(M(317));s[jt]=e}else yi(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;qe(e),s=!1}else Vt!==null&&(Zc(Vt),Vt=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||ge.current&1?ke===0&&(ke=3):cd())),e.updateQueue!==null&&(e.flags|=4),qe(e),null);case 4:return vi(),Hc(t,e),t===null&&Bs(e.stateNode.containerInfo),qe(e),null;case 10:return Kh(e.type._context),qe(e),null;case 17:return lt(e.type)&&$a(),qe(e),null;case 19:if(de(ge),s=e.memoizedState,s===null)return qe(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)ls(s,!1);else{if(ke!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Ya(t),o!==null){for(e.flags|=128,ls(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ue(ge,ge.current&1|2),e.child}t=t.sibling}s.tail!==null&&Se()>wi&&(e.flags|=128,r=!0,ls(s,!1),e.lanes=4194304)}else{if(!r)if(t=Ya(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ls(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!fe)return qe(e),null}else 2*Se()-s.renderingStartTime>wi&&n!==1073741824&&(e.flags|=128,r=!0,ls(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Se(),e.sibling=null,n=ge.current,ue(ge,r?n&1|2:n&1),e):(qe(e),null);case 22:case 23:return ud(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?dt&1073741824&&(qe(e),e.subtreeFlags&6&&(e.flags|=8192)):qe(e),null;case 24:return null;case 25:return null}throw Error(M(156,e.tag))}function zT(t,e){switch($h(e),e.tag){case 1:return lt(e.type)&&$a(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return vi(),de(at),de(Xe),Jh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Xh(e),null;case 13:if(de(ge),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(M(340));yi()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return de(ge),null;case 4:return vi(),null;case 10:return Kh(e.type._context),null;case 22:case 23:return ud(),null;case 24:return null;default:return null}}var ia=!1,Qe=!1,BT=typeof WeakSet=="function"?WeakSet:Set,z=null;function ni(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){we(t,e,r)}else n.current=null}function qc(t,e,n){try{n()}catch(r){we(t,e,r)}}var nm=!1;function $T(t,e){if(kc=ba,t=Py(),zh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,u=-1,h=0,f=0,g=t,y=null;t:for(;;){for(var R;g!==n||i!==0&&g.nodeType!==3||(l=o+i),g!==s||r!==0&&g.nodeType!==3||(u=o+r),g.nodeType===3&&(o+=g.nodeValue.length),(R=g.firstChild)!==null;)y=g,g=R;for(;;){if(g===t)break t;if(y===n&&++h===i&&(l=o),y===s&&++f===r&&(u=o),(R=g.nextSibling)!==null)break;g=y,y=g.parentNode}g=R}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(Nc={focusedElem:t,selectionRange:n},ba=!1,z=e;z!==null;)if(e=z,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,z=t;else for(;z!==null;){e=z;try{var N=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(N!==null){var k=N.memoizedProps,O=N.memoizedState,I=e.stateNode,E=I.getSnapshotBeforeUpdate(e.elementType===e.type?k:Nt(e.type,k),O);I.__reactInternalSnapshotBeforeUpdate=E}break;case 3:var S=e.stateNode.containerInfo;S.nodeType===1?S.textContent="":S.nodeType===9&&S.documentElement&&S.removeChild(S.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(M(163))}}catch(V){we(e,e.return,V)}if(t=e.sibling,t!==null){t.return=e.return,z=t;break}z=e.return}return N=nm,nm=!1,N}function Rs(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&qc(e,n,s)}i=i.next}while(i!==r)}}function kl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function Kc(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function I_(t){var e=t.alternate;e!==null&&(t.alternate=null,I_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[jt],delete e[Ws],delete e[Oc],delete e[AT],delete e[RT])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function S_(t){return t.tag===5||t.tag===3||t.tag===4}function rm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||S_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Gc(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Ba));else if(r!==4&&(t=t.child,t!==null))for(Gc(t,e,n),t=t.sibling;t!==null;)Gc(t,e,n),t=t.sibling}function Qc(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(Qc(t,e,n),t=t.sibling;t!==null;)Qc(t,e,n),t=t.sibling}var Le=null,Dt=!1;function Rn(t,e,n){for(n=n.child;n!==null;)A_(t,e,n),n=n.sibling}function A_(t,e,n){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(wl,n)}catch{}switch(n.tag){case 5:Qe||ni(n,e);case 6:var r=Le,i=Dt;Le=null,Rn(t,e,n),Le=r,Dt=i,Le!==null&&(Dt?(t=Le,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Le.removeChild(n.stateNode));break;case 18:Le!==null&&(Dt?(t=Le,n=n.stateNode,t.nodeType===8?ju(t.parentNode,n):t.nodeType===1&&ju(t,n),bs(t)):ju(Le,n.stateNode));break;case 4:r=Le,i=Dt,Le=n.stateNode.containerInfo,Dt=!0,Rn(t,e,n),Le=r,Dt=i;break;case 0:case 11:case 14:case 15:if(!Qe&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&qc(n,e,o),i=i.next}while(i!==r)}Rn(t,e,n);break;case 1:if(!Qe&&(ni(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){we(n,e,l)}Rn(t,e,n);break;case 21:Rn(t,e,n);break;case 22:n.mode&1?(Qe=(r=Qe)||n.memoizedState!==null,Rn(t,e,n),Qe=r):Rn(t,e,n);break;default:Rn(t,e,n)}}function im(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new BT),e.forEach(function(r){var i=JT.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function kt(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Le=l.stateNode,Dt=!1;break e;case 3:Le=l.stateNode.containerInfo,Dt=!0;break e;case 4:Le=l.stateNode.containerInfo,Dt=!0;break e}l=l.return}if(Le===null)throw Error(M(160));A_(s,o,i),Le=null,Dt=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(h){we(i,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)R_(e,t),e=e.sibling}function R_(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(kt(e,t),Ut(t),r&4){try{Rs(3,t,t.return),kl(3,t)}catch(k){we(t,t.return,k)}try{Rs(5,t,t.return)}catch(k){we(t,t.return,k)}}break;case 1:kt(e,t),Ut(t),r&512&&n!==null&&ni(n,n.return);break;case 5:if(kt(e,t),Ut(t),r&512&&n!==null&&ni(n,n.return),t.flags&32){var i=t.stateNode;try{Ls(i,"")}catch(k){we(t,t.return,k)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Gg(i,s),vc(l,o);var h=vc(l,s);for(o=0;o<u.length;o+=2){var f=u[o],g=u[o+1];f==="style"?Zg(i,g):f==="dangerouslySetInnerHTML"?Xg(i,g):f==="children"?Ls(i,g):Ch(i,f,g,h)}switch(l){case"input":pc(i,s);break;case"textarea":Qg(i,s);break;case"select":var y=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var R=s.value;R!=null?si(i,!!s.multiple,R,!1):y!==!!s.multiple&&(s.defaultValue!=null?si(i,!!s.multiple,s.defaultValue,!0):si(i,!!s.multiple,s.multiple?[]:"",!1))}i[Ws]=s}catch(k){we(t,t.return,k)}}break;case 6:if(kt(e,t),Ut(t),r&4){if(t.stateNode===null)throw Error(M(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(k){we(t,t.return,k)}}break;case 3:if(kt(e,t),Ut(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{bs(e.containerInfo)}catch(k){we(t,t.return,k)}break;case 4:kt(e,t),Ut(t);break;case 13:kt(e,t),Ut(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(ad=Se())),r&4&&im(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(Qe=(h=Qe)||f,kt(e,t),Qe=h):kt(e,t),Ut(t),r&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!f&&t.mode&1)for(z=t,f=t.child;f!==null;){for(g=z=f;z!==null;){switch(y=z,R=y.child,y.tag){case 0:case 11:case 14:case 15:Rs(4,y,y.return);break;case 1:ni(y,y.return);var N=y.stateNode;if(typeof N.componentWillUnmount=="function"){r=y,n=y.return;try{e=r,N.props=e.memoizedProps,N.state=e.memoizedState,N.componentWillUnmount()}catch(k){we(r,n,k)}}break;case 5:ni(y,y.return);break;case 22:if(y.memoizedState!==null){om(g);continue}}R!==null?(R.return=y,z=R):om(g)}f=f.sibling}e:for(f=null,g=t;;){if(g.tag===5){if(f===null){f=g;try{i=g.stateNode,h?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=g.stateNode,u=g.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=Jg("display",o))}catch(k){we(t,t.return,k)}}}else if(g.tag===6){if(f===null)try{g.stateNode.nodeValue=h?"":g.memoizedProps}catch(k){we(t,t.return,k)}}else if((g.tag!==22&&g.tag!==23||g.memoizedState===null||g===t)&&g.child!==null){g.child.return=g,g=g.child;continue}if(g===t)break e;for(;g.sibling===null;){if(g.return===null||g.return===t)break e;f===g&&(f=null),g=g.return}f===g&&(f=null),g.sibling.return=g.return,g=g.sibling}}break;case 19:kt(e,t),Ut(t),r&4&&im(t);break;case 21:break;default:kt(e,t),Ut(t)}}function Ut(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(S_(n)){var r=n;break e}n=n.return}throw Error(M(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Ls(i,""),r.flags&=-33);var s=rm(t);Qc(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,l=rm(t);Gc(t,l,o);break;default:throw Error(M(161))}}catch(u){we(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function WT(t,e,n){z=t,P_(t)}function P_(t,e,n){for(var r=(t.mode&1)!==0;z!==null;){var i=z,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||ia;if(!o){var l=i.alternate,u=l!==null&&l.memoizedState!==null||Qe;l=ia;var h=Qe;if(ia=o,(Qe=u)&&!h)for(z=i;z!==null;)o=z,u=o.child,o.tag===22&&o.memoizedState!==null?am(i):u!==null?(u.return=o,z=u):am(i);for(;s!==null;)z=s,P_(s),s=s.sibling;z=i,ia=l,Qe=h}sm(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,z=s):sm(t)}}function sm(t){for(;z!==null;){var e=z;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Qe||kl(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!Qe)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:Nt(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&$p(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}$p(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var f=h.memoizedState;if(f!==null){var g=f.dehydrated;g!==null&&bs(g)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(M(163))}Qe||e.flags&512&&Kc(e)}catch(y){we(e,e.return,y)}}if(e===t){z=null;break}if(n=e.sibling,n!==null){n.return=e.return,z=n;break}z=e.return}}function om(t){for(;z!==null;){var e=z;if(e===t){z=null;break}var n=e.sibling;if(n!==null){n.return=e.return,z=n;break}z=e.return}}function am(t){for(;z!==null;){var e=z;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{kl(4,e)}catch(u){we(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){we(e,i,u)}}var s=e.return;try{Kc(e)}catch(u){we(e,s,u)}break;case 5:var o=e.return;try{Kc(e)}catch(u){we(e,o,u)}}}catch(u){we(e,e.return,u)}if(e===t){z=null;break}var l=e.sibling;if(l!==null){l.return=e.return,z=l;break}z=e.return}}var HT=Math.ceil,Za=wn.ReactCurrentDispatcher,sd=wn.ReactCurrentOwner,St=wn.ReactCurrentBatchConfig,ne=0,Oe=null,Re=null,Ue=0,dt=0,ri=sr(0),ke=0,Ys=null,Rr=0,Nl=0,od=0,Ps=null,st=null,ad=0,wi=1/0,rn=null,el=!1,Yc=null,Wn=null,sa=!1,Fn=null,tl=0,Cs=0,Xc=null,Ta=-1,Ia=0;function nt(){return ne&6?Se():Ta!==-1?Ta:Ta=Se()}function Hn(t){return t.mode&1?ne&2&&Ue!==0?Ue&-Ue:CT.transition!==null?(Ia===0&&(Ia=hy()),Ia):(t=se,t!==0||(t=window.event,t=t===void 0?16:_y(t.type)),t):1}function Lt(t,e,n,r){if(50<Cs)throw Cs=0,Xc=null,Error(M(185));uo(t,n,r),(!(ne&2)||t!==Oe)&&(t===Oe&&(!(ne&2)&&(Nl|=n),ke===4&&Dn(t,Ue)),ut(t,r),n===1&&ne===0&&!(e.mode&1)&&(wi=Se()+500,Rl&&or()))}function ut(t,e){var n=t.callbackNode;C0(t,e);var r=Ua(t,t===Oe?Ue:0);if(r===0)n!==null&&gp(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&gp(n),e===1)t.tag===0?PT(lm.bind(null,t)):Fy(lm.bind(null,t)),IT(function(){!(ne&6)&&or()}),n=null;else{switch(dy(r)){case 1:n=Oh;break;case 4:n=uy;break;case 16:n=Fa;break;case 536870912:n=cy;break;default:n=Fa}n=L_(n,C_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function C_(t,e){if(Ta=-1,Ia=0,ne&6)throw Error(M(327));var n=t.callbackNode;if(ci()&&t.callbackNode!==n)return null;var r=Ua(t,t===Oe?Ue:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=nl(t,r);else{e=r;var i=ne;ne|=2;var s=N_();(Oe!==t||Ue!==e)&&(rn=null,wi=Se()+500,Er(t,e));do try{GT();break}catch(l){k_(t,l)}while(!0);qh(),Za.current=s,ne=i,Re!==null?e=0:(Oe=null,Ue=0,e=ke)}if(e!==0){if(e===2&&(i=Sc(t),i!==0&&(r=i,e=Jc(t,i))),e===1)throw n=Ys,Er(t,0),Dn(t,r),ut(t,Se()),n;if(e===6)Dn(t,r);else{if(i=t.current.alternate,!(r&30)&&!qT(i)&&(e=nl(t,r),e===2&&(s=Sc(t),s!==0&&(r=s,e=Jc(t,s))),e===1))throw n=Ys,Er(t,0),Dn(t,r),ut(t,Se()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(M(345));case 2:pr(t,st,rn);break;case 3:if(Dn(t,r),(r&130023424)===r&&(e=ad+500-Se(),10<e)){if(Ua(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){nt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Vc(pr.bind(null,t,st,rn),e);break}pr(t,st,rn);break;case 4:if(Dn(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-xt(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=Se()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*HT(r/1960))-r,10<r){t.timeoutHandle=Vc(pr.bind(null,t,st,rn),r);break}pr(t,st,rn);break;case 5:pr(t,st,rn);break;default:throw Error(M(329))}}}return ut(t,Se()),t.callbackNode===n?C_.bind(null,t):null}function Jc(t,e){var n=Ps;return t.current.memoizedState.isDehydrated&&(Er(t,e).flags|=256),t=nl(t,e),t!==2&&(e=st,st=n,e!==null&&Zc(e)),t}function Zc(t){st===null?st=t:st.push.apply(st,t)}function qT(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!Mt(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Dn(t,e){for(e&=~od,e&=~Nl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-xt(e),r=1<<n;t[n]=-1,e&=~r}}function lm(t){if(ne&6)throw Error(M(327));ci();var e=Ua(t,0);if(!(e&1))return ut(t,Se()),null;var n=nl(t,e);if(t.tag!==0&&n===2){var r=Sc(t);r!==0&&(e=r,n=Jc(t,r))}if(n===1)throw n=Ys,Er(t,0),Dn(t,e),ut(t,Se()),n;if(n===6)throw Error(M(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,pr(t,st,rn),ut(t,Se()),null}function ld(t,e){var n=ne;ne|=1;try{return t(e)}finally{ne=n,ne===0&&(wi=Se()+500,Rl&&or())}}function Pr(t){Fn!==null&&Fn.tag===0&&!(ne&6)&&ci();var e=ne;ne|=1;var n=St.transition,r=se;try{if(St.transition=null,se=1,t)return t()}finally{se=r,St.transition=n,ne=e,!(ne&6)&&or()}}function ud(){dt=ri.current,de(ri)}function Er(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,TT(n)),Re!==null)for(n=Re.return;n!==null;){var r=n;switch($h(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&$a();break;case 3:vi(),de(at),de(Xe),Jh();break;case 5:Xh(r);break;case 4:vi();break;case 13:de(ge);break;case 19:de(ge);break;case 10:Kh(r.type._context);break;case 22:case 23:ud()}n=n.return}if(Oe=t,Re=t=qn(t.current,null),Ue=dt=e,ke=0,Ys=null,od=Nl=Rr=0,st=Ps=null,yr!==null){for(e=0;e<yr.length;e++)if(n=yr[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}yr=null}return t}function k_(t,e){do{var n=Re;try{if(qh(),va.current=Ja,Xa){for(var r=ye.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Xa=!1}if(Ar=0,Ve=Pe=ye=null,As=!1,Ks=0,sd.current=null,n===null||n.return===null){ke=1,Ys=e,Re=null;break}e:{var s=t,o=n.return,l=n,u=e;if(e=Ue,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u,f=l,g=f.tag;if(!(f.mode&1)&&(g===0||g===11||g===15)){var y=f.alternate;y?(f.updateQueue=y.updateQueue,f.memoizedState=y.memoizedState,f.lanes=y.lanes):(f.updateQueue=null,f.memoizedState=null)}var R=Qp(o);if(R!==null){R.flags&=-257,Yp(R,o,l,s,e),R.mode&1&&Gp(s,h,e),e=R,u=h;var N=e.updateQueue;if(N===null){var k=new Set;k.add(u),e.updateQueue=k}else N.add(u);break e}else{if(!(e&1)){Gp(s,h,e),cd();break e}u=Error(M(426))}}else if(fe&&l.mode&1){var O=Qp(o);if(O!==null){!(O.flags&65536)&&(O.flags|=256),Yp(O,o,l,s,e),Wh(Ei(u,l));break e}}s=u=Ei(u,l),ke!==4&&(ke=2),Ps===null?Ps=[s]:Ps.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var I=d_(s,u,e);Bp(s,I);break e;case 1:l=u;var E=s.type,S=s.stateNode;if(!(s.flags&128)&&(typeof E.getDerivedStateFromError=="function"||S!==null&&typeof S.componentDidCatch=="function"&&(Wn===null||!Wn.has(S)))){s.flags|=65536,e&=-e,s.lanes|=e;var V=f_(s,l,e);Bp(s,V);break e}}s=s.return}while(s!==null)}V_(n)}catch(b){e=b,Re===n&&n!==null&&(Re=n=n.return);continue}break}while(!0)}function N_(){var t=Za.current;return Za.current=Ja,t===null?Ja:t}function cd(){(ke===0||ke===3||ke===2)&&(ke=4),Oe===null||!(Rr&268435455)&&!(Nl&268435455)||Dn(Oe,Ue)}function nl(t,e){var n=ne;ne|=2;var r=N_();(Oe!==t||Ue!==e)&&(rn=null,Er(t,e));do try{KT();break}catch(i){k_(t,i)}while(!0);if(qh(),ne=n,Za.current=r,Re!==null)throw Error(M(261));return Oe=null,Ue=0,ke}function KT(){for(;Re!==null;)D_(Re)}function GT(){for(;Re!==null&&!v0();)D_(Re)}function D_(t){var e=x_(t.alternate,t,dt);t.memoizedProps=t.pendingProps,e===null?V_(t):Re=e,sd.current=null}function V_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=zT(n,e),n!==null){n.flags&=32767,Re=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{ke=6,Re=null;return}}else if(n=jT(n,e,dt),n!==null){Re=n;return}if(e=e.sibling,e!==null){Re=e;return}Re=e=t}while(e!==null);ke===0&&(ke=5)}function pr(t,e,n){var r=se,i=St.transition;try{St.transition=null,se=1,QT(t,e,n,r)}finally{St.transition=i,se=r}return null}function QT(t,e,n,r){do ci();while(Fn!==null);if(ne&6)throw Error(M(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(M(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(k0(t,s),t===Oe&&(Re=Oe=null,Ue=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||sa||(sa=!0,L_(Fa,function(){return ci(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=St.transition,St.transition=null;var o=se;se=1;var l=ne;ne|=4,sd.current=null,$T(t,n),R_(n,t),mT(Nc),ba=!!kc,Nc=kc=null,t.current=n,WT(n),E0(),ne=l,se=o,St.transition=s}else t.current=n;if(sa&&(sa=!1,Fn=t,tl=i),s=t.pendingLanes,s===0&&(Wn=null),I0(n.stateNode),ut(t,Se()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(el)throw el=!1,t=Yc,Yc=null,t;return tl&1&&t.tag!==0&&ci(),s=t.pendingLanes,s&1?t===Xc?Cs++:(Cs=0,Xc=t):Cs=0,or(),null}function ci(){if(Fn!==null){var t=dy(tl),e=St.transition,n=se;try{if(St.transition=null,se=16>t?16:t,Fn===null)var r=!1;else{if(t=Fn,Fn=null,tl=0,ne&6)throw Error(M(331));var i=ne;for(ne|=4,z=t.current;z!==null;){var s=z,o=s.child;if(z.flags&16){var l=s.deletions;if(l!==null){for(var u=0;u<l.length;u++){var h=l[u];for(z=h;z!==null;){var f=z;switch(f.tag){case 0:case 11:case 15:Rs(8,f,s)}var g=f.child;if(g!==null)g.return=f,z=g;else for(;z!==null;){f=z;var y=f.sibling,R=f.return;if(I_(f),f===h){z=null;break}if(y!==null){y.return=R,z=y;break}z=R}}}var N=s.alternate;if(N!==null){var k=N.child;if(k!==null){N.child=null;do{var O=k.sibling;k.sibling=null,k=O}while(k!==null)}}z=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,z=o;else e:for(;z!==null;){if(s=z,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Rs(9,s,s.return)}var I=s.sibling;if(I!==null){I.return=s.return,z=I;break e}z=s.return}}var E=t.current;for(z=E;z!==null;){o=z;var S=o.child;if(o.subtreeFlags&2064&&S!==null)S.return=o,z=S;else e:for(o=E;z!==null;){if(l=z,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:kl(9,l)}}catch(b){we(l,l.return,b)}if(l===o){z=null;break e}var V=l.sibling;if(V!==null){V.return=l.return,z=V;break e}z=l.return}}if(ne=i,or(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(wl,t)}catch{}r=!0}return r}finally{se=n,St.transition=e}}return!1}function um(t,e,n){e=Ei(n,e),e=d_(t,e,1),t=$n(t,e,1),e=nt(),t!==null&&(uo(t,1,e),ut(t,e))}function we(t,e,n){if(t.tag===3)um(t,t,n);else for(;e!==null;){if(e.tag===3){um(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Wn===null||!Wn.has(r))){t=Ei(n,t),t=f_(e,t,1),e=$n(e,t,1),t=nt(),e!==null&&(uo(e,1,t),ut(e,t));break}}e=e.return}}function YT(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=nt(),t.pingedLanes|=t.suspendedLanes&n,Oe===t&&(Ue&n)===n&&(ke===4||ke===3&&(Ue&130023424)===Ue&&500>Se()-ad?Er(t,0):od|=n),ut(t,e)}function O_(t,e){e===0&&(t.mode&1?(e=Qo,Qo<<=1,!(Qo&130023424)&&(Qo=4194304)):e=1);var n=nt();t=mn(t,e),t!==null&&(uo(t,e,n),ut(t,n))}function XT(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),O_(t,n)}function JT(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(M(314))}r!==null&&r.delete(e),O_(t,n)}var x_;x_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||at.current)ot=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return ot=!1,bT(t,e,n);ot=!!(t.flags&131072)}else ot=!1,fe&&e.flags&1048576&&Uy(e,qa,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;wa(t,e),t=e.pendingProps;var i=gi(e,Xe.current);ui(e,n),i=ed(null,e,r,t,i,n);var s=td();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,lt(r)?(s=!0,Wa(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Qh(e),i.updater=Cl,e.stateNode=i,i._reactInternals=e,bc(e,r,t,n),e=Bc(null,e,r,!0,s,n)):(e.tag=0,fe&&s&&Bh(e),tt(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(wa(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=eI(r),t=Nt(r,t),i){case 0:e=zc(null,e,r,t,n);break e;case 1:e=Zp(null,e,r,t,n);break e;case 11:e=Xp(null,e,r,t,n);break e;case 14:e=Jp(null,e,r,Nt(r.type,t),n);break e}throw Error(M(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),zc(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),Zp(t,e,r,i,n);case 3:e:{if(y_(e),t===null)throw Error(M(387));r=e.pendingProps,s=e.memoizedState,i=s.element,Wy(t,e),Qa(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=Ei(Error(M(423)),e),e=em(t,e,r,n,i);break e}else if(r!==i){i=Ei(Error(M(424)),e),e=em(t,e,r,n,i);break e}else for(ft=Bn(e.stateNode.containerInfo.firstChild),pt=e,fe=!0,Vt=null,n=By(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(yi(),r===i){e=gn(t,e,n);break e}tt(t,e,r,n)}e=e.child}return e;case 5:return Hy(e),t===null&&Mc(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,Dc(r,i)?o=null:s!==null&&Dc(r,s)&&(e.flags|=32),g_(t,e),tt(t,e,o,n),e.child;case 6:return t===null&&Mc(e),null;case 13:return __(t,e,n);case 4:return Yh(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=_i(e,null,r,n):tt(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),Xp(t,e,r,i,n);case 7:return tt(t,e,e.pendingProps,n),e.child;case 8:return tt(t,e,e.pendingProps.children,n),e.child;case 12:return tt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,ue(Ka,r._currentValue),r._currentValue=o,s!==null)if(Mt(s.value,o)){if(s.children===i.children&&!at.current){e=gn(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=dn(-1,n&-n),u.tag=2;var h=s.updateQueue;if(h!==null){h=h.shared;var f=h.pending;f===null?u.next=u:(u.next=f.next,f.next=u),h.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),Fc(s.return,n,e),l.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(M(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Fc(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}tt(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,ui(e,n),i=Rt(i),r=r(i),e.flags|=1,tt(t,e,r,n),e.child;case 14:return r=e.type,i=Nt(r,e.pendingProps),i=Nt(r.type,i),Jp(t,e,r,i,n);case 15:return p_(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),wa(t,e),e.tag=1,lt(r)?(t=!0,Wa(e)):t=!1,ui(e,n),h_(e,r,i),bc(e,r,i,n),Bc(null,e,r,!0,t,n);case 19:return v_(t,e,n);case 22:return m_(t,e,n)}throw Error(M(156,e.tag))};function L_(t,e){return ly(t,e)}function ZT(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function It(t,e,n,r){return new ZT(t,e,n,r)}function hd(t){return t=t.prototype,!(!t||!t.isReactComponent)}function eI(t){if(typeof t=="function")return hd(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Nh)return 11;if(t===Dh)return 14}return 2}function qn(t,e){var n=t.alternate;return n===null?(n=It(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Sa(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")hd(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Kr:return wr(n.children,i,s,e);case kh:o=8,i|=8;break;case uc:return t=It(12,n,e,i|2),t.elementType=uc,t.lanes=s,t;case cc:return t=It(13,n,e,i),t.elementType=cc,t.lanes=s,t;case hc:return t=It(19,n,e,i),t.elementType=hc,t.lanes=s,t;case Hg:return Dl(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case $g:o=10;break e;case Wg:o=9;break e;case Nh:o=11;break e;case Dh:o=14;break e;case Cn:o=16,r=null;break e}throw Error(M(130,t==null?t:typeof t,""))}return e=It(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function wr(t,e,n,r){return t=It(7,t,r,e),t.lanes=n,t}function Dl(t,e,n,r){return t=It(22,t,r,e),t.elementType=Hg,t.lanes=n,t.stateNode={isHidden:!1},t}function Gu(t,e,n){return t=It(6,t,null,e),t.lanes=n,t}function Qu(t,e,n){return e=It(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function tI(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ku(0),this.expirationTimes=ku(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ku(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function dd(t,e,n,r,i,s,o,l,u){return t=new tI(t,e,n,l,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=It(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Qh(s),t}function nI(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:qr,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function M_(t){if(!t)return er;t=t._reactInternals;e:{if(xr(t)!==t||t.tag!==1)throw Error(M(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(lt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(M(171))}if(t.tag===1){var n=t.type;if(lt(n))return My(t,n,e)}return e}function F_(t,e,n,r,i,s,o,l,u){return t=dd(n,r,!0,t,i,s,o,l,u),t.context=M_(null),n=t.current,r=nt(),i=Hn(n),s=dn(r,i),s.callback=e??null,$n(n,s,i),t.current.lanes=i,uo(t,i,r),ut(t,r),t}function Vl(t,e,n,r){var i=e.current,s=nt(),o=Hn(i);return n=M_(n),e.context===null?e.context=n:e.pendingContext=n,e=dn(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=$n(i,e,o),t!==null&&(Lt(t,i,o,s),_a(t,i,o)),o}function rl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function cm(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function fd(t,e){cm(t,e),(t=t.alternate)&&cm(t,e)}function rI(){return null}var U_=typeof reportError=="function"?reportError:function(t){console.error(t)};function pd(t){this._internalRoot=t}Ol.prototype.render=pd.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(M(409));Vl(t,e,null,null)};Ol.prototype.unmount=pd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Pr(function(){Vl(null,t,null,null)}),e[pn]=null}};function Ol(t){this._internalRoot=t}Ol.prototype.unstable_scheduleHydration=function(t){if(t){var e=my();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Nn.length&&e!==0&&e<Nn[n].priority;n++);Nn.splice(n,0,t),n===0&&yy(t)}};function md(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function xl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function hm(){}function iI(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var h=rl(o);s.call(h)}}var o=F_(e,r,t,0,null,!1,!1,"",hm);return t._reactRootContainer=o,t[pn]=o.current,Bs(t.nodeType===8?t.parentNode:t),Pr(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var h=rl(u);l.call(h)}}var u=dd(t,0,!1,null,null,!1,!1,"",hm);return t._reactRootContainer=u,t[pn]=u.current,Bs(t.nodeType===8?t.parentNode:t),Pr(function(){Vl(e,u,n,r)}),u}function Ll(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var l=i;i=function(){var u=rl(o);l.call(u)}}Vl(e,o,t,i)}else o=iI(n,e,t,i,r);return rl(o)}fy=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=fs(e.pendingLanes);n!==0&&(xh(e,n|1),ut(e,Se()),!(ne&6)&&(wi=Se()+500,or()))}break;case 13:Pr(function(){var r=mn(t,1);if(r!==null){var i=nt();Lt(r,t,1,i)}}),fd(t,1)}};Lh=function(t){if(t.tag===13){var e=mn(t,134217728);if(e!==null){var n=nt();Lt(e,t,134217728,n)}fd(t,134217728)}};py=function(t){if(t.tag===13){var e=Hn(t),n=mn(t,e);if(n!==null){var r=nt();Lt(n,t,e,r)}fd(t,e)}};my=function(){return se};gy=function(t,e){var n=se;try{return se=t,e()}finally{se=n}};wc=function(t,e,n){switch(e){case"input":if(pc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=Al(r);if(!i)throw Error(M(90));Kg(r),pc(r,i)}}}break;case"textarea":Qg(t,n);break;case"select":e=n.value,e!=null&&si(t,!!n.multiple,e,!1)}};ny=ld;ry=Pr;var sI={usingClientEntryPoint:!1,Events:[ho,Xr,Al,ey,ty,ld]},us={findFiberByHostInstance:gr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},oI={bundleType:us.bundleType,version:us.version,rendererPackageName:us.rendererPackageName,rendererConfig:us.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:wn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=oy(t),t===null?null:t.stateNode},findFiberByHostInstance:us.findFiberByHostInstance||rI,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var oa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!oa.isDisabled&&oa.supportsFiber)try{wl=oa.inject(oI),zt=oa}catch{}}yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sI;yt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!md(e))throw Error(M(200));return nI(t,e,null,n)};yt.createRoot=function(t,e){if(!md(t))throw Error(M(299));var n=!1,r="",i=U_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=dd(t,1,!1,null,null,n,!1,r,i),t[pn]=e.current,Bs(t.nodeType===8?t.parentNode:t),new pd(e)};yt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(M(188)):(t=Object.keys(t).join(","),Error(M(268,t)));return t=oy(e),t=t===null?null:t.stateNode,t};yt.flushSync=function(t){return Pr(t)};yt.hydrate=function(t,e,n){if(!xl(e))throw Error(M(200));return Ll(null,t,e,!0,n)};yt.hydrateRoot=function(t,e,n){if(!md(t))throw Error(M(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=U_;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=F_(e,null,t,1,n??null,i,!1,s,o),t[pn]=e.current,Bs(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Ol(e)};yt.render=function(t,e,n){if(!xl(e))throw Error(M(200));return Ll(null,t,e,!1,n)};yt.unmountComponentAtNode=function(t){if(!xl(t))throw Error(M(40));return t._reactRootContainer?(Pr(function(){Ll(null,null,t,!1,function(){t._reactRootContainer=null,t[pn]=null})}),!0):!1};yt.unstable_batchedUpdates=ld;yt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!xl(n))throw Error(M(200));if(t==null||t._reactInternals===void 0)throw Error(M(38));return Ll(t,e,n,!1,r)};yt.version="18.3.1-next-f1338f8080-20240426";function b_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(b_)}catch(t){console.error(t)}}b_(),bg.exports=yt;var aI=bg.exports,dm=aI;ac.createRoot=dm.createRoot,ac.hydrateRoot=dm.hydrateRoot;var fm={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j_=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},lI=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},z_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,u=i+2<t.length,h=u?t[i+2]:0,f=s>>2,g=(s&3)<<4|l>>4;let y=(l&15)<<2|h>>6,R=h&63;u||(R=64,o||(y=64)),r.push(n[f],n[g],n[y],n[R])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(j_(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):lI(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const h=i<t.length?n[t.charAt(i)]:64;++i;const g=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||h==null||g==null)throw new uI;const y=s<<2|l>>4;if(r.push(y),h!==64){const R=l<<4&240|h>>2;if(r.push(R),g!==64){const N=h<<6&192|g;r.push(N)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class uI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const cI=function(t){const e=j_(t);return z_.encodeByteArray(e,!0)},il=function(t){return cI(t).replace(/\./g,"")},B_=function(t){try{return z_.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hI(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dI=()=>hI().__FIREBASE_DEFAULTS__,fI=()=>{if(typeof process>"u"||typeof fm>"u")return;const t=fm.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},pI=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&B_(t[1]);return e&&JSON.parse(e)},Ml=()=>{try{return dI()||fI()||pI()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},$_=t=>{var e,n;return(n=(e=Ml())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},mI=t=>{const e=$_(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},W_=()=>{var t;return(t=Ml())===null||t===void 0?void 0:t.config},H_=t=>{var e;return(e=Ml())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gI{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yI(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[il(JSON.stringify(n)),il(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Je(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function _I(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Je())}function vI(){var t;const e=(t=Ml())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function EI(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function wI(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function TI(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function II(){const t=Je();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function SI(){return!vI()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function AI(){try{return typeof indexedDB=="object"}catch{return!1}}function RI(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PI="FirebaseError";class Tn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=PI,Object.setPrototypeOf(this,Tn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,po.prototype.create)}}class po{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?CI(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new Tn(i,l,r)}}function CI(t,e){return t.replace(kI,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const kI=/\{\$([^}]+)}/g;function NI(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function sl(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(pm(s)&&pm(o)){if(!sl(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function pm(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mo(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ms(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function gs(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function DI(t,e){const n=new VI(t,e);return n.subscribe.bind(n)}class VI{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");OI(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Yu),i.error===void 0&&(i.error=Yu),i.complete===void 0&&(i.complete=Yu);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function OI(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Yu(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gt(t){return t&&t._delegate?t._delegate:t}class Cr{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xI{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new gI;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(MI(e))try{this.getOrInitializeService({instanceIdentifier:mr})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=mr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=mr){return this.instances.has(e)}getOptions(e=mr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:LI(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=mr){return this.component?this.component.multipleInstances?e:mr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function LI(t){return t===mr?void 0:t}function MI(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FI{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new xI(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ee;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ee||(ee={}));const UI={debug:ee.DEBUG,verbose:ee.VERBOSE,info:ee.INFO,warn:ee.WARN,error:ee.ERROR,silent:ee.SILENT},bI=ee.INFO,jI={[ee.DEBUG]:"log",[ee.VERBOSE]:"log",[ee.INFO]:"info",[ee.WARN]:"warn",[ee.ERROR]:"error"},zI=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=jI[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class gd{constructor(e){this.name=e,this._logLevel=bI,this._logHandler=zI,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ee))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?UI[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ee.DEBUG,...e),this._logHandler(this,ee.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ee.VERBOSE,...e),this._logHandler(this,ee.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ee.INFO,...e),this._logHandler(this,ee.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ee.WARN,...e),this._logHandler(this,ee.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ee.ERROR,...e),this._logHandler(this,ee.ERROR,...e)}}const BI=(t,e)=>e.some(n=>t instanceof n);let mm,gm;function $I(){return mm||(mm=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function WI(){return gm||(gm=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const q_=new WeakMap,eh=new WeakMap,K_=new WeakMap,Xu=new WeakMap,yd=new WeakMap;function HI(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(Kn(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&q_.set(n,t)}).catch(()=>{}),yd.set(e,t),e}function qI(t){if(eh.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});eh.set(t,e)}let th={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return eh.get(t);if(e==="objectStoreNames")return t.objectStoreNames||K_.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Kn(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function KI(t){th=t(th)}function GI(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Ju(this),e,...n);return K_.set(r,e.sort?e.sort():[e]),Kn(r)}:WI().includes(t)?function(...e){return t.apply(Ju(this),e),Kn(q_.get(this))}:function(...e){return Kn(t.apply(Ju(this),e))}}function QI(t){return typeof t=="function"?GI(t):(t instanceof IDBTransaction&&qI(t),BI(t,$I())?new Proxy(t,th):t)}function Kn(t){if(t instanceof IDBRequest)return HI(t);if(Xu.has(t))return Xu.get(t);const e=QI(t);return e!==t&&(Xu.set(t,e),yd.set(e,t)),e}const Ju=t=>yd.get(t);function YI(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=Kn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(Kn(o.result),u.oldVersion,u.newVersion,Kn(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const XI=["get","getKey","getAll","getAllKeys","count"],JI=["put","add","delete","clear"],Zu=new Map;function ym(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Zu.get(e))return Zu.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=JI.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||XI.includes(n)))return;const s=async function(o,...l){const u=this.transaction(o,i?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),i&&u.done]))[0]};return Zu.set(e,s),s}KI(t=>({...t,get:(e,n,r)=>ym(e,n)||t.get(e,n,r),has:(e,n)=>!!ym(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZI{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(eS(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function eS(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const nh="@firebase/app",_m="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yn=new gd("@firebase/app"),tS="@firebase/app-compat",nS="@firebase/analytics-compat",rS="@firebase/analytics",iS="@firebase/app-check-compat",sS="@firebase/app-check",oS="@firebase/auth",aS="@firebase/auth-compat",lS="@firebase/database",uS="@firebase/data-connect",cS="@firebase/database-compat",hS="@firebase/functions",dS="@firebase/functions-compat",fS="@firebase/installations",pS="@firebase/installations-compat",mS="@firebase/messaging",gS="@firebase/messaging-compat",yS="@firebase/performance",_S="@firebase/performance-compat",vS="@firebase/remote-config",ES="@firebase/remote-config-compat",wS="@firebase/storage",TS="@firebase/storage-compat",IS="@firebase/firestore",SS="@firebase/vertexai-preview",AS="@firebase/firestore-compat",RS="firebase",PS="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rh="[DEFAULT]",CS={[nh]:"fire-core",[tS]:"fire-core-compat",[rS]:"fire-analytics",[nS]:"fire-analytics-compat",[sS]:"fire-app-check",[iS]:"fire-app-check-compat",[oS]:"fire-auth",[aS]:"fire-auth-compat",[lS]:"fire-rtdb",[uS]:"fire-data-connect",[cS]:"fire-rtdb-compat",[hS]:"fire-fn",[dS]:"fire-fn-compat",[fS]:"fire-iid",[pS]:"fire-iid-compat",[mS]:"fire-fcm",[gS]:"fire-fcm-compat",[yS]:"fire-perf",[_S]:"fire-perf-compat",[vS]:"fire-rc",[ES]:"fire-rc-compat",[wS]:"fire-gcs",[TS]:"fire-gcs-compat",[IS]:"fire-fst",[AS]:"fire-fst-compat",[SS]:"fire-vertex","fire-js":"fire-js",[RS]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xs=new Map,kS=new Map,ih=new Map;function vm(t,e){try{t.container.addComponent(e)}catch(n){yn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ti(t){const e=t.name;if(ih.has(e))return yn.debug(`There were multiple attempts to register component ${e}.`),!1;ih.set(e,t);for(const n of Xs.values())vm(n,t);for(const n of kS.values())vm(n,t);return!0}function _d(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ln(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NS={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Gn=new po("app","Firebase",NS);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DS{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Cr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Gn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Li=PS;function G_(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:rh,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Gn.create("bad-app-name",{appName:String(i)});if(n||(n=W_()),!n)throw Gn.create("no-options");const s=Xs.get(i);if(s){if(sl(n,s.options)&&sl(r,s.config))return s;throw Gn.create("duplicate-app",{appName:i})}const o=new FI(i);for(const u of ih.values())o.addComponent(u);const l=new DS(n,r,o);return Xs.set(i,l),l}function vd(t=rh){const e=Xs.get(t);if(!e&&t===rh&&W_())return G_();if(!e)throw Gn.create("no-app",{appName:t});return e}function VS(){return Array.from(Xs.values())}function Qn(t,e,n){var r;let i=(r=CS[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),yn.warn(l.join(" "));return}Ti(new Cr(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OS="firebase-heartbeat-database",xS=1,Js="firebase-heartbeat-store";let ec=null;function Q_(){return ec||(ec=YI(OS,xS,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Js)}catch(n){console.warn(n)}}}}).catch(t=>{throw Gn.create("idb-open",{originalErrorMessage:t.message})})),ec}async function LS(t){try{const n=(await Q_()).transaction(Js),r=await n.objectStore(Js).get(Y_(t));return await n.done,r}catch(e){if(e instanceof Tn)yn.warn(e.message);else{const n=Gn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});yn.warn(n.message)}}}async function Em(t,e){try{const r=(await Q_()).transaction(Js,"readwrite");await r.objectStore(Js).put(e,Y_(t)),await r.done}catch(n){if(n instanceof Tn)yn.warn(n.message);else{const r=Gn.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});yn.warn(r.message)}}}function Y_(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MS=1024,FS=30*24*60*60*1e3;class US{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new jS(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=wm();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=FS}),this._storage.overwrite(this._heartbeatsCache))}catch(r){yn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=wm(),{heartbeatsToSend:r,unsentEntries:i}=bS(this._heartbeatsCache.heartbeats),s=il(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return yn.warn(n),""}}}function wm(){return new Date().toISOString().substring(0,10)}function bS(t,e=MS){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Tm(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Tm(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class jS{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return AI()?RI().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await LS(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Em(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Em(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Tm(t){return il(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zS(t){Ti(new Cr("platform-logger",e=>new ZI(e),"PRIVATE")),Ti(new Cr("heartbeat",e=>new US(e),"PRIVATE")),Qn(nh,_m,t),Qn(nh,_m,"esm2017"),Qn("fire-js","")}zS("");function Ed(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function X_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const BS=X_,J_=new po("auth","Firebase",X_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ol=new gd("@firebase/auth");function $S(t,...e){ol.logLevel<=ee.WARN&&ol.warn(`Auth (${Li}): ${t}`,...e)}function Aa(t,...e){ol.logLevel<=ee.ERROR&&ol.error(`Auth (${Li}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(t,...e){throw wd(t,...e)}function $t(t,...e){return wd(t,...e)}function Z_(t,e,n){const r=Object.assign(Object.assign({},BS()),{[e]:n});return new po("auth","Firebase",r).create(e,{appName:t.name})}function Yn(t){return Z_(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function wd(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return J_.create(t,...e)}function H(t,e,...n){if(!t)throw wd(e,...n)}function un(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Aa(e),new Error(e)}function _n(t,e){t||un(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sh(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function WS(){return Im()==="http:"||Im()==="https:"}function Im(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HS(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(WS()||wI()||"connection"in navigator)?navigator.onLine:!0}function qS(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class go{constructor(e,n){this.shortDelay=e,this.longDelay=n,_n(n>e,"Short delay should be less than long delay!"),this.isMobile=_I()||TI()}get(){return HS()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Td(t,e){_n(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ev{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;un("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;un("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;un("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KS={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GS=new go(3e4,6e4);function Lr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function ar(t,e,n,r,i={}){return tv(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=mo(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h=Object.assign({method:e,headers:u},s);return EI()||(h.referrerPolicy="no-referrer"),ev.fetch()(nv(t,t.config.apiHost,n,l),h)})}async function tv(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},KS),e);try{const i=new YS(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw aa(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw aa(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw aa(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw aa(t,"user-disabled",o);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Z_(t,f,h);Ft(t,f)}}catch(i){if(i instanceof Tn)throw i;Ft(t,"network-request-failed",{message:String(i)})}}async function Fl(t,e,n,r,i={}){const s=await ar(t,e,n,r,i);return"mfaPendingCredential"in s&&Ft(t,"multi-factor-auth-required",{_serverResponse:s}),s}function nv(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?Td(t.config,i):`${t.config.apiScheme}://${i}`}function QS(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class YS{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r($t(this.auth,"network-request-failed")),GS.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function aa(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=$t(t,e,r);return i.customData._tokenResponse=n,i}function Sm(t){return t!==void 0&&t.enterprise!==void 0}class XS{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return QS(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function JS(t,e){return ar(t,"GET","/v2/recaptchaConfig",Lr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ZS(t,e){return ar(t,"POST","/v1/accounts:delete",e)}async function rv(t,e){return ar(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ks(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function eA(t,e=!1){const n=gt(t),r=await n.getIdToken(e),i=Id(r);H(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:ks(tc(i.auth_time)),issuedAtTime:ks(tc(i.iat)),expirationTime:ks(tc(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function tc(t){return Number(t)*1e3}function Id(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Aa("JWT malformed, contained fewer than 3 sections"),null;try{const i=B_(n);return i?JSON.parse(i):(Aa("Failed to decode base64 JWT payload"),null)}catch(i){return Aa("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Am(t){const e=Id(t);return H(e,"internal-error"),H(typeof e.exp<"u","internal-error"),H(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zs(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Tn&&tA(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function tA({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nA{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=ks(this.lastLoginAt),this.creationTime=ks(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function al(t){var e;const n=t.auth,r=await t.getIdToken(),i=await Zs(t,rv(n,{idToken:r}));H(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?iv(s.providerUserInfo):[],l=iA(t.providerData,o),u=t.isAnonymous,h=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=u?h:!1,g={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new oh(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,g)}async function rA(t){const e=gt(t);await al(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function iA(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function iv(t){return t.map(e=>{var{providerId:n}=e,r=Ed(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sA(t,e){const n=await tv(t,{},async()=>{const r=mo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=nv(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",ev.fetch()(o,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function oA(t,e){return ar(t,"POST","/v2/accounts:revokeToken",Lr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){H(e.idToken,"internal-error"),H(typeof e.idToken<"u","internal-error"),H(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Am(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){H(e.length!==0,"internal-error");const n=Am(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(H(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await sA(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new hi;return r&&(H(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(H(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(H(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new hi,this.toJSON())}_performRefresh(){return un("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pn(t,e){H(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class cn{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=Ed(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new nA(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new oh(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Zs(this,this.stsTokenManager.getToken(this.auth,e));return H(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return eA(this,e)}reload(){return rA(this)}_assign(e){this!==e&&(H(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new cn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){H(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await al(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ln(this.auth.app))return Promise.reject(Yn(this.auth));const e=await this.getIdToken();return await Zs(this,ZS(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,l,u,h,f;const g=(r=n.displayName)!==null&&r!==void 0?r:void 0,y=(i=n.email)!==null&&i!==void 0?i:void 0,R=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,N=(o=n.photoURL)!==null&&o!==void 0?o:void 0,k=(l=n.tenantId)!==null&&l!==void 0?l:void 0,O=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,I=(h=n.createdAt)!==null&&h!==void 0?h:void 0,E=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:S,emailVerified:V,isAnonymous:b,providerData:U,stsTokenManager:v}=n;H(S&&v,e,"internal-error");const m=hi.fromJSON(this.name,v);H(typeof S=="string",e,"internal-error"),Pn(g,e.name),Pn(y,e.name),H(typeof V=="boolean",e,"internal-error"),H(typeof b=="boolean",e,"internal-error"),Pn(R,e.name),Pn(N,e.name),Pn(k,e.name),Pn(O,e.name),Pn(I,e.name),Pn(E,e.name);const _=new cn({uid:S,auth:e,email:y,emailVerified:V,displayName:g,isAnonymous:b,photoURL:N,phoneNumber:R,tenantId:k,stsTokenManager:m,createdAt:I,lastLoginAt:E});return U&&Array.isArray(U)&&(_.providerData=U.map(w=>Object.assign({},w))),O&&(_._redirectEventId=O),_}static async _fromIdTokenResponse(e,n,r=!1){const i=new hi;i.updateFromServerResponse(n);const s=new cn({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await al(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];H(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?iv(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new hi;l.updateFromIdToken(r);const u=new cn({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new oh(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rm=new Map;function hn(t){_n(t instanceof Function,"Expected a class definition");let e=Rm.get(t);return e?(_n(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Rm.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sv{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}sv.type="NONE";const Pm=sv;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ra(t,e,n){return`firebase:${t}:${e}:${n}`}class di{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Ra(this.userKey,i.apiKey,s),this.fullPersistenceKey=Ra("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?cn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new di(hn(Pm),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||hn(Pm);const o=Ra(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const f=await h._get(o);if(f){const g=cn._fromJSON(e,f);h!==s&&(l=g),s=h;break}}catch{}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new di(s,e,r):(s=u[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==s)try{await h._remove(o)}catch{}})),new di(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cm(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(uv(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ov(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(hv(e))return"Blackberry";if(dv(e))return"Webos";if(av(e))return"Safari";if((e.includes("chrome/")||lv(e))&&!e.includes("edge/"))return"Chrome";if(cv(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function ov(t=Je()){return/firefox\//i.test(t)}function av(t=Je()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function lv(t=Je()){return/crios\//i.test(t)}function uv(t=Je()){return/iemobile/i.test(t)}function cv(t=Je()){return/android/i.test(t)}function hv(t=Je()){return/blackberry/i.test(t)}function dv(t=Je()){return/webos/i.test(t)}function Sd(t=Je()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function aA(t=Je()){var e;return Sd(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function lA(){return II()&&document.documentMode===10}function fv(t=Je()){return Sd(t)||cv(t)||dv(t)||hv(t)||/windows phone/i.test(t)||uv(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pv(t,e=[]){let n;switch(t){case"Browser":n=Cm(Je());break;case"Worker":n=`${Cm(Je())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Li}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uA{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const u=e(s);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cA(t,e={}){return ar(t,"GET","/v2/passwordPolicy",Lr(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hA=6;class dA{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:hA,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fA{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new km(this),this.idTokenSubscription=new km(this),this.beforeStateQueue=new uA(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=J_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=hn(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await di.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await rv(this,{idToken:e}),r=await cn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(ln(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return H(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await al(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=qS()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ln(this.app))return Promise.reject(Yn(this));const n=e?gt(e):null;return n&&H(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&H(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ln(this.app)?Promise.reject(Yn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ln(this.app)?Promise.reject(Yn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(hn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await cA(this),n=new dA(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new po("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await oA(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&hn(e)||this._popupRedirectResolver;H(n,this,"argument-error"),this.redirectPersistenceManager=await di.create(this,[hn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(H(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return H(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=pv(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&$S(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Mi(t){return gt(t)}class km{constructor(e){this.auth=e,this.observer=null,this.addObserver=DI(n=>this.observer=n)}get next(){return H(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ul={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function pA(t){Ul=t}function mv(t){return Ul.loadJS(t)}function mA(){return Ul.recaptchaEnterpriseScript}function gA(){return Ul.gapiScript}function yA(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const _A="recaptcha-enterprise",vA="NO_RECAPTCHA";class EA{constructor(e){this.type=_A,this.auth=Mi(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{JS(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const h=new XS(u);return s.tenantId==null?s._agentRecaptchaConfig=h:s._tenantRecaptchaConfigs[s.tenantId]=h,o(h.siteKey)}}).catch(u=>{l(u)})})}function i(s,o,l){const u=window.grecaptcha;Sm(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(h=>{o(h)}).catch(()=>{o(vA)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{r(this.auth).then(l=>{if(!n&&Sm(window.grecaptcha))i(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=mA();u.length!==0&&(u+=l),mv(u).then(()=>{i(l,s,o)}).catch(h=>{o(h)})}}).catch(l=>{o(l)})})}}async function Nm(t,e,n,r=!1){const i=new EA(t);let s;try{s=await i.verify(n)}catch{s=await i.verify(n,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Dm(t,e,n,r){var i;if(!((i=t._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Nm(t,e,n,n==="getOobCode");return r(t,s)}else return r(t,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Nm(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wA(t,e){const n=_d(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(sl(s,e??{}))return i;Ft(i,"already-initialized")}return n.initialize({options:e})}function TA(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(hn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function IA(t,e,n){const r=Mi(t);H(r._canInitEmulator,r,"emulator-config-failed"),H(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=gv(e),{host:o,port:l}=SA(e),u=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),AA()}function gv(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function SA(t){const e=gv(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Vm(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Vm(o)}}}function Vm(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function AA(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return un("not implemented")}_getIdTokenResponse(e){return un("not implemented")}_linkToIdToken(e,n){return un("not implemented")}_getReauthenticationResolver(e){return un("not implemented")}}async function RA(t,e){return ar(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PA(t,e){return Fl(t,"POST","/v1/accounts:signInWithPassword",Lr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function CA(t,e){return Fl(t,"POST","/v1/accounts:signInWithEmailLink",Lr(t,e))}async function kA(t,e){return Fl(t,"POST","/v1/accounts:signInWithEmailLink",Lr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo extends Ad{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new eo(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new eo(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dm(e,n,"signInWithPassword",PA);case"emailLink":return CA(e,{email:this._email,oobCode:this._password});default:Ft(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dm(e,r,"signUpPassword",RA);case"emailLink":return kA(e,{idToken:n,email:this._email,oobCode:this._password});default:Ft(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fi(t,e){return Fl(t,"POST","/v1/accounts:signInWithIdp",Lr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NA="http://localhost";class kr extends Ad{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new kr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Ft("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=Ed(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new kr(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return fi(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,fi(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,fi(e,n)}buildRequest(){const e={requestUri:NA,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=mo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DA(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function VA(t){const e=ms(gs(t)).link,n=e?ms(gs(e)).deep_link_id:null,r=ms(gs(t)).deep_link_id;return(r?ms(gs(r)).link:null)||r||n||e||t}class Rd{constructor(e){var n,r,i,s,o,l;const u=ms(gs(e)),h=(n=u.apiKey)!==null&&n!==void 0?n:null,f=(r=u.oobCode)!==null&&r!==void 0?r:null,g=DA((i=u.mode)!==null&&i!==void 0?i:null);H(h&&f&&g,"argument-error"),this.apiKey=h,this.operation=g,this.code=f,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=u.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=VA(e);try{return new Rd(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(){this.providerId=Fi.PROVIDER_ID}static credential(e,n){return eo._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Rd.parseLink(n);return H(r,"argument-error"),eo._fromEmailAndCode(e,r.code,r.tenantId)}}Fi.PROVIDER_ID="password";Fi.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Fi.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yv{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo extends yv{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn extends yo{constructor(){super("facebook.com")}static credential(e){return kr._fromParams({providerId:Vn.PROVIDER_ID,signInMethod:Vn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Vn.credentialFromTaggedObject(e)}static credentialFromError(e){return Vn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Vn.credential(e.oauthAccessToken)}catch{return null}}}Vn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Vn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On extends yo{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return kr._fromParams({providerId:On.PROVIDER_ID,signInMethod:On.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return On.credentialFromTaggedObject(e)}static credentialFromError(e){return On.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return On.credential(n,r)}catch{return null}}}On.GOOGLE_SIGN_IN_METHOD="google.com";On.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn extends yo{constructor(){super("github.com")}static credential(e){return kr._fromParams({providerId:xn.PROVIDER_ID,signInMethod:xn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return xn.credentialFromTaggedObject(e)}static credentialFromError(e){return xn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return xn.credential(e.oauthAccessToken)}catch{return null}}}xn.GITHUB_SIGN_IN_METHOD="github.com";xn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln extends yo{constructor(){super("twitter.com")}static credential(e,n){return kr._fromParams({providerId:Ln.PROVIDER_ID,signInMethod:Ln.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ln.credentialFromTaggedObject(e)}static credentialFromError(e){return Ln.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ln.credential(n,r)}catch{return null}}}Ln.TWITTER_SIGN_IN_METHOD="twitter.com";Ln.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await cn._fromIdTokenResponse(e,r,i),o=Om(r);return new Ii({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Om(r);return new Ii({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Om(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll extends Tn{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,ll.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new ll(e,n,r,i)}}function _v(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?ll._fromErrorAndOperation(t,s,e,r):s})}async function OA(t,e,n=!1){const r=await Zs(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Ii._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xA(t,e,n=!1){const{auth:r}=t;if(ln(r.app))return Promise.reject(Yn(r));const i="reauthenticate";try{const s=await Zs(t,_v(r,i,e,t),n);H(s.idToken,r,"internal-error");const o=Id(s.idToken);H(o,r,"internal-error");const{sub:l}=o;return H(t.uid===l,r,"user-mismatch"),Ii._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Ft(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vv(t,e,n=!1){if(ln(t.app))return Promise.reject(Yn(t));const r="signIn",i=await _v(t,r,e),s=await Ii._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function LA(t,e){return vv(Mi(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function MA(t){const e=Mi(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function FA(t,e,n){return ln(t.app)?Promise.reject(Yn(t)):LA(gt(t),Fi.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&MA(t),r})}function UA(t,e,n,r){return gt(t).onIdTokenChanged(e,n,r)}function bA(t,e,n){return gt(t).beforeAuthStateChanged(e,n)}function jA(t,e,n,r){return gt(t).onAuthStateChanged(e,n,r)}const ul="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ev{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ul,"1"),this.storage.removeItem(ul),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zA=1e3,BA=10;class wv extends Ev{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=fv(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);lA()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,BA):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},zA)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}wv.type="LOCAL";const $A=wv;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tv extends Ev{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Tv.type="SESSION";const Iv=Tv;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WA(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new bl(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async h=>h(n.origin,s)),u=await WA(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bl.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pd(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HA{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,u)=>{const h=Pd("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(g){const y=g;if(y.data.eventId===h)switch(y.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(y.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wt(){return window}function qA(t){Wt().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sv(){return typeof Wt().WorkerGlobalScope<"u"&&typeof Wt().importScripts=="function"}async function KA(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function GA(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function QA(){return Sv()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Av="firebaseLocalStorageDb",YA=1,cl="firebaseLocalStorage",Rv="fbase_key";class _o{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function jl(t,e){return t.transaction([cl],e?"readwrite":"readonly").objectStore(cl)}function XA(){const t=indexedDB.deleteDatabase(Av);return new _o(t).toPromise()}function ah(){const t=indexedDB.open(Av,YA);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(cl,{keyPath:Rv})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(cl)?e(r):(r.close(),await XA(),e(await ah()))})})}async function xm(t,e,n){const r=jl(t,!0).put({[Rv]:e,value:n});return new _o(r).toPromise()}async function JA(t,e){const n=jl(t,!1).get(e),r=await new _o(n).toPromise();return r===void 0?null:r.value}function Lm(t,e){const n=jl(t,!0).delete(e);return new _o(n).toPromise()}const ZA=800,eR=3;class Pv{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ah(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>eR)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Sv()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bl._getInstance(QA()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await KA(),!this.activeServiceWorker)return;this.sender=new HA(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||GA()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ah();return await xm(e,ul,"1"),await Lm(e,ul),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>xm(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>JA(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Lm(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=jl(i,!1).getAll();return new _o(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),ZA)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Pv.type="LOCAL";const tR=Pv;new go(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nR(t,e){return e?hn(e):(H(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cd extends Ad{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return fi(e,this._buildIdpRequest())}_linkToIdToken(e,n){return fi(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return fi(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function rR(t){return vv(t.auth,new Cd(t),t.bypassAuthState)}function iR(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),xA(n,new Cd(t),t.bypassAuthState)}async function sR(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),OA(n,new Cd(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return rR;case"linkViaPopup":case"linkViaRedirect":return sR;case"reauthViaPopup":case"reauthViaRedirect":return iR;default:Ft(this.auth,"internal-error")}}resolve(e){_n(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){_n(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oR=new go(2e3,1e4);class ii extends Cv{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,ii.currentPopupAction&&ii.currentPopupAction.cancel(),ii.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return H(e,this.auth,"internal-error"),e}async onExecution(){_n(this.filter.length===1,"Popup operations only handle one event");const e=Pd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject($t(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject($t(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ii.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject($t(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,oR.get())};e()}}ii.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aR="pendingRedirect",Pa=new Map;class lR extends Cv{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Pa.get(this.auth._key());if(!e){try{const r=await uR(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Pa.set(this.auth._key(),e)}return this.bypassAuthState||Pa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function uR(t,e){const n=dR(e),r=hR(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function cR(t,e){Pa.set(t._key(),e)}function hR(t){return hn(t._redirectPersistence)}function dR(t){return Ra(aR,t.config.apiKey,t.name)}async function fR(t,e,n=!1){if(ln(t.app))return Promise.reject(Yn(t));const r=Mi(t),i=nR(r,e),o=await new lR(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pR=10*60*1e3;class mR{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!gR(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!kv(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError($t(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=pR&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mm(e))}saveEventToCache(e){this.cachedEventUids.add(Mm(e)),this.lastProcessedEventTime=Date.now()}}function Mm(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function kv({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function gR(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return kv(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yR(t,e={}){return ar(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _R=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,vR=/^https?/;async function ER(t){if(t.config.emulator)return;const{authorizedDomains:e}=await yR(t);for(const n of e)try{if(wR(n))return}catch{}Ft(t,"unauthorized-domain")}function wR(t){const e=sh(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!vR.test(n))return!1;if(_R.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TR=new go(3e4,6e4);function Fm(){const t=Wt().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function IR(t){return new Promise((e,n)=>{var r,i,s;function o(){Fm(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Fm(),n($t(t,"network-request-failed"))},timeout:TR.get()})}if(!((i=(r=Wt().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Wt().gapi)===null||s===void 0)&&s.load)o();else{const l=yA("iframefcb");return Wt()[l]=()=>{gapi.load?o():n($t(t,"network-request-failed"))},mv(`${gA()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Ca=null,e})}let Ca=null;function SR(t){return Ca=Ca||IR(t),Ca}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AR=new go(5e3,15e3),RR="__/auth/iframe",PR="emulator/auth/iframe",CR={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},kR=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function NR(t){const e=t.config;H(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Td(e,PR):`https://${t.config.authDomain}/${RR}`,r={apiKey:e.apiKey,appName:t.name,v:Li},i=kR.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${mo(r).slice(1)}`}async function DR(t){const e=await SR(t),n=Wt().gapi;return H(n,t,"internal-error"),e.open({where:document.body,url:NR(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:CR,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=$t(t,"network-request-failed"),l=Wt().setTimeout(()=>{s(o)},AR.get());function u(){Wt().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VR={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},OR=500,xR=600,LR="_blank",MR="http://localhost";class Um{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function FR(t,e,n,r=OR,i=xR){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},VR),{width:r.toString(),height:i.toString(),top:s,left:o}),h=Je().toLowerCase();n&&(l=lv(h)?LR:n),ov(h)&&(e=e||MR,u.scrollbars="yes");const f=Object.entries(u).reduce((y,[R,N])=>`${y}${R}=${N},`,"");if(aA(h)&&l!=="_self")return UR(e||"",l),new Um(null);const g=window.open(e||"",l,f);H(g,t,"popup-blocked");try{g.focus()}catch{}return new Um(g)}function UR(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bR="__/auth/handler",jR="emulator/auth/handler",zR=encodeURIComponent("fac");async function bm(t,e,n,r,i,s){H(t.config.authDomain,t,"auth-domain-config-required"),H(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Li,eventId:i};if(e instanceof yv){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",NI(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,g]of Object.entries({}))o[f]=g}if(e instanceof yo){const f=e.getScopes().filter(g=>g!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const u=await t._getAppCheckToken(),h=u?`#${zR}=${encodeURIComponent(u)}`:"";return`${BR(t)}?${mo(l).slice(1)}${h}`}function BR({config:t}){return t.emulator?Td(t,jR):`https://${t.authDomain}/${bR}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nc="webStorageSupport";class $R{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Iv,this._completeRedirectFn=fR,this._overrideRedirectResult=cR}async _openPopup(e,n,r,i){var s;_n((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await bm(e,n,r,sh(),i);return FR(e,o,Pd())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await bm(e,n,r,sh(),i);return qA(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(_n(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await DR(e),r=new mR(e);return n.register("authEvent",i=>(H(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(nc,{type:nc},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[nc];o!==void 0&&n(!!o),Ft(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=ER(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return fv()||av()||Sd()}}const WR=$R;var jm="@firebase/auth",zm="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HR{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){H(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qR(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function KR(t){Ti(new Cr("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;H(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:pv(t)},h=new fA(r,i,s,u);return TA(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Ti(new Cr("auth-internal",e=>{const n=Mi(e.getProvider("auth").getImmediate());return(r=>new HR(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Qn(jm,zm,qR(t)),Qn(jm,zm,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GR=5*60,QR=H_("authIdTokenMaxAge")||GR;let Bm=null;const YR=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>QR)return;const i=n==null?void 0:n.token;Bm!==i&&(Bm=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function XR(t=vd()){const e=_d(t,"auth");if(e.isInitialized())return e.getImmediate();const n=wA(t,{popupRedirectResolver:WR,persistence:[tR,$A,Iv]}),r=H_("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=YR(s.toString());bA(n,o,()=>o(n.currentUser)),UA(n,l=>o(l))}}const i=$_("auth");return i&&IA(n,`http://${i}`),n}function JR(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}pA({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=$t("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",JR().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});KR("Browser");var ZR="firebase",eP="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Qn(ZR,eP,"app");var $m=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Tr,Nv;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(v,m){function _(){}_.prototype=m.prototype,v.D=m.prototype,v.prototype=new _,v.prototype.constructor=v,v.C=function(w,A,C){for(var T=Array(arguments.length-2),vt=2;vt<arguments.length;vt++)T[vt-2]=arguments[vt];return m.prototype[A].apply(w,T)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(v,m,_){_||(_=0);var w=Array(16);if(typeof m=="string")for(var A=0;16>A;++A)w[A]=m.charCodeAt(_++)|m.charCodeAt(_++)<<8|m.charCodeAt(_++)<<16|m.charCodeAt(_++)<<24;else for(A=0;16>A;++A)w[A]=m[_++]|m[_++]<<8|m[_++]<<16|m[_++]<<24;m=v.g[0],_=v.g[1],A=v.g[2];var C=v.g[3],T=m+(C^_&(A^C))+w[0]+3614090360&4294967295;m=_+(T<<7&4294967295|T>>>25),T=C+(A^m&(_^A))+w[1]+3905402710&4294967295,C=m+(T<<12&4294967295|T>>>20),T=A+(_^C&(m^_))+w[2]+606105819&4294967295,A=C+(T<<17&4294967295|T>>>15),T=_+(m^A&(C^m))+w[3]+3250441966&4294967295,_=A+(T<<22&4294967295|T>>>10),T=m+(C^_&(A^C))+w[4]+4118548399&4294967295,m=_+(T<<7&4294967295|T>>>25),T=C+(A^m&(_^A))+w[5]+1200080426&4294967295,C=m+(T<<12&4294967295|T>>>20),T=A+(_^C&(m^_))+w[6]+2821735955&4294967295,A=C+(T<<17&4294967295|T>>>15),T=_+(m^A&(C^m))+w[7]+4249261313&4294967295,_=A+(T<<22&4294967295|T>>>10),T=m+(C^_&(A^C))+w[8]+1770035416&4294967295,m=_+(T<<7&4294967295|T>>>25),T=C+(A^m&(_^A))+w[9]+2336552879&4294967295,C=m+(T<<12&4294967295|T>>>20),T=A+(_^C&(m^_))+w[10]+4294925233&4294967295,A=C+(T<<17&4294967295|T>>>15),T=_+(m^A&(C^m))+w[11]+2304563134&4294967295,_=A+(T<<22&4294967295|T>>>10),T=m+(C^_&(A^C))+w[12]+1804603682&4294967295,m=_+(T<<7&4294967295|T>>>25),T=C+(A^m&(_^A))+w[13]+4254626195&4294967295,C=m+(T<<12&4294967295|T>>>20),T=A+(_^C&(m^_))+w[14]+2792965006&4294967295,A=C+(T<<17&4294967295|T>>>15),T=_+(m^A&(C^m))+w[15]+1236535329&4294967295,_=A+(T<<22&4294967295|T>>>10),T=m+(A^C&(_^A))+w[1]+4129170786&4294967295,m=_+(T<<5&4294967295|T>>>27),T=C+(_^A&(m^_))+w[6]+3225465664&4294967295,C=m+(T<<9&4294967295|T>>>23),T=A+(m^_&(C^m))+w[11]+643717713&4294967295,A=C+(T<<14&4294967295|T>>>18),T=_+(C^m&(A^C))+w[0]+3921069994&4294967295,_=A+(T<<20&4294967295|T>>>12),T=m+(A^C&(_^A))+w[5]+3593408605&4294967295,m=_+(T<<5&4294967295|T>>>27),T=C+(_^A&(m^_))+w[10]+38016083&4294967295,C=m+(T<<9&4294967295|T>>>23),T=A+(m^_&(C^m))+w[15]+3634488961&4294967295,A=C+(T<<14&4294967295|T>>>18),T=_+(C^m&(A^C))+w[4]+3889429448&4294967295,_=A+(T<<20&4294967295|T>>>12),T=m+(A^C&(_^A))+w[9]+568446438&4294967295,m=_+(T<<5&4294967295|T>>>27),T=C+(_^A&(m^_))+w[14]+3275163606&4294967295,C=m+(T<<9&4294967295|T>>>23),T=A+(m^_&(C^m))+w[3]+4107603335&4294967295,A=C+(T<<14&4294967295|T>>>18),T=_+(C^m&(A^C))+w[8]+1163531501&4294967295,_=A+(T<<20&4294967295|T>>>12),T=m+(A^C&(_^A))+w[13]+2850285829&4294967295,m=_+(T<<5&4294967295|T>>>27),T=C+(_^A&(m^_))+w[2]+4243563512&4294967295,C=m+(T<<9&4294967295|T>>>23),T=A+(m^_&(C^m))+w[7]+1735328473&4294967295,A=C+(T<<14&4294967295|T>>>18),T=_+(C^m&(A^C))+w[12]+2368359562&4294967295,_=A+(T<<20&4294967295|T>>>12),T=m+(_^A^C)+w[5]+4294588738&4294967295,m=_+(T<<4&4294967295|T>>>28),T=C+(m^_^A)+w[8]+2272392833&4294967295,C=m+(T<<11&4294967295|T>>>21),T=A+(C^m^_)+w[11]+1839030562&4294967295,A=C+(T<<16&4294967295|T>>>16),T=_+(A^C^m)+w[14]+4259657740&4294967295,_=A+(T<<23&4294967295|T>>>9),T=m+(_^A^C)+w[1]+2763975236&4294967295,m=_+(T<<4&4294967295|T>>>28),T=C+(m^_^A)+w[4]+1272893353&4294967295,C=m+(T<<11&4294967295|T>>>21),T=A+(C^m^_)+w[7]+4139469664&4294967295,A=C+(T<<16&4294967295|T>>>16),T=_+(A^C^m)+w[10]+3200236656&4294967295,_=A+(T<<23&4294967295|T>>>9),T=m+(_^A^C)+w[13]+681279174&4294967295,m=_+(T<<4&4294967295|T>>>28),T=C+(m^_^A)+w[0]+3936430074&4294967295,C=m+(T<<11&4294967295|T>>>21),T=A+(C^m^_)+w[3]+3572445317&4294967295,A=C+(T<<16&4294967295|T>>>16),T=_+(A^C^m)+w[6]+76029189&4294967295,_=A+(T<<23&4294967295|T>>>9),T=m+(_^A^C)+w[9]+3654602809&4294967295,m=_+(T<<4&4294967295|T>>>28),T=C+(m^_^A)+w[12]+3873151461&4294967295,C=m+(T<<11&4294967295|T>>>21),T=A+(C^m^_)+w[15]+530742520&4294967295,A=C+(T<<16&4294967295|T>>>16),T=_+(A^C^m)+w[2]+3299628645&4294967295,_=A+(T<<23&4294967295|T>>>9),T=m+(A^(_|~C))+w[0]+4096336452&4294967295,m=_+(T<<6&4294967295|T>>>26),T=C+(_^(m|~A))+w[7]+1126891415&4294967295,C=m+(T<<10&4294967295|T>>>22),T=A+(m^(C|~_))+w[14]+2878612391&4294967295,A=C+(T<<15&4294967295|T>>>17),T=_+(C^(A|~m))+w[5]+4237533241&4294967295,_=A+(T<<21&4294967295|T>>>11),T=m+(A^(_|~C))+w[12]+1700485571&4294967295,m=_+(T<<6&4294967295|T>>>26),T=C+(_^(m|~A))+w[3]+2399980690&4294967295,C=m+(T<<10&4294967295|T>>>22),T=A+(m^(C|~_))+w[10]+4293915773&4294967295,A=C+(T<<15&4294967295|T>>>17),T=_+(C^(A|~m))+w[1]+2240044497&4294967295,_=A+(T<<21&4294967295|T>>>11),T=m+(A^(_|~C))+w[8]+1873313359&4294967295,m=_+(T<<6&4294967295|T>>>26),T=C+(_^(m|~A))+w[15]+4264355552&4294967295,C=m+(T<<10&4294967295|T>>>22),T=A+(m^(C|~_))+w[6]+2734768916&4294967295,A=C+(T<<15&4294967295|T>>>17),T=_+(C^(A|~m))+w[13]+1309151649&4294967295,_=A+(T<<21&4294967295|T>>>11),T=m+(A^(_|~C))+w[4]+4149444226&4294967295,m=_+(T<<6&4294967295|T>>>26),T=C+(_^(m|~A))+w[11]+3174756917&4294967295,C=m+(T<<10&4294967295|T>>>22),T=A+(m^(C|~_))+w[2]+718787259&4294967295,A=C+(T<<15&4294967295|T>>>17),T=_+(C^(A|~m))+w[9]+3951481745&4294967295,v.g[0]=v.g[0]+m&4294967295,v.g[1]=v.g[1]+(A+(T<<21&4294967295|T>>>11))&4294967295,v.g[2]=v.g[2]+A&4294967295,v.g[3]=v.g[3]+C&4294967295}r.prototype.u=function(v,m){m===void 0&&(m=v.length);for(var _=m-this.blockSize,w=this.B,A=this.h,C=0;C<m;){if(A==0)for(;C<=_;)i(this,v,C),C+=this.blockSize;if(typeof v=="string"){for(;C<m;)if(w[A++]=v.charCodeAt(C++),A==this.blockSize){i(this,w),A=0;break}}else for(;C<m;)if(w[A++]=v[C++],A==this.blockSize){i(this,w),A=0;break}}this.h=A,this.o+=m},r.prototype.v=function(){var v=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);v[0]=128;for(var m=1;m<v.length-8;++m)v[m]=0;var _=8*this.o;for(m=v.length-8;m<v.length;++m)v[m]=_&255,_/=256;for(this.u(v),v=Array(16),m=_=0;4>m;++m)for(var w=0;32>w;w+=8)v[_++]=this.g[m]>>>w&255;return v};function s(v,m){var _=l;return Object.prototype.hasOwnProperty.call(_,v)?_[v]:_[v]=m(v)}function o(v,m){this.h=m;for(var _=[],w=!0,A=v.length-1;0<=A;A--){var C=v[A]|0;w&&C==m||(_[A]=C,w=!1)}this.g=_}var l={};function u(v){return-128<=v&&128>v?s(v,function(m){return new o([m|0],0>m?-1:0)}):new o([v|0],0>v?-1:0)}function h(v){if(isNaN(v)||!isFinite(v))return g;if(0>v)return O(h(-v));for(var m=[],_=1,w=0;v>=_;w++)m[w]=v/_|0,_*=4294967296;return new o(m,0)}function f(v,m){if(v.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(v.charAt(0)=="-")return O(f(v.substring(1),m));if(0<=v.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=h(Math.pow(m,8)),w=g,A=0;A<v.length;A+=8){var C=Math.min(8,v.length-A),T=parseInt(v.substring(A,A+C),m);8>C?(C=h(Math.pow(m,C)),w=w.j(C).add(h(T))):(w=w.j(_),w=w.add(h(T)))}return w}var g=u(0),y=u(1),R=u(16777216);t=o.prototype,t.m=function(){if(k(this))return-O(this).m();for(var v=0,m=1,_=0;_<this.g.length;_++){var w=this.i(_);v+=(0<=w?w:4294967296+w)*m,m*=4294967296}return v},t.toString=function(v){if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(N(this))return"0";if(k(this))return"-"+O(this).toString(v);for(var m=h(Math.pow(v,6)),_=this,w="";;){var A=V(_,m).g;_=I(_,A.j(m));var C=((0<_.g.length?_.g[0]:_.h)>>>0).toString(v);if(_=A,N(_))return C+w;for(;6>C.length;)C="0"+C;w=C+w}},t.i=function(v){return 0>v?0:v<this.g.length?this.g[v]:this.h};function N(v){if(v.h!=0)return!1;for(var m=0;m<v.g.length;m++)if(v.g[m]!=0)return!1;return!0}function k(v){return v.h==-1}t.l=function(v){return v=I(this,v),k(v)?-1:N(v)?0:1};function O(v){for(var m=v.g.length,_=[],w=0;w<m;w++)_[w]=~v.g[w];return new o(_,~v.h).add(y)}t.abs=function(){return k(this)?O(this):this},t.add=function(v){for(var m=Math.max(this.g.length,v.g.length),_=[],w=0,A=0;A<=m;A++){var C=w+(this.i(A)&65535)+(v.i(A)&65535),T=(C>>>16)+(this.i(A)>>>16)+(v.i(A)>>>16);w=T>>>16,C&=65535,T&=65535,_[A]=T<<16|C}return new o(_,_[_.length-1]&-2147483648?-1:0)};function I(v,m){return v.add(O(m))}t.j=function(v){if(N(this)||N(v))return g;if(k(this))return k(v)?O(this).j(O(v)):O(O(this).j(v));if(k(v))return O(this.j(O(v)));if(0>this.l(R)&&0>v.l(R))return h(this.m()*v.m());for(var m=this.g.length+v.g.length,_=[],w=0;w<2*m;w++)_[w]=0;for(w=0;w<this.g.length;w++)for(var A=0;A<v.g.length;A++){var C=this.i(w)>>>16,T=this.i(w)&65535,vt=v.i(A)>>>16,lr=v.i(A)&65535;_[2*w+2*A]+=T*lr,E(_,2*w+2*A),_[2*w+2*A+1]+=C*lr,E(_,2*w+2*A+1),_[2*w+2*A+1]+=T*vt,E(_,2*w+2*A+1),_[2*w+2*A+2]+=C*vt,E(_,2*w+2*A+2)}for(w=0;w<m;w++)_[w]=_[2*w+1]<<16|_[2*w];for(w=m;w<2*m;w++)_[w]=0;return new o(_,0)};function E(v,m){for(;(v[m]&65535)!=v[m];)v[m+1]+=v[m]>>>16,v[m]&=65535,m++}function S(v,m){this.g=v,this.h=m}function V(v,m){if(N(m))throw Error("division by zero");if(N(v))return new S(g,g);if(k(v))return m=V(O(v),m),new S(O(m.g),O(m.h));if(k(m))return m=V(v,O(m)),new S(O(m.g),m.h);if(30<v.g.length){if(k(v)||k(m))throw Error("slowDivide_ only works with positive integers.");for(var _=y,w=m;0>=w.l(v);)_=b(_),w=b(w);var A=U(_,1),C=U(w,1);for(w=U(w,2),_=U(_,2);!N(w);){var T=C.add(w);0>=T.l(v)&&(A=A.add(_),C=T),w=U(w,1),_=U(_,1)}return m=I(v,A.j(m)),new S(A,m)}for(A=g;0<=v.l(m);){for(_=Math.max(1,Math.floor(v.m()/m.m())),w=Math.ceil(Math.log(_)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),C=h(_),T=C.j(m);k(T)||0<T.l(v);)_-=w,C=h(_),T=C.j(m);N(C)&&(C=y),A=A.add(C),v=I(v,T)}return new S(A,v)}t.A=function(v){return V(this,v).h},t.and=function(v){for(var m=Math.max(this.g.length,v.g.length),_=[],w=0;w<m;w++)_[w]=this.i(w)&v.i(w);return new o(_,this.h&v.h)},t.or=function(v){for(var m=Math.max(this.g.length,v.g.length),_=[],w=0;w<m;w++)_[w]=this.i(w)|v.i(w);return new o(_,this.h|v.h)},t.xor=function(v){for(var m=Math.max(this.g.length,v.g.length),_=[],w=0;w<m;w++)_[w]=this.i(w)^v.i(w);return new o(_,this.h^v.h)};function b(v){for(var m=v.g.length+1,_=[],w=0;w<m;w++)_[w]=v.i(w)<<1|v.i(w-1)>>>31;return new o(_,v.h)}function U(v,m){var _=m>>5;m%=32;for(var w=v.g.length-_,A=[],C=0;C<w;C++)A[C]=0<m?v.i(C+_)>>>m|v.i(C+_+1)<<32-m:v.i(C+_);return new o(A,v.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Nv=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Tr=o}).apply(typeof $m<"u"?$m:typeof self<"u"?self:typeof window<"u"?window:{});var la=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Dv,ys,Vv,ka,lh,Ov,xv,Lv;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,c,d){return a==Array.prototype||a==Object.prototype||(a[c]=d.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof la=="object"&&la];for(var c=0;c<a.length;++c){var d=a[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=n(this);function i(a,c){if(c)e:{var d=r;a=a.split(".");for(var p=0;p<a.length-1;p++){var P=a[p];if(!(P in d))break e;d=d[P]}a=a[a.length-1],p=d[a],c=c(p),c!=p&&c!=null&&e(d,a,{configurable:!0,writable:!0,value:c})}}function s(a,c){a instanceof String&&(a+="");var d=0,p=!1,P={next:function(){if(!p&&d<a.length){var D=d++;return{value:c(D,a[D]),done:!1}}return p=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}i("Array.prototype.values",function(a){return a||function(){return s(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function u(a){var c=typeof a;return c=c!="object"?c:a?Array.isArray(a)?"array":c:"null",c=="array"||c=="object"&&typeof a.length=="number"}function h(a){var c=typeof a;return c=="object"&&a!=null||c=="function"}function f(a,c,d){return a.call.apply(a.bind,arguments)}function g(a,c,d){if(!a)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,p),a.apply(c,P)}}return function(){return a.apply(c,arguments)}}function y(a,c,d){return y=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:g,y.apply(null,arguments)}function R(a,c){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function N(a,c){function d(){}d.prototype=c.prototype,a.aa=c.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(p,P,D){for(var F=Array(arguments.length-2),le=2;le<arguments.length;le++)F[le-2]=arguments[le];return c.prototype[P].apply(p,F)}}function k(a){const c=a.length;if(0<c){const d=Array(c);for(let p=0;p<c;p++)d[p]=a[p];return d}return[]}function O(a,c){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(u(p)){const P=a.length||0,D=p.length||0;a.length=P+D;for(let F=0;F<D;F++)a[P+F]=p[F]}else a.push(p)}}class I{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function E(a){return/^[\s\xa0]*$/.test(a)}function S(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function V(a){return V[" "](a),a}V[" "]=function(){};var b=S().indexOf("Gecko")!=-1&&!(S().toLowerCase().indexOf("webkit")!=-1&&S().indexOf("Edge")==-1)&&!(S().indexOf("Trident")!=-1||S().indexOf("MSIE")!=-1)&&S().indexOf("Edge")==-1;function U(a,c,d){for(const p in a)c.call(d,a[p],p,a)}function v(a,c){for(const d in a)c.call(void 0,a[d],d,a)}function m(a){const c={};for(const d in a)c[d]=a[d];return c}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,c){let d,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(d in p)a[d]=p[d];for(let D=0;D<_.length;D++)d=_[D],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function A(a){var c=1;a=a.split(":");const d=[];for(;0<c&&a.length;)d.push(a.shift()),c--;return a.length&&d.push(a.join(":")),d}function C(a){l.setTimeout(()=>{throw a},0)}function T(){var a=K;let c=null;return a.g&&(c=a.g,a.g=a.g.next,a.g||(a.h=null),c.next=null),c}class vt{constructor(){this.h=this.g=null}add(c,d){const p=lr.get();p.set(c,d),this.h?this.h.next=p:this.g=p,this.h=p}}var lr=new I(()=>new Bi,a=>a.reset());class Bi{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Yt,j=!1,K=new vt,Y=()=>{const a=l.Promise.resolve(void 0);Yt=()=>{a.then(me)}};var me=()=>{for(var a;a=T();){try{a.h.call(a.g)}catch(d){C(d)}var c=lr;c.j(a),100>c.h&&(c.h++,a.next=c.g,c.g=a)}j=!1};function ae(){this.s=this.s,this.C=this.C}ae.prototype.s=!1,ae.prototype.ma=function(){this.s||(this.s=!0,this.N())},ae.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Te(a,c){this.type=a,this.g=this.target=c,this.defaultPrevented=!1}Te.prototype.h=function(){this.defaultPrevented=!0};var Xt=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,c=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};l.addEventListener("test",d,c),l.removeEventListener("test",d,c)}catch{}return a}();function Jt(a,c){if(Te.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=c,c=a.relatedTarget){if(b){e:{try{V(c.nodeName);var P=!0;break e}catch{}P=!1}P||(c=null)}}else d=="mouseover"?c=a.fromElement:d=="mouseout"&&(c=a.toElement);this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Zt[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Jt.aa.h.call(this)}}N(Jt,Te);var Zt={2:"touch",3:"pen",4:"mouse"};Jt.prototype.h=function(){Jt.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var en="closure_listenable_"+(1e6*Math.random()|0),rw=0;function iw(a,c,d,p,P){this.listener=a,this.proxy=null,this.src=c,this.type=d,this.capture=!!p,this.ha=P,this.key=++rw,this.da=this.fa=!1}function Ro(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Po(a){this.src=a,this.g={},this.h=0}Po.prototype.add=function(a,c,d,p,P){var D=a.toString();a=this.g[D],a||(a=this.g[D]=[],this.h++);var F=nu(a,c,p,P);return-1<F?(c=a[F],d||(c.fa=!1)):(c=new iw(c,this.src,D,!!p,P),c.fa=d,a.push(c)),c};function tu(a,c){var d=c.type;if(d in a.g){var p=a.g[d],P=Array.prototype.indexOf.call(p,c,void 0),D;(D=0<=P)&&Array.prototype.splice.call(p,P,1),D&&(Ro(c),a.g[d].length==0&&(delete a.g[d],a.h--))}}function nu(a,c,d,p){for(var P=0;P<a.length;++P){var D=a[P];if(!D.da&&D.listener==c&&D.capture==!!d&&D.ha==p)return P}return-1}var ru="closure_lm_"+(1e6*Math.random()|0),iu={};function sf(a,c,d,p,P){if(Array.isArray(c)){for(var D=0;D<c.length;D++)sf(a,c[D],d,p,P);return null}return d=lf(d),a&&a[en]?a.K(c,d,h(p)?!!p.capture:!1,P):sw(a,c,d,!1,p,P)}function sw(a,c,d,p,P,D){if(!c)throw Error("Invalid event type");var F=h(P)?!!P.capture:!!P,le=ou(a);if(le||(a[ru]=le=new Po(a)),d=le.add(c,d,p,F,D),d.proxy)return d;if(p=ow(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)Xt||(P=F),P===void 0&&(P=!1),a.addEventListener(c.toString(),p,P);else if(a.attachEvent)a.attachEvent(af(c.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function ow(){function a(d){return c.call(a.src,a.listener,d)}const c=aw;return a}function of(a,c,d,p,P){if(Array.isArray(c))for(var D=0;D<c.length;D++)of(a,c[D],d,p,P);else p=h(p)?!!p.capture:!!p,d=lf(d),a&&a[en]?(a=a.i,c=String(c).toString(),c in a.g&&(D=a.g[c],d=nu(D,d,p,P),-1<d&&(Ro(D[d]),Array.prototype.splice.call(D,d,1),D.length==0&&(delete a.g[c],a.h--)))):a&&(a=ou(a))&&(c=a.g[c.toString()],a=-1,c&&(a=nu(c,d,p,P)),(d=-1<a?c[a]:null)&&su(d))}function su(a){if(typeof a!="number"&&a&&!a.da){var c=a.src;if(c&&c[en])tu(c.i,a);else{var d=a.type,p=a.proxy;c.removeEventListener?c.removeEventListener(d,p,a.capture):c.detachEvent?c.detachEvent(af(d),p):c.addListener&&c.removeListener&&c.removeListener(p),(d=ou(c))?(tu(d,a),d.h==0&&(d.src=null,c[ru]=null)):Ro(a)}}}function af(a){return a in iu?iu[a]:iu[a]="on"+a}function aw(a,c){if(a.da)a=!0;else{c=new Jt(c,this);var d=a.listener,p=a.ha||a.src;a.fa&&su(a),a=d.call(p,c)}return a}function ou(a){return a=a[ru],a instanceof Po?a:null}var au="__closure_events_fn_"+(1e9*Math.random()>>>0);function lf(a){return typeof a=="function"?a:(a[au]||(a[au]=function(c){return a.handleEvent(c)}),a[au])}function Be(){ae.call(this),this.i=new Po(this),this.M=this,this.F=null}N(Be,ae),Be.prototype[en]=!0,Be.prototype.removeEventListener=function(a,c,d,p){of(this,a,c,d,p)};function Ze(a,c){var d,p=a.F;if(p)for(d=[];p;p=p.F)d.push(p);if(a=a.M,p=c.type||c,typeof c=="string")c=new Te(c,a);else if(c instanceof Te)c.target=c.target||a;else{var P=c;c=new Te(p,a),w(c,P)}if(P=!0,d)for(var D=d.length-1;0<=D;D--){var F=c.g=d[D];P=Co(F,p,!0,c)&&P}if(F=c.g=a,P=Co(F,p,!0,c)&&P,P=Co(F,p,!1,c)&&P,d)for(D=0;D<d.length;D++)F=c.g=d[D],P=Co(F,p,!1,c)&&P}Be.prototype.N=function(){if(Be.aa.N.call(this),this.i){var a=this.i,c;for(c in a.g){for(var d=a.g[c],p=0;p<d.length;p++)Ro(d[p]);delete a.g[c],a.h--}}this.F=null},Be.prototype.K=function(a,c,d,p){return this.i.add(String(a),c,!1,d,p)},Be.prototype.L=function(a,c,d,p){return this.i.add(String(a),c,!0,d,p)};function Co(a,c,d,p){if(c=a.i.g[String(c)],!c)return!0;c=c.concat();for(var P=!0,D=0;D<c.length;++D){var F=c[D];if(F&&!F.da&&F.capture==d){var le=F.listener,xe=F.ha||F.src;F.fa&&tu(a.i,F),P=le.call(xe,p)!==!1&&P}}return P&&!p.defaultPrevented}function uf(a,c,d){if(typeof a=="function")d&&(a=y(a,d));else if(a&&typeof a.handleEvent=="function")a=y(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(a,c||0)}function cf(a){a.g=uf(()=>{a.g=null,a.i&&(a.i=!1,cf(a))},a.l);const c=a.h;a.h=null,a.m.apply(null,c)}class lw extends ae{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:cf(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function $i(a){ae.call(this),this.h=a,this.g={}}N($i,ae);var hf=[];function df(a){U(a.g,function(c,d){this.g.hasOwnProperty(d)&&su(c)},a),a.g={}}$i.prototype.N=function(){$i.aa.N.call(this),df(this)},$i.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var lu=l.JSON.stringify,uw=l.JSON.parse,cw=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function uu(){}uu.prototype.h=null;function ff(a){return a.h||(a.h=a.i())}function pf(){}var Wi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function cu(){Te.call(this,"d")}N(cu,Te);function hu(){Te.call(this,"c")}N(hu,Te);var ur={},mf=null;function ko(){return mf=mf||new Be}ur.La="serverreachability";function gf(a){Te.call(this,ur.La,a)}N(gf,Te);function Hi(a){const c=ko();Ze(c,new gf(c))}ur.STAT_EVENT="statevent";function yf(a,c){Te.call(this,ur.STAT_EVENT,a),this.stat=c}N(yf,Te);function et(a){const c=ko();Ze(c,new yf(c,a))}ur.Ma="timingevent";function _f(a,c){Te.call(this,ur.Ma,a),this.size=c}N(_f,Te);function qi(a,c){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},c)}function Ki(){this.g=!0}Ki.prototype.xa=function(){this.g=!1};function hw(a,c,d,p,P,D){a.info(function(){if(a.g)if(D)for(var F="",le=D.split("&"),xe=0;xe<le.length;xe++){var re=le[xe].split("=");if(1<re.length){var $e=re[0];re=re[1];var We=$e.split("_");F=2<=We.length&&We[1]=="type"?F+($e+"="+re+"&"):F+($e+"=redacted&")}}else F=null;else F=D;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+c+`
`+d+`
`+F})}function dw(a,c,d,p,P,D,F){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+c+`
`+d+`
`+D+" "+F})}function Ur(a,c,d,p){a.info(function(){return"XMLHTTP TEXT ("+c+"): "+pw(a,d)+(p?" "+p:"")})}function fw(a,c){a.info(function(){return"TIMEOUT: "+c})}Ki.prototype.info=function(){};function pw(a,c){if(!a.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var p=d[a];if(!(2>p.length)){var P=p[1];if(Array.isArray(P)&&!(1>P.length)){var D=P[0];if(D!="noop"&&D!="stop"&&D!="close")for(var F=1;F<P.length;F++)P[F]=""}}}}return lu(d)}catch{return c}}var No={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},vf={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},du;function Do(){}N(Do,uu),Do.prototype.g=function(){return new XMLHttpRequest},Do.prototype.i=function(){return{}},du=new Do;function In(a,c,d,p){this.j=a,this.i=c,this.l=d,this.R=p||1,this.U=new $i(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ef}function Ef(){this.i=null,this.g="",this.h=!1}var wf={},fu={};function pu(a,c,d){a.L=1,a.v=Lo(tn(c)),a.m=d,a.P=!0,Tf(a,null)}function Tf(a,c){a.F=Date.now(),Vo(a),a.A=tn(a.v);var d=a.A,p=a.R;Array.isArray(p)||(p=[String(p)]),Mf(d.i,"t",p),a.C=0,d=a.j.J,a.h=new Ef,a.g=ep(a.j,d?c:null,!a.m),0<a.O&&(a.M=new lw(y(a.Y,a,a.g),a.O)),c=a.U,d=a.g,p=a.ca;var P="readystatechange";Array.isArray(P)||(P&&(hf[0]=P.toString()),P=hf);for(var D=0;D<P.length;D++){var F=sf(d,P[D],p||c.handleEvent,!1,c.h||c);if(!F)break;c.g[F.key]=F}c=a.H?m(a.H):{},a.m?(a.u||(a.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,c)):(a.u="GET",a.g.ea(a.A,a.u,null,c)),Hi(),hw(a.i,a.u,a.A,a.l,a.R,a.m)}In.prototype.ca=function(a){a=a.target;const c=this.M;c&&nn(a)==3?c.j():this.Y(a)},In.prototype.Y=function(a){try{if(a==this.g)e:{const We=nn(this.g);var c=this.g.Ba();const zr=this.g.Z();if(!(3>We)&&(We!=3||this.g&&(this.h.h||this.g.oa()||$f(this.g)))){this.J||We!=4||c==7||(c==8||0>=zr?Hi(3):Hi(2)),mu(this);var d=this.g.Z();this.X=d;t:if(If(this)){var p=$f(this.g);a="";var P=p.length,D=nn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){cr(this),Gi(this);var F="";break t}this.h.i=new l.TextDecoder}for(c=0;c<P;c++)this.h.h=!0,a+=this.h.i.decode(p[c],{stream:!(D&&c==P-1)});p.length=0,this.h.g+=a,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=d==200,dw(this.i,this.u,this.A,this.l,this.R,We,d),this.o){if(this.T&&!this.K){t:{if(this.g){var le,xe=this.g;if((le=xe.g?xe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!E(le)){var re=le;break t}}re=null}if(d=re)Ur(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,gu(this,d);else{this.o=!1,this.s=3,et(12),cr(this),Gi(this);break e}}if(this.P){d=!0;let Ct;for(;!this.J&&this.C<F.length;)if(Ct=mw(this,F),Ct==fu){We==4&&(this.s=4,et(14),d=!1),Ur(this.i,this.l,null,"[Incomplete Response]");break}else if(Ct==wf){this.s=4,et(15),Ur(this.i,this.l,F,"[Invalid Chunk]"),d=!1;break}else Ur(this.i,this.l,Ct,null),gu(this,Ct);if(If(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),We!=4||F.length!=0||this.h.h||(this.s=1,et(16),d=!1),this.o=this.o&&d,!d)Ur(this.i,this.l,F,"[Invalid Chunked Response]"),cr(this),Gi(this);else if(0<F.length&&!this.W){this.W=!0;var $e=this.j;$e.g==this&&$e.ba&&!$e.M&&($e.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),Tu($e),$e.M=!0,et(11))}}else Ur(this.i,this.l,F,null),gu(this,F);We==4&&cr(this),this.o&&!this.J&&(We==4?Yf(this.j,this):(this.o=!1,Vo(this)))}else Vw(this.g),d==400&&0<F.indexOf("Unknown SID")?(this.s=3,et(12)):(this.s=0,et(13)),cr(this),Gi(this)}}}catch{}finally{}};function If(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function mw(a,c){var d=a.C,p=c.indexOf(`
`,d);return p==-1?fu:(d=Number(c.substring(d,p)),isNaN(d)?wf:(p+=1,p+d>c.length?fu:(c=c.slice(p,p+d),a.C=p+d,c)))}In.prototype.cancel=function(){this.J=!0,cr(this)};function Vo(a){a.S=Date.now()+a.I,Sf(a,a.I)}function Sf(a,c){if(a.B!=null)throw Error("WatchDog timer not null");a.B=qi(y(a.ba,a),c)}function mu(a){a.B&&(l.clearTimeout(a.B),a.B=null)}In.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(fw(this.i,this.A),this.L!=2&&(Hi(),et(17)),cr(this),this.s=2,Gi(this)):Sf(this,this.S-a)};function Gi(a){a.j.G==0||a.J||Yf(a.j,a)}function cr(a){mu(a);var c=a.M;c&&typeof c.ma=="function"&&c.ma(),a.M=null,df(a.U),a.g&&(c=a.g,a.g=null,c.abort(),c.ma())}function gu(a,c){try{var d=a.j;if(d.G!=0&&(d.g==a||yu(d.h,a))){if(!a.K&&yu(d.h,a)&&d.G==3){try{var p=d.Da.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)zo(d),bo(d);else break e;wu(d),et(18)}}else d.za=P[1],0<d.za-d.T&&37500>P[2]&&d.F&&d.v==0&&!d.C&&(d.C=qi(y(d.Za,d),6e3));if(1>=Pf(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else dr(d,11)}else if((a.K||d.g==a)&&zo(d),!E(c))for(P=d.Da.g.parse(c),c=0;c<P.length;c++){let re=P[c];if(d.T=re[0],re=re[1],d.G==2)if(re[0]=="c"){d.K=re[1],d.ia=re[2];const $e=re[3];$e!=null&&(d.la=$e,d.j.info("VER="+d.la));const We=re[4];We!=null&&(d.Aa=We,d.j.info("SVER="+d.Aa));const zr=re[5];zr!=null&&typeof zr=="number"&&0<zr&&(p=1.5*zr,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Ct=a.g;if(Ct){const $o=Ct.g?Ct.g.getResponseHeader("X-Client-Wire-Protocol"):null;if($o){var D=p.h;D.g||$o.indexOf("spdy")==-1&&$o.indexOf("quic")==-1&&$o.indexOf("h2")==-1||(D.j=D.l,D.g=new Set,D.h&&(_u(D,D.h),D.h=null))}if(p.D){const Iu=Ct.g?Ct.g.getResponseHeader("X-HTTP-Session-Id"):null;Iu&&(p.ya=Iu,ce(p.I,p.D,Iu))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var F=a;if(p.qa=Zf(p,p.J?p.ia:null,p.W),F.K){Cf(p.h,F);var le=F,xe=p.L;xe&&(le.I=xe),le.B&&(mu(le),Vo(le)),p.g=F}else Gf(p);0<d.i.length&&jo(d)}else re[0]!="stop"&&re[0]!="close"||dr(d,7);else d.G==3&&(re[0]=="stop"||re[0]=="close"?re[0]=="stop"?dr(d,7):Eu(d):re[0]!="noop"&&d.l&&d.l.ta(re),d.v=0)}}Hi(4)}catch{}}var gw=class{constructor(a,c){this.g=a,this.map=c}};function Af(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Rf(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Pf(a){return a.h?1:a.g?a.g.size:0}function yu(a,c){return a.h?a.h==c:a.g?a.g.has(c):!1}function _u(a,c){a.g?a.g.add(c):a.h=c}function Cf(a,c){a.h&&a.h==c?a.h=null:a.g&&a.g.has(c)&&a.g.delete(c)}Af.prototype.cancel=function(){if(this.i=kf(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function kf(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let c=a.i;for(const d of a.g.values())c=c.concat(d.D);return c}return k(a.i)}function yw(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var c=[],d=a.length,p=0;p<d;p++)c.push(a[p]);return c}c=[],d=0;for(p in a)c[d++]=a[p];return c}function _w(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var c=[];a=a.length;for(var d=0;d<a;d++)c.push(d);return c}c=[],d=0;for(const p in a)c[d++]=p;return c}}}function Nf(a,c){if(a.forEach&&typeof a.forEach=="function")a.forEach(c,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,c,void 0);else for(var d=_w(a),p=yw(a),P=p.length,D=0;D<P;D++)c.call(void 0,p[D],d&&d[D],a)}var Df=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function vw(a,c){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var p=a[d].indexOf("="),P=null;if(0<=p){var D=a[d].substring(0,p);P=a[d].substring(p+1)}else D=a[d];c(D,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function hr(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof hr){this.h=a.h,Oo(this,a.j),this.o=a.o,this.g=a.g,xo(this,a.s),this.l=a.l;var c=a.i,d=new Xi;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),Vf(this,d),this.m=a.m}else a&&(c=String(a).match(Df))?(this.h=!1,Oo(this,c[1]||"",!0),this.o=Qi(c[2]||""),this.g=Qi(c[3]||"",!0),xo(this,c[4]),this.l=Qi(c[5]||"",!0),Vf(this,c[6]||"",!0),this.m=Qi(c[7]||"")):(this.h=!1,this.i=new Xi(null,this.h))}hr.prototype.toString=function(){var a=[],c=this.j;c&&a.push(Yi(c,Of,!0),":");var d=this.g;return(d||c=="file")&&(a.push("//"),(c=this.o)&&a.push(Yi(c,Of,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Yi(d,d.charAt(0)=="/"?Tw:ww,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Yi(d,Sw)),a.join("")};function tn(a){return new hr(a)}function Oo(a,c,d){a.j=d?Qi(c,!0):c,a.j&&(a.j=a.j.replace(/:$/,""))}function xo(a,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);a.s=c}else a.s=null}function Vf(a,c,d){c instanceof Xi?(a.i=c,Aw(a.i,a.h)):(d||(c=Yi(c,Iw)),a.i=new Xi(c,a.h))}function ce(a,c,d){a.i.set(c,d)}function Lo(a){return ce(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Qi(a,c){return a?c?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Yi(a,c,d){return typeof a=="string"?(a=encodeURI(a).replace(c,Ew),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Ew(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Of=/[#\/\?@]/g,ww=/[#\?:]/g,Tw=/[#\?]/g,Iw=/[#\?@]/g,Sw=/#/g;function Xi(a,c){this.h=this.g=null,this.i=a||null,this.j=!!c}function Sn(a){a.g||(a.g=new Map,a.h=0,a.i&&vw(a.i,function(c,d){a.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}t=Xi.prototype,t.add=function(a,c){Sn(this),this.i=null,a=br(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(c),this.h+=1,this};function xf(a,c){Sn(a),c=br(a,c),a.g.has(c)&&(a.i=null,a.h-=a.g.get(c).length,a.g.delete(c))}function Lf(a,c){return Sn(a),c=br(a,c),a.g.has(c)}t.forEach=function(a,c){Sn(this),this.g.forEach(function(d,p){d.forEach(function(P){a.call(c,P,p,this)},this)},this)},t.na=function(){Sn(this);const a=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let p=0;p<c.length;p++){const P=a[p];for(let D=0;D<P.length;D++)d.push(c[p])}return d},t.V=function(a){Sn(this);let c=[];if(typeof a=="string")Lf(this,a)&&(c=c.concat(this.g.get(br(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)c=c.concat(a[d])}return c},t.set=function(a,c){return Sn(this),this.i=null,a=br(this,a),Lf(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[c]),this.h+=1,this},t.get=function(a,c){return a?(a=this.V(a),0<a.length?String(a[0]):c):c};function Mf(a,c,d){xf(a,c),0<d.length&&(a.i=null,a.g.set(br(a,c),k(d)),a.h+=d.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var p=c[d];const D=encodeURIComponent(String(p)),F=this.V(p);for(p=0;p<F.length;p++){var P=D;F[p]!==""&&(P+="="+encodeURIComponent(String(F[p]))),a.push(P)}}return this.i=a.join("&")};function br(a,c){return c=String(c),a.j&&(c=c.toLowerCase()),c}function Aw(a,c){c&&!a.j&&(Sn(a),a.i=null,a.g.forEach(function(d,p){var P=p.toLowerCase();p!=P&&(xf(this,p),Mf(this,P,d))},a)),a.j=c}function Rw(a,c){const d=new Ki;if(l.Image){const p=new Image;p.onload=R(An,d,"TestLoadImage: loaded",!0,c,p),p.onerror=R(An,d,"TestLoadImage: error",!1,c,p),p.onabort=R(An,d,"TestLoadImage: abort",!1,c,p),p.ontimeout=R(An,d,"TestLoadImage: timeout",!1,c,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else c(!1)}function Pw(a,c){const d=new Ki,p=new AbortController,P=setTimeout(()=>{p.abort(),An(d,"TestPingServer: timeout",!1,c)},1e4);fetch(a,{signal:p.signal}).then(D=>{clearTimeout(P),D.ok?An(d,"TestPingServer: ok",!0,c):An(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(P),An(d,"TestPingServer: error",!1,c)})}function An(a,c,d,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(d)}catch{}}function Cw(){this.g=new cw}function kw(a,c,d){const p=d||"";try{Nf(a,function(P,D){let F=P;h(P)&&(F=lu(P)),c.push(p+D+"="+encodeURIComponent(F))})}catch(P){throw c.push(p+"type="+encodeURIComponent("_badmap")),P}}function Mo(a){this.l=a.Ub||null,this.j=a.eb||!1}N(Mo,uu),Mo.prototype.g=function(){return new Fo(this.l,this.j)},Mo.prototype.i=function(a){return function(){return a}}({});function Fo(a,c){Be.call(this),this.D=a,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}N(Fo,Be),t=Fo.prototype,t.open=function(a,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=c,this.readyState=1,Zi(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(c.body=a),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Ji(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Zi(this)),this.g&&(this.readyState=3,Zi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ff(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ff(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var c=a.value?a.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!a.done}))&&(this.response=this.responseText+=c)}a.done?Ji(this):Zi(this),this.readyState==3&&Ff(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,Ji(this))},t.Qa=function(a){this.g&&(this.response=a,Ji(this))},t.ga=function(){this.g&&Ji(this)};function Ji(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Zi(a)}t.setRequestHeader=function(a,c){this.u.append(a,c)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=c.next();return a.join(`\r
`)};function Zi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Fo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Uf(a){let c="";return U(a,function(d,p){c+=p,c+=":",c+=d,c+=`\r
`}),c}function vu(a,c,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=Uf(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):ce(a,c,d))}function Ee(a){Be.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}N(Ee,Be);var Nw=/^https?$/i,Dw=["POST","PUT"];t=Ee.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,c,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);c=c?c.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():du.g(),this.v=this.o?ff(this.o):ff(du),this.g.onreadystatechange=y(this.Ea,this);try{this.B=!0,this.g.open(c,String(a),!0),this.B=!1}catch(D){bf(this,D);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)d.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const D of p.keys())d.set(D,p.get(D));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(D=>D.toLowerCase()=="content-type"),P=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Dw,c,void 0))||p||P||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[D,F]of d)this.g.setRequestHeader(D,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Bf(this),this.u=!0,this.g.send(a),this.u=!1}catch(D){bf(this,D)}};function bf(a,c){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=c,a.m=5,jf(a),Uo(a)}function jf(a){a.A||(a.A=!0,Ze(a,"complete"),Ze(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ze(this,"complete"),Ze(this,"abort"),Uo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Uo(this,!0)),Ee.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?zf(this):this.bb())},t.bb=function(){zf(this)};function zf(a){if(a.h&&typeof o<"u"&&(!a.v[1]||nn(a)!=4||a.Z()!=2)){if(a.u&&nn(a)==4)uf(a.Ea,0,a);else if(Ze(a,"readystatechange"),nn(a)==4){a.h=!1;try{const F=a.Z();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var p;if(p=F===0){var P=String(a.D).match(Df)[1]||null;!P&&l.self&&l.self.location&&(P=l.self.location.protocol.slice(0,-1)),p=!Nw.test(P?P.toLowerCase():"")}d=p}if(d)Ze(a,"complete"),Ze(a,"success");else{a.m=6;try{var D=2<nn(a)?a.g.statusText:""}catch{D=""}a.l=D+" ["+a.Z()+"]",jf(a)}}finally{Uo(a)}}}}function Uo(a,c){if(a.g){Bf(a);const d=a.g,p=a.v[0]?()=>{}:null;a.g=null,a.v=null,c||Ze(a,"ready");try{d.onreadystatechange=p}catch{}}}function Bf(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function nn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<nn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var c=this.g.responseText;return a&&c.indexOf(a)==0&&(c=c.substring(a.length)),uw(c)}};function $f(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Vw(a){const c={};a=(a.g&&2<=nn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(E(a[p]))continue;var d=A(a[p]);const P=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const D=c[P]||[];c[P]=D,D.push(d)}v(c,function(p){return p.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function es(a,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||c}function Wf(a){this.Aa=0,this.i=[],this.j=new Ki,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=es("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=es("baseRetryDelayMs",5e3,a),this.cb=es("retryDelaySeedMs",1e4,a),this.Wa=es("forwardChannelMaxRetries",2,a),this.wa=es("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Af(a&&a.concurrentRequestLimit),this.Da=new Cw,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Wf.prototype,t.la=8,t.G=1,t.connect=function(a,c,d,p){et(0),this.W=a,this.H=c||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Zf(this,null,this.W),jo(this)};function Eu(a){if(Hf(a),a.G==3){var c=a.U++,d=tn(a.I);if(ce(d,"SID",a.K),ce(d,"RID",c),ce(d,"TYPE","terminate"),ts(a,d),c=new In(a,a.j,c),c.L=2,c.v=Lo(tn(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=c.v,d=!0),d||(c.g=ep(c.j,null),c.g.ea(c.v)),c.F=Date.now(),Vo(c)}Jf(a)}function bo(a){a.g&&(Tu(a),a.g.cancel(),a.g=null)}function Hf(a){bo(a),a.u&&(l.clearTimeout(a.u),a.u=null),zo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function jo(a){if(!Rf(a.h)&&!a.s){a.s=!0;var c=a.Ga;Yt||Y(),j||(Yt(),j=!0),K.add(c,a),a.B=0}}function Ow(a,c){return Pf(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=c.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=qi(y(a.Ga,a,c),Xf(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const P=new In(this,this.j,a);let D=this.o;if(this.S&&(D?(D=m(D),w(D,this.S)):D=this.S),this.m!==null||this.O||(P.H=D,D=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(c+=p,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Kf(this,P,c),d=tn(this.I),ce(d,"RID",a),ce(d,"CVER",22),this.D&&ce(d,"X-HTTP-Session-Id",this.D),ts(this,d),D&&(this.O?c="headers="+encodeURIComponent(String(Uf(D)))+"&"+c:this.m&&vu(d,this.m,D)),_u(this.h,P),this.Ua&&ce(d,"TYPE","init"),this.P?(ce(d,"$req",c),ce(d,"SID","null"),P.T=!0,pu(P,d,null)):pu(P,d,c),this.G=2}}else this.G==3&&(a?qf(this,a):this.i.length==0||Rf(this.h)||qf(this))};function qf(a,c){var d;c?d=c.l:d=a.U++;const p=tn(a.I);ce(p,"SID",a.K),ce(p,"RID",d),ce(p,"AID",a.T),ts(a,p),a.m&&a.o&&vu(p,a.m,a.o),d=new In(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),c&&(a.i=c.D.concat(a.i)),c=Kf(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),_u(a.h,d),pu(d,p,c)}function ts(a,c){a.H&&U(a.H,function(d,p){ce(c,p,d)}),a.l&&Nf({},function(d,p){ce(c,p,d)})}function Kf(a,c,d){d=Math.min(a.i.length,d);var p=a.l?y(a.l.Na,a.l,a):null;e:{var P=a.i;let D=-1;for(;;){const F=["count="+d];D==-1?0<d?(D=P[0].g,F.push("ofs="+D)):D=0:F.push("ofs="+D);let le=!0;for(let xe=0;xe<d;xe++){let re=P[xe].g;const $e=P[xe].map;if(re-=D,0>re)D=Math.max(0,P[xe].g-100),le=!1;else try{kw($e,F,"req"+re+"_")}catch{p&&p($e)}}if(le){p=F.join("&");break e}}}return a=a.i.splice(0,d),c.D=a,p}function Gf(a){if(!a.g&&!a.u){a.Y=1;var c=a.Fa;Yt||Y(),j||(Yt(),j=!0),K.add(c,a),a.v=0}}function wu(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=qi(y(a.Fa,a),Xf(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Qf(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=qi(y(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,et(10),bo(this),Qf(this))};function Tu(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Qf(a){a.g=new In(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var c=tn(a.qa);ce(c,"RID","rpc"),ce(c,"SID",a.K),ce(c,"AID",a.T),ce(c,"CI",a.F?"0":"1"),!a.F&&a.ja&&ce(c,"TO",a.ja),ce(c,"TYPE","xmlhttp"),ts(a,c),a.m&&a.o&&vu(c,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=Lo(tn(c)),d.m=null,d.P=!0,Tf(d,a)}t.Za=function(){this.C!=null&&(this.C=null,bo(this),wu(this),et(19))};function zo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Yf(a,c){var d=null;if(a.g==c){zo(a),Tu(a),a.g=null;var p=2}else if(yu(a.h,c))d=c.D,Cf(a.h,c),p=1;else return;if(a.G!=0){if(c.o)if(p==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var P=a.B;p=ko(),Ze(p,new _f(p,d)),jo(a)}else Gf(a);else if(P=c.s,P==3||P==0&&0<c.X||!(p==1&&Ow(a,c)||p==2&&wu(a)))switch(d&&0<d.length&&(c=a.h,c.i=c.i.concat(d)),P){case 1:dr(a,5);break;case 4:dr(a,10);break;case 3:dr(a,6);break;default:dr(a,2)}}}function Xf(a,c){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*c}function dr(a,c){if(a.j.info("Error code "+c),c==2){var d=y(a.fb,a),p=a.Xa;const P=!p;p=new hr(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Oo(p,"https"),Lo(p),P?Rw(p.toString(),d):Pw(p.toString(),d)}else et(2);a.G=0,a.l&&a.l.sa(c),Jf(a),Hf(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),et(2)):(this.j.info("Failed to ping google.com"),et(1))};function Jf(a){if(a.G=0,a.ka=[],a.l){const c=kf(a.h);(c.length!=0||a.i.length!=0)&&(O(a.ka,c),O(a.ka,a.i),a.h.i.length=0,k(a.i),a.i.length=0),a.l.ra()}}function Zf(a,c,d){var p=d instanceof hr?tn(d):new hr(d);if(p.g!="")c&&(p.g=c+"."+p.g),xo(p,p.s);else{var P=l.location;p=P.protocol,c=c?c+"."+P.hostname:P.hostname,P=+P.port;var D=new hr(null);p&&Oo(D,p),c&&(D.g=c),P&&xo(D,P),d&&(D.l=d),p=D}return d=a.D,c=a.ya,d&&c&&ce(p,d,c),ce(p,"VER",a.la),ts(a,p),p}function ep(a,c,d){if(c&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=a.Ca&&!a.pa?new Ee(new Mo({eb:d})):new Ee(a.pa),c.Ha(a.J),c}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function tp(){}t=tp.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Bo(){}Bo.prototype.g=function(a,c){return new ct(a,c)};function ct(a,c){Be.call(this),this.g=new Wf(c),this.l=a,this.h=c&&c.messageUrlParams||null,a=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(a?a["X-WebChannel-Content-Type"]=c.messageContentType:a={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(a?a["X-WebChannel-Client-Profile"]=c.va:a={"X-WebChannel-Client-Profile":c.va}),this.g.S=a,(a=c&&c.Sb)&&!E(a)&&(this.g.m=a),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!E(c)&&(this.g.D=c,a=this.h,a!==null&&c in a&&(a=this.h,c in a&&delete a[c])),this.j=new jr(this)}N(ct,Be),ct.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ct.prototype.close=function(){Eu(this.g)},ct.prototype.o=function(a){var c=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=lu(a),a=d);c.i.push(new gw(c.Ya++,a)),c.G==3&&jo(c)},ct.prototype.N=function(){this.g.l=null,delete this.j,Eu(this.g),delete this.g,ct.aa.N.call(this)};function np(a){cu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var c=a.__sm__;if(c){e:{for(const d in c){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,c=c!==null&&a in c?c[a]:void 0),this.data=c}else this.data=a}N(np,cu);function rp(){hu.call(this),this.status=1}N(rp,hu);function jr(a){this.g=a}N(jr,tp),jr.prototype.ua=function(){Ze(this.g,"a")},jr.prototype.ta=function(a){Ze(this.g,new np(a))},jr.prototype.sa=function(a){Ze(this.g,new rp)},jr.prototype.ra=function(){Ze(this.g,"b")},Bo.prototype.createWebChannel=Bo.prototype.g,ct.prototype.send=ct.prototype.o,ct.prototype.open=ct.prototype.m,ct.prototype.close=ct.prototype.close,Lv=function(){return new Bo},xv=function(){return ko()},Ov=ur,lh={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},No.NO_ERROR=0,No.TIMEOUT=8,No.HTTP_ERROR=6,ka=No,vf.COMPLETE="complete",Vv=vf,pf.EventType=Wi,Wi.OPEN="a",Wi.CLOSE="b",Wi.ERROR="c",Wi.MESSAGE="d",Be.prototype.listen=Be.prototype.K,ys=pf,Ee.prototype.listenOnce=Ee.prototype.L,Ee.prototype.getLastError=Ee.prototype.Ka,Ee.prototype.getLastErrorCode=Ee.prototype.Ba,Ee.prototype.getStatus=Ee.prototype.Z,Ee.prototype.getResponseJson=Ee.prototype.Oa,Ee.prototype.getResponseText=Ee.prototype.oa,Ee.prototype.send=Ee.prototype.ea,Ee.prototype.setWithCredentials=Ee.prototype.Ha,Dv=Ee}).apply(typeof la<"u"?la:typeof self<"u"?self:typeof window<"u"?window:{});const Wm="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ge.UNAUTHENTICATED=new Ge(null),Ge.GOOGLE_CREDENTIALS=new Ge("google-credentials-uid"),Ge.FIRST_PARTY=new Ge("first-party-uid"),Ge.MOCK_USER=new Ge("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ui="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nr=new gd("@firebase/firestore");function cs(){return Nr.logLevel}function B(t,...e){if(Nr.logLevel<=ee.DEBUG){const n=e.map(kd);Nr.debug(`Firestore (${Ui}): ${t}`,...n)}}function vn(t,...e){if(Nr.logLevel<=ee.ERROR){const n=e.map(kd);Nr.error(`Firestore (${Ui}): ${t}`,...n)}}function Si(t,...e){if(Nr.logLevel<=ee.WARN){const n=e.map(kd);Nr.warn(`Firestore (${Ui}): ${t}`,...n)}}function kd(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(t="Unexpected state"){const e=`FIRESTORE (${Ui}) INTERNAL ASSERTION FAILED: `+t;throw vn(e),new Error(e)}function oe(t,e){t||q()}function Q(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends Tn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mv{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class tP{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Ge.UNAUTHENTICATED))}shutdown(){}}class nP{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class rP{constructor(e){this.t=e,this.currentUser=Ge.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){oe(this.o===void 0);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new Xn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Xn,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{B("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(B("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Xn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(B("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(oe(typeof r.accessToken=="string"),new Mv(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return oe(e===null||typeof e=="string"),new Ge(e)}}class iP{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=Ge.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class sP{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new iP(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(Ge.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class oP{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class aP{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){oe(this.o===void 0);const r=s=>{s.error!=null&&B("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,B("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{B("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):B("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(oe(typeof n.token=="string"),this.R=n.token,new oP(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lP(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=lP(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function ie(t,e){return t<e?-1:t>e?1:0}function Ai(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new $(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new $(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new $(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ne.fromMillis(Date.now())}static fromDate(e){return Ne.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new Ne(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ie(this.nanoseconds,e.nanoseconds):ie(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new Ne(0,0))}static max(){return new G(new Ne(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(e,n,r){n===void 0?n=0:n>e.length&&q(),r===void 0?r=e.length-n:r>e.length-n&&q(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return to.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof to?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),o=n.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class pe extends to{construct(e,n,r){return new pe(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new $(L.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new pe(n)}static emptyPath(){return new pe([])}}const uP=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Fe extends to{construct(e,n,r){return new Fe(e,n,r)}static isValidIdentifier(e){return uP.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Fe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Fe(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new $(L.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new $(L.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new $(L.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new $(L.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Fe(n)}static emptyPath(){return new Fe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(pe.fromString(e))}static fromName(e){return new W(pe.fromString(e).popFirst(5))}static empty(){return new W(pe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&pe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return pe.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new pe(e.slice()))}}function cP(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=G.fromTimestamp(r===1e9?new Ne(n+1,0):new Ne(n,r));return new tr(i,W.empty(),e)}function hP(t){return new tr(t.readTime,t.key,-1)}class tr{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new tr(G.min(),W.empty(),-1)}static max(){return new tr(G.max(),W.empty(),-1)}}function dP(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=W.comparator(t.documentKey,e.documentKey),n!==0?n:ie(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fP="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class pP{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vo(t){if(t.code!==L.FAILED_PRECONDITION||t.message!==fP)throw t;B("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&q(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new x((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof x?n:x.resolve(n)}catch(n){return x.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):x.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):x.reject(n)}static resolve(e){return new x((n,r)=>{n(e)})}static reject(e){return new x((n,r)=>{r(e)})}static waitFor(e){return new x((n,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=x.resolve(!1);for(const r of e)n=n.next(i=>i?x.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new x((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let u=0;u<s;u++){const h=u;n(e[h]).next(f=>{o[h]=f,++l,l===s&&r(o)},f=>i(f))}})}static doWhile(e,n){return new x((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function mP(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Eo(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Nd.oe=-1;function zl(t){return t==null}function hl(t){return t===0&&1/t==-1/0}function gP(t){return typeof t=="number"&&Number.isInteger(t)&&!hl(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hm(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function bi(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Uv(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(e,n){this.comparator=e,this.root=n||Me.EMPTY}insert(e,n){return new ve(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Me.BLACK,null,null))}remove(e){return new ve(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Me.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ua(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ua(this.root,e,this.comparator,!1)}getReverseIterator(){return new ua(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ua(this.root,e,this.comparator,!0)}}class ua{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Me{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??Me.RED,this.left=i??Me.EMPTY,this.right=s??Me.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new Me(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Me.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return Me.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Me.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Me.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw q();const e=this.left.check();if(e!==this.right.check())throw q();return e+(this.isRed()?0:1)}}Me.EMPTY=null,Me.RED=!0,Me.BLACK=!1;Me.EMPTY=new class{constructor(){this.size=0}get key(){throw q()}get value(){throw q()}get color(){throw q()}get left(){throw q()}get right(){throw q()}copy(e,n,r,i,s){return this}insert(e,n,r){return new Me(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e){this.comparator=e,this.data=new ve(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new qm(this.data.getIterator())}getIteratorFrom(e){return new qm(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof be)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new be(this.comparator);return n.data=e,n}}class qm{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this.fields=e,e.sort(Fe.comparator)}static empty(){return new Ot([])}unionWith(e){let n=new be(Fe.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Ot(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Ai(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new bv("Invalid base64 string: "+s):s}}(e);return new ze(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new ze(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ie(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ze.EMPTY_BYTE_STRING=new ze("");const yP=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function nr(t){if(oe(!!t),typeof t=="string"){let e=0;const n=yP.exec(t);if(oe(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ie(t.seconds),nanos:Ie(t.nanos)}}function Ie(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Dr(t){return typeof t=="string"?ze.fromBase64String(t):ze.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dd(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Vd(t){const e=t.mapValue.fields.__previous_value__;return Dd(e)?Vd(e):e}function no(t){const e=nr(t.mapValue.fields.__local_write_time__.timestampValue);return new Ne(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _P{constructor(e,n,r,i,s,o,l,u,h){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h}}class ro{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new ro("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof ro&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ca={mapValue:{}};function Vr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Dd(t)?4:EP(t)?9007199254740991:vP(t)?10:11:q()}function Gt(t,e){if(t===e)return!0;const n=Vr(t);if(n!==Vr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return no(t).isEqual(no(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=nr(i.timestampValue),l=nr(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Dr(i.bytesValue).isEqual(Dr(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Ie(i.geoPointValue.latitude)===Ie(s.geoPointValue.latitude)&&Ie(i.geoPointValue.longitude)===Ie(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Ie(i.integerValue)===Ie(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Ie(i.doubleValue),l=Ie(s.doubleValue);return o===l?hl(o)===hl(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Ai(t.arrayValue.values||[],e.arrayValue.values||[],Gt);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(Hm(o)!==Hm(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!Gt(o[u],l[u])))return!1;return!0}(t,e);default:return q()}}function io(t,e){return(t.values||[]).find(n=>Gt(n,e))!==void 0}function Ri(t,e){if(t===e)return 0;const n=Vr(t),r=Vr(e);if(n!==r)return ie(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ie(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Ie(s.integerValue||s.doubleValue),u=Ie(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return Km(t.timestampValue,e.timestampValue);case 4:return Km(no(t),no(e));case 5:return ie(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Dr(s),u=Dr(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),u=o.split("/");for(let h=0;h<l.length&&h<u.length;h++){const f=ie(l[h],u[h]);if(f!==0)return f}return ie(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=ie(Ie(s.latitude),Ie(o.latitude));return l!==0?l:ie(Ie(s.longitude),Ie(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Gm(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,u,h,f;const g=s.fields||{},y=o.fields||{},R=(l=g.value)===null||l===void 0?void 0:l.arrayValue,N=(u=y.value)===null||u===void 0?void 0:u.arrayValue,k=ie(((h=R==null?void 0:R.values)===null||h===void 0?void 0:h.length)||0,((f=N==null?void 0:N.values)===null||f===void 0?void 0:f.length)||0);return k!==0?k:Gm(R,N)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===ca.mapValue&&o===ca.mapValue)return 0;if(s===ca.mapValue)return 1;if(o===ca.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let g=0;g<u.length&&g<f.length;++g){const y=ie(u[g],f[g]);if(y!==0)return y;const R=Ri(l[u[g]],h[f[g]]);if(R!==0)return R}return ie(u.length,f.length)}(t.mapValue,e.mapValue);default:throw q()}}function Km(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ie(t,e);const n=nr(t),r=nr(e),i=ie(n.seconds,r.seconds);return i!==0?i:ie(n.nanos,r.nanos)}function Gm(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=Ri(n[i],r[i]);if(s)return s}return ie(n.length,r.length)}function Pi(t){return uh(t)}function uh(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=nr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Dr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return W.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=uh(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${uh(n.fields[o])}`;return i+"}"}(t.mapValue):q()}function ch(t){return!!t&&"integerValue"in t}function Od(t){return!!t&&"arrayValue"in t}function Qm(t){return!!t&&"nullValue"in t}function Ym(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Na(t){return!!t&&"mapValue"in t}function vP(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function Ns(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return bi(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Ns(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Ns(t.arrayValue.values[n]);return e}return Object.assign({},t)}function EP(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.value=e}static empty(){return new Tt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Na(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ns(n)}setAll(e){let n=Fe.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}o?r[l.lastSegment()]=Ns(o):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Na(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Gt(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Na(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){bi(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new Tt(Ns(this.value))}}function jv(t){const e=[];return bi(t.fields,(n,r)=>{const i=new Fe([n]);if(Na(r)){const s=jv(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new Ot(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e,n,r,i,s,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Ye(e,0,G.min(),G.min(),G.min(),Tt.empty(),0)}static newFoundDocument(e,n,r,i){return new Ye(e,1,n,G.min(),r,i,0)}static newNoDocument(e,n){return new Ye(e,2,n,G.min(),G.min(),Tt.empty(),0)}static newUnknownDocument(e,n){return new Ye(e,3,n,G.min(),G.min(),Tt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Tt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Tt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ye&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ye(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e,n){this.position=e,this.inclusive=n}}function Xm(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=W.comparator(W.fromName(o.referenceValue),n.key):r=Ri(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Jm(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Gt(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e,n="asc"){this.field=e,this.dir=n}}function wP(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zv{}class Ce extends zv{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new IP(e,n,r):n==="array-contains"?new RP(e,r):n==="in"?new PP(e,r):n==="not-in"?new CP(e,r):n==="array-contains-any"?new kP(e,r):new Ce(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new SP(e,r):new AP(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Ri(n,this.value)):n!==null&&Vr(this.value)===Vr(n)&&this.matchesComparison(Ri(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return q()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Qt extends zv{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new Qt(e,n)}matches(e){return Bv(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Bv(t){return t.op==="and"}function $v(t){return TP(t)&&Bv(t)}function TP(t){for(const e of t.filters)if(e instanceof Qt)return!1;return!0}function hh(t){if(t instanceof Ce)return t.field.canonicalString()+t.op.toString()+Pi(t.value);if($v(t))return t.filters.map(e=>hh(e)).join(",");{const e=t.filters.map(n=>hh(n)).join(",");return`${t.op}(${e})`}}function Wv(t,e){return t instanceof Ce?function(r,i){return i instanceof Ce&&r.op===i.op&&r.field.isEqual(i.field)&&Gt(r.value,i.value)}(t,e):t instanceof Qt?function(r,i){return i instanceof Qt&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&Wv(o,i.filters[l]),!0):!1}(t,e):void q()}function Hv(t){return t instanceof Ce?function(n){return`${n.field.canonicalString()} ${n.op} ${Pi(n.value)}`}(t):t instanceof Qt?function(n){return n.op.toString()+" {"+n.getFilters().map(Hv).join(" ,")+"}"}(t):"Filter"}class IP extends Ce{constructor(e,n,r){super(e,n,r),this.key=W.fromName(r.referenceValue)}matches(e){const n=W.comparator(e.key,this.key);return this.matchesComparison(n)}}class SP extends Ce{constructor(e,n){super(e,"in",n),this.keys=qv("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class AP extends Ce{constructor(e,n){super(e,"not-in",n),this.keys=qv("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function qv(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>W.fromName(r.referenceValue))}class RP extends Ce{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Od(n)&&io(n.arrayValue,this.value)}}class PP extends Ce{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&io(this.value.arrayValue,n)}}class CP extends Ce{constructor(e,n){super(e,"not-in",n)}matches(e){if(io(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!io(this.value.arrayValue,n)}}class kP extends Ce{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Od(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>io(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NP{constructor(e,n=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.ue=null}}function Zm(t,e=null,n=[],r=[],i=null,s=null,o=null){return new NP(t,e,n,r,i,s,o)}function xd(t){const e=Q(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>hh(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),zl(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>Pi(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>Pi(r)).join(",")),e.ue=n}return e.ue}function Ld(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!wP(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Wv(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Jm(t.startAt,e.startAt)&&Jm(t.endAt,e.endAt)}function dh(t){return W.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,n=null,r=[],i=[],s=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function DP(t,e,n,r,i,s,o,l){return new Bl(t,e,n,r,i,s,o,l)}function Kv(t){return new Bl(t)}function eg(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function VP(t){return t.collectionGroup!==null}function Ds(t){const e=Q(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new be(Fe.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new fl(s,r))}),n.has(Fe.keyField().canonicalString())||e.ce.push(new fl(Fe.keyField(),r))}return e.ce}function Ht(t){const e=Q(t);return e.le||(e.le=OP(e,Ds(t))),e.le}function OP(t,e){if(t.limitType==="F")return Zm(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new fl(i.field,s)});const n=t.endAt?new dl(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new dl(t.startAt.position,t.startAt.inclusive):null;return Zm(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function fh(t,e,n){return new Bl(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function $l(t,e){return Ld(Ht(t),Ht(e))&&t.limitType===e.limitType}function Gv(t){return`${xd(Ht(t))}|lt:${t.limitType}`}function $r(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>Hv(i)).join(", ")}]`),zl(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>Pi(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>Pi(i)).join(",")),`Target(${r})`}(Ht(t))}; limitType=${t.limitType})`}function Wl(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):W.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Ds(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,l,u){const h=Xm(o,l,u);return o.inclusive?h<=0:h<0}(r.startAt,Ds(r),i)||r.endAt&&!function(o,l,u){const h=Xm(o,l,u);return o.inclusive?h>=0:h>0}(r.endAt,Ds(r),i))}(t,e)}function xP(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function Qv(t){return(e,n)=>{let r=!1;for(const i of Ds(t)){const s=LP(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function LP(t,e,n){const r=t.field.isKeyField()?W.comparator(e.key,n.key):function(s,o,l){const u=o.data.field(s),h=l.data.field(s);return u!==null&&h!==null?Ri(u,h):q()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return q()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){bi(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return Uv(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MP=new ve(W.comparator);function En(){return MP}const Yv=new ve(W.comparator);function _s(...t){let e=Yv;for(const n of t)e=e.insert(n.key,n);return e}function Xv(t){let e=Yv;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function vr(){return Vs()}function Jv(){return Vs()}function Vs(){return new ji(t=>t.toString(),(t,e)=>t.isEqual(e))}const FP=new ve(W.comparator),UP=new be(W.comparator);function Z(...t){let e=UP;for(const n of t)e=e.add(n);return e}const bP=new be(ie);function jP(){return bP}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Md(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:hl(e)?"-0":e}}function Zv(t){return{integerValue:""+t}}function zP(t,e){return gP(e)?Zv(e):Md(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hl{constructor(){this._=void 0}}function BP(t,e,n){return t instanceof so?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Dd(s)&&(s=Vd(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(n,e):t instanceof oo?tE(t,e):t instanceof ao?nE(t,e):function(i,s){const o=eE(i,s),l=tg(o)+tg(i.Pe);return ch(o)&&ch(i.Pe)?Zv(l):Md(i.serializer,l)}(t,e)}function $P(t,e,n){return t instanceof oo?tE(t,e):t instanceof ao?nE(t,e):n}function eE(t,e){return t instanceof pl?function(r){return ch(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class so extends Hl{}class oo extends Hl{constructor(e){super(),this.elements=e}}function tE(t,e){const n=rE(e);for(const r of t.elements)n.some(i=>Gt(i,r))||n.push(r);return{arrayValue:{values:n}}}class ao extends Hl{constructor(e){super(),this.elements=e}}function nE(t,e){let n=rE(e);for(const r of t.elements)n=n.filter(i=>!Gt(i,r));return{arrayValue:{values:n}}}class pl extends Hl{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function tg(t){return Ie(t.integerValue||t.doubleValue)}function rE(t){return Od(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WP{constructor(e,n){this.field=e,this.transform=n}}function HP(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof oo&&i instanceof oo||r instanceof ao&&i instanceof ao?Ai(r.elements,i.elements,Gt):r instanceof pl&&i instanceof pl?Gt(r.Pe,i.Pe):r instanceof so&&i instanceof so}(t.transform,e.transform)}class qP{constructor(e,n){this.version=e,this.transformResults=n}}class qt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new qt}static exists(e){return new qt(void 0,e)}static updateTime(e){return new qt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Da(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class ql{}function iE(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new oE(t.key,qt.none()):new wo(t.key,t.data,qt.none());{const n=t.data,r=Tt.empty();let i=new be(Fe.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new Mr(t.key,r,new Ot(i.toArray()),qt.none())}}function KP(t,e,n){t instanceof wo?function(i,s,o){const l=i.value.clone(),u=rg(i.fieldTransforms,s,o.transformResults);l.setAll(u),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Mr?function(i,s,o){if(!Da(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=rg(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(sE(i)),u.setAll(l),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Os(t,e,n,r){return t instanceof wo?function(s,o,l,u){if(!Da(s.precondition,o))return l;const h=s.value.clone(),f=ig(s.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof Mr?function(s,o,l,u){if(!Da(s.precondition,o))return l;const h=ig(s.fieldTransforms,u,o),f=o.data;return f.setAll(sE(s)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(g=>g.field))}(t,e,n,r):function(s,o,l){return Da(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function GP(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=eE(r.transform,i||null);s!=null&&(n===null&&(n=Tt.empty()),n.set(r.field,s))}return n||null}function ng(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&Ai(r,i,(s,o)=>HP(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class wo extends ql{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Mr extends ql{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function sE(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function rg(t,e,n){const r=new Map;oe(t.length===n.length);for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,$P(o,l,n[i]))}return r}function ig(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,BP(s,o,e))}return r}class oE extends ql{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class QP extends ql{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YP{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&KP(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=Os(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=Os(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=Jv();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(i.key)?null:l;const u=iE(o,l);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),Z())}isEqual(e){return this.batchId===e.batchId&&Ai(this.mutations,e.mutations,(n,r)=>ng(n,r))&&Ai(this.baseMutations,e.baseMutations,(n,r)=>ng(n,r))}}class Fd{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){oe(e.mutations.length===r.length);let i=function(){return FP}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new Fd(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XP{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JP{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ae,te;function ZP(t){switch(t){default:return q();case L.CANCELLED:case L.UNKNOWN:case L.DEADLINE_EXCEEDED:case L.RESOURCE_EXHAUSTED:case L.INTERNAL:case L.UNAVAILABLE:case L.UNAUTHENTICATED:return!1;case L.INVALID_ARGUMENT:case L.NOT_FOUND:case L.ALREADY_EXISTS:case L.PERMISSION_DENIED:case L.FAILED_PRECONDITION:case L.ABORTED:case L.OUT_OF_RANGE:case L.UNIMPLEMENTED:case L.DATA_LOSS:return!0}}function aE(t){if(t===void 0)return vn("GRPC error has no .code"),L.UNKNOWN;switch(t){case Ae.OK:return L.OK;case Ae.CANCELLED:return L.CANCELLED;case Ae.UNKNOWN:return L.UNKNOWN;case Ae.DEADLINE_EXCEEDED:return L.DEADLINE_EXCEEDED;case Ae.RESOURCE_EXHAUSTED:return L.RESOURCE_EXHAUSTED;case Ae.INTERNAL:return L.INTERNAL;case Ae.UNAVAILABLE:return L.UNAVAILABLE;case Ae.UNAUTHENTICATED:return L.UNAUTHENTICATED;case Ae.INVALID_ARGUMENT:return L.INVALID_ARGUMENT;case Ae.NOT_FOUND:return L.NOT_FOUND;case Ae.ALREADY_EXISTS:return L.ALREADY_EXISTS;case Ae.PERMISSION_DENIED:return L.PERMISSION_DENIED;case Ae.FAILED_PRECONDITION:return L.FAILED_PRECONDITION;case Ae.ABORTED:return L.ABORTED;case Ae.OUT_OF_RANGE:return L.OUT_OF_RANGE;case Ae.UNIMPLEMENTED:return L.UNIMPLEMENTED;case Ae.DATA_LOSS:return L.DATA_LOSS;default:return q()}}(te=Ae||(Ae={}))[te.OK=0]="OK",te[te.CANCELLED=1]="CANCELLED",te[te.UNKNOWN=2]="UNKNOWN",te[te.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",te[te.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",te[te.NOT_FOUND=5]="NOT_FOUND",te[te.ALREADY_EXISTS=6]="ALREADY_EXISTS",te[te.PERMISSION_DENIED=7]="PERMISSION_DENIED",te[te.UNAUTHENTICATED=16]="UNAUTHENTICATED",te[te.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",te[te.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",te[te.ABORTED=10]="ABORTED",te[te.OUT_OF_RANGE=11]="OUT_OF_RANGE",te[te.UNIMPLEMENTED=12]="UNIMPLEMENTED",te[te.INTERNAL=13]="INTERNAL",te[te.UNAVAILABLE=14]="UNAVAILABLE",te[te.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eC(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tC=new Tr([4294967295,4294967295],0);function sg(t){const e=eC().encode(t),n=new Nv;return n.update(e),new Uint8Array(n.digest())}function og(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Tr([n,r],0),new Tr([i,s],0)]}class Ud{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new vs(`Invalid padding: ${n}`);if(r<0)throw new vs(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new vs(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new vs(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Tr.fromNumber(this.Ie)}Ee(e,n,r){let i=e.add(n.multiply(Tr.fromNumber(r)));return i.compare(tC)===1&&(i=new Tr([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=sg(e),[r,i]=og(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);if(!this.de(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Ud(s,i,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=sg(e),[r,i]=og(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class vs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kl{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,To.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new Kl(G.min(),i,new ve(ie),En(),Z())}}class To{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new To(r,n,Z(),Z(),Z())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Va{constructor(e,n,r,i){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=i}}class lE{constructor(e,n){this.targetId=e,this.me=n}}class uE{constructor(e,n,r=ze.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class ag{constructor(){this.fe=0,this.ge=ug(),this.pe=ze.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=Z(),n=Z(),r=Z();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:q()}}),new To(this.pe,this.ye,e,n,r)}Ce(){this.we=!1,this.ge=ug()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,oe(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class nC{constructor(e){this.Le=e,this.Be=new Map,this.ke=En(),this.qe=lg(),this.Qe=new ve(ie)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:q()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,i)=>{this.ze(i)&&n(i)})}He(e){const n=e.targetId,r=e.me.count,i=this.Je(n);if(i){const s=i.target;if(dh(s))if(r===0){const o=new W(s.path);this.Ue(n,o,Ye.newNoDocument(o,G.min()))}else oe(r===1);else{const o=this.Ye(n);if(o!==r){const l=this.Ze(e),u=l?this.Xe(l,e,o):1;if(u!==0){this.je(n);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,h)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,l;try{o=Dr(r).toUint8Array()}catch(u){if(u instanceof bv)return Si("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new Ud(o,i,s)}catch(u){return Si(u instanceof vs?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.Ie===0?null:l}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,s,null),i++)}),i}rt(e){const n=new Map;this.Be.forEach((s,o)=>{const l=this.Je(o);if(l){if(s.current&&dh(l.target)){const u=new W(l.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,Ye.newNoDocument(u,e))}s.be&&(n.set(o,s.ve()),s.Ce())}});let r=Z();this.qe.forEach((s,o)=>{let l=!0;o.forEachWhile(u=>{const h=this.Je(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new Kl(e,n,this.Qe,this.ke,r);return this.ke=En(),this.qe=lg(),this.Qe=new ve(ie),i}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,n)?i.Fe(n,1):i.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new ag,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new be(ie),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||B("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new ag),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function lg(){return new ve(W.comparator)}function ug(){return new ve(W.comparator)}const rC={asc:"ASCENDING",desc:"DESCENDING"},iC={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},sC={and:"AND",or:"OR"};class oC{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function ph(t,e){return t.useProto3Json||zl(e)?e:{value:e}}function ml(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function cE(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function aC(t,e){return ml(t,e.toTimestamp())}function Kt(t){return oe(!!t),G.fromTimestamp(function(n){const r=nr(n);return new Ne(r.seconds,r.nanos)}(t))}function bd(t,e){return mh(t,e).canonicalString()}function mh(t,e){const n=function(i){return new pe(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function hE(t){const e=pe.fromString(t);return oe(gE(e)),e}function gh(t,e){return bd(t.databaseId,e.path)}function rc(t,e){const n=hE(e);if(n.get(1)!==t.databaseId.projectId)throw new $(L.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new $(L.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new W(fE(n))}function dE(t,e){return bd(t.databaseId,e)}function lC(t){const e=hE(t);return e.length===4?pe.emptyPath():fE(e)}function yh(t){return new pe(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function fE(t){return oe(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function cg(t,e,n){return{name:gh(t,e),fields:n.value.mapValue.fields}}function uC(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:q()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(h,f){return h.useProto3Json?(oe(f===void 0||typeof f=="string"),ze.fromBase64String(f||"")):(oe(f===void 0||f instanceof Buffer||f instanceof Uint8Array),ze.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const f=h.code===void 0?L.UNKNOWN:aE(h.code);return new $(f,h.message||"")}(o);n=new uE(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=rc(t,r.document.name),s=Kt(r.document.updateTime),o=r.document.createTime?Kt(r.document.createTime):G.min(),l=new Tt({mapValue:{fields:r.document.fields}}),u=Ye.newFoundDocument(i,s,o,l),h=r.targetIds||[],f=r.removedTargetIds||[];n=new Va(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=rc(t,r.document),s=r.readTime?Kt(r.readTime):G.min(),o=Ye.newNoDocument(i,s),l=r.removedTargetIds||[];n=new Va([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=rc(t,r.document),s=r.removedTargetIds||[];n=new Va([],s,i,null)}else{if(!("filter"in e))return q();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new JP(i,s),l=r.targetId;n=new lE(l,o)}}return n}function cC(t,e){let n;if(e instanceof wo)n={update:cg(t,e.key,e.value)};else if(e instanceof oE)n={delete:gh(t,e.key)};else if(e instanceof Mr)n={update:cg(t,e.key,e.data),updateMask:vC(e.fieldMask)};else{if(!(e instanceof QP))return q();n={verify:gh(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const l=o.transform;if(l instanceof so)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof oo)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof ao)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof pl)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw q()}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:aC(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:q()}(t,e.precondition)),n}function hC(t,e){return t&&t.length>0?(oe(e!==void 0),t.map(n=>function(i,s){let o=i.updateTime?Kt(i.updateTime):Kt(s);return o.isEqual(G.min())&&(o=Kt(s)),new qP(o,i.transformResults||[])}(n,e))):[]}function dC(t,e){return{documents:[dE(t,e.path)]}}function fC(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=dE(t,i);const s=function(h){if(h.length!==0)return mE(Qt.create(h,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(h){if(h.length!==0)return h.map(f=>function(y){return{field:Wr(y.field),direction:gC(y.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=ph(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:n,parent:i}}function pC(t){let e=lC(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){oe(r===1);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(g){const y=pE(g);return y instanceof Qt&&$v(y)?y.getFilters():[y]}(n.where));let o=[];n.orderBy&&(o=function(g){return g.map(y=>function(N){return new fl(Hr(N.field),function(O){switch(O){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(N.direction))}(y))}(n.orderBy));let l=null;n.limit&&(l=function(g){let y;return y=typeof g=="object"?g.value:g,zl(y)?null:y}(n.limit));let u=null;n.startAt&&(u=function(g){const y=!!g.before,R=g.values||[];return new dl(R,y)}(n.startAt));let h=null;return n.endAt&&(h=function(g){const y=!g.before,R=g.values||[];return new dl(R,y)}(n.endAt)),DP(e,i,o,s,l,"F",u,h)}function mC(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return q()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function pE(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=Hr(n.unaryFilter.field);return Ce.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Hr(n.unaryFilter.field);return Ce.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Hr(n.unaryFilter.field);return Ce.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Hr(n.unaryFilter.field);return Ce.create(o,"!=",{nullValue:"NULL_VALUE"});default:return q()}}(t):t.fieldFilter!==void 0?function(n){return Ce.create(Hr(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return q()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return Qt.create(n.compositeFilter.filters.map(r=>pE(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return q()}}(n.compositeFilter.op))}(t):q()}function gC(t){return rC[t]}function yC(t){return iC[t]}function _C(t){return sC[t]}function Wr(t){return{fieldPath:t.canonicalString()}}function Hr(t){return Fe.fromServerFormat(t.fieldPath)}function mE(t){return t instanceof Ce?function(n){if(n.op==="=="){if(Ym(n.value))return{unaryFilter:{field:Wr(n.field),op:"IS_NAN"}};if(Qm(n.value))return{unaryFilter:{field:Wr(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Ym(n.value))return{unaryFilter:{field:Wr(n.field),op:"IS_NOT_NAN"}};if(Qm(n.value))return{unaryFilter:{field:Wr(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Wr(n.field),op:yC(n.op),value:n.value}}}(t):t instanceof Qt?function(n){const r=n.getFilters().map(i=>mE(i));return r.length===1?r[0]:{compositeFilter:{op:_C(n.op),filters:r}}}(t):q()}function vC(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function gE(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un{constructor(e,n,r,i,s=G.min(),o=G.min(),l=ze.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new Un(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Un(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Un(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Un(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EC{constructor(e){this.ct=e}}function wC(t){const e=pC({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?fh(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TC{constructor(){this.un=new IC}addToCollectionParentIndex(e,n){return this.un.add(n),x.resolve()}getCollectionParents(e,n){return x.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return x.resolve()}deleteFieldIndex(e,n){return x.resolve()}deleteAllFieldIndexes(e){return x.resolve()}createTargetIndexes(e,n){return x.resolve()}getDocumentsMatchingTarget(e,n){return x.resolve(null)}getIndexType(e,n){return x.resolve(0)}getFieldIndexes(e,n){return x.resolve([])}getNextCollectionGroupToUpdate(e){return x.resolve(null)}getMinOffset(e,n){return x.resolve(tr.min())}getMinOffsetFromCollectionGroup(e,n){return x.resolve(tr.min())}updateCollectionGroup(e,n,r){return x.resolve()}updateIndexEntries(e,n){return x.resolve()}}class IC{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new be(pe.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new be(pe.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ci(0)}static kn(){return new Ci(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SC{constructor(){this.changes=new ji(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Ye.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?x.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AC{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RC{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&Os(r.mutation,i,Ot.empty(),Ne.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,Z()).next(()=>r))}getLocalViewOfDocuments(e,n,r=Z()){const i=vr();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=_s();return s.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=vr();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,Z()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,i){let s=En();const o=Vs(),l=function(){return Vs()}();return n.forEach((u,h)=>{const f=r.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof Mr)?s=s.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Os(f.mutation,h,f.mutation.getFieldMask(),Ne.now())):o.set(h.key,Ot.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((h,f)=>o.set(h,f)),n.forEach((h,f)=>{var g;return l.set(h,new AC(f,(g=o.get(h))!==null&&g!==void 0?g:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Vs();let i=new ve((o,l)=>o-l),s=Z();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let f=r.get(u)||Ot.empty();f=l.applyToLocalView(h,f),r.set(u,f);const g=(i.get(l.batchId)||Z()).add(u);i=i.insert(l.batchId,g)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,f=u.value,g=Jv();f.forEach(y=>{if(!s.has(y)){const R=iE(n.get(y),r.get(y));R!==null&&g.set(y,R),s=s.add(y)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,g))}return x.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):VP(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):x.resolve(vr());let l=-1,u=s;return o.next(h=>x.forEach(h,(f,g)=>(l<g.largestBatchId&&(l=g.largestBatchId),s.get(f)?x.resolve():this.remoteDocumentCache.getEntry(e,f).next(y=>{u=u.insert(f,y)}))).next(()=>this.populateOverlays(e,h,s)).next(()=>this.computeViews(e,u,h,Z())).next(f=>({batchId:l,changes:Xv(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new W(n)).next(r=>{let i=_s();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=_s();return this.indexManager.getCollectionParents(e,s).next(l=>x.forEach(l,u=>{const h=function(g,y){return new Bl(y,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next(f=>{f.forEach((g,y)=>{o=o.insert(g,y)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,Ye.newInvalidDocument(f)))});let l=_s();return o.forEach((u,h)=>{const f=s.get(u);f!==void 0&&Os(f.mutation,h,Ot.empty(),Ne.now()),Wl(n,h)&&(l=l.insert(u,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PC{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return x.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:Kt(i.createTime)}}(n)),x.resolve()}getNamedQuery(e,n){return x.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(i){return{name:i.name,query:wC(i.bundledQuery),readTime:Kt(i.readTime)}}(n)),x.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CC{constructor(){this.overlays=new ve(W.comparator),this.Ir=new Map}getOverlay(e,n){return x.resolve(this.overlays.get(n))}getOverlays(e,n){const r=vr();return x.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.ht(e,n,s)}),x.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),x.resolve()}getOverlaysForCollection(e,n,r){const i=vr(),s=n.length+1,o=new W(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return x.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new ve((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let f=s.get(h.largestBatchId);f===null&&(f=vr(),s=s.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=vr(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,f)=>l.set(h,f)),!(l.size()>=i)););return x.resolve(l)}ht(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new XP(n,r));let s=this.Ir.get(n);s===void 0&&(s=Z(),this.Ir.set(n,s)),this.Ir.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kC{constructor(){this.sessionToken=ze.EMPTY_BYTE_STRING}getSessionToken(e){return x.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,x.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(){this.Tr=new be(De.Er),this.dr=new be(De.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const r=new De(e,n);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Vr(new De(e,n))}mr(e,n){e.forEach(r=>this.removeReference(r,n))}gr(e){const n=new W(new pe([])),r=new De(n,e),i=new De(n,e+1),s=[];return this.dr.forEachInRange([r,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new W(new pe([])),r=new De(n,e),i=new De(n,e+1);let s=Z();return this.dr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new De(e,0),r=this.Tr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class De{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return W.comparator(e.key,n.key)||ie(e.wr,n.wr)}static Ar(e,n){return ie(e.wr,n.wr)||W.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NC{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new be(De.Er)}checkEmpty(e){return x.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new YP(s,n,r,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new De(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return x.resolve(o)}lookupMutationBatch(e,n){return x.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.vr(r),s=i<0?0:i;return x.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return x.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return x.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new De(n,0),i=new De(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],o=>{const l=this.Dr(o.wr);s.push(l)}),x.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new be(ie);return n.forEach(i=>{const s=new De(i,0),o=new De(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],l=>{r=r.add(l.wr)})}),x.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;W.isDocumentKey(s)||(s=s.child(""));const o=new De(new W(s),0);let l=new be(ie);return this.br.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.wr)),!0)},o),x.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){oe(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return x.forEach(n.mutations,i=>{const s=new De(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,n){const r=new De(n,0),i=this.br.firstAfterOrEqual(r);return x.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,x.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DC{constructor(e){this.Mr=e,this.docs=function(){return new ve(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.Mr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return x.resolve(r?r.document.mutableCopy():Ye.newInvalidDocument(n))}getEntries(e,n){let r=En();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Ye.newInvalidDocument(i))}),x.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=En();const o=n.path,l=new W(o.child("")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||dP(hP(f),r)<=0||(i.has(f.key)||Wl(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return x.resolve(s)}getAllFromCollectionGroup(e,n,r,i){q()}Or(e,n){return x.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new VC(this)}getSize(e){return x.resolve(this.size)}}class VC extends SC{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),x.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OC{constructor(e){this.persistence=e,this.Nr=new ji(n=>xd(n),Ld),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new jd,this.targetCount=0,this.kr=Ci.Bn()}forEachTarget(e,n){return this.Nr.forEach((r,i)=>n(i)),x.resolve()}getLastRemoteSnapshotVersion(e){return x.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return x.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),x.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Lr&&(this.Lr=n),x.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Ci(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,x.resolve()}updateTargetData(e,n){return this.Kn(n),x.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,x.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),x.waitFor(s).next(()=>i)}getTargetCount(e){return x.resolve(this.targetCount)}getTargetData(e,n){const r=this.Nr.get(n)||null;return x.resolve(r)}addMatchingKeys(e,n,r){return this.Br.Rr(n,r),x.resolve()}removeMatchingKeys(e,n,r){this.Br.mr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),x.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),x.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Br.yr(n);return x.resolve(r)}containsKey(e,n){return x.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xC{constructor(e,n){this.qr={},this.overlays={},this.Qr=new Nd(0),this.Kr=!1,this.Kr=!0,this.$r=new kC,this.referenceDelegate=e(this),this.Ur=new OC(this),this.indexManager=new TC,this.remoteDocumentCache=function(i){return new DC(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new EC(n),this.Gr=new PC(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new CC,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.qr[e.toKey()];return r||(r=new NC(n,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,r){B("MemoryPersistence","Starting transaction:",e);const i=new LC(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,n){return x.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,n)))}}class LC extends pP{constructor(e){super(),this.currentSequenceNumber=e}}class zd{constructor(e){this.persistence=e,this.Jr=new jd,this.Yr=null}static Zr(e){return new zd(e)}get Xr(){if(this.Yr)return this.Yr;throw q()}addReference(e,n,r){return this.Jr.addReference(r,n),this.Xr.delete(r.toString()),x.resolve()}removeReference(e,n,r){return this.Jr.removeReference(r,n),this.Xr.add(r.toString()),x.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),x.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return x.forEach(this.Xr,r=>{const i=W.fromPath(r);return this.ei(e,i).next(s=>{s||n.removeEntry(i,G.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(r=>{r?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return x.or([()=>x.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.$i=r,this.Ui=i}static Wi(e,n){let r=Z(),i=Z();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Bd(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MC{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FC{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return SI()?8:mP(Je())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.Yi(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new MC;return this.Xi(e,n,o).next(l=>{if(s.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>s.result)}es(e,n,r,i){return r.documentReadCount<this.ji?(cs()<=ee.DEBUG&&B("QueryEngine","SDK will not create cache indexes for query:",$r(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),x.resolve()):(cs()<=ee.DEBUG&&B("QueryEngine","Query:",$r(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(cs()<=ee.DEBUG&&B("QueryEngine","The SDK decides to create cache indexes for query:",$r(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ht(n))):x.resolve())}Yi(e,n){if(eg(n))return x.resolve(null);let r=Ht(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=fh(n,null,"F"),r=Ht(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=Z(...s);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.ts(n,l);return this.ns(n,h,o,u.readTime)?this.Yi(e,fh(n,null,"F")):this.rs(e,h,n,u)}))})))}Zi(e,n,r,i){return eg(n)||i.isEqual(G.min())?x.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const o=this.ts(n,s);return this.ns(n,o,r,i)?x.resolve(null):(cs()<=ee.DEBUG&&B("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),$r(n)),this.rs(e,o,n,cP(i,-1)).next(l=>l))})}ts(e,n){let r=new be(Qv(e));return n.forEach((i,s)=>{Wl(e,s)&&(r=r.add(s))}),r}ns(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,n,r){return cs()<=ee.DEBUG&&B("QueryEngine","Using full collection scan to execute query:",$r(n)),this.Ji.getDocumentsMatchingQuery(e,n,tr.min(),r)}rs(e,n,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UC{constructor(e,n,r,i){this.persistence=e,this.ss=n,this.serializer=i,this.os=new ve(ie),this._s=new ji(s=>xd(s),Ld),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new RC(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function bC(t,e,n,r){return new UC(t,e,n,r)}async function yE(t,e){const n=Q(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.ls(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let u=Z();for(const h of i){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of s){l.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return n.localDocuments.getDocuments(r,u).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function jC(t,e){const n=Q(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,u,h,f){const g=h.batch,y=g.keys();let R=x.resolve();return y.forEach(N=>{R=R.next(()=>f.getEntry(u,N)).next(k=>{const O=h.docVersions.get(N);oe(O!==null),k.version.compareTo(O)<0&&(g.applyToRemoteDocument(k,h),k.isValidDocument()&&(k.setReadTime(h.commitVersion),f.addEntry(k)))})}),R.next(()=>l.mutationQueue.removeMutationBatch(u,g))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=Z();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function _E(t){const e=Q(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function zC(t,e){const n=Q(t),r=e.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const l=[];e.targetChanges.forEach((f,g)=>{const y=i.get(g);if(!y)return;l.push(n.Ur.removeMatchingKeys(s,f.removedDocuments,g).next(()=>n.Ur.addMatchingKeys(s,f.addedDocuments,g)));let R=y.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(g)!==null?R=R.withResumeToken(ze.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,r)),i=i.insert(g,R),function(k,O,I){return k.resumeToken.approximateByteSize()===0||O.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=3e8?!0:I.addedDocuments.size+I.modifiedDocuments.size+I.removedDocuments.size>0}(y,R,f)&&l.push(n.Ur.updateTargetData(s,R))});let u=En(),h=Z();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(BC(s,o,e.documentUpdates).next(f=>{u=f.Ps,h=f.Is})),!r.isEqual(G.min())){const f=n.Ur.getLastRemoteSnapshotVersion(s).next(g=>n.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(f)}return x.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,h)).next(()=>u)}).then(s=>(n.os=i,s))}function BC(t,e,n){let r=Z(),i=Z();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=En();return n.forEach((l,u)=>{const h=s.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(G.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):B("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{Ps:o,Is:i}})}function $C(t,e){const n=Q(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function WC(t,e){const n=Q(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.Ur.getTargetData(r,e).next(s=>s?(i=s,x.resolve(i)):n.Ur.allocateTargetId(r).next(o=>(i=new Un(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.os=n.os.insert(r.targetId,r),n._s.set(e,r.targetId)),r})}async function _h(t,e,n){const r=Q(t),i=r.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Eo(o))throw o;B("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function hg(t,e,n){const r=Q(t);let i=G.min(),s=Z();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,f){const g=Q(u),y=g._s.get(f);return y!==void 0?x.resolve(g.os.get(y)):g.Ur.getTargetData(h,f)}(r,o,Ht(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,l.targetId).next(u=>{s=u})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,n?i:G.min(),n?s:Z())).next(l=>(HC(r,xP(e),l),{documents:l,Ts:s})))}function HC(t,e,n){let r=t.us.get(e)||G.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.us.set(e,r)}class dg{constructor(){this.activeTargetIds=jP()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class qC{constructor(){this.so=new dg,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,r){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new dg,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KC{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fg{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){B("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){B("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ha=null;function ic(){return ha===null?ha=function(){return 268435456+Math.round(2147483648*Math.random())}():ha++,"0x"+ha.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GC={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QC{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="WebChannelConnection";class YC extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+n.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(n,r,i,s,o){const l=ic(),u=this.xo(n,r.toUriEncodedString());B("RestConnection",`Sending RPC '${n}' ${l}:`,u,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,s,o),this.No(n,u,h,i).then(f=>(B("RestConnection",`Received RPC '${n}' ${l}: `,f),f),f=>{throw Si("RestConnection",`RPC '${n}' ${l} failed with error: `,f,"url: ",u,"request:",i),f})}Lo(n,r,i,s,o,l){return this.Mo(n,r,i,s,o)}Oo(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Ui}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>n[o]=s),i&&i.headers.forEach((s,o)=>n[o]=s)}xo(n,r){const i=GC[n];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,r,i){const s=ic();return new Promise((o,l)=>{const u=new Dv;u.setWithCredentials(!0),u.listenOnce(Vv.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case ka.NO_ERROR:const f=u.getResponseJson();B(Ke,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),o(f);break;case ka.TIMEOUT:B(Ke,`RPC '${e}' ${s} timed out`),l(new $(L.DEADLINE_EXCEEDED,"Request time out"));break;case ka.HTTP_ERROR:const g=u.getStatus();if(B(Ke,`RPC '${e}' ${s} failed with status:`,g,"response text:",u.getResponseText()),g>0){let y=u.getResponseJson();Array.isArray(y)&&(y=y[0]);const R=y==null?void 0:y.error;if(R&&R.status&&R.message){const N=function(O){const I=O.toLowerCase().replace(/_/g,"-");return Object.values(L).indexOf(I)>=0?I:L.UNKNOWN}(R.status);l(new $(N,R.message))}else l(new $(L.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new $(L.UNAVAILABLE,"Connection failed."));break;default:q()}}finally{B(Ke,`RPC '${e}' ${s} completed.`)}});const h=JSON.stringify(i);B(Ke,`RPC '${e}' ${s} sending request:`,i),u.send(n,"POST",h,r,15)})}Bo(e,n,r){const i=ic(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Lv(),l=xv(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const f=s.join("");B(Ke,`Creating RPC '${e}' stream ${i}: ${f}`,u);const g=o.createWebChannel(f,u);let y=!1,R=!1;const N=new QC({Io:O=>{R?B(Ke,`Not sending because RPC '${e}' stream ${i} is closed:`,O):(y||(B(Ke,`Opening RPC '${e}' stream ${i} transport.`),g.open(),y=!0),B(Ke,`RPC '${e}' stream ${i} sending:`,O),g.send(O))},To:()=>g.close()}),k=(O,I,E)=>{O.listen(I,S=>{try{E(S)}catch(V){setTimeout(()=>{throw V},0)}})};return k(g,ys.EventType.OPEN,()=>{R||(B(Ke,`RPC '${e}' stream ${i} transport opened.`),N.yo())}),k(g,ys.EventType.CLOSE,()=>{R||(R=!0,B(Ke,`RPC '${e}' stream ${i} transport closed`),N.So())}),k(g,ys.EventType.ERROR,O=>{R||(R=!0,Si(Ke,`RPC '${e}' stream ${i} transport errored:`,O),N.So(new $(L.UNAVAILABLE,"The operation could not be completed")))}),k(g,ys.EventType.MESSAGE,O=>{var I;if(!R){const E=O.data[0];oe(!!E);const S=E,V=S.error||((I=S[0])===null||I===void 0?void 0:I.error);if(V){B(Ke,`RPC '${e}' stream ${i} received error:`,V);const b=V.status;let U=function(_){const w=Ae[_];if(w!==void 0)return aE(w)}(b),v=V.message;U===void 0&&(U=L.INTERNAL,v="Unknown error status: "+b+" with message "+V.message),R=!0,N.So(new $(U,v)),g.close()}else B(Ke,`RPC '${e}' stream ${i} received:`,E),N.bo(E)}}),k(l,Ov.STAT_EVENT,O=>{O.stat===lh.PROXY?B(Ke,`RPC '${e}' stream ${i} detected buffering proxy`):O.stat===lh.NOPROXY&&B(Ke,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{N.wo()},0),N}}function sc(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gl(t){return new oC(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vE{constructor(e,n,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,n-r);i>0&&B("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EE{constructor(e,n,r,i,s,o,l,u){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new vE(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===L.RESOURCE_EXHAUSTED?(vn(n.toString()),vn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===L.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===n&&this.P_(r,i)},r=>{e(()=>{const i=new $(L.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,n){const r=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return B("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(B("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class XC extends EE{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=uC(this.serializer,e),r=function(s){if(!("targetChange"in s))return G.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?G.min():o.readTime?Kt(o.readTime):G.min()}(e);return this.listener.d_(n,r)}A_(e){const n={};n.database=yh(this.serializer),n.addTarget=function(s,o){let l;const u=o.target;if(l=dh(u)?{documents:dC(s,u)}:{query:fC(s,u)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=cE(s,o.resumeToken);const h=ph(s,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(G.min())>0){l.readTime=ml(s,o.snapshotVersion.toTimestamp());const h=ph(s,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const r=mC(this.serializer,e);r&&(n.labels=r),this.a_(n)}R_(e){const n={};n.database=yh(this.serializer),n.removeTarget=e,this.a_(n)}}class JC extends EE{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return oe(!!e.streamToken),this.lastStreamToken=e.streamToken,oe(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){oe(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=hC(e.writeResults,e.commitTime),r=Kt(e.commitTime);return this.listener.g_(r,n)}p_(){const e={};e.database=yh(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>cC(this.serializer,r))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZC extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new $(L.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,mh(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new $(L.UNKNOWN,s.toString())})}Lo(e,n,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,mh(n,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(L.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class ek{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(vn(n),this.D_=!1):B("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tk{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{r.enqueueAndForget(async()=>{Fr(this)&&(B("RemoteStore","Restarting streams for network reachability change."),await async function(u){const h=Q(u);h.L_.add(4),await Io(h),h.q_.set("Unknown"),h.L_.delete(4),await Ql(h)}(this))})}),this.q_=new ek(r,i)}}async function Ql(t){if(Fr(t))for(const e of t.B_)await e(!0)}async function Io(t){for(const e of t.B_)await e(!1)}function wE(t,e){const n=Q(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),qd(n)?Hd(n):zi(n).r_()&&Wd(n,e))}function $d(t,e){const n=Q(t),r=zi(n);n.N_.delete(e),r.r_()&&TE(n,e),n.N_.size===0&&(r.r_()?r.o_():Fr(n)&&n.q_.set("Unknown"))}function Wd(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}zi(t).A_(e)}function TE(t,e){t.Q_.xe(e),zi(t).R_(e)}function Hd(t){t.Q_=new nC({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),zi(t).start(),t.q_.v_()}function qd(t){return Fr(t)&&!zi(t).n_()&&t.N_.size>0}function Fr(t){return Q(t).L_.size===0}function IE(t){t.Q_=void 0}async function nk(t){t.q_.set("Online")}async function rk(t){t.N_.forEach((e,n)=>{Wd(t,e)})}async function ik(t,e){IE(t),qd(t)?(t.q_.M_(e),Hd(t)):t.q_.set("Unknown")}async function sk(t,e,n){if(t.q_.set("Online"),e instanceof uE&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(t,e)}catch(r){B("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await gl(t,r)}else if(e instanceof Va?t.Q_.Ke(e):e instanceof lE?t.Q_.He(e):t.Q_.We(e),!n.isEqual(G.min()))try{const r=await _E(t.localStore);n.compareTo(r)>=0&&await function(s,o){const l=s.Q_.rt(o);return l.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=s.N_.get(h);f&&s.N_.set(h,f.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,h)=>{const f=s.N_.get(u);if(!f)return;s.N_.set(u,f.withResumeToken(ze.EMPTY_BYTE_STRING,f.snapshotVersion)),TE(s,u);const g=new Un(f.target,u,h,f.sequenceNumber);Wd(s,g)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){B("RemoteStore","Failed to raise snapshot:",r),await gl(t,r)}}async function gl(t,e,n){if(!Eo(e))throw e;t.L_.add(1),await Io(t),t.q_.set("Offline"),n||(n=()=>_E(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{B("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await Ql(t)})}function SE(t,e){return e().catch(n=>gl(t,n,e))}async function Yl(t){const e=Q(t),n=rr(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;ok(e);)try{const i=await $C(e.localStore,r);if(i===null){e.O_.length===0&&n.o_();break}r=i.batchId,ak(e,i)}catch(i){await gl(e,i)}AE(e)&&RE(e)}function ok(t){return Fr(t)&&t.O_.length<10}function ak(t,e){t.O_.push(e);const n=rr(t);n.r_()&&n.V_&&n.m_(e.mutations)}function AE(t){return Fr(t)&&!rr(t).n_()&&t.O_.length>0}function RE(t){rr(t).start()}async function lk(t){rr(t).p_()}async function uk(t){const e=rr(t);for(const n of t.O_)e.m_(n.mutations)}async function ck(t,e,n){const r=t.O_.shift(),i=Fd.from(r,e,n);await SE(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await Yl(t)}async function hk(t,e){e&&rr(t).V_&&await async function(r,i){if(function(o){return ZP(o)&&o!==L.ABORTED}(i.code)){const s=r.O_.shift();rr(r).s_(),await SE(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Yl(r)}}(t,e),AE(t)&&RE(t)}async function pg(t,e){const n=Q(t);n.asyncQueue.verifyOperationInProgress(),B("RemoteStore","RemoteStore received new credentials");const r=Fr(n);n.L_.add(3),await Io(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await Ql(n)}async function dk(t,e){const n=Q(t);e?(n.L_.delete(2),await Ql(n)):e||(n.L_.add(2),await Io(n),n.q_.set("Unknown"))}function zi(t){return t.K_||(t.K_=function(n,r,i){const s=Q(n);return s.w_(),new XC(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:nk.bind(null,t),Ro:rk.bind(null,t),mo:ik.bind(null,t),d_:sk.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),qd(t)?Hd(t):t.q_.set("Unknown")):(await t.K_.stop(),IE(t))})),t.K_}function rr(t){return t.U_||(t.U_=function(n,r,i){const s=Q(n);return s.w_(),new JC(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:lk.bind(null,t),mo:hk.bind(null,t),f_:uk.bind(null,t),g_:ck.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await Yl(t)):(await t.U_.stop(),t.O_.length>0&&(B("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new Xn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,l=new Kd(e,n,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(L.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Gd(t,e){if(vn("AsyncQueue",`${e}: ${t}`),Eo(t))return new $(L.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{constructor(e){this.comparator=e?(n,r)=>e(n,r)||W.comparator(n.key,r.key):(n,r)=>W.comparator(n.key,r.key),this.keyedMap=_s(),this.sortedSet=new ve(this.comparator)}static emptySet(e){return new pi(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof pi)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new pi;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mg{constructor(){this.W_=new ve(W.comparator)}track(e){const n=e.doc.key,r=this.W_.get(n);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(n,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(n):e.type===1&&r.type===2?this.W_=this.W_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):q():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,r)=>{e.push(r)}),e}}class ki{constructor(e,n,r,i,s,o,l,u,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new ki(e,n,pi.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&$l(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fk{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class pk{constructor(){this.queries=gg(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,r){const i=Q(n),s=i.queries;i.queries=gg(),s.forEach((o,l)=>{for(const u of l.j_)u.onError(r)})})(this,new $(L.ABORTED,"Firestore shutting down"))}}function gg(){return new ji(t=>Gv(t),$l)}async function mk(t,e){const n=Q(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new fk,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await n.onListen(i,!0);break;case 1:s.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=Gd(o,`Initialization of query '${$r(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&Qd(n)}async function gk(t,e){const n=Q(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function yk(t,e){const n=Q(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const l of o.j_)l.X_(i)&&(r=!0);o.z_=i}}r&&Qd(n)}function _k(t,e,n){const r=Q(t),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(n);r.queries.delete(e)}function Qd(t){t.Y_.forEach(e=>{e.next()})}var vh,yg;(yg=vh||(vh={})).ea="default",yg.Cache="cache";class vk{constructor(e,n,r){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new ki(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const r=n!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=ki.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==vh.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(e){this.key=e}}class CE{constructor(e){this.key=e}}class Ek{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Z(),this.mutatedKeys=Z(),this.Aa=Qv(e),this.Ra=new pi(this.Aa)}get Va(){return this.Ta}ma(e,n){const r=n?n.fa:new mg,i=n?n.Ra:this.Ra;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,g)=>{const y=i.get(f),R=Wl(this.query,g)?g:null,N=!!y&&this.mutatedKeys.has(y.key),k=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let O=!1;y&&R?y.data.isEqual(R.data)?N!==k&&(r.track({type:3,doc:R}),O=!0):this.ga(y,R)||(r.track({type:2,doc:R}),O=!0,(u&&this.Aa(R,u)>0||h&&this.Aa(R,h)<0)&&(l=!0)):!y&&R?(r.track({type:0,doc:R}),O=!0):y&&!R&&(r.track({type:1,doc:y}),O=!0,(u||h)&&(l=!0)),O&&(R?(o=o.add(R),s=k?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{Ra:o,fa:r,ns:l,mutatedKeys:s}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((f,g)=>function(R,N){const k=O=>{switch(O){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return q()}};return k(R)-k(N)}(f.type,g.type)||this.Aa(f.doc,g.doc)),this.pa(r),i=i!=null&&i;const l=n&&!i?this.ya():[],u=this.da.size===0&&this.current&&!i?1:0,h=u!==this.Ea;return this.Ea=u,o.length!==0||h?{snapshot:new ki(this.query,e.Ra,s,o,e.mutatedKeys,u===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new mg,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=Z(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const n=[];return e.forEach(r=>{this.da.has(r)||n.push(new CE(r))}),this.da.forEach(r=>{e.has(r)||n.push(new PE(r))}),n}ba(e){this.Ta=e.Ts,this.da=Z();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return ki.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class wk{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class Tk{constructor(e){this.key=e,this.va=!1}}class Ik{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ji(l=>Gv(l),$l),this.Ma=new Map,this.xa=new Set,this.Oa=new ve(W.comparator),this.Na=new Map,this.La=new jd,this.Ba={},this.ka=new Map,this.qa=Ci.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Sk(t,e,n=!0){const r=xE(t);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await kE(r,e,n,!0),i}async function Ak(t,e){const n=xE(t);await kE(n,e,!0,!1)}async function kE(t,e,n,r){const i=await WC(t.localStore,Ht(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return r&&(l=await Rk(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&wE(t.remoteStore,i),l}async function Rk(t,e,n,r,i){t.Ka=(g,y,R)=>async function(k,O,I,E){let S=O.view.ma(I);S.ns&&(S=await hg(k.localStore,O.query,!1).then(({documents:v})=>O.view.ma(v,S)));const V=E&&E.targetChanges.get(O.targetId),b=E&&E.targetMismatches.get(O.targetId)!=null,U=O.view.applyChanges(S,k.isPrimaryClient,V,b);return vg(k,O.targetId,U.wa),U.snapshot}(t,g,y,R);const s=await hg(t.localStore,e,!0),o=new Ek(e,s.Ts),l=o.ma(s.documents),u=To.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),h=o.applyChanges(l,t.isPrimaryClient,u);vg(t,n,h.wa);const f=new wk(e,n,o);return t.Fa.set(e,f),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),h.snapshot}async function Pk(t,e,n){const r=Q(t),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(o=>!$l(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await _h(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&$d(r.remoteStore,i.targetId),Eh(r,i.targetId)}).catch(vo)):(Eh(r,i.targetId),await _h(r.localStore,i.targetId,!0))}async function Ck(t,e){const n=Q(t),r=n.Fa.get(e),i=n.Ma.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),$d(n.remoteStore,r.targetId))}async function kk(t,e,n){const r=Mk(t);try{const i=await function(o,l){const u=Q(o),h=Ne.now(),f=l.reduce((R,N)=>R.add(N.key),Z());let g,y;return u.persistence.runTransaction("Locally write mutations","readwrite",R=>{let N=En(),k=Z();return u.cs.getEntries(R,f).next(O=>{N=O,N.forEach((I,E)=>{E.isValidDocument()||(k=k.add(I))})}).next(()=>u.localDocuments.getOverlayedDocuments(R,N)).next(O=>{g=O;const I=[];for(const E of l){const S=GP(E,g.get(E.key).overlayedDocument);S!=null&&I.push(new Mr(E.key,S,jv(S.value.mapValue),qt.exists(!0)))}return u.mutationQueue.addMutationBatch(R,h,I,l)}).next(O=>{y=O;const I=O.applyToLocalDocumentSet(g,k);return u.documentOverlayCache.saveOverlays(R,O.batchId,I)})}).then(()=>({batchId:y.batchId,changes:Xv(g)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,l,u){let h=o.Ba[o.currentUser.toKey()];h||(h=new ve(ie)),h=h.insert(l,u),o.Ba[o.currentUser.toKey()]=h}(r,i.batchId,n),await So(r,i.changes),await Yl(r.remoteStore)}catch(i){const s=Gd(i,"Failed to persist write");n.reject(s)}}async function NE(t,e){const n=Q(t);try{const r=await zC(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Na.get(s);o&&(oe(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?oe(o.va):i.removedDocuments.size>0&&(oe(o.va),o.va=!1))}),await So(n,r,e)}catch(r){await vo(r)}}function _g(t,e,n){const r=Q(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Fa.forEach((s,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const u=Q(o);u.onlineState=l;let h=!1;u.queries.forEach((f,g)=>{for(const y of g.j_)y.Z_(l)&&(h=!0)}),h&&Qd(u)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Nk(t,e,n){const r=Q(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Na.get(e),s=i&&i.key;if(s){let o=new ve(W.comparator);o=o.insert(s,Ye.newNoDocument(s,G.min()));const l=Z().add(s),u=new Kl(G.min(),new Map,new ve(ie),o,l);await NE(r,u),r.Oa=r.Oa.remove(s),r.Na.delete(e),Yd(r)}else await _h(r.localStore,e,!1).then(()=>Eh(r,e,n)).catch(vo)}async function Dk(t,e){const n=Q(t),r=e.batch.batchId;try{const i=await jC(n.localStore,e);VE(n,r,null),DE(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await So(n,i)}catch(i){await vo(i)}}async function Vk(t,e,n){const r=Q(t);try{const i=await function(o,l){const u=Q(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return u.mutationQueue.lookupMutationBatch(h,l).next(g=>(oe(g!==null),f=g.keys(),u.mutationQueue.removeMutationBatch(h,g))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>u.localDocuments.getDocuments(h,f))})}(r.localStore,e);VE(r,e,n),DE(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await So(r,i)}catch(i){await vo(i)}}function DE(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function VE(t,e,n){const r=Q(t);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function Eh(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Ma.get(e))t.Fa.delete(r),n&&t.Ca.$a(r,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(r=>{t.La.containsKey(r)||OE(t,r)})}function OE(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&($d(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Yd(t))}function vg(t,e,n){for(const r of n)r instanceof PE?(t.La.addReference(r.key,e),Ok(t,r)):r instanceof CE?(B("SyncEngine","Document no longer in limbo: "+r.key),t.La.removeReference(r.key,e),t.La.containsKey(r.key)||OE(t,r.key)):q()}function Ok(t,e){const n=e.key,r=n.path.canonicalString();t.Oa.get(n)||t.xa.has(r)||(B("SyncEngine","New document in limbo: "+n),t.xa.add(r),Yd(t))}function Yd(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new W(pe.fromString(e)),r=t.qa.next();t.Na.set(r,new Tk(n)),t.Oa=t.Oa.insert(n,r),wE(t.remoteStore,new Un(Ht(Kv(n.path)),r,"TargetPurposeLimboResolution",Nd.oe))}}async function So(t,e,n){const r=Q(t),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((l,u)=>{o.push(r.Ka(u,e,n).then(h=>{var f;if((h||n)&&r.isPrimaryClient){const g=h?!h.fromCache:(f=n==null?void 0:n.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,g?"current":"not-current")}if(h){i.push(h);const g=Bd.Wi(u.targetId,h);s.push(g)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(u,h){const f=Q(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",g=>x.forEach(h,y=>x.forEach(y.$i,R=>f.persistence.referenceDelegate.addReference(g,y.targetId,R)).next(()=>x.forEach(y.Ui,R=>f.persistence.referenceDelegate.removeReference(g,y.targetId,R)))))}catch(g){if(!Eo(g))throw g;B("LocalStore","Failed to update sequence numbers: "+g)}for(const g of h){const y=g.targetId;if(!g.fromCache){const R=f.os.get(y),N=R.snapshotVersion,k=R.withLastLimboFreeSnapshotVersion(N);f.os=f.os.insert(y,k)}}}(r.localStore,s))}async function xk(t,e){const n=Q(t);if(!n.currentUser.isEqual(e)){B("SyncEngine","User change. New user:",e.toKey());const r=await yE(n.localStore,e);n.currentUser=e,function(s,o){s.ka.forEach(l=>{l.forEach(u=>{u.reject(new $(L.CANCELLED,o))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await So(n,r.hs)}}function Lk(t,e){const n=Q(t),r=n.Na.get(e);if(r&&r.va)return Z().add(r.key);{let i=Z();const s=n.Ma.get(e);if(!s)return i;for(const o of s){const l=n.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function xE(t){const e=Q(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=NE.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Lk.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Nk.bind(null,e),e.Ca.d_=yk.bind(null,e.eventManager),e.Ca.$a=_k.bind(null,e.eventManager),e}function Mk(t){const e=Q(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Dk.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Vk.bind(null,e),e}class yl{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Gl(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return bC(this.persistence,new FC,e.initialUser,this.serializer)}Ga(e){return new xC(zd.Zr,this.serializer)}Wa(e){return new qC}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}yl.provider={build:()=>new yl};class wh{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>_g(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=xk.bind(null,this.syncEngine),await dk(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new pk}()}createDatastore(e){const n=Gl(e.databaseInfo.databaseId),r=function(s){return new YC(s)}(e.databaseInfo);return function(s,o,l,u){return new ZC(s,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,l){return new tk(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>_g(this.syncEngine,n,0),function(){return fg.D()?new fg:new KC}())}createSyncEngine(e,n){return function(i,s,o,l,u,h,f){const g=new Ik(i,s,o,l,u,h);return f&&(g.Qa=!0),g}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=Q(i);B("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Io(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}wh.provider={build:()=>new wh};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fk{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):vn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uk{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=Ge.UNAUTHENTICATED,this.clientId=Fv.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{B("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(B("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Xn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Gd(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function oc(t,e){t.asyncQueue.verifyOperationInProgress(),B("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await yE(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Eg(t,e){t.asyncQueue.verifyOperationInProgress();const n=await bk(t);B("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>pg(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>pg(e.remoteStore,i)),t._onlineComponents=e}async function bk(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){B("FirestoreClient","Using user provided OfflineComponentProvider");try{await oc(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===L.FAILED_PRECONDITION||i.code===L.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;Si("Error using user provided cache. Falling back to memory cache: "+n),await oc(t,new yl)}}else B("FirestoreClient","Using default OfflineComponentProvider"),await oc(t,new yl);return t._offlineComponents}async function LE(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(B("FirestoreClient","Using user provided OnlineComponentProvider"),await Eg(t,t._uninitializedComponentsProvider._online)):(B("FirestoreClient","Using default OnlineComponentProvider"),await Eg(t,new wh))),t._onlineComponents}function jk(t){return LE(t).then(e=>e.syncEngine)}async function zk(t){const e=await LE(t),n=e.eventManager;return n.onListen=Sk.bind(null,e.syncEngine),n.onUnlisten=Pk.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=Ak.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=Ck.bind(null,e.syncEngine),n}function Bk(t,e,n={}){const r=new Xn;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,h){const f=new Fk({next:y=>{f.Za(),o.enqueueAndForget(()=>gk(s,g)),y.fromCache&&u.source==="server"?h.reject(new $(L.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(y)},error:y=>h.reject(y)}),g=new vk(l,f,{includeMetadataChanges:!0,_a:!0});return mk(s,g)}(await zk(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ME(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wg=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FE(t,e,n){if(!n)throw new $(L.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function $k(t,e,n,r){if(e===!0&&r===!0)throw new $(L.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Tg(t){if(!W.isDocumentKey(t))throw new $(L.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Ig(t){if(W.isDocumentKey(t))throw new $(L.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Xd(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":q()}function Ni(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new $(L.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Xd(t);throw new $(L.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sg{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new $(L.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(L.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}$k("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ME((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new $(L.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new $(L.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new $(L.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Xl{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Sg({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(L.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(L.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Sg(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new tP;switch(r.type){case"firstParty":return new sP(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new $(L.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=wg.get(n);r&&(B("ComponentProvider","Removing Datastore"),wg.delete(n),r.terminate())}(this),Promise.resolve()}}function Wk(t,e,n,r={}){var i;const s=(t=Ni(t,Xl))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&Si("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let l,u;if(typeof r.mockUserToken=="string")l=r.mockUserToken,u=Ge.MOCK_USER;else{l=yI(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const h=r.mockUserToken.sub||r.mockUserToken.user_id;if(!h)throw new $(L.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Ge(h)}t._authCredentials=new nP(new Mv(l,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Jl(this.firestore,e,this._query)}}class At{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Jn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new At(this.firestore,e,this._key)}}class Jn extends Jl{constructor(e,n,r){super(e,n,Kv(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new At(this.firestore,null,new W(e))}withConverter(e){return new Jn(this.firestore,e,this._path)}}function Zl(t,e,...n){if(t=gt(t),FE("collection","path",e),t instanceof Xl){const r=pe.fromString(e,...n);return Ig(r),new Jn(t,null,r)}{if(!(t instanceof At||t instanceof Jn))throw new $(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(pe.fromString(e,...n));return Ig(r),new Jn(t.firestore,null,r)}}function UE(t,e,...n){if(t=gt(t),arguments.length===1&&(e=Fv.newId()),FE("doc","path",e),t instanceof Xl){const r=pe.fromString(e,...n);return Tg(r),new At(t,null,new W(r))}{if(!(t instanceof At||t instanceof Jn))throw new $(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(pe.fromString(e,...n));return Tg(r),new At(t.firestore,t instanceof Jn?t.converter:null,new W(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ag{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new vE(this,"async_queue_retry"),this.Vu=()=>{const r=sc();r&&B("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=sc();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=sc();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Xn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Eo(e))throw e;B("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(r);throw vn("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const i=Kd.createAndSchedule(this,e,n,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&q()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class eu extends Xl{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new Ag,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ag(e),this._firestoreClient=void 0,await e}}}function Hk(t,e){const n=typeof t=="object"?t:vd(),r=typeof t=="string"?t:"(default)",i=_d(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=mI("firestore");s&&Wk(i,...s)}return i}function bE(t){if(t._terminated)throw new $(L.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||qk(t),t._firestoreClient}function qk(t){var e,n,r;const i=t._freezeSettings(),s=function(l,u,h,f){return new _P(l,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,ME(f.experimentalLongPollingOptions),f.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new Uk(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Di(ze.fromBase64String(e))}catch(n){throw new $(L.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Di(ze.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jd{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new $(L.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Fe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ef{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new $(L.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new $(L.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ie(this._lat,e._lat)||ie(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kk=/^__.*__$/;class Gk{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Mr(e,this.data,this.fieldMask,n,this.fieldTransforms):new wo(e,this.data,n,this.fieldTransforms)}}function jE(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw q()}}class nf{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new nf(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return _l(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(jE(this.Cu)&&Kk.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Qk{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Gl(e)}Qu(e,n,r,i=!1){return new nf({Cu:e,methodName:n,qu:r,path:Fe.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function zE(t){const e=t._freezeSettings(),n=Gl(t._databaseId);return new Qk(t._databaseId,!!e.ignoreUndefinedProperties,n)}function BE(t,e,n,r,i,s={}){const o=t.Qu(s.merge||s.mergeFields?2:0,e,n,i);qE("Data must be an object, but it was:",o,r);const l=WE(r,o);let u,h;if(s.merge)u=new Ot(o.fieldMask),h=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const g of s.mergeFields){const y=Yk(e,g,n);if(!o.contains(y))throw new $(L.INVALID_ARGUMENT,`Field '${y}' is specified in your field mask but missing from your input data.`);Jk(f,y)||f.push(y)}u=new Ot(f),h=o.fieldTransforms.filter(g=>u.covers(g.field))}else u=null,h=o.fieldTransforms;return new Gk(new Tt(l),u,h)}class rf extends Zd{_toFieldTransform(e){return new WP(e.path,new so)}isEqual(e){return e instanceof rf}}function $E(t,e){if(HE(t=gt(t)))return qE("Unsupported field value:",e,t),WE(t,e);if(t instanceof Zd)return function(r,i){if(!jE(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let u=$E(l,i.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=gt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return zP(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=Ne.fromDate(r);return{timestampValue:ml(i.serializer,s)}}if(r instanceof Ne){const s=new Ne(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ml(i.serializer,s)}}if(r instanceof ef)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Di)return{bytesValue:cE(i.serializer,r._byteString)};if(r instanceof At){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:bd(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof tf)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw l.Bu("VectorValues must only contain numeric values.");return Md(l.serializer,u)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${Xd(r)}`)}(t,e)}function WE(t,e){const n={};return Uv(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):bi(t,(r,i)=>{const s=$E(i,e.Mu(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function HE(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Ne||t instanceof ef||t instanceof Di||t instanceof At||t instanceof Zd||t instanceof tf)}function qE(t,e,n){if(!HE(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=Xd(n);throw r==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}}function Yk(t,e,n){if((e=gt(e))instanceof Jd)return e._internalPath;if(typeof e=="string")return KE(t,e);throw _l("Field path arguments must be of type string or ",t,!1,void 0,n)}const Xk=new RegExp("[~\\*/\\[\\]]");function KE(t,e,n){if(e.search(Xk)>=0)throw _l(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Jd(...e.split("."))._internalPath}catch{throw _l(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function _l(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new $(L.INVALID_ARGUMENT,l+t+u)}function Jk(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GE{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new At(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Zk(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(QE("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Zk extends GE{data(){return super.data()}}function QE(t,e){return typeof e=="string"?KE(t,e):e instanceof Jd?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e1(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new $(L.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class t1{convertValue(e,n="none"){switch(Vr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ie(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Dr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw q()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return bi(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;const s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Ie(o.doubleValue));return new tf(s)}convertGeoPoint(e){return new ef(Ie(e.latitude),Ie(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Vd(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(no(e));default:return null}}convertTimestamp(e){const n=nr(e);return new Ne(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=pe.fromString(e);oe(gE(r));const i=new ro(r.get(1),r.get(3)),s=new W(r.popFirst(5));return i.isEqual(n)||vn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YE(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class da{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class n1 extends GE{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Oa(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(QE("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class Oa extends n1{data(e={}){return super.data(e)}}class r1{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new da(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Oa(this._firestore,this._userDataWriter,r.key,r,new da(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new $(L.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const u=new Oa(i._firestore,i._userDataWriter,l.doc.key,l.doc,new da(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const u=new Oa(i._firestore,i._userDataWriter,l.doc.key,l.doc,new da(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:i1(l.type),doc:u,oldIndex:h,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function i1(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return q()}}class s1 extends t1{constructor(e){super(),this.firestore=e}convertBytes(e){return new Di(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new At(this.firestore,null,n)}}function XE(t){t=Ni(t,Jl);const e=Ni(t.firestore,eu),n=bE(e),r=new s1(e);return e1(t._query),Bk(n,t._query).then(i=>new r1(e,r,t,i))}function o1(t,e,n){t=Ni(t,At);const r=Ni(t.firestore,eu),i=YE(t.converter,e,n);return ZE(r,[BE(zE(r),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,qt.none())])}function JE(t,e){const n=Ni(t.firestore,eu),r=UE(t),i=YE(t.converter,e);return ZE(n,[BE(zE(t.firestore),"addDoc",r._key,i,t.converter!==null,{}).toMutation(r._key,qt.exists(!1))]).then(()=>r)}function ZE(t,e){return function(r,i){const s=new Xn;return r.asyncQueue.enqueueAndForget(async()=>kk(await jk(r),i,s)),s.promise}(bE(t),e)}function vl(){return new rf("serverTimestamp")}(function(e,n=!0){(function(i){Ui=i})(Li),Ti(new Cr("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new eu(new rP(r.getProvider("auth-internal")),new aP(r.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new $(L.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ro(h.options.projectId,f)}(o,i),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),Qn(Wm,"4.7.3",e),Qn(Wm,"4.7.3","esm2017")})();const a1={apiKey:void 0,authDomain:void 0,projectId:void 0},ew=VS().length?vd():G_(a1),tw=XR(ew),Ao=Hk(ew);async function l1(){return(await XE(Zl(Ao,"users"))).docs.map(e=>({id:e.id,...e.data()}))}async function Rg(){return(await XE(Zl(Ao,"featureFlags"))).docs.map(e=>({id:e.id,...e.data()}))}async function u1(t,e){await o1(UE(Ao,"featureFlags",t),{value:e,updatedAt:vl()},{merge:!0})}async function Pg(t,e){await JE(Zl(Ao,"auditLogs"),{action:t,actorEmail:e??void 0,createdAt:vl()})}async function c1(t){return(await JE(Zl(Ao,"renderJobs"),{userId:t.userId,preset:t.preset,source:t.source??"admin",status:"queued",progress:0,createdAt:vl(),updatedAt:vl()})).id}function h1(){const[t,e]=ht.useState(null),[n,r]=ht.useState(!0),[i,s]=ht.useState([]),[o,l]=ht.useState([]),[u,h]=ht.useState(""),[f,g]=ht.useState("life-movie-v1"),[y,R]=ht.useState("");ht.useEffect(()=>jA(tw,async k=>{if(e(k),r(!1),k){const O=await l1();s(O),l(await Rg()),await Pg("ADMIN_LOGIN",k.email??void 0)}}),[]),ht.useEffect(()=>{!u&&i.length&&h(i[0].id)},[i,u]);const N=ht.useMemo(()=>i.find(k=>k.id===u)||null,[i,u]);return n?J.jsx("div",{style:{padding:24},children:"Loading…"}):t?J.jsxs("div",{style:{padding:24,fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial"},children:[J.jsx("h1",{style:{margin:0},children:"URAI Admin"}),J.jsx("p",{style:{marginTop:8,opacity:.8},children:t.email}),J.jsx("hr",{style:{margin:"16px 0"}}),J.jsx("h2",{children:"Render Jobs → asset-factory"}),J.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[J.jsxs("label",{children:["User:",J.jsx("select",{style:{marginLeft:8},value:u,onChange:k=>h(k.target.value),children:i.map(k=>J.jsxs("option",{value:k.id,children:[k.id,k.email?` (${k.email})`:""]},k.id))})]}),J.jsxs("label",{children:["Preset:",J.jsxs("select",{style:{marginLeft:8},value:f,onChange:k=>g(k.target.value),children:[J.jsx("option",{value:"life-movie-v1",children:"life-movie-v1"}),J.jsx("option",{value:"life-movie-v2",children:"life-movie-v2"}),J.jsx("option",{value:"life-movie-v3",children:"life-movie-v3"})]})]}),J.jsx("button",{onClick:async()=>{const k=u.trim();if(!k)return;const O=await c1({userId:k,preset:f,source:"admin"});R(O),await Pg("RENDER_JOB_CREATED",t.email??void 0)},children:"Create Render Job (queued)"})]}),N?J.jsxs("p",{style:{marginTop:10,opacity:.8},children:["Selected: ",J.jsx("b",{children:N.id})]}):null,y?J.jsxs("p",{style:{marginTop:10},children:["✅ Created job: ",J.jsx("code",{children:y})]}):null,J.jsx("hr",{style:{margin:"16px 0"}}),J.jsx("h2",{children:"Users"}),J.jsx("ul",{children:i.map(k=>J.jsx("li",{children:k.id},k.id))}),J.jsx("h2",{children:"Feature Flags"}),J.jsx("ul",{children:o.map(k=>J.jsxs("li",{style:{display:"flex",gap:8,alignItems:"center"},children:[J.jsxs("span",{children:[k.id,": ",J.jsx("b",{children:String(k.value)})]}),J.jsx("button",{onClick:async()=>{await u1(k.id,!k.value),l(await Rg())},children:"toggle"})]},k.id))})]}):J.jsx(d1,{})}function d1(){const t=async()=>{const e=prompt("Admin email"),n=prompt("Password");!e||!n||await FA(tw,e,n)};return J.jsxs("div",{style:{padding:24},children:[J.jsx("h2",{children:"Sign in"}),J.jsx("button",{onClick:t,children:"Sign in"})]})}const nw=document.getElementById("root");if(!nw)throw new Error("Root element not found");ac.createRoot(nw).render(J.jsx(Yw.StrictMode,{children:J.jsx(h1,{})}));
//# sourceMappingURL=index-CQgmkK8q.js.map
