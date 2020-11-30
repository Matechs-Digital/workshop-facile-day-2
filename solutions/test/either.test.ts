import * as E from "@app/Either";
import { pipe } from "@app/Function";

interface User {
  username: string;
  password: string;
}
const InvalidPassword = "InvalidPassword" as const;
const InvalidUsername = "InvalidUsername" as const;

type InvalidMessage = typeof InvalidPassword | typeof InvalidUsername;

const validateUsername = (u: User): E.Either<"InvalidUsername", User> =>
  u.username.length > 20 ? E.left(InvalidUsername) : E.right(u);

const validatePassword = (u: User): E.Either<"InvalidPassword", User> =>
  u.password.length > 8 ? E.right(u) : E.left(InvalidPassword);

function formatError(_: InvalidMessage): E.Either<string, never> {
  switch (_) {
    case "InvalidUsername": {
      return E.left("Username was invalid");
    }
    case "InvalidPassword": {
      return E.left("Password was invalid");
    }
  }
}

function validateUser(user: User) {
  return pipe(
    E.right(user),
    E.chain(validateUsername),
    E.chain(validatePassword)
  );
}

export const result = pipe(
  validateUser({ username: "Michael", password: "Password" }),
  E.catchAll(formatError)
);

test("should fail", () => {
  expect(
    pipe(
      result,
      E.map((u) => u.password)
    )
  ).toEqual(E.left("Password was invalid"));
});
