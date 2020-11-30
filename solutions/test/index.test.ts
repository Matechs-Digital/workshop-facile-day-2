import { flow, pipe } from "@app/Function";
import * as O from "@app/Option";

it("pipe should pass", () => {
  const x = pipe(
    O.some(1),
    O.chain((n) => O.some(n + 1)),
    O.chain((n) => O.some(n + 2)),
    O.chain((n) => O.some(n + 3))
  );

  expect(x).toEqual(O.some(7));
});
it("flow should pass", () => {
  const f = flow(
    (n: number) => n + 1,
    (n) => n + 1,
    (n) => n + 1
  );

  expect(f(1)).toEqual(4);
});
