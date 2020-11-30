export interface Left<E> {
  _tag: "Left";
  left: E;
}

export interface Right<A> {
  _tag: "Right";
  right: A;
}

export type Either<E, A> = Left<E> | Right<A>;

export function left<E>(e: E): Either<E, never> {
  return {
    _tag: "Left",
    left: e,
  };
}

export function right<A>(a: A): Either<never, A> {
  return {
    _tag: "Right",
    right: a,
  };
}

export function map<A, B>(
  f: (a: A) => B
): <E>(self: Either<E, A>) => Either<E, B> {
  return (self) => {
    if (self._tag === "Left") {
      return left(self.left);
    }
    return right(f(self.right));
  };
}

export function chain<E0, A, B>(
  f: (a: A) => Either<E0, B>
): <E>(self: Either<E, A>) => Either<E | E0, B> {
  return (self) => {
    if (self._tag === "Right") {
      return f(self.right);
    }

    return left(self.left);
  };
}

export function flatten<E, E0, A>(
  ffa: Either<E, Either<E0, A>>
): Either<E | E0, A> {
  if (ffa._tag === "Right") {
    return ffa.right;
  }

  return ffa;
}

export function catchAll<E, E1, B>(
  f: (a: E) => Either<E1, B>
): <A>(self: Either<E, A>) => Either<E1, A | B> {
  return (self) => {
    if (self._tag === "Left") {
      return f(self.left);
    }

    return self;
  };
}
