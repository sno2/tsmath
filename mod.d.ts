import type {
  DigitDiffMap,
  DigitProdMap,
  DigitSumMap,
  TenComplementMap,
} from "./_maps.ts";

type Rev<
  T extends string,
  $Acc extends string = ""
> = T extends `${infer $Ch}${infer $Rest}` ? Rev<$Rest, `${$Ch}${$Acc}`> : $Acc;

declare const __UNSAFE_TYPE_LOCK__: unique symbol;

type TypeLock<Name extends string> = {
  [K in `__${Name}TypeLock__`]: typeof __UNSAFE_TYPE_LOCK__;
};

type Is<T extends K, K> = T;

type StripTypeLock<Obj, Name extends string> = Obj extends infer U &
  TypeLock<Name>
  ? U
  : never;

type DigitSum<
  Lhs extends string,
  Rhs extends string
> = Lhs extends keyof DigitSumMap
  ? Rhs extends keyof DigitSumMap
    ? DigitSumMap[Lhs][Rhs]
    : never
  : never;

type IntSyntax = `${bigint}` | `${bigint}e${bigint}`;

type Repeat<
  S extends string,
  N extends string,
  $Acc extends string = "",
  $Counter extends 0[] = []
> = `${$Counter["length"]}` extends `${N}`
  ? $Acc
  : Repeat<S, N, `${$Acc}${S}`, [...$Counter, 0]>;

type NegExponential<
  T extends string,
  N extends string,
  $Counter extends 0[] = []
> =
  //
  `${$Counter["length"]}` extends N
    ? T extends "" | "-"
      ? "0"
      : Rev<T>
    : T extends `${string}${infer $Rest}`
    ? NegExponential<$Rest, N, [...$Counter, 0]>
    : "0";

type NormalizeExponential<T extends IntSyntax> =
  //
  T extends `${infer $Before}e${infer $After}`
    ? $Before extends "0"
      ? "0"
      : $Before extends "-0"
      ? "-0"
      : $After extends `-${infer $After}`
      ? NegExponential<Rev<$Before>, $After>
      : `${$Before}${Repeat<"0", $After>}`
    : never;

export type Int<N extends number | `${number}` | bigint | `${bigint}`> =
  N extends `${infer $N extends number | bigint}`
    ? $N
    : N extends number | bigint
    ? N
    : never;

export declare namespace Int {
  export {}; // disable automatic exports

  /**
   * Unsafely creates an `Int`. If the `string` is not a valid `Int`, then this
   * will return `never`.
   */
  export type Unsafe<T extends string> = T extends `${infer $N extends number}`
    ? $N
    : never;

  export type IsPositive<N extends number> = IsNegative<N> extends true
    ? false
    : true;

  export type IsNegative<N extends number> = `${N}` extends `-${string}`
    ? true
    : false;

  export type Min<N1 extends number, N2 extends number> =
    //
    Int.GreaterThan<N1, N2> extends true ? N1 : N2;

  export type Max<N1 extends number, N2 extends number> =
    //
    Int.GreaterThan<N1, N2> extends true ? N2 : N1;

  /** Negates the given integer. */
  export type Negate<N extends number> =
    //
    IsPositive<N> extends true
      ? N extends 0
        ? 0
        : Int.Unsafe<`-${N}`>
      : `${N}` extends `-${infer $Int}`
      ? Int.Unsafe<$Int>
      : 0; // this is *impossible* but required for valid typing

  /** Calculates the absolute value of the given integer. */
  export type Abs<N extends number> = Int.IsNegative<N> extends true
    ? Int.Negate<N>
    : N;

  type HasGreaterLength<S1 extends string, S2 extends string> = [
    ReplaceWith<S1, "0">,
    ReplaceWith<S2, "0">
  ] extends [`${infer $ReplacedS1}`, `${infer $ReplacedS2}`]
    ? $ReplacedS1 extends $ReplacedS2
      ? unknown
      : $ReplacedS1 extends `${$ReplacedS2}${infer _}`
      ? true
      : false
    : never;

  type GreaterThanPosImpl<Lhs extends string, Rhs extends string> = [
    Lhs,
    Rhs
  ] extends [
    `${infer $DigitLhs}${infer $RestLhs}`,
    `${infer $DigitRhs}${infer $RestRhs}`
  ]
    ? $DigitLhs extends $DigitRhs
      ? GreaterThanPosImpl<$RestLhs, $RestRhs>
      : DigitDiff<$DigitLhs, $DigitRhs>[1] extends true
      ? false
      : true
    : false;

  type GreaterThanPos<
    Lhs extends string,
    Rhs extends string
  > = HasGreaterLength<Lhs, Rhs> extends infer $GreaterLenInfo
    ? $GreaterLenInfo extends true
      ? true
      : $GreaterLenInfo extends false
      ? false
      : GreaterThanPosImpl<Lhs, Rhs>
    : never;

  export type GreaterThan<Lhs extends number, Rhs extends number> =
    //
    Lhs extends Rhs
      ? false
      : [Lhs, Rhs] extends [0, 0]
      ? false
      : [Int.IsPositive<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? true
      : [Int.IsNegative<Lhs>, Int.IsPositive<Rhs>] extends [true, true]
      ? false
      : [Int.IsNegative<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? GreaterThanPos<`${Int.Negate<Lhs>}`, `${Int.Negate<Rhs>}`> extends true
        ? false
        : true
      : GreaterThanPos<`${Lhs}`, `${Rhs}`>;

  export type LessThan<Lhs extends number, Rhs extends number> = Lhs extends Rhs
    ? false
    : GreaterThan<Lhs, Rhs> extends true
    ? false
    : true;

  /**
   * Takes the side that needs a carry and handles the carries whilst reversing
   * the result.
   */
  type HandleSideCarry<
    Side extends string,
    $Acc extends string = ""
  > = Side extends `${infer $Digit}${infer $Rest}`
    ? DigitSum<$Digit, "1"> extends `${infer $Dg1}${infer $Dg2}`
      ? $Dg2 extends ""
        ? `${$Rest}${$Dg1}${$Acc}`
        : $Rest extends ""
        ? `1${$Dg2}${$Acc}`
        : HandleSideCarry<$Rest, `${$Dg2}${$Acc}`>
      : never
    : `1${$Acc}`;

  /**
   * This takes in the left and right hand side numbers with their digits
   * **reversed**.
   */
  type AddParts<
    Lhs extends string,
    Rhs extends string,
    Acc extends string = "",
    ExtraCarry extends boolean = false
  > =
    //
    Lhs extends `${infer $LeftDigit}${infer $LeftRest}`
      ? Rhs extends `${infer $RightDigit}${infer $RightRest}`
        ? DigitSum<
            $LeftDigit,
            $RightDigit
          > extends `${infer $FirstDigit}${infer $SecondDigit}`
          ? (
              $SecondDigit extends ""
                ? [$FirstDigit, false]
                : [$SecondDigit, true]
            ) extends [`${infer $AddingDigit}`, infer $NextExtraCarry]
            ? (
                ExtraCarry extends true
                  ? DigitSum<
                      $AddingDigit,
                      "1"
                    > extends `${infer $Dg1}${infer $Dg2}`
                    ? $Dg2 extends ""
                      ? [$Dg1, $NextExtraCarry]
                      : [$Dg2, true]
                    : never
                  : [$AddingDigit, $NextExtraCarry]
              ) extends [`${infer $AddingDigit}`, infer $NextExtraCarry]
              ? AddParts<
                  $LeftRest,
                  $RightRest,
                  `${$AddingDigit}${Acc}`,
                  $NextExtraCarry extends boolean ? $NextExtraCarry : never
                >
              : never
            : never
          : never
        : Int.Unsafe<`${ExtraCarry extends true
            ? HandleSideCarry<Lhs>
            : Rev<Lhs>}${Acc}`>
      : Int.Unsafe<`${ExtraCarry extends true
          ? HandleSideCarry<Rhs>
          : Rev<Rhs>}${Acc}`>;

  export type AnyZero = 0 | -0;

  /** Adds the two integers together. */
  export type Add<Lhs extends number, Rhs extends number> =
    //
    Lhs extends Int.AnyZero
      ? Rhs
      : Rhs extends Int.AnyZero
      ? Lhs
      : [Int.IsPositive<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? Int.Sub<Lhs, Int.Negate<Rhs>>
      : [Int.IsNegative<Lhs>, Int.IsPositive<Rhs>] extends [true, true]
      ? Int.Sub<Rhs, Int.Negate<Lhs>>
      : [Int.IsNegative<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? Int.Sub<Lhs, Int.Negate<Rhs>>
      : AddParts<Rev<`${Lhs}`>, Rev<`${Rhs}`>>;

  type DigitDiff<
    Dg1 extends string,
    Dg2 extends string
  > = Dg1 extends keyof DigitDiffMap
    ? Dg2 extends keyof DigitDiffMap
      ? DigitDiffMap[Dg1][Dg2]
      : never
    : never;

  type TenComplement<T extends string> = T extends keyof TenComplementMap
    ? TenComplementMap[T]
    : never;

  type HandleSubSideBorrow<
    Side extends string,
    Borrowed extends boolean,
    $Acc extends string = ""
  > =
    //
    Borrowed extends false
      ? `${Rev<Side>}${$Acc}`
      : Side extends `${infer $Digit}${infer $Rest}`
      ? DigitDiff<$Digit, "1"> extends [
          `${infer $Rem}`,
          Is<infer $NextBorrowed, boolean>
        ]
        ? [$Rest, $Rem] extends ["", "0"]
          ? `${$NextBorrowed extends true ? "-" : ""}${$Acc}`
          : HandleSubSideBorrow<
              $Rest,
              $NextBorrowed,
              `${[$NextBorrowed, $Rest] extends [true, `${infer _}${infer __}`]
                ? TenComplement<$Rem>
                : $Rem}${$Acc}`
            >
        : never
      : `${Borrowed extends true ? "-" : ""}${$Acc}`;

  export type SubParts<
    Lhs extends string,
    Rhs extends string,
    $Acc extends string = "",
    Borrowed extends boolean = false
  > =
    //
    Lhs extends `${infer $LeftDigit}${infer $LeftRest}`
      ? Rhs extends `${infer $RightDigit}${infer $RightRest}`
        ? (
            Borrowed extends true
              ? DigitDiff<$LeftDigit, "1">
              : [$LeftDigit, false]
          ) extends [`${infer $LeftDigit}`, Is<infer $NextBorrowed, boolean>]
          ? DigitDiff<$LeftDigit, $RightDigit> extends [
              `${infer $RemDigit}`,
              Is<infer $Negative, boolean>
            ]
            ? (
                $NextBorrowed extends true
                  ? true
                  : $Negative extends true
                  ? true
                  : false
              ) extends Is<infer $NextBorrowed, boolean>
              ? SubParts<
                  $LeftRest,
                  $RightRest,
                  `${[$NextBorrowed, $LeftRest] extends [
                    true,
                    `${infer _}${infer __}`
                  ]
                    ? TenComplement<$RemDigit>
                    : $RemDigit}${$Acc}`,
                  $NextBorrowed
                >
              : never
            : never
          : never
        : Int.Unsafe<HandleSubSideBorrow<Lhs, Borrowed, $Acc>>
      : Int.Unsafe<HandleSubSideBorrow<Rhs, Borrowed, $Acc>>;

  export type Sub<Lhs extends number, Rhs extends number> =
    //
    [Int.IsNegative<Lhs>, Int.IsPositive<Rhs>] extends [true, true]
      ? Int.Negate<Int.Add<Int.Negate<Lhs>, Rhs>>
      : [Int.IsPositive<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? Int.Add<Lhs, Int.Negate<Rhs>>
      : [Int.IsNegative<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? Add<Lhs, Int.Negate<Rhs>>
      : SubParts<Rev<`${Lhs}`>, Rev<`${Rhs}`>>;

  type DigitProd<
    Dg1 extends string,
    Dg2 extends string
  > = Dg1 extends keyof DigitProdMap
    ? Dg2 extends keyof DigitProdMap
      ? DigitProdMap[Dg1][Dg2]
      : never
    : never;

  /** Replaces each character in a string with the given string. */
  type ReplaceWith<
    T extends string,
    C extends string,
    $Acc extends string = ""
  > = T extends `${string}${infer $Rest}`
    ? ReplaceWith<$Rest, C, `${$Acc}${C}`>
    : $Acc;

  type MultLhsParts<
    Lhs extends string,
    Multiplier extends string,
    $Acc extends number = 0
  > =
    //
    Lhs extends `${infer $LeftDigit}${infer $LeftRest}`
      ? MultLhsParts<
          $LeftRest,
          Multiplier,
          $LeftDigit extends "0"
            ? $Acc
            : Int.Add<
                $Acc,
                Int.Unsafe<`${DigitProd<$LeftDigit, Multiplier>}${ReplaceWith<
                  $LeftRest,
                  "0"
                >}`>
              >
        >
      : $Acc;

  type MultParts<
    Lhs extends string,
    Rhs extends string,
    $Acc extends number = 0
  > =
    //
    Rhs extends `${infer $RightDigit}${infer $RightRest}`
      ? MultParts<
          Lhs,
          $RightRest,
          $RightDigit extends "0"
            ? $Acc
            : Int.Add<
                $Acc,
                Int.Unsafe<`${MultLhsParts<Lhs, $RightDigit>}${ReplaceWith<
                  $RightRest,
                  "0"
                >}`>
              >
        >
      : $Acc;

  type MultPos<Lhs extends number, Rhs extends number> = MultParts<
    `${Lhs}`,
    `${Rhs}`
  >;

  /** Multiplies two integers together using grid multiplication. */
  export type Mult<Lhs extends number, Rhs extends number> =
    //
    0 extends Int.Abs<Lhs> | Int.Abs<Rhs>
      ? 0
      : Lhs extends 1
      ? Rhs
      : Lhs extends -1
      ? Int.Negate<Rhs>
      : Rhs extends 1
      ? Lhs
      : Rhs extends -1
      ? Int.Negate<Lhs>
      : [Int.IsPositive<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? Int.Negate<MultPos<Lhs, Int.Abs<Rhs>>>
      : [Int.IsNegative<Lhs>, Int.IsPositive<Rhs>] extends [true, true]
      ? Int.Negate<MultPos<Int.Abs<Lhs>, Rhs>>
      : [Int.IsNegative<Lhs>, Int.IsNegative<Rhs>] extends [true, true]
      ? MultPos<Int.Abs<Lhs>, Int.Abs<Rhs>>
      : MultPos<Lhs, Rhs>;

  export type BitShift<N extends number, Movement extends number> = 2;

  export type Log<N extends number, Base extends number = 10> =
    //
    Int.LessThan<N, 1> extends true ? 1 : LogImpl<N, Base>;

  type LogImpl<
    N extends number,
    Base extends number,
    $Div extends number = 2,
    $Count extends 0[] = [0]
  > =
    //
    Int.Sub<N, $Div> extends infer $Rem extends number
      ? Int.GreaterThan<$Rem, 0> extends true
        ? LogImpl<N, Base, Int.Mult<$Div, Base>, [...$Count, 0]>
        : $Count["length"]
      : never;

  type A = Int.Add<1, -10>;
  type B = Int.Sub<1, 10>;
}
