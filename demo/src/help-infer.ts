// this whole file + calling a helpInfer function is probably unnecessary, but it was easiest to get a POC

// Recursive prettify fn w/ customizable depth
type Prettify<
  T,
  Depth extends number = 5,
  Current extends any[] = [],
> = Current["length"] extends Depth
  ? T
  : { [P in keyof T]: Prettify<T[P], Depth, [any, ...Current]> } & {};

export function helpInfer<T>(obj: T) {
  // don't actually have to reassign, but for clarity
  const wrapped: Prettify<T> = obj;
  return wrapped;
}
