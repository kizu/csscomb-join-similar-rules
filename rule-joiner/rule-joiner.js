module.exports = {
    name: 'rule-joiner',

    syntax: ['css', 'less', 'sass', 'scss'],

    accepts: { boolean: [true, false] },

    runBefore: 'strip-spaces',

    /**
     * Processes tree node.
     * @param {String} nodeType
     * @param {node} node
     */
    process: function(nodeType, node) {
        var value = this.getValue('rule-joiner');
        if (value !== true) return;
        // Hacky hack, replace with some proper gonzales stringify
        var normalizeSelector = function(selector) {
            var result = [];
            for (var i = selector.length; i--;) {
                if (selector[i][0] === 'simpleselector') {
                    subSelector = selector[i].slice(1);
                    subResult = [];
                    for (var j = subSelector.length; j--;) {
                        if (subSelector[j][0] !== 's') {
                            subResult.push(subSelector[j].toString().replace(/,/g, '_'));
                        }
                    }
                    subResult = subResult
                        .join('__')
                        .replace(/^class_ident_/g, '.')
                        .replace(/^shash_/g, '#');
                    if (result.indexOf(subResult) === -1) {
                        result.push(subResult);
                    }
                }
            }
            return result.sort().join(',');
        }

        var needDeclDelim = function(ruleset) {
            for (var i = ruleset[2].length; i--;) {
                if (ruleset[2][i][0] === 'declaration') {
                    return true;
                }
                if (ruleset[2][i][0] === 'declDelim') {
                    return false;
                }
            }
            return false;
        }

        if (['stylesheet', 'atrulers', 'block'].indexOf(nodeType) !== -1) {
            var prevRuleset;
            var prevRulesetIndex;
            for (var i = node.length; i--;) {
                // Do not merge rulesets if there is something other than
                // whitespace or comment between them
                if (['ruleset', 'commentML', 's'].indexOf(node[i][0]) === -1) {
                    prevRuleset = undefined;
                    prevRulesetIndex = undefined;
                }
                if (node[i][0] !== 'ruleset') continue;
                var currentRuleset = node[i];
                if (prevRuleset) {
                    prevSelector = normalizeSelector(prevRuleset[1].slice(1));
                    currentSelector = normalizeSelector(currentRuleset[1].slice(1));
                    if (prevSelector === currentSelector) {
                        // Insert declDelim if the current ruleset lacks it
                        if (needDeclDelim(currentRuleset)) {
                            currentRuleset[2].splice(currentRuleset[2].length, 0, ['declDelim']);
                        }
                        // Move stuff from the previous ruleset to the current
                        for (var j = 0; j < prevRuleset[2].length; j++) {
                            if (typeof prevRuleset[2][j] !== 'string') {
                                currentRuleset[2].splice(currentRuleset[2].length, 0, prevRuleset[2][j]);
                            }
                        }
                        // Remove the previous ruleset
                        node.splice(prevRulesetIndex, 1);
                    }
                }
                prevRuleset = currentRuleset;
                prevRulesetIndex = i;
            }
        }
    }
};