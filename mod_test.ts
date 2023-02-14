import type { Int } from "./mod.d.ts";

function assertEqualTypes<T, F>(
  ..._params: [T] extends [F] ? ([F] extends [T] ? [] : ["ERROR"]) : ["ERROR"]
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

Deno.test("Int<N>", (t) => {
  assertEqualTypes<1, 1>();
  assertEqualTypes<235, 235>();
  assertEqualTypes<-235, -235>();
});

Deno.test("Int.Add", () => {
  assertEqualTypes<Int.Add<1, 5>, 6>();
  assertEqualTypes<Int.Add<9, 3>, 12>();
  assertEqualTypes<Int.Add<12, 5>, 17>();
  assertEqualTypes<Int.Add<99, 5>, 104>();
  assertEqualTypes<Int.Add<100, 192>, 292>();
  assertEqualTypes<Int.Add<110, 192>, 302>();
  assertEqualTypes<Int.Add<99999, 1>, 100000>();
  assertEqualTypes<Int.Add<0, 53>, 53>();
  assertEqualTypes<Int.Add<54, 0>, 54>();
  assertEqualTypes<Int.Add<5, 5>, 10>();
  assertEqualTypes<Int.Add<5, 235923>, 235928>();
  assertEqualTypes<Int.Add<-5, 5>, 0>();
  assertEqualTypes<Int.Add<5, -5>, 0>();
});

Deno.test("Int.Sub", () => {
  assertEqualTypes<Int.Sub<5, 3>, 2>();
  assertEqualTypes<Int.Sub<3, 5>, -2>();
  assertEqualTypes<Int.Sub<0, 5>, -5>();
  assertEqualTypes<Int.Sub<5, 0>, 5>();
  assertEqualTypes<Int.Sub<12, 5>, 7>();
  assertEqualTypes<Int.Sub<20, 10>, 10>();
  assertEqualTypes<Int.Sub<10, 20>, -10>();
  assertEqualTypes<Int.Sub<-5, -10>, 5>();
  assertEqualTypes<Int.Sub<10, 5>, 5>();
  assertEqualTypes<Int.Sub<999999999, 69>, 999999930>();
  assertEqualTypes<Int.Sub<-999999999, 69>, -1000000068>();
});

Deno.test("Int.GreaterThan", () => {
  assertEqualTypes<Int.GreaterThan<2, 2>, false>();
  assertEqualTypes<Int.GreaterThan<21, 2>, true>();
  assertEqualTypes<Int.GreaterThan<21, 0>, true>();
  assertEqualTypes<Int.GreaterThan<0, 0>, false>();
  assertEqualTypes<Int.GreaterThan<-0, 0>, false>();
  assertEqualTypes<Int.GreaterThan<2, -2>, true>();
  assertEqualTypes<Int.GreaterThan<123, 124>, false>();
  assertEqualTypes<Int.GreaterThan<123, 121>, true>();
  assertEqualTypes<Int.GreaterThan<-123, -121>, false>();
});

Deno.test("Int.LessThan", () => {
  assertEqualTypes<Int.LessThan<2, 2>, false>();
  assertEqualTypes<Int.LessThan<21, 2>, false>();
  assertEqualTypes<Int.LessThan<21, 0>, false>();
  assertEqualTypes<Int.LessThan<5, 21>, true>();
  assertEqualTypes<Int.LessThan<0, 0>, false>();
  assertEqualTypes<Int.LessThan<-0, 0>, false>();
  assertEqualTypes<Int.LessThan<2, -2>, false>();
  assertEqualTypes<Int.LessThan<123, 124>, true>();
  assertEqualTypes<Int.LessThan<123, 121>, false>();
  assertEqualTypes<Int.LessThan<-123, -121>, true>();
});

Deno.test("Int.Negate", () => {
  assertEqualTypes<Int.Negate<5>, -5>();
  assertEqualTypes<Int.Negate<0>, 0>();
  assertEqualTypes<Int.Negate<-5>, 5>();
});

Deno.test("Int.Abs", () => {
  assertEqualTypes<Int.Abs<5>, 5>();
  assertEqualTypes<Int.Abs<0>, 0>();
  assertEqualTypes<Int.Abs<-5>, 5>();
});

Deno.test("Int.Mult", () => {
  assertEqualTypes<Int.Mult<234235, 2349>, 550218015>();
  assertEqualTypes<Int.Mult<904, 235>, 212440>();
  assertEqualTypes<Int.Mult<23, 55>, 1265>();
  assertEqualTypes<Int.Mult<9, 9090>, 81810>();
  assertEqualTypes<Int.Mult<9, 4>, 36>();
  assertEqualTypes<Int.Mult<5, 5>, 25>();
  assertEqualTypes<Int.Mult<5, -5>, -25>();
  assertEqualTypes<Int.Mult<-5, -5>, 25>();
  assertEqualTypes<Int.Mult<-5, 5>, -25>();
  assertEqualTypes<Int.Mult<234, 23>, 5382>();
  assertEqualTypes<Int.Mult<5, 234>, 1170>();
  assertEqualTypes<Int.Mult<1, 234>, 234>();
  assertEqualTypes<Int.Mult<234, 1>, 234>();
  assertEqualTypes<Int.Mult<52, 0>, 0>();
  assertEqualTypes<Int.Mult<50000, 1>, 50000>();
  assertEqualTypes<Int.Mult<50000, -1>, -50000>();
  assertEqualTypes<Int.Mult<0, 234>, 0>();
});
