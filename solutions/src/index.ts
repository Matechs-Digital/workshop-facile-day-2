import { chainReader, of, add, logMessage } from "./Reader";

const result = chainReader(
  chainReader(of(0), (n) => add(n, 3)),
  (n) => logMessage(`(${n})`)
);

result({
  ConsoleService: {
    log: (message) => () => {
      console.log(message);
    },
  },
  MathService: {
    add: (x, y) => x + y,
  },
});
