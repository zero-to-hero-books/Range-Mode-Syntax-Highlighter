JS wrapper files for the XML syntax definitions. Include these after RangeModeSyntaxHighlighter.js script tag.

For example, for HTML:
```
<!DOCTYPE html>
<html>
<head>
<script src="http://your-website.com/RangeModeSyntaxHighlighter-min.js"></script>
<script src="http://your-website.com/html.xml.js"></script>
<script src="http://your-website.com/javascript.xml.js"></script>
</head>
```
*html.xml.js* uses *javascript.xml.js* if there is a `<script>` tag in the code to highlight.
