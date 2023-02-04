const WHITE_SPACE = choice(" ", "\t", "\v", "\f");
const NEWLINE = /\r?\n/;

module.exports = grammar({
  name: 'tmplang',

  rules: {
    // S = ( Function_Definition | DataDecl)*
    //   | "EOF";
    // Note: There is no need to handle EOF
    source_file: $ => repeat(choice($.Function_Definition, $.DataDecl)),

    // DataDecl = "data" Identifier "=" DataDeclFieldList ";";
    DataDecl: $ => seq('data', $.Identifier, seq('=', $.DataDeclFieldList), ';'),

    // DataDeclFieldList = DataDeclField (",", DataDeclField)*;
    DataDeclFieldList: $ => seq($.DataDeclField, repeat(seq(',', $.DataDeclField))),

    // DataDeclField = Identifier ":" Type;
    DataDeclField: $ => seq($.Identifier, ':', $.Type),

    // Function_Definition =
    //   | Function_Type, Identifier, ":", Param_List, "->", Type, Block
    //   | Function_Type, Identifier, ":", Param_List, Block
    //   | Function_Type, Identifier, "->", Type, Block
    //   | Function_Type, Identifier, Block;
    Function_Definition: $ => seq($.Function_Type, field('name', $.Identifier), choice(
        seq(':', $.Param_List, choice(
            seq('->', $.Type, $.Block),
            $.Block
          )
        ),
        seq('->', $.Type, $.Block),
        $.Block
      )
    ),

    // Param_List = Param (",", Param)*;
    Param_List: $ => seq($.Param, repeat(seq(',', $.Param))),

    // Param = Type Identifier;
    Param: $ => seq($.Type, $.Identifier),

    //Block = "{" "}";
    Block: $ => seq('{', repeat($.ExprStmt), '}'),

    // ExprNumber = [0-9][0-9_]*;
    ExprNumber: $ => /[0-9][0-9_]*/,

    // ExprVarRef = Identifier;
    ExprVarRef: $ => $.Identifier,

    // ExprAggregateDataAccess = (ExprAggregateDataAccess | ExprVarRef) "." (Integer | Identifier);
    ExprAggregateDataAccess: $ => seq(choice($.ExprAggregateDataAccess, $.ExprVarRef), '.', choice($.Identifier, $.ExprNumber)),

    // ExprRet = "ret" Expr?;
    ExprRet: $ => seq('ret', optional($.Expr)),

    // ExprTuple = "(" (Expr ("," Expr)*)? ")";
    ExprTuple: $ => seq('(', optional(seq($.Expr, repeat(seq(',', $.Expr)))), ')'),

    // Expr = ExprNumber | ExprRet | ExprTuple | ExprAggregateDataAccess;
    Expr: $ => choice($.ExprNumber, $.ExprRet, $.ExprTuple, $.ExprAggregateDataAccess),

    // ExprStmt = Expr ";";
    ExprStmt: $ => seq($.Expr, ';'),

    // Function_type = "proc" | "fn";
    Function_Type: $ => choice('proc','fn'),

    // Type = NamedType | TupleType;
    Type: $ => choice($.NamedType, $.TupleType),

    // NamedType = Identifier;
    NamedType: $ => $.Identifier,

    // TupleType = "(" (Type ("," Type)*)? ")";
    TupleType: $ => seq('(', optional(seq($.Type, repeat(seq(',', $.Type)))), ')'),

    // Identifier = [a-zA-Z][a-zA-Z0-9]*;
    Identifier: $ => /[a-zA-Z][a-zA-Z0-9]*/,

    // Comment = //.*$;
    Comment: $ => /\/\/.*/,

    // Newline = \r?\n;
    Newline: $ => NEWLINE,

    // Whitespace = /[ \t\f\v]/;
    Whitespace: $ => token(WHITE_SPACE),
  },

  // Tokens that can appear ANYWHERE in the grammar
  extras: $ => [
    $.Comment,
    $.Newline,
    $.Whitespace
  ]
});
