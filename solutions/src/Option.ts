export interface None {
  _tag: "None";
}

export interface Some<A> {
  _tag: "Some";
  value: A;
}

export type Option<A> = None | Some<A>;

export const none: Option<never> = {
  _tag: "None",
};

export function some<A>(value: A): Option<A> {
  return {
    _tag: "Some",
    value,
  };
}

export function map<A, B>(f: (a: A) => B): (self: Option<A>) => Option<B> {
  return (self) => {
    if (self._tag === "None") {
      return self;
    }
    return some(f(self.value));
  };
}

export function chain<A, B>(
  f: (a: A) => Option<B>
): (self: Option<A>) => Option<B> {
  return (self) => {
    if (self._tag === "None") {
      return self;
    }
    return f(self.value);
  };
}
