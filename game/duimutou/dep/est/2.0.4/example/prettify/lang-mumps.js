/*! 2016 Baidu Inc. All Rights Reserved */
PR.registerLangHandler(PR.createSimpleLexer([["pln",/^[\t\n\r \xa0]+/,null,"	\n\r  "],["str",/^"(?:[^"]|\\.)*"/,null,'"']],[["com",/^;[^\n\r]*/,null,";"],["dec",/^\$(?:d|device|ec|ecode|es|estack|et|etrap|h|horolog|i|io|j|job|k|key|p|principal|q|quit|st|stack|s|storage|sy|system|t|test|tl|tlevel|tr|trestart|x|y|z[a-z]*|a|ascii|c|char|d|data|e|extract|f|find|fn|fnumber|g|get|j|justify|l|length|na|name|o|order|p|piece|ql|qlength|qs|qsubscript|q|query|r|random|re|reverse|s|select|st|stack|t|text|tr|translate|nan)\b/i,null],["kwd",/^(?:[^$]b|break|c|close|d|do|e|else|f|for|g|goto|h|halt|h|hang|i|if|j|job|k|kill|l|lock|m|merge|n|new|o|open|q|quit|r|read|s|set|tc|tcommit|tre|trestart|tro|trollback|ts|tstart|u|use|v|view|w|write|x|xecute)\b/i,null],["lit",/^[+-]?(?:\.\d+|\d+(?:\.\d*)?)(?:e[+-]?\d+)?/i],["pln",/^[a-z][^\W_]*/i],["pun",/^[^\w\t\n\r"$%;^\xa0]|_/]]),["mumps"]);