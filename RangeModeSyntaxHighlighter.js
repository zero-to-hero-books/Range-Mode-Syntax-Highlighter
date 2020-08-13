/* https://github.com/zero-to-hero-books/Range-Mode-Syntax-Highlighter */
var RMSH = (function () {
	var syntaxDef={};
	var tokenizer;
	var symbolizer;
	var styler;
	return {
        syntaxDef: syntaxDef,
        highlight: highlight,
        addSyntaxXML: addSyntaxXML
	};
	
	function addSyntaxXML(lang, XMLstr){
		syntaxDef[lang]={xml: XMLstr};
	}
	
	function getSyntaxObj(lang){
		if(!syntaxDef[lang].hasOwnProperty('jsObj')) 
			syntaxDef[lang].jsObj=RMSHXMLParser(syntaxDef[lang].xml);
		return syntaxDef[lang].jsObj;
	}
	
	function highlight(HTMLelement, lang, folding, lineNumbers){
		//folding is not supported on IE11
		if(folding!=true) folding=false;
		else if(window.navigator.userAgent.indexOf("Trident/")>-1) folding=false;
		
		if(lineNumbers!==true) lineNumbers=false;
		var syntax=getSyntaxObj(lang);
		
		tokenizer= RMSHTokenizer(HTMLelement.textContent, syntax.delimiters);
		symbolizer= RMSHSymbolizer(tokenizer, "", syntax.caseSensitive); 
		styler= RMSHStyler(HTMLelement, lineNumbers);

		parseRange(syntax.ranges[syntax.defaultRange], "", 0, syntax, folding, '::'+lang+'.'+syntax.defaultRange);
		styler.updateView(symbolizer.currentLine());
	}
	
	function parseRange(thisRange, endSymbols, startOffset, syntaxObj, folding, namespace){
		var rangeSymbols=thisRange.symbols + thisRange.beginSymbols + endSymbols;
		
		symbolizer.setSymbols(rangeSymbols);
		var nextSymbol=symbolizer.getNextSymbol();
		var searchStr;
		var style;
		var length;
		var openFolds=[]; //stack of fold start symbols
		var foldEnds="";
		var embededNamespace;
		
		while(nextSymbol!=null){
			searchStr=" " + nextSymbol.symbol + " ";
			if(endSymbols.indexOf(searchStr)>-1){
				if(thisRange.defaultStyle!=null && startOffset < nextSymbol.offset){
					length=nextSymbol.offset-startOffset;
					styler.applyStyle(startOffset, length, thisRange.defaultStyle);
				}
				return nextSymbol;
			}
			else if(thisRange.beginSymbols.indexOf(searchStr)>-1){
				var embededObj=thisRange.embededRanges[nextSymbol.symbol];
				//we need to style the symbol and apply default style before
				//moving on to embeded range
				style=getStyle(searchStr);
				if(style!=null){
					if(thisRange.defaultStyle!=null){
						length=nextSymbol.offset-startOffset;
						styler.applyStyle(startOffset, length, thisRange.defaultStyle);
					}
					styler.applyStyle(nextSymbol.offset, nextSymbol.symbol.length, style);
				}
				else if(thisRange.defaultStyle!=null){
					length=nextSymbol.offset + nextSymbol.symbol.length-startOffset;
					styler.applyStyle(startOffset, length, thisRange.defaultStyle);
				}
				startOffset=nextSymbol.offset + nextSymbol.symbol.length;
				
				//move to embed range or syntaxDef
				if(embededObj.hasOwnProperty('range')){
					embededNamespace=namespace + '.' + embededObj.range;
					if(folding && embededObj.fold) styler.foldOpen(embededNamespace, startOffset, symbolizer.currentLine());
					nextSymbol=parseRange(syntaxObj.ranges[embededObj.range], embededObj.end, startOffset, syntaxObj, folding, embededNamespace);
					if(folding && embededObj.fold) styler.foldClose(embededNamespace, nextSymbol.offset, symbolizer.currentLine());
				}
				else if(embededObj.hasOwnProperty('syntaxDefinition')){
					var embededSyntax=getSyntaxObj(embededObj.syntaxDefinition);
					embededNamespace=namespace+'::'+embededObj.syntaxDefinition+'.'+embededSyntax.defaultRange;
					if(folding && embededObj.fold) styler.foldOpen(embededNamespace, startOffset, symbolizer.currentLine());
					//need to change delimiters
					tokenizer.setDelimiters(syntaxObj.delimiters +  embededSyntax.delimiters);
					nextSymbol=parseRange(embededSyntax.ranges[embededSyntax.defaultRange], embededObj.end, startOffset, embededSyntax, folding, embededNamespace);
					//need to change back delimiters
					tokenizer.setDelimiters(syntaxObj.delimiters);
					if(folding && embededObj.fold) styler.foldClose(embededNamespace, nextSymbol.offset, symbolizer.currentLine());
				}
				//at the start of parseRange() symbols are set, need to reset
				symbolizer.setSymbols(rangeSymbols);
				//style the symbol returned by embeded Range/syntaxDefinition
					if(nextSymbol!=null){
						startOffset=nextSymbol.offset;
						searchStr=" " + nextSymbol.symbol + " ";
						style=getStyle(searchStr);
						if(style!=null){
							styler.applyStyle(nextSymbol.offset, nextSymbol.symbol.length, style);
							startOffset=nextSymbol.offset + nextSymbol.symbol.length;
						}
					}
					else return null;
			}
			else{
				//check for folding
				if(folding){
					if(foldEnds.indexOf(searchStr)>-1){
						var foldId=thisRange.embededFolds[openFolds.pop()].id;
						styler.foldClose(namespace + '.' + foldId, nextSymbol.offset, symbolizer.currentLine());
						if(openFolds.length>0)
							foldEnds=thisRange.embededFolds[openFolds[openFolds.length-1]].end;
						else foldEnds="";
					}
					else if(thisRange.beginFolds.indexOf(searchStr)>-1){
						foldId=thisRange.embededFolds[nextSymbol.symbol].id;
						openFolds.push(nextSymbol.symbol);
						foldEnds=thisRange.embededFolds[nextSymbol.symbol].end;
						styler.foldOpen(namespace + '.' + foldId, nextSymbol.offset+nextSymbol.symbol.length, symbolizer.currentLine());
					}
				}
				//style symbol
				style=getStyle(searchStr);
				if(style!=null){
					if(thisRange.defaultStyle!=null){
						styler.applyStyle(startOffset, nextSymbol.offset-startOffset, thisRange.defaultStyle);
					}
					styler.applyStyle(nextSymbol.offset, nextSymbol.symbol.length, style);
					startOffset=nextSymbol.offset + nextSymbol.symbol.length;
				}
			}
			//end of while loop=> get next symbol
			nextSymbol=symbolizer.getNextSymbol();
		}
		//still need to apply default styles for the tokens after the last style symbol
		if(startOffset<symbolizer.getProcessedCharCnt()){
			if(thisRange.defaultStyle!=null)
				styler.applyStyle(startOffset, symbolizer.getProcessedCharCnt()-startOffset, thisRange.defaultStyle);
		}
		return null;
		
		function getStyle(searchStr){
			var strIndex=thisRange.symbols.indexOf(searchStr);
			if(strIndex>-1)
				for(var i=0; i<thisRange.symbolsMap.length; i++)
					if(strIndex<thisRange.symbolsMap[i])
						return thisRange.symbolsMapStyles[i];
			return null;
		}
	}
	
}());

function RMSHfoldEventHandler(){
	//https://stackoverflow.com/questions/58675228/bind-with-addeventlistener
	//answer: https://stackoverflow.com/a/58675429
	var args = Array.prototype.slice.call(arguments);
	var placeholder;
	return function(e){
		if(this.textContent=="-"){
			this.textContent="+";
			for(var i=0; i < args.length; i++)	args[i].style.display="none";
			if(placeholder==undefined){
				placeholder=document.createElement('span');
				placeholder.innerHTML="&nbsp;&rarr;&nbsp;line:&nbsp;" + args[0].dataset.foldEndLine + "&nbsp;";
				placeholder.className="foldPlaceholder";
				placeholder.style.display="inline";
				placeholder.style.border="1px solid #999";
				args[0].parentElement.insertBefore(placeholder, args[0]);
			}
			else placeholder.style.display="inline";
		}
		else{
			this.textContent="-";
			for(var i=0; i < args.length; i++) args[i].style.display="";
			if(placeholder!=undefined) placeholder.style.display="none";
		}
	}
}

function RMSHStyler(HTMLelement, lineNumbers){
	var str=HTMLelement.textContent;
	var fragment=document.createDocumentFragment();
	
	var charCnt=0;
	var foldLevel=[];
	var validFolds=[];
	var foldsToDisplay=[];
	
	return {
		applyStyle: applyStyle,
		updateView: updateView,
		foldOpen: foldOpen,
		foldClose: foldClose
	};
	
	function foldOpen(namespace, offset, line){
		foldLevel.push({level: namespace, offset: offset, line: line});
	}
	
	function foldClose(namespace, offset, line){
		var poped;
		while(foldLevel.length>0){
			poped=foldLevel.pop();
			if(poped.level==namespace){
				if(poped.line!=line)
					validFolds.push({start: poped.offset, end: offset, startLine:poped.line, endLine:line});
				break;
			}
		}
	}

	function applyStyle(offset, length, styles){
		var text;
		var textStr;
		var el;
		if(offset > charCnt){
			textStr=str.substring(charCnt, offset);
			text=document.createTextNode(textStr);
			//workaround for Chrome erroneously removing whitespace text nodes
			if(textStr.trim().length>0){ 
				fragment.appendChild(text);
				charCnt=offset;
			}
		}
		
		el = document.createElement('span');
		if(styles.hasOwnProperty('color'))
			el.style.color=styles.color;
		if(styles.hasOwnProperty('bold') && styles.bold)
			el.style.fontWeight="bold";
		if(styles.hasOwnProperty('italic') && styles.italic)
			el.style.fontStyle = "italic";
		//workaround for Chrome erroneously removing whitespace text nodes
		if(offset > charCnt)
			text=document.createTextNode(str.substring(charCnt, offset+length));
		else
			text=document.createTextNode(str.substring(offset, offset+length));
		el.appendChild(text);
		fragment.appendChild(el);
		charCnt=offset+length;
	}
	
	function updateView(totalLineCnt){
		var text;
		if(charCnt==0 && lineNumbers!=true && validFolds.length==0) return;
		if(str.length > charCnt){
			text=document.createTextNode(str.substring(charCnt));
			fragment.appendChild(text);
		}
		
		if(validFolds.length>0){
			validFolds.sort(function(a, b) { return b.startLine - a.startLine;});

			var node=fragment.firstChild;
			var fold=validFolds.pop();
			var offset=0;
			while(node!=null && fold!=undefined){
				if(node.nodeType==Node.ELEMENT_NODE)
					text=node.textContent;
				else if(node.nodeType==Node.TEXT_NODE)
					text=node.nodeValue;
				
				var textEndOffset=offset+text.length;
			
				if(fold.start<textEndOffset){
					var result=procFoldStart(node, fragment, fold, offset);
					node=result.nextNode;
					offset=result.nodeOffset;
					var foldEndLine=fold.endLine;
					fold=validFolds.pop();
					//if the next fold start is on the same line as the prev fold end, then we skip it
					if(fold!=undefined && fold.startLine==foldEndLine)
						fold=validFolds.pop();
				}
				else{
					offset=textEndOffset;
					node=node.nextSibling;
				}
			}
		}
		
		if(foldsToDisplay.length>0 || lineNumbers){
			var blockEl;
			if(HTMLelement.nodeName=="CODE") blockEl=HTMLelement.parentElement;
			else blockEl=HTMLelement;
			//top and height for gutter
			var computed=window.getComputedStyle(blockEl);
			var top = computed.paddingTop;
			var padding = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
			var height=(blockEl.getBoundingClientRect().height - padding)+'px';
			computed=undefined;

			var gutterFrag=document.createDocumentFragment();
			var gutterWidth=0;
			var gutterLine;
			var gutterFold;
			var linePad="";
			if(lineNumbers){
				gutterWidth=(''+totalLineCnt).length;
				gutterLine=document.createElement('span');
				gutterLine.className="RMSHgutterLine";
				gutterLine.style.cssText='left:0;top:'+top+';width:'+gutterWidth+'em;position:absolute;height:'+height+';text-align:right;';
				gutterFrag.appendChild(gutterLine);
			}
			
			if(foldsToDisplay.length>0){
				gutterFold=document.createElement('span');
				gutterFold.className="RMSHgutterFold";
				gutterFold.style.cssText='left:'+(gutterWidth+0.5)+'em;width:1em;top:'+top+';position:absolute;height:'+height+';text-align:center;';
				gutterFrag.appendChild(gutterFold);
				var totalLines=addToGutter(gutterLine, gutterFold, 1, totalLineCnt);
				if(lineNumbers && totalLines<totalLineCnt){
					linePad="";
					for(totalLines; totalLines<totalLineCnt; totalLines++){
						linePad+=totalLines+"\n";
					} 
					linePad+=totalLines;
					gutterLine.appendChild(document.createTextNode(linePad));
				}
				gutterWidth+=1.5;
			}
			else{ //no folding, just line numbers
				linePad="";
				for(var i=1; i<totalLineCnt; i++){
					linePad+=i+"\n";
				} 
				linePad+=i;
				gutterLine.appendChild(document.createTextNode(linePad));
			}
			
			blockEl.style.position='relative';
			blockEl.style.paddingLeft=(gutterWidth+0.5)+'em';
			blockEl.style.overflow="hidden";
		}
		HTMLelement.innerHTML='';
		if(gutterFold || lineNumbers) blockEl.appendChild(gutterFrag);
		HTMLelement.appendChild(fragment);
	}
	
	function addToGutter(lineGutter, foldGutter, startLine, endLine){
		var linePad="";
		var foldPad="";
		var fold;
		var innerLine=undefined;
		var innerFold;
		while(foldsToDisplay[0]!=undefined && foldsToDisplay[0].start < endLine){
			fold=foldsToDisplay.shift();
			linePad="";
			foldPad="";
				for(startLine; startLine<fold.start; startLine++){
					linePad+=startLine+"\n";
					foldPad+="\n";
				} 
				linePad+=startLine+"\n";
				foldGutter.appendChild(document.createTextNode(foldPad));
				if(lineGutter){
					lineGutter.appendChild(document.createTextNode(linePad));
					innerLine=document.createElement('span');
					lineGutter.appendChild(innerLine);
				}
				
				var btn=document.createElement('span');
				btn.textContent="-";
				btn.style.border="1px solid #999";
				btn.style.cursor="pointer";
				btn.className="foldButton";
				
				foldGutter.appendChild(btn);
				foldGutter.appendChild(document.createTextNode("\n"));
				innerFold=document.createElement('span');
				foldGutter.appendChild(innerFold);
				
				if(lineGutter)
					btn.addEventListener('click', RMSHfoldEventHandler(fold.node, innerFold, innerLine));
				else btn.addEventListener('click', RMSHfoldEventHandler(fold.node, innerFold));
				
				startLine=addToGutter(innerLine, innerFold, startLine+1, fold.end);
				
				if(startLine<=fold.end){
					linePad="";
					foldPad="";
					for(startLine; startLine<=fold.end; startLine++){
						linePad+=startLine+"\n";
						foldPad+="\n";
					} 
					innerFold.appendChild(document.createTextNode(foldPad));
					if(lineGutter) innerLine.appendChild(document.createTextNode(linePad));
				}
		}	
		return startLine;
	}
	
	function procFoldStart(node, parentNode, fold, offset){
		var foldNode = document.createElement('span');
		foldNode.className="fold";
		foldNode.dataset.foldStartLine=fold.startLine;
		foldNode.dataset.foldEndLine=fold.endLine;
		
		if(parentNode===fragment) parentNode.insertBefore(foldNode, node);
		else parentNode.appendChild(foldNode);
		
		foldsToDisplay.push({start:fold.startLine, end:fold.endLine, node:foldNode});
		
		if(fold.start>offset){
			var newNode=node.cloneNode(true);
			if(node.nodeType==Node.ELEMENT_NODE){
				newNode.textContent=newNode.textContent.substring(0, fold.start-offset);
				node.textContent=node.textContent.substring(fold.start-offset);
			}
			else if(node.nodeType==Node.TEXT_NODE){
				newNode.nodeValue=newNode.nodeValue.substring(0, fold.start-offset);
				node.nodeValue=node.nodeValue.substring(fold.start-offset);
			}
			
			parentNode.insertBefore(newNode, foldNode);
			offset=fold.start;
		}
		return addToFold(node, foldNode, fold, offset);
	}
	
	function addToFold(node, foldNode, fold, offset){
		 //we have a non null node for sure, we can do a do/while loop
		 //start by checking if there is an innerfold
		var text;
		var textEndOffset;
		var nextNode; //next node must always come from fragment
		var innerFold=undefined;
		if(validFolds.length>0){
			innerFold=validFolds[validFolds.length-1];
			if(innerFold.start<fold.end) validFolds.pop();
			else innerFold=undefined;
		}

		do{
			if(node.nodeType==Node.ELEMENT_NODE)
				text=node.textContent;
			else if(node.nodeType==Node.TEXT_NODE)
				text=node.nodeValue;
				
			textEndOffset=offset+text.length;
		
			if(innerFold!=undefined && innerFold.start<textEndOffset){
					var result=procFoldStart(node, foldNode, innerFold, offset);
					node=result.nextNode;
					offset=result.nodeOffset;
					
					var foldEndLine=innerFold.endLine;
					if(validFolds.length>0){
						innerFold=validFolds[validFolds.length-1];
						if(innerFold.start<fold.end){
							validFolds.pop();
							//if the next fold start is on the same line as the prev fold end, then we skip it
							if(innerFold.startLine==foldEndLine){
								if(validFolds.length>0){
									innerFold=validFolds[validFolds.length-1];
									if(innerFold.start<fold.end) validFolds.pop();
									else innerFold=undefined;
								}else innerFold=undefined;
							}
						}else innerFold=undefined;
					}else innerFold=undefined;
			}
			else{
				if(fold.end<textEndOffset){
					var newNode=node.cloneNode(true);
					if(node.nodeType==Node.ELEMENT_NODE){
						newNode.textContent=newNode.textContent.substring(0, fold.end-offset);
						node.textContent=node.textContent.substring(fold.end-offset);
					}
					else if(node.nodeType==Node.TEXT_NODE){
						newNode.nodeValue=newNode.nodeValue.substring(0, fold.end-offset);
						node.nodeValue=node.nodeValue.substring(fold.end-offset);
						
					}
					foldNode.appendChild(newNode);
					return {nextNode: node, nodeOffset:fold.end};
				}
				else if(fold.end==textEndOffset){
					nextNode=node.nextSibling;
					foldNode.appendChild(node);
					return {nextNode: nextNode, nodeOffset:fold.end};
				}
				nextNode=node.nextSibling;
				foldNode.appendChild(node);
				offset=textEndOffset;
				node=nextNode;
			}
		} while(node!=null);
		return {nextNode: node, nodeOffset: offset};
	}
}

function RMSHXMLParser(XMLstr){
	var obj={};
	var domparser=new DOMParser();
	var doc = domparser.parseFromString(XMLstr, "application/xml");
	
	if(doc.documentElement.attributes['caseSensitive'].nodeValue=="true")
		obj.caseSensitive=true;
	else obj.caseSensitive=false;
	obj.ranges={};
	
	var nodes=getChildren(doc.documentElement);
	nodes.forEach(function(el){
		if(el.nodeName=='delimiters') obj.delimiters=el.textContent;
		else if(el.nodeName=='range'){
			var rangeName=el.attributes['id'].nodeValue;
			obj.ranges[rangeName]={}; 
			var thisRange=obj.ranges[rangeName];
			
			if(el.attributes.hasOwnProperty('default')) obj.defaultRange=rangeName;
			
			thisRange['defaultStyle']=generateStyleObj(el);
			thisRange['embededRanges']={}; 
			thisRange['embededFolds']={};
			thisRange['symbols']=" "; //needs to start with a space
			thisRange['symbolsMap']=[];
			thisRange['symbolsMapStyles']=[];
			thisRange['beginSymbols']=" "; //needs to start with a space
			thisRange['beginFolds']=" "; //needs to start with a space
			
			var childNodes=getChildren(el);
			childNodes.forEach(function(innerEl){
				var begin="";
				var end="";
				var endSymbols=" ";
				var children, i;
				if(innerEl.nodeName=='symbols'){
					if(!obj.caseSensitive)
						thisRange['symbols']+= innerEl.textContent.toUpperCase() + " ";
					else thisRange['symbols']+= innerEl.textContent + " ";
					thisRange['symbolsMap'].push(thisRange['symbols'].length-1);
					thisRange['symbolsMapStyles'].push(generateStyleObj(innerEl, thisRange['defaultStyle']));
					
				}
				else if(innerEl.nodeName=='embed'){
					children=getChildren(innerEl);
					for (i=0; i<children.length; i++){
						if(children[i].nodeName=='begin'){
							begin=children[i].textContent;
							if(!obj.caseSensitive) begin= begin.toUpperCase();
							if(thisRange['beginSymbols'].indexOf(" " + begin + " ")==-1)
								thisRange['beginSymbols']+=begin + " ";
						}
						else if(children[i].nodeName=='end'){
							end=children[i].textContent;
							if(!obj.caseSensitive) end= end.toUpperCase();
							if(end.length==0 && children[i].attributes['value'].nodeValue=="EOL")
								end="\n";
							if(endSymbols.indexOf(" " + end + " ")==-1)
								endSymbols+=end + " ";
						}
					}
					
					thisRange['embededRanges'][begin]={end: endSymbols};
					if(innerEl.attributes.hasOwnProperty('range')) 
							thisRange['embededRanges'][begin]['range']=innerEl.attributes['range'].nodeValue;
					else thisRange['embededRanges'][begin]['syntaxDefinition']=innerEl.attributes['syntaxDefinition'].nodeValue;
					
					if(innerEl.attributes.hasOwnProperty('fold') && innerEl.attributes['fold'].nodeValue=="true")
						thisRange['embededRanges'][begin]['fold']=true;
					else thisRange['embededRanges'][begin]['fold']=false;
				}
				else if(innerEl.nodeName=='fold'){
					children=getChildren(innerEl);
					for (i=0; i<children.length; i++){
						if(children[i].nodeName=='begin'){
							begin=children[i].textContent;
							if(!obj.caseSensitive) begin= begin.toUpperCase();
							if(thisRange['beginFolds'].indexOf(" " + begin + " ")==-1)
								thisRange['beginFolds']+=begin + " ";
						}
						else if(children[i].nodeName=='end'){
							end=children[i].textContent;
							if(!obj.caseSensitive) end= end.toUpperCase();
							if(endSymbols.indexOf(" " + end + " ")==-1)
								endSymbols+=end + " ";
						}
					}
					
					thisRange['embededFolds'][begin]={end: endSymbols};
					thisRange['embededFolds'][begin]['id']=innerEl.attributes['id'].nodeValue;
					thisRange['symbols']+= begin + " ";
					thisRange['symbols']+= end + " ";
				}
			});
			if(thisRange['symbols']==" ") thisRange['symbols']="";
			if(thisRange['beginSymbols']==" ") thisRange['beginSymbols']="";
			if(thisRange['beginFolds']==" ") thisRange['beginFolds']="";
		}
	});
	return obj;

	function generateStyleObj(xmlNode, defaultStyle){
		var style={};
		var hasStyle=false;
		if(xmlNode.attributes.hasOwnProperty('color')){
			hasStyle=true;
			style['color']=xmlNode.attributes['color'].nodeValue;
		}
		if(xmlNode.attributes.hasOwnProperty('italic')){
			hasStyle=true;
			if(xmlNode.attributes['italic'].nodeValue=="true")
				style['italic']=true;
			else style['italic']=false;
		}
		if(xmlNode.attributes.hasOwnProperty('bold')){
			hasStyle=true;
			if(xmlNode.attributes['bold'].nodeValue=="true")
				style['bold']=true;
			else style['bold']=false;
		}
		if(hasStyle){
			var temp={};
			copyStyle(defaultStyle, temp);
			copyStyle(style, temp);
			return temp;
		}
		else return null;
	}
	
	function copyStyle(from, to){
		if(from==null) return;
		if(typeof Object.assign !== 'function'){ //IE11
			if(from.hasOwnProperty('color')) to.color=from.color;
			if(from.hasOwnProperty('bold')) to.bold=from.bold;
			if(from.hasOwnProperty('italic')) to.italic=from.italic;
		}
		else Object.assign(to, from);
	}
	
	function getChildren(node){
		if(node.children==undefined){ //IE11
			var i = 0, nodeEl, nodes = node.childNodes, children = [];
			while (nodeEl = nodes[i++]) {
				if (nodeEl.nodeType === 1) children.push(nodeEl);
			}
			return children;
		}
		else return Array.prototype.slice.call(node.children);
	}
}

function RMSHSymbolizer(tokenizer, symbols, caseSensitive){
	var matchNewLine=false;
	var lineCnt=1;
	var whitespace=" \t\r\n";
	if(symbols.indexOf(" \n ")>-1) matchNewLine=true;
	
	return {
        setSymbols: setSymbols,
        getNextSymbol: getNextSymbol,
        getProcessedCharCnt: getProcessedCharCnt,
        currentLine: currentLine
	};
	
	function currentLine(){
		return lineCnt;
	}
	
	function getProcessedCharCnt(){
		return tokenizer.popedCharsCnt();
	}

	function setSymbols(newSymbols){
		symbols=newSymbols;
		if(symbols.indexOf(" \n ")>-1) matchNewLine=true;
	}
		
	function getNextSymbol(){
		var searchStartIndex=0;
		var concatTokens=" "; //needs to start with a space
		var lookAheadCnt=1;
		var lastMatchTokenCnt=0;
		var nextToken=tokenizer.lookAhead(lookAheadCnt);

		while(nextToken!=null){
			if(!caseSensitive) concatTokens+=nextToken.toUpperCase();
			else concatTokens+=nextToken;
			
			if(whitespace.indexOf(nextToken)>-1){
				if(lastMatchTokenCnt>0)	break;
				else{
					while(lookAheadCnt>0){
						tokenizer.popToken();
						lookAheadCnt--;
					}
					concatTokens=" "; //needs to start with a space
					searchStartIndex=0;
					// \n is handled seperately, because we count lines and it could be a range end
					if(nextToken=="\n"){
						lineCnt+=1;
						if(matchNewLine) return {symbol:  nextToken , offset: tokenizer.popedCharsCnt()-1 };
					}
				}
			}
			else{
				searchStartIndex=symbols.indexOf(concatTokens, searchStartIndex);
				if(searchStartIndex > -1){
					if(symbols.indexOf(concatTokens+" ", searchStartIndex) > -1)
						lastMatchTokenCnt=lookAheadCnt;
				}
				else if(lastMatchTokenCnt>0) break;
				else{
					tokenizer.popToken();
					concatTokens=" "; //needs to start with a space
					lookAheadCnt=0;
					searchStartIndex=0;
				}
			}

			lookAheadCnt++;
			nextToken=tokenizer.lookAhead(lookAheadCnt);
	
		}
		//we have an exact match or end of tokenizer stream
		if(lastMatchTokenCnt>0){
			var matchedSymbol='';
			var offset=tokenizer.popedCharsCnt();
			while(lastMatchTokenCnt>0){
				matchedSymbol+=tokenizer.popToken();
				lastMatchTokenCnt--;
			}
			return {symbol:  matchedSymbol , offset: offset};
			
		}
		else return null;
	}
}

function RMSHTokenizer(strToTokenize, delimiters){	
	var TokenFIFOQueue;
	var popFromIndex=0;
	var peekFromIndex=0;
	var delim;
	setDelimiters(delimiters);

	return {
        popToken: popToken,
        lookAhead: lookAhead,
        popedCharsCnt: popedCharsCnt,
        setDelimiters: setDelimiters
    };
	
	function setDelimiters(newDelimiters){
		peekFromIndex=popFromIndex;
		TokenFIFOQueue=[];
		delim=newDelimiters + " \t\n\r";
	}
	
	function popedCharsCnt(){
		return popFromIndex;
	}
	
	//returns the next token or null if we have reached the end of the string
	function popToken(){
		var nextToken=null;
		if(TokenFIFOQueue.length>0) nextToken=TokenFIFOQueue.shift();
		else nextToken=getNextToken(popFromIndex);
		
		if(nextToken!=null){
			popFromIndex+=nextToken.length;
			if(peekFromIndex<popFromIndex) peekFromIndex=popFromIndex;
		}
		
		return nextToken;
	}
	
	//returns null if we have reached the end of the string
	function lookAhead(cnt){
		if(cnt<=TokenFIFOQueue.length) return TokenFIFOQueue[cnt-1];
		
		while(cnt>TokenFIFOQueue.length ){
			var nextToken=null;
			nextToken=getNextToken(peekFromIndex);
			if(nextToken!=null){
				peekFromIndex+=nextToken.length;
				TokenFIFOQueue.push(nextToken);
			}
			else return null;		
		}
		
		return TokenFIFOQueue[cnt-1];
	}
	
	function getNextToken(startFromIndex){
		var offset=startFromIndex;
		if(startFromIndex >= strToTokenize.length) return null;
		
		while(startFromIndex < strToTokenize.length){
			var nextChar = strToTokenize.charAt(startFromIndex);
			if(delim.indexOf(nextChar)>-1){
				if(offset==startFromIndex) return nextChar;
				else break;
			}
			startFromIndex++;
		}
		return strToTokenize.substring(offset, startFromIndex);
	}
}
