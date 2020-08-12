RMSH.addSyntaxXML("html", "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<syntaxDefinition name=\"html\" extensions=\"htm html xhtml\" caseSensitive=\"true\"><delimiters>\"'&lt;&gt;[]!-?/=</delimiters><range id=\"defaultHTML\" default=\"true\"><symbols color=\"#0000ff\">&lt; &lt;/ &gt; &lt;![CDATA[ ]]&gt; &lt;? ?&gt; &lt;script script&gt; &lt;style style&gt;</symbols><symbols color=\"#ee3333\">&lt;!-- --&gt;</symbols><embed range=\"javascriptTag\"><begin>&lt;script</begin><end>script&gt;</end></embed><embed range=\"cssTag\"><begin>&lt;style</begin><end>style&gt;</end></embed><embed range=\"tag\"><begin>&lt;</begin><end>&gt;</end></embed><embed range=\"endtag\"><begin>&lt;/</begin><end>&gt;</end></embed><embed range=\"cdata\" fold=\"true\"><begin>&lt;![CDATA[</begin><end>]]&gt;</end></embed><embed range=\"comment\" fold=\"true\"><begin>&lt;!--</begin><end>--&gt;</end></embed></range><range id=\"quoteDouble\" color=\"#ee3333\"/><range id=\"quoteSingle\" color=\"#ee3333\"/><range id=\"comment\" color=\"#00bb00\"><!-- double hyphen is not allowed in comments, mark as bold and red --><symbols color=\"#ee3333\" bold=\"true\">--</symbols></range><range id=\"cdata\"/><range id=\"endtag\" color=\"#0000ff\"/><range id=\"tag\" color=\"#0000ff\"><symbols color=\"#ee3333\">\" '</symbols><symbols color=\"#000000\">=</symbols><embed range=\"quoteDouble\"><begin>\"</begin><end>\"</end></embed><embed range=\"quoteSingle\"><begin>'</begin><end>'</end></embed></range><!-- CSS tag range--><range id=\"cssTag\" color=\"#0000ff\"><symbols color=\"#ee3333\">\" '</symbols><symbols color=\"#000000\">=</symbols><embed range=\"quoteDouble\"><begin>\"</begin><end>\"</end></embed><embed range=\"quoteSingle\"><begin>'</begin><end>'</end></embed><embed range=\"css\" fold=\"true\"><begin>&gt;</begin><end>&lt;/</end></embed></range><range id=\"css\"><symbols color=\"#ee3333\">\" '</symbols><symbols color=\"#00bb00\">/* */</symbols><embed range=\"quoteDoubleCSS\"><begin>\"</begin><end>\"</end></embed><embed range=\"quoteSingleCss\"><begin>'</begin><end>'</end></embed><embed range=\"commentCSS\" fold=\"true\"><begin>/*</begin><end>*/</end></embed></range><range id=\"quoteDoubleCSS\" color=\"#ee3333\"><symbols>\\\" \\\\</symbols></range><range id=\"quoteSingleCSS\" color=\"#ee3333\"><symbols>\\' \\\\</symbols></range><range id=\"commentCSS\" color=\"#00bb00\"/><!-- javascript tag range--><range id=\"javascriptTag\" color=\"#0000ff\"><symbols color=\"#ee3333\">\" '</symbols><symbols color=\"#000000\">=</symbols><embed range=\"quoteDouble\"><begin>\"</begin><end>\"</end></embed><embed range=\"quoteSingle\"><begin>'</begin><end>'</end></embed><embed syntaxDefinition=\"javascript\" fold=\"true\"><begin>&gt;</begin><end>&lt;/</end></embed></range></syntaxDefinition>");