# Range-Mode-Syntax-Highlighter
RangeModeSyntaxHighlighter.js is a code highlighter with code folding and line numbers for code in `<pre>` or `<pre><code>` on webpages. The project consists of two parts:
1. An XML specification for defining syntax highlighting and folding for programming, scripting and markup languages. 
2. A javascript implementation for highlighting code inside `<pre>` or `<pre><code>` on webpages.

Github website with documentation and usage guide: 

[Website](https://zero-to-hero-books.github.io/Range-Mode-Syntax-Highlighter/index.html)

Unit, Integration and Performance tests:

[Tests](https://zero-to-hero-books.github.io/Range-Mode-Syntax-Highlighter/tests/unitTokenizer.html)

Usage:

`RMSH.highlight(HTMLelement, lang, bFold, bLineNumbers);`

* HTMLelement: The element to highlight.
* lang: Language name string corresponding to one loaded with `RMSH.addSyntaxXML()`. (This is done by the wrapper JS files.)
* bFold: Set `true` to enable code folding. Unless code folding is needed, it should be `false`. On Internet Explorer code folding is not supported, and this value is ignored.
* bLineNumbers: Set `true` to display line numbers, leave out or set to `false` otherwise.

If neither code folding or line numbers are needed, then they can be left out. The function call becomes:

`RMSH.highlight(HTMLelement, lang);`
