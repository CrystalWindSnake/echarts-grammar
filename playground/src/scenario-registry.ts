type Scenario = {
  name: string;
  run: () => void;
};

export const scenarios: Scenario[] = [
  {
    name: "grammar-test.ts",
    run: () => import("./lib-test/grammar-test").then((m) => m.run()),
  },
  {
    name: "drilldown-test.ts",
    run: () => import("./lib-test/drilldown-test").then((m) => m.run()),
  },
];
