type Scenario = {
  name: string;
  run: () => void;
};

const scenarios: Scenario[] = [
  {
    name: "grammar-test.ts",
    run: () => import("./lib-test/grammar-test").then((m) => m.run()),
  },
  {
    name: "drilldown-test.ts",
    run: () => import("./lib-test/drilldown-test").then((m) => m.run()),
  },
  {
    name: "simplified-test.ts",
    run: () => import("./lib-test/simplified-test").then((m) => m.run()),
  },
];

scenarios[scenarios.length - 3].run();

export default scenarios;
