import type {
  DigitDiffMap,
  DigitProdMap,
  DigitSumMap,
  TenComplementMap,
} from "./_maps.ts";

type Rev<T extends string, $Acc extends string = ""> = T extends
  `${infer $Ch}${infer $Rest}` ? Rev<$Rest, `${$Ch}${$Acc}`> : $Acc;

declare const __UNSAFE_TYPE_LOCK__: unique symbol;

type TypeLock<Name extends string> = {
  [K in `__${Name}TypeLock__`]: typeof __UNSAFE_TYPE_LOCK__;
};

type Is<T extends K, K> = T;

type StripTypeLock<Obj, Name extends string> = Obj extends
  infer U & TypeLock<Name> ? U
  : never;

type DigitSum<Lhs extends string, Rhs extends string> = Lhs extends
  keyof DigitSumMap
  ? Rhs extends keyof DigitSumMap ? DigitSumMap[Lhs][Rhs] : never
  : never;

type IntSyntax = `${bigint}` | `${bigint}e${bigint}`;

type Repeat<
  S extends string,
  N extends string,
  $Acc extends string = "",
  $Counter extends 0[] = [],
> = `${$Counter["length"]}` extends `${N}` ? $Acc
  : Repeat<S, N, `${$Acc}${S}`, [...$Counter, 0]>;

type NegExponential<
  T extends string,
  N extends string,
  $Counter extends 0[] = [],
> =
  //
  `${$Counter["length"]}` extends N ? T extends "" | "-" ? "0" : Rev<T>
    : T extends `${string}${infer $Rest}`
      ? NegExponential<$Rest, N, [...$Counter, 0]>
    : "0";

type NormalizeExponential<T extends IntSyntax> =
  //
  T extends `${infer $Before}e${infer $After}` ? $Before extends "0" ? "0"
  : $Before extends "-0" ? "-0"
  : $After extends `-${infer $After}` ? NegExponential<Rev<$Before>, $After>
  : `${$Before}${Repeat<"0", $After>}`
    : never;

export type Int<T extends IntSyntax> =
  & (T extends `${bigint}e${bigint}` ? T extends `-0e-${bigint}` ? "-0"
  : T extends `0e-${bigint}` ? "0"
  : NormalizeExponential<T>
    : T)
  & TypeLock<"Int">;

export declare namespace Int {
  export {}; // disable automatic exports

  // The indirection helps give better names in error messages.
  type AnyInt = Int<IntSyntax>;

  /** A type for any `Int` value. */
  export type Any = AnyInt;

  /**
   * A type for doing checked inferations on integers. Basically, this reduces
   * the need for extra code to check if something that was inferred is really
   * an `Int` in cases where TypeScript cannot tell.
   *
   * ## Examples
   *
   * The following code does not work because `$First` and `$Second` are
   * `unknown` in type-land so `$First` and `$Second` do not satisfy `Int.Add`'s
   * constraints of both sides needing to extend `Int.Any`.
   *
   * ```ts
   * type FirstTwoSum<Nums extends Int.Any[]> = Nums extends
   *   [infer $First, infer $Second, ...unknown[]] ? Int.Add<$First, $Second>
   *   : never;
   * ```
   *
   * However, if we use `Int.Infer`, then it correctly knows that `$First` and
   * `$Second` will be `Int`s:
   *
   * ```ts
   * type FirstTwoSum<Nums extends Int.Any[]> = Nums extends
   *   [Int.Infer<infer $First>, Int.Infer<infer $Second>, ...unknown[]]
   *   ? Int.Add<$First, $Second>
   *   : never;
   * ```
   */
  export type Infer<T extends Int.Any> = T;

  /**
   * Unsafely creates an `Int`. If the `string` is not a valid `Int`, then this
   * will return `never`.
   */
  export type Unsafe<T extends string> =
    //
    T extends IntSyntax ? Int<T>
      : never;

  /** A constant type for an even integer. */
  export type Even = `${string}${0 | 2 | 4 | 6 | 8}` & TypeLock<"Int">;

  /** A constant type for an odd integer. */
  export type Odd = `${string}${1 | 3 | 5 | 7 | 9}` & TypeLock<"Int">;

  /** A constant type for a positive integer. */
  export type Positive =
    & `${keyof DigitSumMap}${string}`
    & TypeLock<"Int">;

  /** A constant type for a negative integer. */
  export type Negative = `-${string}` & TypeLock<"Int">;

  /** Negates the given integer. */
  export type Negate<T extends Int.Any> =
    //
    T extends Int.Positive ? Int.Unsafe<`-${Int.Unwrap<T>}`>
      : Int.Unwrap<T> extends `-${infer $Int}` ? Int.Unsafe<$Int>
      : Int.Any; // this is *impossible* but required for valid typing

  /** Calculates the absolute value of the given integer. */
  export type Abs<T extends Int.Any> = T extends Int.Negative ? Int.Negate<T>
    : T;

  /** Gets the contained `string` within the `Int`. */
  export type Unwrap<T extends Int.Any> = StripTypeLock<T, "Int">;

  type HasGreaterLength<S1 extends string, S2 extends string> =
    [ReplaceWith<S1, "0">, ReplaceWith<S2, "0">] extends
      [`${infer $ReplacedS1}`, `${infer $ReplacedS2}`]
      ? $ReplacedS1 extends $ReplacedS2 ? unknown
      : $ReplacedS1 extends `${$ReplacedS2}${infer _}` ? true
      : false
      : never;

  type GreaterThanPosImpl<Lhs extends string, Rhs extends string> =
    [Lhs, Rhs] extends [
      `${infer $DigitLhs}${infer $RestLhs}`,
      `${infer $DigitRhs}${infer $RestRhs}`,
    ] ? $DigitLhs extends $DigitRhs ? GreaterThanPosImpl<$RestLhs, $RestRhs>
    : DigitDiff<$DigitLhs, $DigitRhs>[1] extends true ? false
    : true
      : false;

  type GreaterThanPos<Lhs extends string, Rhs extends string> =
    HasGreaterLength<Lhs, Rhs> extends infer $GreaterLenInfo
      ? $GreaterLenInfo extends true ? true
      : $GreaterLenInfo extends false ? false
      : GreaterThanPosImpl<Lhs, Rhs>
      : never;

  export type GreaterThan<Lhs extends Int.Any, Rhs extends Int.Any> =
    //
    Lhs extends Rhs ? false
      : [Lhs, Rhs] extends ["0" | "-0", "0" | "-0"] ? false
      : [Lhs, Rhs] extends [Int.Positive, Int.Negative] ? true
      : [Lhs, Rhs] extends [Int.Negative, Int.Positive] ? false
      : [Lhs, Rhs] extends [Int.Negative, Int.Negative] ? GreaterThanPos<
        Int.Unwrap<Int.Negate<Lhs>>,
        Int.Unwrap<Int.Negate<Rhs>>
      > extends true ? false
      : true
      : GreaterThanPos<Int.Unwrap<Lhs>, Int.Unwrap<Rhs>>;

  export type LessThan<Lhs extends Int.Any, Rhs extends Int.Any> =
    [Lhs, Rhs] extends ["0" | "-0", "0" | "-0"] ? false
      : GreaterThan<Lhs, Rhs> extends true ? false
      : true;

  export type SquareRoot<N extends Int.Any> = never;

  /**
   * Takes the side that needs a carry and handles the carries whilst reversing
   * the result.
   */
  type HandleSideCarry<Side extends string, $Acc extends string = ""> =
    Side extends `${infer $Digit}${infer $Rest}`
      ? DigitSum<$Digit, "1"> extends `${infer $Dg1}${infer $Dg2}`
        ? $Dg2 extends "" ? `${$Rest}${$Dg1}${$Acc}`
        : $Rest extends "" ? `1${$Dg2}${$Acc}`
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
    ExtraCarry extends boolean = false,
  > =
    //
    Lhs extends `${infer $LeftDigit}${infer $LeftRest}`
      ? Rhs extends `${infer $RightDigit}${infer $RightRest}`
        ? DigitSum<$LeftDigit, $RightDigit> extends
          `${infer $FirstDigit}${infer $SecondDigit}`
          ? ($SecondDigit extends "" ? [$FirstDigit, false]
            : [$SecondDigit, true]) extends
            [`${infer $AddingDigit}`, infer $NextExtraCarry]
            ? (ExtraCarry extends true
              ? (DigitSum<$AddingDigit, "1"> extends
                `${infer $Dg1}${infer $Dg2}`
                ? $Dg2 extends "" ? [$Dg1, $NextExtraCarry] : [$Dg2, true]
                : never)
              : [$AddingDigit, $NextExtraCarry]) extends
              [`${infer $AddingDigit}`, infer $NextExtraCarry] ? AddParts<
              $LeftRest,
              $RightRest,
              `${$AddingDigit}${Acc}`,
              $NextExtraCarry extends boolean ? $NextExtraCarry : never
            >
            : never
          : never
        : never
      : Int.Unsafe<
        `${ExtraCarry extends true ? HandleSideCarry<Lhs> : Rev<Lhs>}${Acc}`
      >
      : Int.Unsafe<
        `${ExtraCarry extends true ? HandleSideCarry<Rhs> : Rev<Rhs>}${Acc}`
      >;

  export type AnyZero = Int<"0"> | Int<"-0">;

  /** Adds the two integers together. */
  export type Add<Lhs extends Int.Any, Rhs extends Int.Any> =
    //
    Lhs extends Int.AnyZero ? Rhs : Rhs extends Int.AnyZero ? Lhs
    : [Lhs, Rhs] extends [Int.Positive, Int.Negative]
      ? Int.Sub<Lhs, Int.Negate<Rhs>>
    : [Lhs, Rhs] extends [Int.Negative, Int.Positive]
      ? Int.Sub<Rhs, Int.Negate<Lhs>>
    : [Lhs, Rhs] extends [Int.Negative, Int.Negative]
      ? Int.Sub<Lhs, Int.Negate<Rhs>>
    : [
      Rev<Int.Unwrap<Lhs>>,
      Rev<Int.Unwrap<Rhs>>,
    ] extends [`${infer Lhs}`, `${infer Rhs}`] ? AddParts<Lhs, Rhs>
    : never;

  type DigitDiff<Dg1 extends string, Dg2 extends string> = Dg1 extends
    keyof DigitDiffMap
    ? Dg2 extends keyof DigitDiffMap ? DigitDiffMap[Dg1][Dg2] : never
    : never;

  type TenComplement<T extends string> = T extends keyof TenComplementMap
    ? TenComplementMap[T]
    : never;

  type HandleSubSideBorrow<
    Side extends string,
    Borrowed extends boolean,
    $Acc extends string = "",
  > =
    //
    Borrowed extends false ? `${Rev<Side>}${$Acc}`
      : Side extends `${infer $Digit}${infer $Rest}`
        ? DigitDiff<$Digit, "1"> extends
          [`${infer $Rem}`, Is<infer $NextBorrowed, boolean>]
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
    Borrowed extends boolean = false,
  > =
    //
    Lhs extends `${infer $LeftDigit}${infer $LeftRest}`
      ? Rhs extends `${infer $RightDigit}${infer $RightRest}`
        ? (Borrowed extends true ? DigitDiff<$LeftDigit, "1">
          : [$LeftDigit, false]) extends
          [`${infer $LeftDigit}`, Is<infer $NextBorrowed, boolean>]
          ? DigitDiff<$LeftDigit, $RightDigit> extends
            [`${infer $RemDigit}`, Is<infer $Negative, boolean>]
            ? ($NextBorrowed extends true ? true
              : $Negative extends true ? true
              : false) extends Is<infer $NextBorrowed, boolean> ? SubParts<
              $LeftRest,
              $RightRest,
              `${[$NextBorrowed, $LeftRest] extends
                [true, `${infer _}${infer __}`] ? TenComplement<$RemDigit>
                : $RemDigit}${$Acc}`,
              $NextBorrowed
            >
            : never
          : never
        : never
      : Int.Unsafe<HandleSubSideBorrow<Lhs, Borrowed, $Acc>>
      : Int.Unsafe<
        HandleSubSideBorrow<
          Rhs,
          Borrowed,
          $Acc
        >
      >;

  export type Sub<Lhs extends Int.Any, Rhs extends Int.Any> =
    //
    [Lhs, Rhs] extends [Int.Negative, Int.Positive]
      ? Int.Negate<Int.Add<Int.Negate<Lhs>, Rhs>>
      : [Lhs, Rhs] extends [Int.Positive, Int.Negative]
        ? Int.Add<Lhs, Int.Negate<Rhs>>
      : [Lhs, Rhs] extends [Int.Negative, Int.Negative]
        ? Sub<Int.Negate<Rhs>, Int.Negate<Lhs>>
      : [Rev<Int.Unwrap<Lhs>>, Rev<Int.Unwrap<Rhs>>] extends
        [`${infer Lhs}`, `${infer Rhs}`] ? SubParts<Lhs, Rhs>
      : never;

  type DigitProd<Dg1 extends string, Dg2 extends string> = Dg1 extends
    keyof DigitProdMap
    ? Dg2 extends keyof DigitProdMap ? DigitProdMap[Dg1][Dg2] : never
    : never;

  /** Replaces each character in a string with the given string. */
  type ReplaceWith<
    T extends string,
    C extends string,
    $Acc extends string = "",
  > = T extends `${string}${infer $Rest}` ? ReplaceWith<$Rest, C, `${$Acc}${C}`>
    : $Acc;

  type MultLhsParts<
    Lhs extends string,
    Multiplier extends string,
    $Acc extends Int.Any = Int<"0">,
  > =
    //
    Lhs extends `${infer $LeftDigit}${infer $LeftRest}` ? MultLhsParts<
      $LeftRest,
      Multiplier,
      $LeftDigit extends "0" ? $Acc : Int.Add<
        $Acc,
        Int.Unsafe<
          `${DigitProd<$LeftDigit, Multiplier>}${ReplaceWith<$LeftRest, "0">}`
        >
      >
    >
      : $Acc;

  type MultParts<
    Lhs extends string,
    Rhs extends string,
    $Acc extends Int.Any = Int<"0">,
  > =
    //
    Rhs extends `${infer $RightDigit}${infer $RightRest}` ? MultParts<
      Lhs,
      $RightRest,
      $RightDigit extends "0" ? $Acc : Int.Add<
        $Acc,
        Int.Unsafe<
          `${Int.Unwrap<MultLhsParts<Lhs, $RightDigit>>}${ReplaceWith<
            $RightRest,
            "0"
          >}`
        >
      >
    >
      : $Acc;

  type MultPos<Lhs extends Int.Any, Rhs extends Int.Any> =
    [Int.Unwrap<Lhs>, Int.Unwrap<Rhs>] extends [`${infer Lhs}`, `${infer Rhs}`]
      ? MultParts<Lhs, Rhs>
      : never;

  /** Multiplies two integers together using grid multiplication. */
  export type Mult<Lhs extends Int.Any, Rhs extends Int.Any> =
    //
    Int<"0"> extends Int.Abs<Lhs> | Int.Abs<Rhs> ? Int<"0">
      : Lhs extends Int<"1"> ? Rhs
      : Lhs extends Int<"-1"> ? Int.Negate<Rhs>
      : Rhs extends Int<"1"> ? Lhs
      : Rhs extends Int<"-1"> ? Int.Negate<Lhs>
      : [Lhs, Rhs] extends [Int.Positive, Int.Negative]
        ? Int.Negate<MultPos<Lhs, Int.Abs<Rhs>>>
      : [Lhs, Rhs] extends [Int.Negative, Int.Positive]
        ? Int.Negate<MultPos<Int.Abs<Lhs>, Rhs>>
      : [Lhs, Rhs] extends [Int.Negative, Int.Negative]
        ? MultPos<Int.Abs<Lhs>, Int.Abs<Rhs>>
      : MultPos<Lhs, Rhs>;

  type FactorialImpl<N extends Int.Any> = N extends Int<"0"> ? Int<"1">
    : Int.Mult<
      N,
      FactorialImpl<
        Int.Sub<N, Int<"1">> extends Int.Infer<infer $N> ? $N : never
      >
    >;

  /**
   * Gets the factorial of an integer. This is currently a primtiive loop
   * implementation and only supports positive integers.
   */
  export type Factorial<N extends Int.Any & Int.Positive> = FactorialImpl<N>;
}

/** A checked TS `float` type as a `string`. */
export type Float<T extends `${number}`> = T & TypeLock<"Float">;

export declare namespace Float {
  export {};

  export type Any = `${number}` & TypeLock<"Float">;

  export type Unsafe<T extends string> = T extends `${number}` ? Float<T>
    : never;

  export type Unwrap<T extends string> = StripTypeLock<T, "Float">;
}
