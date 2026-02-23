/**
 * @file scripting language
 * @author pungy <max.yakovlev555@gmail.com>
 * @license MIT
 */


/**
 * TreeSitter grammar
 */

const ws = /[ \t]/;
const wsO = /[ \t]*/;
const wsM = /[ \t]+/;
const newline = /\r?\n/;

const PREC = {
  PIPE: 1,
  CHAIN: 2,
  APPLY: 3,
  FLOW: 4,

  LITERAL: 1,
};

module.exports = grammar({
  name: 'shik',

  word: $ => $.identifier,

  extras: $ => [
    ws,
    newline,
    $.line_comment,
    $.block_comment,
  ],

  rules: {
    program: $ => repeat($.statement),

    statement: $ => seq($.expression, newline),

    line_comment: $ => token(seq(
      ';',
      /.*/
    )),

    block_comment: $ => token(seq(
      '{*',
      /[^*]*\*+([^}*][^*]*\*+)*/,
      '}',
    )),

    expression: $ => choice($.flow_expression, $.chain_expression, $.pipe_expression, $.application, $.primary),

    pipe_expression: $ => prec.left(PREC.PIPE, seq(
      field('left', $.expression),
      '$>',
      field('right', $.expression),
    )),
    chain_expression: $ => prec.left(PREC.CHAIN, seq(
      field('left', $.expression),
      '$',
      field('right', $.expression),
    )),

    flow_expression: $ => prec.left(PREC.FLOW, seq(
      field('left', $.expression),
      '#>',
      field('right', $.expression),
    )),

    application: $ => prec.left(PREC.APPLY, seq(
      field('fn', $.expression),
      field('arg', $.primary),
    )),

    primary: $ => choice(
      $.lambda,
      $.let_expression,
      $.list,
      $.object,
      $.literal,
      $.identifier,
      $.parenthesized,
      $.block,
      $.lazy,
    ),

    parenthesized: $ => seq('(', $.expression, ')'),
    block: $ => seq(
      "'(",
      repeat(seq($.expression, optional(newline))),
      ')'
    ),
    lazy: $ => seq(
      "#(",
      repeat(seq($.expression, optional(newline))),
      ')'
    ),

    list: $ => seq(
      '[',
      repeat($.primary),
      ']'
    ),

    object: $ => seq(
      '{',
      repeat($.object_items),
      '}'
    ),
    object_items: $ => seq(
      field('key', $.primary),
      field('value', $.primary),
    ),

    let_expression: $ => seq(
      'let$',
      field('name', $.let_pattern),
      field('value', $.expression)
    ),
    let_pattern: $ => choice($.identifier, $.let_list_pattern),
    let_list_pattern: $ => seq(
      '[',
      repeat($.let_pattern),
      field('rest', optional(seq('#', $.identifier))),
      ']',
    ),

    lambda: $ => seq(
      'fn',
      '[',
      field('arg', repeat($.match_pattern)),
      field('rest', optional(seq('#', $.identifier))),
      ']',
      field('body', $.expression),
    ),
    match_pattern: $ => choice(
      $.identifier,
      $.literal,
      $.match_list_pattern,
      '_',
    ),
    match_list_pattern: $ => seq(
      '[',
      repeat($.match_pattern),
      optional(seq('#', $.identifier)),
      ']',
    ),

    literal: $ => choice(
      $.string,
      $.number
    ),

    string: $ => choice(
      $.symbol_string,
      $.quoted_string
    ),

    symbol_string: $ => seq(
      ':',
      $.symbol_string_content,
    ),

    quoted_string: $ => seq(
      '"',
      repeat(choice(
        $.string_content,
        $.escape_sequence,
        $.interpolation
      )),
      '"'
    ),
    string_content: $ => token.immediate(prec(1, /[^"\\{]+/)),
    symbol_string_content: $ => token.immediate(prec(1, /[^\s\t\n\(\{\[\]\}\)]+/)),
    escape_sequence: $ => token.immediate(/\\./),
    interpolation: $ => seq(
      '{',
      $.expression,
      '}'
    ),

    number: $ => prec.dynamic(1, token(seq(
      optional('-'),
      /\d+/,
      optional(seq('.', /\d+/))
    ))),

    identifier: $ => /[\p{L}\p{N}!@%^&*\-_=+|?<>$.][\p{L}\p{N}!@#%^&*\-_=+'|?<>$.]*/u,
  }
});
