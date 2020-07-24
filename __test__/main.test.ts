import { toOutdatedPackages } from "../src/json";

test("json parse", () => {
    const json = `{
  "@actions/core": {
    "current": "1.1.0",
    "wanted": "1.1.1",
    "latest": "1.1.1",
    "location": "node_modules\\\\@actions\\\\core",
    "type": "dependencies",
    "homepage": "https://github.com/actions/toolkit/tree/master/packages/core"
  },
  "@types/node": {
    "current": "12.7.5",
    "wanted": "12.7.8",
    "latest": "12.7.8",
    "location": "node_modules\\\\@types\\\\node",
    "type": "devDependencies",
    "homepage": "https://github.com/DefinitelyTyped/DefinitelyTyped#readme"
  }
}`;

    const result = toOutdatedPackages(json);
    expect(result.length).toBe(2);

    expect(result[0].name).toBe("@actions/core");
    expect(result[0].current).toBe("1.1.0");
    expect(result[0].wanted).toBe("1.1.1");
    expect(result[0].latest).toBe("1.1.1");
    expect(result[0].homepage).toBe("https://github.com/actions/toolkit/tree/master/packages/core");

    expect(result[1].name).toBe("@types/node");
    expect(result[1].current).toBe("12.7.5");
    expect(result[1].wanted).toBe("12.7.8");
    expect(result[1].latest).toBe("12.7.8");
    expect(result[1].homepage).toBe("https://github.com/DefinitelyTyped/DefinitelyTyped#readme");
});

test("no-value json parse", () => {
    const json = "";

    const result = toOutdatedPackages(json);
    expect(result.length).toBe(0);
});
