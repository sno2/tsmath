declare const enum TokenType {
  Number = 0,
  OpAdd = 1,
  OpSub = 2,
  OpMul = 3,
  OpDiv = 4,
  OpenParen = 5,
  CloseParen = 6,
}

export type Token =
  | Exclude<TokenType, TokenType.Number>
  | (TokenType.Number & {
    value: string;
  });

type ParseInt<T extends string, $Acc extends string = ""> =
  //
  T extends `${infer $Ch}${infer $Rest}`
    ? $Ch extends `${bigint}` ? ParseInt<$Rest, `${$Acc}${$Ch}`>
    : $Acc extends "" ? never
    : [TokenType.Number & { value: $Acc }, T]
    : $Acc extends "" ? never
    : [TokenType.Number & { value: $Acc }, T];

type ParseDelim<T extends string> = T extends `(${infer $Rest}`
  ? [TokenType.OpenParen, $Rest]
  : T extends `)${infer $Rest}` ? [TokenType.CloseParen, $Rest]
  : never;

type ParseOp<T extends string> =
  //
  T extends `+${infer $Rest}` ? [TokenType.OpAdd, $Rest]
    : T extends `-${infer $Rest}` ? [TokenType.OpSub, $Rest]
    : T extends `*${infer $Rest}` ? [TokenType.OpMul, $Rest]
    : T extends `/${infer $Rest}` ? [TokenType.OpDiv, $Rest]
    : never;

type Tokenize<T extends string, $Tokens extends unknown[] = []> = T extends
  ` ${infer $Rest}` ? Tokenize<$Rest, $Tokens>
  : T extends "" ? $Tokens
  : [ParseOp<T> | ParseInt<T> | ParseDelim<T>] extends [infer $Data]
    ? unknown extends $Data ? $Tokens
    : $Data extends [infer $Token, `${infer $Rest}`]
      ? Tokenize<$Rest, [...$Tokens, $Token]>
    : 2
  : $Tokens;

type Eval<T extends string> = Tokenize<T> extends infer $Tokens ? $Tokens
  : never;

type asdf2 = Eval<"2 + 2">;
