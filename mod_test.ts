import type { Int } from "./mod.d.ts";

function assertEqualTypes<T, F>(
  ..._params: [T] extends [F] ? [F] extends [T] ? [] : ["ERROR"] : ["ERROR"]
) {}
function assertAssignableType<T, F>(
  ..._params: [T] extends [F] ? [] : ["ERROR"]
) {}
// function assertInequalTypes<T, F>(
//   ..._params: [T] extends [F] ? [F] extends [T] ? ["ERROR"] : [] : []
// ) {}
function assertUnassignableType<T, F>(
  ..._params: [T] extends [F] ? ["ERROR"] : []
) {}

Deno.test("Int<N>", async (t) => {
  assertEqualTypes<Int<"1">, Int<"1">>();
  assertEqualTypes<Int<"235">, Int<"235">>();
  assertEqualTypes<Int<"-235">, Int<"-235">>();

  await t.step("Exponential Form", () => {
    assertEqualTypes<Int<"2e5">, Int<"200000">>();
    assertEqualTypes<Int<"-2e5">, Int<"-200000">>();
    assertEqualTypes<Int<"-0e5">, Int<"-0">>();
    assertEqualTypes<Int<"0e5">, Int<"0">>();
    assertEqualTypes<Int<"234e0">, Int<"234">>();
    assertEqualTypes<Int<"234e1">, Int<"2340">>();
    assertEqualTypes<Int<"234e-1">, Int<"23">>();
    assertEqualTypes<Int<"0e-1">, Int<"0">>();
    assertEqualTypes<Int<"0e-2325">, Int<"0">>();
    assertEqualTypes<Int<"0e-0">, Int<"0">>();
    assertEqualTypes<Int<"25e-2">, Int<"0">>();
    assertEqualTypes<Int<"25e-6">, Int<"0">>();
    assertEqualTypes<Int<"25e-1">, Int<"2">>();
    assertEqualTypes<Int<"-25e-6">, Int<"0">>();
    assertEqualTypes<Int<"-25e-2">, Int<"0">>();
    assertEqualTypes<Int<"-0e-0">, Int<"-0">>();
    assertEqualTypes<Int<"-0e-54">, Int<"-0">>();
  });
});

Deno.test("Int.Add", () => {
  assertEqualTypes<Int.Add<Int<"1">, Int<"5">>, Int<"6">>();
  assertEqualTypes<Int.Add<Int<"9">, Int<"3">>, Int<"12">>();
  assertEqualTypes<Int.Add<Int<"12">, Int<"5">>, Int<"17">>();
  assertEqualTypes<Int.Add<Int<"99">, Int<"5">>, Int<"104">>();
  assertEqualTypes<Int.Add<Int<"100">, Int<"192">>, Int<"292">>();
  assertEqualTypes<Int.Add<Int<"110">, Int<"192">>, Int<"302">>();
  assertEqualTypes<Int.Add<Int<"99999">, Int<"1">>, Int<"100000">>();
  assertEqualTypes<Int.Add<Int<"0">, Int<"53">>, Int<"53">>();
  assertEqualTypes<Int.Add<Int<"54">, Int<"0">>, Int<"54">>();
  assertEqualTypes<Int.Add<Int<"5">, Int<"5">>, Int<"10">>();
  assertEqualTypes<Int.Add<Int<"5">, Int<"235923">>, Int<"235928">>();
  assertEqualTypes<Int.Add<Int<"-5">, Int<"5">>, Int<"0">>();
  assertEqualTypes<Int.Add<Int<"5">, Int<"-5">>, Int<"0">>();
});

Deno.test("Int.Sub", () => {
  assertEqualTypes<Int.Sub<Int<"5">, Int<"3">>, Int<"2">>();
  assertEqualTypes<Int.Sub<Int<"3">, Int<"5">>, Int<"-2">>();
  assertEqualTypes<Int.Sub<Int<"0">, Int<"5">>, Int<"-5">>();
  assertEqualTypes<Int.Sub<Int<"5">, Int<"0">>, Int<"5">>();
  assertEqualTypes<Int.Sub<Int<"12">, Int<"5">>, Int<"7">>();
  assertEqualTypes<Int.Sub<Int<"20">, Int<"10">>, Int<"10">>();
  assertEqualTypes<Int.Sub<Int<"10">, Int<"20">>, Int<"-10">>();
  assertEqualTypes<Int.Sub<Int<"-5">, Int<"-10">>, Int<"5">>();
  assertEqualTypes<Int.Sub<Int<"10">, Int<"5">>, Int<"5">>();
  assertEqualTypes<
    Int.Sub<Int<"999999999">, Int<"69">>,
    Int<"999999930">
  >();
  assertEqualTypes<
    Int.Sub<Int<"-999999999">, Int<"69">>,
    Int<"-1000000068">
  >();
});

Deno.test("Int.Unwrap", () => {
  assertEqualTypes<Int.Unwrap<Int<"234">>, "234">();
  assertEqualTypes<Int.Unwrap<Int<"0">>, "0">();
  assertEqualTypes<Int.Unwrap<Int<"-234">>, "-234">();
});

Deno.test("Int.Even", () => {
  assertAssignableType<Int<"0">, Int.Even>();
  assertAssignableType<Int<"2">, Int.Even>();
  assertAssignableType<Int<"54">, Int.Even>();
  assertAssignableType<Int<"532880">, Int.Even>();
  assertAssignableType<Int<"532888">, Int.Even>();
  assertAssignableType<Int<"-2">, Int.Even>();
  assertAssignableType<Int<"-666">, Int.Even>();

  assertUnassignableType<Int<"3">, Int.Even>();
  assertUnassignableType<Int<"-3">, Int.Even>();
  assertUnassignableType<Int<"222525">, Int.Even>();
  assertUnassignableType<Int<"-222525">, Int.Even>();
  assertUnassignableType<Int<"22225">, Int.Even>();
});

Deno.test("Int.Odd", () => {
  assertAssignableType<Int<"3">, Int.Odd>();
  assertAssignableType<Int<"-3">, Int.Odd>();
  assertAssignableType<Int<"222525">, Int.Odd>();
  assertAssignableType<Int<"-222525">, Int.Odd>();
  assertAssignableType<Int<"22225">, Int.Odd>();

  assertUnassignableType<Int<"0">, Int.Odd>();
  assertUnassignableType<Int<"2">, Int.Odd>();
  assertUnassignableType<Int<"54">, Int.Odd>();
  assertUnassignableType<Int<"532880">, Int.Odd>();
  assertUnassignableType<Int<"532888">, Int.Odd>();
  assertUnassignableType<Int<"-2">, Int.Odd>();
  assertUnassignableType<Int<"-666">, Int.Odd>();
});

Deno.test("Int.GreaterThan", () => {
  assertEqualTypes<Int.GreaterThan<Int<"2">, Int<"2">>, false>();
  assertEqualTypes<Int.GreaterThan<Int<"21">, Int<"2">>, true>();
  assertEqualTypes<Int.GreaterThan<Int<"21">, Int<"0">>, true>();
  assertEqualTypes<Int.GreaterThan<Int<"0">, Int<"0">>, false>();
  assertEqualTypes<Int.GreaterThan<Int<"-0">, Int<"0">>, false>();
  assertEqualTypes<Int.GreaterThan<Int<"2">, Int<"-2">>, true>();
  assertEqualTypes<Int.GreaterThan<Int<"123">, Int<"124">>, false>();
  assertEqualTypes<Int.GreaterThan<Int<"123">, Int<"121">>, true>();
  assertEqualTypes<Int.GreaterThan<Int<"-123">, Int<"-121">>, false>();
});

Deno.test("Int.LessThan", () => {
  assertEqualTypes<Int.LessThan<Int<"2">, Int<"2">>, true>();
  assertEqualTypes<Int.LessThan<Int<"21">, Int<"2">>, false>();
  assertEqualTypes<Int.LessThan<Int<"21">, Int<"0">>, false>();
  assertEqualTypes<Int.LessThan<Int<"5">, Int<"21">>, true>();
  assertEqualTypes<Int.LessThan<Int<"0">, Int<"0">>, false>();
  assertEqualTypes<Int.LessThan<Int<"-0">, Int<"0">>, false>();
  assertEqualTypes<Int.LessThan<Int<"2">, Int<"-2">>, false>();
  assertEqualTypes<Int.LessThan<Int<"123">, Int<"124">>, true>();
  assertEqualTypes<Int.LessThan<Int<"123">, Int<"121">>, false>();
  assertEqualTypes<Int.LessThan<Int<"-123">, Int<"-121">>, true>();
});

Deno.test("Int.Positive", () => {
  assertAssignableType<Int<"2">, Int.Positive>();
  assertAssignableType<Int<"534">, Int.Positive>();
  assertAssignableType<Int<"99999">, Int.Positive>();

  assertUnassignableType<Int<"-2">, Int.Positive>();
  assertUnassignableType<Int<"-543">, Int.Positive>();
  assertUnassignableType<Int<"-0">, Int.Positive>();
});

Deno.test("Int.Negative", () => {
  assertAssignableType<Int<"-2">, Int.Negative>();
  assertAssignableType<Int<"-543">, Int.Negative>();
  assertAssignableType<Int<"-0">, Int.Negative>();

  assertUnassignableType<Int<"2">, Int.Negative>();
  assertUnassignableType<Int<"534">, Int.Negative>();
  assertUnassignableType<Int<"99999">, Int.Negative>();
});

Deno.test("Int.Negate", () => {
  assertEqualTypes<Int.Negate<Int<"5">>, Int<"-5">>();
  assertEqualTypes<Int.Negate<Int<"0">>, Int<"-0">>();
  assertEqualTypes<Int.Negate<Int<"-0">>, Int<"0">>();
  assertEqualTypes<Int.Negate<Int<"-5">>, Int<"5">>();
});

Deno.test("Int.Abs", () => {
  assertEqualTypes<Int.Abs<Int<"5">>, Int<"5">>();
  assertEqualTypes<Int.Abs<Int<"0">>, Int<"0">>();
  assertEqualTypes<Int.Abs<Int<"-5">>, Int<"5">>();
});

Deno.test("Int.Mult", () => {
  assertEqualTypes<Int.Mult<Int<"234235">, Int<"2349">>, Int<"550218015">>();
  assertEqualTypes<Int.Mult<Int<"904">, Int<"235">>, Int<"1265">>();
  assertEqualTypes<Int.Mult<Int<"23">, Int<"55">>, Int<"1265">>();
  assertEqualTypes<Int.Mult<Int<"9">, Int<"9090">>, Int<"81810">>();
  assertEqualTypes<Int.Mult<Int<"9">, Int<"4">>, Int<"36">>();
  assertEqualTypes<Int.Mult<Int<"5">, Int<"5">>, Int<"25">>();
  assertEqualTypes<Int.Mult<Int<"5">, Int<"-5">>, Int<"-25">>();
  assertEqualTypes<Int.Mult<Int<"-5">, Int<"-5">>, Int<"25">>();
  assertEqualTypes<Int.Mult<Int<"-5">, Int<"5">>, Int<"-25">>();
  assertEqualTypes<Int.Mult<Int<"234">, Int<"23">>, Int<"5382">>();
  assertEqualTypes<Int.Mult<Int<"5">, Int<"234">>, Int<"1170">>();
  assertEqualTypes<Int.Mult<Int<"1">, Int<"234">>, Int<"234">>();
  assertEqualTypes<Int.Mult<Int<"234">, Int<"1">>, Int<"234">>();
  assertEqualTypes<Int.Mult<Int<"52">, Int<"0">>, Int<"0">>();
  assertEqualTypes<Int.Mult<Int<"50000">, Int<"1">>, Int<"50000">>();
  assertEqualTypes<Int.Mult<Int<"50000">, Int<"-1">>, Int<"-50000">>();
  assertEqualTypes<Int.Mult<Int<"0">, Int<"234">>, Int<"0">>();
  // assertEqualTypes<
  //   Int.Mult<
  //     Int<
  //       "9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
  //     >,
  //     Int<
  //       "9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
  //     >
  //   >,
  //   Int<
  //     "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999980000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
  //   >
  // >();
});

Deno.test("Int.Factorial", () => {
  assertEqualTypes<Int.Factorial<Int<"12">>, Int<"2117001600">>();
  // @ts-expect-error should fail
  type _CompileFail = Int.Factorial<Int<"-5">>;
});
