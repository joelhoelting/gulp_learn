var WebFontConfig={google:{families:["Bitter:700:latin","Raleway:400:latin"]},timeout:2e3};!function(){"use strict";var t=document.createElement("script");t.src=("https:"==document.location.protocol?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",t.async="true",document.head.appendChild(t),console.log("fonts loading")}(),function(){"use strict";var s={scrollTime:600};document.body.addEventListener("click",function(t){var e=t.target;if("A"!==e.nodeName||!e.hash||!window.requestAnimationFrame)return;var o=document.getElementById(e.hash.slice(1));if(!o)return;console.log("initiate scrollto handler"),t.preventDefault();var a=null,r=window.pageYOffset,l=o.offsetTop-r;requestAnimationFrame(function t(e){a||(a=e);var o=Math.min(e-a,s.scrollTime),n=o/s.scrollTime,i=n<.5?8*n*n*n*n:1-8*--n*n*n*n;window.scrollTo(0,r+l*i);o<s.scrollTime&&requestAnimationFrame(t)})},!0)}(),function(){"use strict";var s={formID:"tweetform",width:500,height:500,minmargin:10},m=document.getElementById(s.formID);m&&m.addEventListener("submit",function(t){console.log("tweet form submitted");var e=screen.availWidth||1024,o=screen.availHeight||700,n=Math.min(s.width,e-2*s.minmargin),i=Math.min(s.height,o-2*s.minmargin),a=Math.floor((e-n)/2),r=Math.floor((o-i)/2),l=window.open("about:blank","tweet","width="+n+",height="+i+",left="+a+",top="+r+",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");l&&(t.preventDefault(),m.setAttribute("target","tweet"),m.submit(),l.focus())},!0)}();