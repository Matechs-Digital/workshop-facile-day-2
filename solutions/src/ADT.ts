import * as S from "@effect-ts/core/Sync";

interface NumberValue<T> {
  _tag: "NumberValue";
  n: number;
  identity: (_: number) => T;
}

interface StringValue<T> {
  _tag: "StringValue";
  s: string;
  identity: (_: string) => T;
}

interface Add<T> {
  _tag: "Add";
  x: Expression<number>;
  y: Expression<number>;
  identity: (_: number) => T;
}

interface Mul<T> {
  _tag: "Mul";
  x: Expression<number>;
  y: Expression<number>;
  identity: (_: number) => T;
}

interface Stringify<T> {
  _tag: "Stringify";
  x: Expression<number>;
  identity: (_: string) => T;
}

interface Concat<T> {
  _tag: "Concat";
  x: Expression<string>;
  y: Expression<string>;
  identity: (_: string) => T;
}

type Expression<T> =
  | NumberValue<T>
  | StringValue<T>
  | Add<T>
  | Mul<T>
  | Stringify<T>
  | Concat<T>;

function identity<T>(x: T): T {
  return x;
}

function numberValue(n: number): Expression<number> {
  return {
    _tag: "NumberValue",
    n,
    identity,
  };
}

function stringValue(s: string): Expression<string> {
  return {
    _tag: "StringValue",
    s,
    identity,
  };
}

function stringify(x: Expression<number>): Expression<string> {
  return {
    _tag: "Stringify",
    x,
    identity,
  };
}

function add(x: Expression<number>, y: Expression<number>): Expression<number> {
  return {
    _tag: "Add",
    x,
    y,
    identity,
  };
}

function mul(x: Expression<number>, y: Expression<number>): Expression<number> {
  return {
    _tag: "Mul",
    x,
    y,
    identity,
  };
}

function concat(
  x: Expression<string>,
  y: Expression<string>
): Expression<string> {
  return {
    _tag: "Concat",
    x,
    y,
    identity,
  };
}

function unsafeCalc<T>(x: Expression<T>): T {
  switch (x._tag) {
    case "NumberValue": {
      return x.identity(x.n);
    }
    case "StringValue": {
      return x.identity(x.s);
    }
    case "Add": {
      return x.identity(unsafeCalc(x.x) + unsafeCalc(x.y));
    }
    case "Mul": {
      return x.identity(unsafeCalc(x.x) * unsafeCalc(x.y));
    }
    case "Stringify": {
      return x.identity(`${unsafeCalc(x.x)}`);
    }
    case "Concat": {
      return x.identity(unsafeCalc(x.x) + unsafeCalc(x.y));
    }
  }
}

function safeCalcInternal<T>(x: Expression<T>): S.UIO<T> {
  return S.gen(function* (_) {
    switch (x._tag) {
      case "NumberValue": {
        return x.identity(x.n);
      }
      case "StringValue": {
        return x.identity(x.s);
      }
      case "Add": {
        return x.identity(
          (yield* _(safeCalcInternal(x.x))) + (yield* _(safeCalcInternal(x.y)))
        );
      }
      case "Mul": {
        return x.identity(
          (yield* _(safeCalcInternal(x.x))) * (yield* _(safeCalcInternal(x.y)))
        );
      }
      case "Stringify": {
        return x.identity(`${yield* _(safeCalcInternal(x.x))}`);
      }
      case "Concat": {
        return x.identity(
          (yield* _(safeCalcInternal(x.x))) + (yield* _(safeCalcInternal(x.y)))
        );
      }
    }
  });
}

function safeCalc<T>(x: Expression<T>): T {
  return S.run(safeCalcInternal(x));
}

const expr = concat(
  stringValue("Result: "),
  stringify(mul(add(numberValue(0), numberValue(1)), numberValue(2)))
);

const a = safeCalc(expr);
const b = unsafeCalc(expr);

console.log(a);
console.log(b);
