/*! 2016 Baidu Inc. All Rights Reserved */
PR.registerLangHandler(PR.createSimpleLexer([["pln",/^[\t\n\r \xa0]+/,null,"	\n\r  "],["com",/^%[^\n\r]*/,null,"%"]],[["lit",/^\\(?:cr|l?dots|R|tab)\b/],["kwd",/^\\[@-Za-z]+/],["kwd",/^#(?:ifn?def|endif)/],["pln",/^\\[{}]/],["pun",/^[()[\]{}]+/]]),["Rd","rd"]);