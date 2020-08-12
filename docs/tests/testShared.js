var id=document.getElementById.bind(document);
function exists(obj){return typeof obj!=='undefined';}

function addContents(sel){
	var fragment=document.createDocumentFragment();
	var ul = document.createElement('ul');
	fragment.appendChild(ul);
	var contents=[];
	contents.push({str:"Unit tests"});
	contents.push({str:"Tokenizer", href:"./unitTokenizer.html"});
	contents.push({str:"Symbolizer", href:"./unitSymbolizer.html"});
	contents.push({str:"Styler", href:"./unitStyler.html"});
	contents.push({str:"Integration tests"});
	contents.push({str:"Tokenizer + Symbolizer", href:"./integrationSymbolizer.html"});
	contents.push({str:"Tokenizer + Symbolizer + Styler", href:"./integrationStyler.html"});


	contents.forEach(function(obj){
		var li=document.createElement('li');
		fragment.firstChild.appendChild(li);
		if(obj.str==sel){
			li.className="pad sel";
			li.textContent=sel;
		}
		else if(obj.href==undefined){
			li.textContent=obj.str;
		}
		else{
			li.className="pad";
			var a=document.createElement('a');
			a.href=obj.href;
			a.textContent=obj.str;
			li.appendChild(a);
		}
	});
	id("testUL").innerHTML=fragment.firstChild.innerHTML;
}

var sqlStr="SELECT isbn,price FROM Book\nWHERE price<(SELECT AVG(price) FROM Book)";
var sqlDelimiters=";()'\"/*-,";
var sqlExpected=["SELECT", " ", "isbn", ",", "price", " ", "FROM", " ", "Book", "\n", "WHERE", " ", "price<", "(",
				"SELECT", " ", "AVG", "(", "price", ")", " ", "FROM", " ", "Book", ")"];
var sqlSymbolsExpected=['{"symbol":"SELECT","offset":0}', '{"symbol":"FROM","offset":18}',
				'{"symbol":"WHERE","offset":28}', '{"symbol":"SELECT","offset":41}', '{"symbol":"FROM","offset":59}'];

var jsStr="function retnull(){\n//comment\nreturn null;\n}/*unterminated";
var jsDelimiters="+-/%*|^?:&!=<>\"'\\{}[]()~`;$."
var jsExpected=["function", " ", "retnull", "(", ")", "{", "\n", "/", "/", "comment",
				"\n", "return", " ", "null", ";", "\n", "}", "/", "*", "unterminated"];
var jsSymbolsExpected=['{"symbol":"function","offset":0}', '{"symbol":"//","offset":20}',
				'{"symbol":"return","offset":30}', '{"symbol":"null","offset":37}', '{"symbol":"/*","offset":44}'];

var xmlStr="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root>text</root>";
var xmlDelimiters="\"'<>[]!?-/";
var xmlExpected=["<", "?", "xml", " ", "version=", "\"", "1.0", "\"", " ", "encoding=", "\"",
				"UTF", "-", "8", "\"", "?", ">", "\n", "<", "root", ">", "text", "<", "/", "root", ">"];
var xmlSymbolsExpected=['{"symbol":"<?","offset":0}', '{"symbol":"\\"","offset":14}', '{"symbol":"\\"","offset":18}',
				'{"symbol":"\\"","offset":29}', '{"symbol":"\\"","offset":35}', '{"symbol":"?>","offset":36}',
				'{"symbol":"<","offset":39}', '{"symbol":">","offset":44}', '{"symbol":"</","offset":49}',
				'{"symbol":">","offset":55}'];

function TestOutput(HTMLelement, expected){
	var el=HTMLelement;
	var cnt=0;
	el.innerHTML="";
	var expCnt=0;
	if(Array.isArray(expected)) expCnt=expected.length;
	return logOutput;
	

	function logOutput(obj){
		cnt+=1;
		var node;
		if(typeof obj == 'object') obj=JSON.stringify(obj);
		
		if(obj==" "){
			node=document.createElement('mark');
			node.textContent="space";
		}
		else if(obj=="\t"){
			node=document.createElement('mark');
			node.textContent="tab (\\t)";
		}
		else if(obj=="\r"){
			node=document.createElement('mark');
			node.textContent="carriage return (\\r)";
		}
		else if(obj=="\n"){
			node=document.createElement('mark');
			node.textContent="new line (\\n)";
		}
		else node=document.createTextNode(obj);
		
		if(expCnt>0){
			var b=document.createElement('b');
			if(cnt<=expCnt){
				if(obj==expected[cnt-1]){
					b.innerHTML="&#10004;&nbsp;";
					b.style.color="#00ff00";
				}
				else{
					b.innerHTML="&times;&nbsp;";
					b.style.color="#ff0000";
				}
			}
			else{
				b.innerHTML="&times;&nbsp;";
				b.style.color="#ff0000";
			}
			el.appendChild(b);
		}
		el.appendChild(node);
		node=document.createElement('br');
		el.appendChild(node);
	}

}

var Test=(function () {
	var args;
	var code;
	var expected;
	var bEdit=true;
	return {
        load: load,
        edit: edit,
        run: run
	};
	
	function load(tArgs, tCode, tExpected){
		id('testForm').querySelectorAll('.arg').forEach(function(element){
			if(element.type=='checkbox'){
				element.checked=tArgs[element.dataset.arg - 1];
				element.disabled=true;
			}
			else element.value=tArgs[element.dataset.arg - 1];
			element.readOnly=true;
			addClass(element, 'readOnly');
		});
		args=tArgs;
		
		var element=id('code');
		element.value=tCode;
		element.readOnly=true;
		addClass(element, 'readOnly');
		code=tCode;
		expected=tExpected;
		bEdit=false;
	}
	function edit(){
		id('testForm').querySelectorAll('.arg').forEach(function(element){
			if(element.type=='checkbox') element.disabled=false;
			element.readOnly=false;
			removeClass(element, 'readOnly');
		});
		var element=id('code');
		element.readOnly=false;
		removeClass(element, 'readOnly');
		expected=undefined;
		args=undefined;
		code=undefined;
		bEdit=true;
	}
	function run(setup){
		if(bEdit){
			args=[];
			id('testForm').querySelectorAll('.arg').forEach(function(element){
				if(element.type=='checkbox') args[element.dataset.arg - 1]=element.checked;
				else args[element.dataset.arg - 1]=element.value;
			});
		}
		if(bEdit) code=id('code').value;
		window.logOutput=TestOutput(id('output'), expected);
		createObj(args);
		try{
			new Function(code)();
		}
		catch(t){
			id('output').appendChild(document.createTextNode("Test code Error: "+t.message));
			console.dir(t);
		}
	}
}());

function hasClass(el, classStr){
	  if (el.classList) return el.classList.contains(classStr);
	  else return !!el.className.match(new RegExp('(\\s|^)' + classStr + '(\\s|$)'));
}

function addClass(el, classStr){
	  if (el.classList) el.classList.add(classStr);
	  else if (!hasClass(el, classStr)) el.className += " " + classStr;
}

function removeClass(el, classStr){
	  if (el.classList) el.classList.remove(classStr);
	  else if (hasClass(el, classStr)) {
		var reg = new RegExp('(\\s|^)' + classStr + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	  }
}
