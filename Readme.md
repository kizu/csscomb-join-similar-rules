# [CSSComb.js](https://github.com/csscomb/csscomb.js) option for joining the rules with the same selectors

## join-similar-rules

Acceptable value: `true`.

Example: { "join-similar-rules": true }

``` CSS
/* before */
a { width: 10px; }
a { height: 10px; }

/* after */
a { width: 10px;  height: 10px; }

```

## Usage

This is a plugin for CSSComb.js, to learn how to use it read the corresponding docs.

## Features

- Joins equal selectors.
- Inserts missing semicolons between joined declarations.
- Works for multiple selectors in different order.
- Leaves untouched selectors if there is anything between them.

## Known issues

The joining is literal and does not handle any whitespaces, so you should use other CSSComb.js options to prettify the result.
