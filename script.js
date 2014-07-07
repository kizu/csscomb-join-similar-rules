// Require:
var Comb = require('csscomb');
var ruleJoiner = require('./rule-joiner/rule-joiner.js');

// Configure:
var comb = new Comb();

var css = '#a,  .b  {\n  width: 10px\n}\n#a,.b{\n  /*z*/foo:bar\n}\n/* hey ho */\n.b, #a {\n  bar: baz; \n}'

var result = comb
    .use(ruleJoiner)
    .configure({
        'rule-joiner': true,
        'always-semicolon': true,
        'space-after-colon': ' ',
        'sort-order': ['foo', 'bar', 'width']
    })
    .processString(css, 'css')

console.log(result);