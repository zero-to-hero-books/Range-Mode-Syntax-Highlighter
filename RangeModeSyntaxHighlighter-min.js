/* https://github.com/zero-to-hero-books/Range-Mode-Syntax-Highlighter */
function RMSHfoldEventHandler(){var e,t=Array.prototype.slice.call(arguments)
return function(n){if("-"==this.textContent){this.textContent="+"
for(var o=0;o<t.length;o++)t[o].style.display="none"
void 0==e?(e=document.createElement("span"),e.innerHTML="&nbsp;&rarr;&nbsp;line:&nbsp;"+t[0].dataset.foldEndLine+"&nbsp;",e.className="foldPlaceholder",e.style.display="inline",e.style.border="1px solid #999",t[0].parentElement.insertBefore(e,t[0])):e.style.display="inline"}else{this.textContent="-"
for(var o=0;o<t.length;o++)t[o].style.display=""
void 0!=e&&(e.style.display="none")}}}function RMSHStyler(e,t){function n(e,t,n){p.push({level:e,offset:t,line:n})}function o(e,t,n){for(var o;p.length>0;)if(o=p.pop(),o.level==e){o.line!=n&&c.push({start:o.offset,end:t,startLine:o.line,endLine:n})
break}}function l(e,t,n){var o,l,r
e>u&&(l=i.substring(u,e),o=document.createTextNode(l),l.trim().length>0&&(f.appendChild(o),u=e)),r=document.createElement("span"),n.hasOwnProperty("color")&&(r.style.color=n.color),n.hasOwnProperty("bold")&&n.bold&&(r.style.fontWeight="bold"),n.hasOwnProperty("italic")&&n.italic&&(r.style.fontStyle="italic"),o=e>u?document.createTextNode(i.substring(u,e+t)):document.createTextNode(i.substring(e,e+t)),r.appendChild(o),f.appendChild(r),u=e+t}function r(n){var o
if(0!=u||1==t||0!=c.length){if(i.length>u&&(o=document.createTextNode(i.substring(u)),f.appendChild(o)),c.length>0){c.sort(function(e,t){return t.startLine-e.startLine})
for(var l=f.firstChild,r=c.pop(),a=0;null!=l&&void 0!=r;){l.nodeType==Node.ELEMENT_NODE?o=l.textContent:l.nodeType==Node.TEXT_NODE&&(o=l.nodeValue)
var p=a+o.length
if(r.start<p){var m=s(l,f,r,a)
l=m.nextNode,a=m.nodeOffset
var b=r.endLine
r=c.pop(),void 0!=r&&r.startLine==b&&(r=c.pop())}else a=p,l=l.nextSibling}}if(y.length>0||t){var g
g="CODE"==e.nodeName?e.parentElement:e
var h=window.getComputedStyle(g),v=h.paddingTop,x=parseFloat(h.paddingTop)+parseFloat(h.paddingBottom),C=g.getBoundingClientRect().height-x+"px"
h=void 0
var S,N,O=document.createDocumentFragment(),E=0,T=""
if(t&&(E=(""+n).length,S=document.createElement("span"),S.className="RMSHgutterLine",S.style.cssText="left:0;top:"+v+";width:"+E+"em;position:absolute;height:"+C+";text-align:right;",O.appendChild(S)),y.length>0){N=document.createElement("span"),N.className="RMSHgutterFold",N.style.cssText="left:"+(E+.5)+"em;width:1em;top:"+v+";position:absolute;height:"+C+";text-align:center;",O.appendChild(N)
var L=d(S,N,1,n)
if(t&&n>L){for(T="",L;n>L;L++)T+=L+"\n"
T+=L,S.appendChild(document.createTextNode(T))}E+=1.5}else{T=""
for(var M=1;n>M;M++)T+=M+"\n"
T+=M,S.appendChild(document.createTextNode(T))}g.style.position="relative",g.style.paddingLeft=E+.5+"em",g.style.overflow="hidden"}e.innerHTML="",(N||t)&&g.appendChild(O),e.appendChild(f)}}function d(e,t,n,o){for(var l,r,s="",a="",i=void 0;void 0!=y[0]&&y[0].start<o;){for(l=y.shift(),s="",a="",n;n<l.start;n++)s+=n+"\n",a+="\n"
s+=n+"\n",t.appendChild(document.createTextNode(a)),e&&(e.appendChild(document.createTextNode(s)),i=document.createElement("span"),e.appendChild(i))
var f=document.createElement("span")
if(f.textContent="-",f.style.border="1px solid #999",f.style.cursor="pointer",f.className="foldButton",t.appendChild(f),t.appendChild(document.createTextNode("\n")),r=document.createElement("span"),t.appendChild(r),e?f.addEventListener("click",RMSHfoldEventHandler(l.node,r,i)):f.addEventListener("click",RMSHfoldEventHandler(l.node,r)),n=d(i,r,n+1,l.end),n<=l.end){for(s="",a="",n;n<=l.end;n++)s+=n+"\n",a+="\n"
r.appendChild(document.createTextNode(a)),e&&i.appendChild(document.createTextNode(s))}}return n}function s(e,t,n,o){var l=document.createElement("span")
if(l.className="fold",l.dataset.foldStartLine=n.startLine,l.dataset.foldEndLine=n.endLine,t===f?t.insertBefore(l,e):t.appendChild(l),y.push({start:n.startLine,end:n.endLine,node:l}),n.start>o){var r=e.cloneNode(!0)
e.nodeType==Node.ELEMENT_NODE?(r.textContent=r.textContent.substring(0,n.start-o),e.textContent=e.textContent.substring(n.start-o)):e.nodeType==Node.TEXT_NODE&&(r.nodeValue=r.nodeValue.substring(0,n.start-o),e.nodeValue=e.nodeValue.substring(n.start-o)),t.insertBefore(r,l),o=n.start}return a(e,l,n,o)}function a(e,t,n,o){var l,r,d,a=void 0
c.length>0&&(a=c[c.length-1],a.start<n.end?c.pop():a=void 0)
do if(e.nodeType==Node.ELEMENT_NODE?l=e.textContent:e.nodeType==Node.TEXT_NODE&&(l=e.nodeValue),r=o+l.length,void 0!=a&&a.start<r){var i=s(e,t,a,o)
e=i.nextNode,o=i.nodeOffset
var f=a.endLine
c.length>0?(a=c[c.length-1],a.start<n.end?(c.pop(),a.startLine==f&&(c.length>0?(a=c[c.length-1],a.start<n.end?c.pop():a=void 0):a=void 0)):a=void 0):a=void 0}else{if(n.end<r){var u=e.cloneNode(!0)
return e.nodeType==Node.ELEMENT_NODE?(u.textContent=u.textContent.substring(0,n.end-o),e.textContent=e.textContent.substring(n.end-o)):e.nodeType==Node.TEXT_NODE&&(u.nodeValue=u.nodeValue.substring(0,n.end-o),e.nodeValue=e.nodeValue.substring(n.end-o)),t.appendChild(u),{nextNode:e,nodeOffset:n.end}}if(n.end==r)return d=e.nextSibling,t.appendChild(e),{nextNode:d,nodeOffset:n.end}
d=e.nextSibling,t.appendChild(e),o=r,e=d}while(null!=e)
return{nextNode:e,nodeOffset:o}}var i=e.textContent,f=document.createDocumentFragment(),u=0,p=[],c=[],y=[]
return{applyStyle:l,updateView:r,foldOpen:n,foldClose:o}}function RMSHXMLParser(e){function t(e,t){var o={},l=!1
if(e.attributes.hasOwnProperty("color")&&(l=!0,o.color=e.attributes.color.nodeValue),e.attributes.hasOwnProperty("italic")&&(l=!0,"true"==e.attributes.italic.nodeValue?o.italic=!0:o.italic=!1),e.attributes.hasOwnProperty("bold")&&(l=!0,"true"==e.attributes.bold.nodeValue?o.bold=!0:o.bold=!1),l){var r={}
return n(t,r),n(o,r),r}return null}function n(e,t){null!=e&&("function"!=typeof Object.assign?(e.hasOwnProperty("color")&&(t.color=e.color),e.hasOwnProperty("bold")&&(t.bold=e.bold),e.hasOwnProperty("italic")&&(t.italic=e.italic)):Object.assign(t,e))}function o(e){if(void 0==e.children){for(var t,n=0,o=e.childNodes,l=[];t=o[n++];)1===t.nodeType&&l.push(t)
return l}return Array.prototype.slice.call(e.children)}var l={},r=new DOMParser,d=r.parseFromString(e,"application/xml")
"true"==d.documentElement.attributes.caseSensitive.nodeValue?l.caseSensitive=!0:l.caseSensitive=!1,l.ranges={}
var s=o(d.documentElement)
return s.forEach(function(e){if("delimiters"==e.nodeName)l.delimiters=e.textContent
else if("range"==e.nodeName){var n=e.attributes.id.nodeValue
l.ranges[n]={}
var r=l.ranges[n]
e.attributes.hasOwnProperty("default")&&(l.defaultRange=n),r.defaultStyle=t(e),r.embededRanges={},r.embededFolds={},r.symbols=" ",r.symbolsMap=[],r.symbolsMapStyles=[],r.beginSymbols=" ",r.beginFolds=" "
var d=o(e)
d.forEach(function(e){var n,d,s="",a="",i=" "
if("symbols"==e.nodeName)l.caseSensitive?r.symbols+=e.textContent+" ":r.symbols+=e.textContent.toUpperCase()+" ",r.symbolsMap.push(r.symbols.length-1),r.symbolsMapStyles.push(t(e,r.defaultStyle))
else if("embed"==e.nodeName){for(n=o(e),d=0;d<n.length;d++)"begin"==n[d].nodeName?(s=n[d].textContent,l.caseSensitive||(s=s.toUpperCase()),-1==r.beginSymbols.indexOf(" "+s+" ")&&(r.beginSymbols+=s+" ")):"end"==n[d].nodeName&&(a=n[d].textContent,l.caseSensitive||(a=a.toUpperCase()),0==a.length&&"EOL"==n[d].attributes.value.nodeValue&&(a="\n"),-1==i.indexOf(" "+a+" ")&&(i+=a+" "))
r.embededRanges[s]={end:i},e.attributes.hasOwnProperty("range")?r.embededRanges[s].range=e.attributes.range.nodeValue:r.embededRanges[s].syntaxDefinition=e.attributes.syntaxDefinition.nodeValue,e.attributes.hasOwnProperty("fold")&&"true"==e.attributes.fold.nodeValue?r.embededRanges[s].fold=!0:r.embededRanges[s].fold=!1}else if("fold"==e.nodeName){for(n=o(e),d=0;d<n.length;d++)"begin"==n[d].nodeName?(s=n[d].textContent,l.caseSensitive||(s=s.toUpperCase()),-1==r.beginFolds.indexOf(" "+s+" ")&&(r.beginFolds+=s+" ")):"end"==n[d].nodeName&&(a=n[d].textContent,l.caseSensitive||(a=a.toUpperCase()),-1==i.indexOf(" "+a+" ")&&(i+=a+" "))
r.embededFolds[s]={end:i},r.embededFolds[s].id=e.attributes.id.nodeValue,r.symbols+=s+" ",r.symbols+=a+" "}})," "==r.symbols&&(r.symbols="")," "==r.beginSymbols&&(r.beginSymbols="")," "==r.beginFolds&&(r.beginFolds="")}}),l}function RMSHSymbolizer(e,t,n){function o(){return a}function l(){return e.popedCharsCnt()}function r(e){t=e,t.indexOf(" \n ")>-1&&(s=!0)}function d(){for(var o=0,l=" ",r=1,d=0,f=e.lookAhead(r);null!=f;){if(l+=n?f:f.toUpperCase(),i.indexOf(f)>-1){if(d>0)break
for(;r>0;)e.popToken(),r--
if(l=" ",o=0,"\n"==f&&(a+=1,s))return{symbol:f,offset:e.popedCharsCnt()-1}}else if(o=t.indexOf(l,o),o>-1)t.indexOf(l+" ",o)>-1&&(d=r)
else{if(d>0)break
e.popToken(),l=" ",r=0,o=0}r++,f=e.lookAhead(r)}if(d>0){for(var u="",p=e.popedCharsCnt();d>0;)u+=e.popToken(),d--
return{symbol:u,offset:p}}return null}var s=!1,a=1,i=" 	\r\n"
return t.indexOf(" \n ")>-1&&(s=!0),{setSymbols:r,getNextSymbol:d,getProcessedCharCnt:l,currentLine:o}}function RMSHTokenizer(e,t){function n(e){f=i,s=[],a=e+" 	\n\r"}function o(){return i}function l(){var e=null
return e=s.length>0?s.shift():d(i),null!=e&&(i+=e.length,i>f&&(f=i)),e}function r(e){if(e<=s.length)return s[e-1]
for(;e>s.length;){var t=null
if(t=d(f),null==t)return null
f+=t.length,s.push(t)}return s[e-1]}function d(t){var n=t
if(t>=e.length)return null
for(;t<e.length;){var o=e.charAt(t)
if(a.indexOf(o)>-1){if(n==t)return o
break}t++}return e.substring(n,t)}var s,a,i=0,f=0
return n(t),{popToken:l,lookAhead:r,popedCharsCnt:o,setDelimiters:n}}var RMSH=function(){function e(e,t){s[e]={xml:t}}function t(e){return s[e].hasOwnProperty("jsObj")||(s[e].jsObj=RMSHXMLParser(s[e].xml)),s[e].jsObj}function n(e,n,s,a){1!=s?s=!1:window.navigator.userAgent.indexOf("Trident/")>-1&&(s=!1),a!==!0&&(a=!1)
var i=t(n)
l=RMSHTokenizer(e.textContent,i.delimiters),r=RMSHSymbolizer(l,"",i.caseSensitive),d=RMSHStyler(e,a),o(i.ranges[i.defaultRange],"",0,i,s,"::"+n+"."+i.defaultRange),d.updateView(r.currentLine())}function o(e,n,s,a,i,f){function u(t){var n=e.symbols.indexOf(t)
if(n>-1)for(var o=0;o<e.symbolsMap.length;o++)if(n<e.symbolsMap[o])return e.symbolsMapStyles[o]
return null}var p=e.symbols+e.beginSymbols+n
r.setSymbols(p)
for(var c,y,m,b,g=r.getNextSymbol(),h=[],v="";null!=g;){if(c=" "+g.symbol+" ",n.indexOf(c)>-1)return null!=e.defaultStyle&&s<g.offset&&(m=g.offset-s,d.applyStyle(s,m,e.defaultStyle)),g
if(e.beginSymbols.indexOf(c)>-1){var x=e.embededRanges[g.symbol]
if(y=u(c),null!=y?(null!=e.defaultStyle&&(m=g.offset-s,d.applyStyle(s,m,e.defaultStyle)),d.applyStyle(g.offset,g.symbol.length,y)):null!=e.defaultStyle&&(m=g.offset+g.symbol.length-s,d.applyStyle(s,m,e.defaultStyle)),s=g.offset+g.symbol.length,x.hasOwnProperty("range"))b=f+"."+x.range,i&&x.fold&&d.foldOpen(b,s,r.currentLine()),g=o(a.ranges[x.range],x.end,s,a,i,b),i&&x.fold&&d.foldClose(b,g.offset,r.currentLine())
else if(x.hasOwnProperty("syntaxDefinition")){var C=t(x.syntaxDefinition)
b=f+"::"+x.syntaxDefinition+"."+C.defaultRange,i&&x.fold&&d.foldOpen(b,s,r.currentLine()),l.setDelimiters(a.delimiters+C.delimiters),g=o(C.ranges[C.defaultRange],x.end,s,C,i,b),l.setDelimiters(a.delimiters),i&&x.fold&&d.foldClose(b,g.offset,r.currentLine())}if(r.setSymbols(p),null==g)return null
s=g.offset,c=" "+g.symbol+" ",y=u(c),null!=y&&(d.applyStyle(g.offset,g.symbol.length,y),s=g.offset+g.symbol.length)}else{if(i)if(v.indexOf(c)>-1){var S=e.embededFolds[h.pop()].id
d.foldClose(f+"."+S,g.offset,r.currentLine()),v=h.length>0?e.embededFolds[h[h.length-1]].end:""}else e.beginFolds.indexOf(c)>-1&&(S=e.embededFolds[g.symbol].id,h.push(g.symbol),v=e.embededFolds[g.symbol].end,d.foldOpen(f+"."+S,g.offset+g.symbol.length,r.currentLine()))
y=u(c),null!=y&&(null!=e.defaultStyle&&d.applyStyle(s,g.offset-s,e.defaultStyle),d.applyStyle(g.offset,g.symbol.length,y),s=g.offset+g.symbol.length)}g=r.getNextSymbol()}return s<r.getProcessedCharCnt()&&null!=e.defaultStyle&&d.applyStyle(s,r.getProcessedCharCnt()-s,e.defaultStyle),null}var l,r,d,s={}
return{syntaxDef:s,highlight:n,addSyntaxXML:e}}()