module.exports = grammar({
  name: 'tmplang',

  rules: {
    // S = Function_Definition*
    //   | "EOF";
    // Note: There is no need to handle EOF
    source_file: $ => repeat($.Function_Definition),
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
    Param_List: $ => seq($.Param,repeat(seq(',', $.Param))),
    // Param = Type Identifier;
    Param: $ => seq($.Type,$.Identifier),
    //Block = "{" "}";
    Block: $ => seq('{','}'),
    // Function_type = "proc" | "fn";
    Function_Type: $ => choice('proc','fn'),
    // Type = Identifier;
    Type: $ => $.Identifier,
    // Identifier = [a-zA-Z][a-zA-Z0-9]*;
    Identifier: $ => /[a-zA-Z][a-zA-Z0-9]*/
  }
});
