(Type) @type
(Function_Definition name: (Identifier) @function)
(Identifier) @variable
(ExprNumber) @number

[
  ","
  ";"
  ":"
  "->"
  "."
] @punctuation.delimiter

[
  "("
  ")"
  "{"
  "}"
  "="
] @punctuation.bracket

[
  (Function_Type)
  "ret"
  "data"
  "match"
  "otherwise"
  "_"
] @keyword

(Comment) @comment

(ERROR) @error
