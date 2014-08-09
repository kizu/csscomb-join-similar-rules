var assert = require('assert');
var CSScomb = require('csscomb');
var testedOption = require('./join-similar-rules');
var csscomb = new CSScomb().use(testedOption);

describe('Join similar rules', function() {
    it('Should join two simple rules', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a { width: 10px; } a { height: 10px; }';
        var expected = 'a { width: 10px;  height: 10px; } ';
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });
    it('Should join two simple rules with newline character', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a { width: 10px; }\na { height: 10px; }';
        var expected = 'a { width: 10px;  height: 10px; }\n';
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });
    it('Should join two rules if there is a comment between them', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a { width: 10px; } /* hey! */ a { height: 10px; }';
        var expected = 'a { width: 10px;  height: 10px; } /* hey! */ ';
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });
    it('Should not join rules when there is something between them', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a { width: 10px; } b { width: 20px; } a { height: 10px; }';
        var result = csscomb.processString(css);
        assert.equal(result, css);
    });
    it('Should add missing semicolon', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a { width: 10px } a { height: 10px }';
        var expected = 'a { width: 10px ; height: 10px } ';
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });
    it('Should remove doubled selectors', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a { width: 10px; } a, a { height: 10px }';
        var expected = 'a { width: 10px;  height: 10px } ';
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });
    it('Should work for multiple selectors in different order', function() {
        csscomb.configure({'join-similar-rules': true});
        var css = 'a, b, c { width: 10px; } b, c ,a { height: 10px }';
        var expected = 'a, b, c { width: 10px;  height: 10px } ';
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });

    it('Should work with other prettifying options', function() {
        csscomb.configure({
            'join-similar-rules': true,
            'space-between-declarations': '\n'
        });
        var css = 'a { width: 10px; } a { height: 10px; }';
        var expected = 'a { width: 10px; \nheight: 10px; } '; // Why there is a space?
        var result = csscomb.processString(css);
        assert.equal(result, expected);
    });
});