import{spread as o,mergeProps as r,insert as t,template as s}from"solid-js/web";import{mergeProps as e,splitProps as b}from"solid-js";const l=s("<button>"),a=s=>{s=e({size:"small"},s);const[a,n]=b(s,["primary","size","backgroundColor","label"]);return(()=>{const s=l();return o(s,r(n,{type:"button",get classList(){return{"storybook-button--small":"small"===a.size,"storybook-button--medium":"medium"===a.size,"storybook-button--large":"large"===a.size,"storybook-button":!0,"storybook-button--primary":!0===a.primary,"storybook-button--secondary":!1===a.primary}},get style(){return{"background-color":a.backgroundColor}}}),!1,!0),t(s,(()=>a.label)),s})()};export{a as default};
//# sourceMappingURL=Button.js.map