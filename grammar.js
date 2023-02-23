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

    // MatchExpr = "match" Expr "{" MatchExprCaseList "}";
    MatchExpr: $ => seq('match', $.Expr, '{', $.MatchExprCaseList, '}'),

    // MatchExprCaseList = MatchExprCase ("," MatchExprCase)*;
    MatchExprCaseList: $ => seq($.MatchExprCase, repeat(seq(',', $.MatchExprCase))),

    // MatchExprCase = MatchExprCaseLhsValue "->" Expr;
    MatchExprCase: $ => seq($.MatchExprCaseLhsValue, '->', $.Expr),

    // MatchExprCaseLhsValue = MatchExprCaseLhsValues | "otherwise";
    MatchExprCaseLhsValue: $ => choice($.MatchExprCaseLhsValues, 'otherwise'),

    // MatchExprCaseLhsValues = TupleDestructuration | DataDestructuration | PlaceholderDecl | "_" | ExprNumber;
    MatchExprCaseLhsValues: $ => choice($.TupleDestructuration, $.DataDestructuration, $.PlaceholderDecl, '_', $.ExprNumber),

    // PlaceholderDecl = Identifier;
    PlaceholderDecl: $ => $.Identifier,

    // TupleDestructuration = "(" (TupleDestructurationElem ("," TupleDestructurationElem)*)? ")";
    TupleDestructuration: $ => seq('(', optional(seq($.TupleDestructurationElem, repeat(seq(',', $.TupleDestructurationElem)))), ')'),
    // TupleDestructurationElem = MatchExprCaseLhsValues;
    TupleDestructurationElem: $ => $.MatchExprCaseLhsValues,

    // DataDestructuration = "{" (DataDestructuration ("," TupleDestructurationElem)*)? "}";
    DataDestructuration: $ => seq('{', optional(seq($.DataDestructurationElem, repeat(seq(',', $.DataDestructurationElem)))), '}'),
    // DataDestructurationElem = Identifier ":" MatchExprCaseLhsValues;
    DataDestructurationElem: $ => seq($.Identifier, ':', $.MatchExprCaseLhsValues),

    // ExprRet = "ret" Expr?;
    ExprRet: $ => seq('ret', optional($.Expr)),

    // ExprTuple = "(" (Expr ("," Expr)*)? ")";
    ExprTuple: $ => seq('(', optional(seq($.Expr, repeat(seq(',', $.Expr)))), ')'),

    // Expr = ExprVarRef | ExprNumber | ExprRet | ExprTuple | ExprAggregateDataAccess | MatchExpr;
    Expr: $ => choice($.ExprVarRef, $.ExprNumber, $.ExprRet, $.ExprTuple, $.ExprAggregateDataAccess, $.MatchExpr),

    // ExprStmt = Expr ";";
    ExprStmt: $ => seq($.Expr, ';'),

    // Function_type = "proc" | "fn";
    Function_Type: $ => choice('proc', 'fn'),

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
