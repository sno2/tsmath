import type { QuickSort } from "./quicksort.ts";

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

Deno.test("quicksort", () => {
  assertEqualTypes<QuickSort<[2, 3, 4]>, [2, 3, 4]>();
  assertEqualTypes<QuickSort<[4, 3, 2]>, [2, 3, 4]>();
  assertEqualTypes<QuickSort<[2, 4, 3]>, [2, 3, 4]>();
  assertEqualTypes<QuickSort<[2, 4, 3]>, [2, 3, 4]>();
  assertEqualTypes<QuickSort<[2]>, [2]>();
  assertEqualTypes<QuickSort<[]>, []>();
  assertEqualTypes<QuickSort<[64, 2, 54, -2]>, [-2, 2, 54, 64]>();
  assertEqualTypes<QuickSort<[-4, 2]>, [-4, 2]>();
  assertEqualTypes<QuickSort<[2, -4]>, [-4, 2]>();
});
