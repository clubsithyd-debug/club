import{u as l,j as e,L as o}from"./index-Bvv6xj4p.js";import{c as t}from"./createLucideIcon-COSBDt03.js";import{T as i}from"./terminal-BPSfRnYQ.js";import{U as r}from"./users-DVeELqIj.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=t("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=t("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=t("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=t("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=t("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=t("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]),k="_navShell_18het_1",x="_navWidth_18het_11",p="_navBar_18het_17",u="_navItem_18het_25",_="_navItemActive_18het_48",f="_navLabel_18het_57",n={navShell:k,navWidth:x,navBar:p,navItem:u,navItemActive:_,navLabel:f},I=[{id:"/",icon:h,label:"Main Site",exact:!0},{id:"/symbihackathon",icon:i,label:"Hackathon",exact:!0},{id:"/symbihackathon/problems",icon:d,label:"Problems"},{id:"/symbihackathon/schedule",icon:y,label:"Schedule"},{id:"/symbihackathon/committee",icon:r,label:"Committee"},{id:"/symbihackathon/sponsors",icon:b,label:"Sponsors"},{id:"/symbihackathon/rules",icon:m,label:"Rules"},{id:"/symbihackathon/payment",icon:v,label:"Payment"}];function S(){const c=l().pathname;return e.jsx("div",{className:n.navShell,children:e.jsx("div",{className:n.navWidth,children:e.jsx("nav",{className:n.navBar,children:I.map(a=>{const s=a.exact?c===a.id:c.startsWith(a.id);return e.jsxs(o,{to:a.id,"aria-label":a.label,title:a.label,className:`${n.navItem} ${s?n.navItemActive:""}`,children:[e.jsx(a.icon,{className:"h-4 w-4"}),e.jsx("span",{className:n.navLabel,children:a.label})]},a.id)})})})})}export{S as H};
