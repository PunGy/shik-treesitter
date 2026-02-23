; Comments
(line_comment) @comment
(block_comment) @comment


; === Punctuation ===
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket
"'("   @punctuation.special
"#("   @punctuation.special
(interpolation
  "{" @punctuation.special
  "}" @punctuation.special) @embedded


; === Literals ===
(number) @number
(quoted_string) @string
(escape_sequence) @string.escape
(symbol_string_content) @string


; === Keywords ===
"$" @keyword
"$>" @keyword
"#>" @keyword
"fn" @keyword
"let$" @keyword

(application
  fn: (expression
    (primary
      (identifier) @function)))

(pipe_expression
  right: (expression
    (primary
      (identifier) @function)))

(chain_expression
  left: (expression
    (primary
      (identifier) @function)))


(flow_expression
  left: (expression
      (primary
        (identifier) @function))
  right: (expression
    (primary
      (identifier) @function)))

(object_items
  key: (primary) @property)

; Highlight lambda parameters
(lambda
  (match_pattern (identifier) @variable.parameter))
(lambda
  rest: (identifier) @variable.parameter)
; Also capture parameters inside a list pattern
(match_pattern (match_list_pattern (match_pattern (identifier) @variable.parameter)))

(let_pattern (identifier) @variable.parameter)
(let_list_pattern
  rest: (identifier) @variable.parameter)
; Also capture parameters inside a list pattern
(let_pattern (let_list_pattern (let_pattern (identifier) @variable.parameter)))

; Highlight keywords that are parsed as identifiers
((identifier) @keyword
  (#any-of? @keyword "if" "let"))

; Highlight built-in constants that are parsed as identifiers
((identifier) @boolean
  (#any-of? @boolean "true" "false"))
"_" @constant.builtin
