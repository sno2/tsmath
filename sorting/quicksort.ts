import type { Int } from "../mod.d.ts";

export interface Provider {
  input: unknown;
}

// TODO: optimize this to use tail-end recursion by switching states
export type QuickSort<I extends number[]> =
  //
  Int.LessThan<I["length"], 2> extends true
    ? I
    : I extends [infer Pivot extends number, ...infer Rest extends number[]]
    ? [
        ...QuickSort<QuickSortPartLow<Rest, Pivot>>,
        Pivot,
        ...QuickSort<QuickSortPartHigh<Rest, Pivot>>
      ]
    : never;

type QuickSortPartHigh<
  I extends number[],
  Pivot extends number,
  $Acc extends number[] = []
> =
  //
  I extends [infer N extends number, ...infer Rest extends number[]]
    ? Int.GreaterThan<N, Pivot> extends true
      ? QuickSortPartHigh<Rest, Pivot, [...$Acc, N]>
      : QuickSortPartHigh<Rest, Pivot, $Acc>
    : $Acc;

type QuickSortPartLow<
  I extends number[],
  Pivot extends number,
  $Acc extends number[] = []
> =
  //
  I extends [infer N extends number, ...infer Rest extends number[]]
    ? Int.LessThan<N, Pivot> extends true
      ? QuickSortPartLow<Rest, Pivot, [...$Acc, N]>
      : QuickSortPartLow<Rest, Pivot, $Acc>
    : $Acc;

export declare namespace QuickSort {
  export interface Pipe extends Provider {
    output: this["input"] extends number[] ? QuickSort<this["input"]> : never;
  }
}
