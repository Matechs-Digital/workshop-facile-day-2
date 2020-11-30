export function pipe<A, B, C, D, E>(
  a: A,
  f0: (_: A) => B,
  f1: (_: B) => C,
  f2: (_: C) => D,
  f3: (_: D) => E
): E;
export function pipe<A, B, C, D>(
  a: A,
  f0: (_: A) => B,
  f1: (_: B) => C,
  f2: (_: C) => D
): D;
export function pipe<A, B, C>(a: A, f0: (_: A) => B, f1: (_: B) => C): C;
export function pipe<A, B>(a: A, f0: (_: A) => B): B;
export function pipe<A>(a: A): A;
export function pipe(a: any, ...fns: ((_: any) => any)[]): any {
  let r = a;
  for (const f of fns) {
    r = f(r);
  }
  return r;
}

export function flow<A extends any[], B, C, D>(
  f: (...a: A) => B,
  f1: (b: B) => C,
  f2: (c: C) => D
): (...a: A) => D;
export function flow<A extends any[], B, C>(
  f: (...a: A) => B,
  f1: (b: B) => C
): (...a: A) => C;
export function flow<A extends any[], B>(f: (...a: A) => B): (...a: A) => B;
export function flow(...fns: ((_: any) => any)[]): (...args: any[]) => any {
  return (...args) => {
    // @ts-expect-error
    let r = fns[0](...args);

    for (let i = 1; i < fns.length; i++) {
      r = fns[i](r);
    }

    return r;
  };
}
