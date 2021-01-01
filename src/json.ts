export interface OutdatedPackage {
    readonly name: string;
    readonly current: string;
    readonly wanted: string;
    readonly latest: string;
    readonly homepage: string;
}

export function toOutdatedPackages(value: string): OutdatedPackage[] {
    interface Package {
        readonly current: string;
        readonly wanted: string;
        readonly latest: string;
        readonly homepage: string;
    }
    if (value.trim().length == 0) {
        return [];
    }

    const json = JSON.parse(value);
    const map = new Map<string, Package>();

    Object.keys(json).map((x) => {
        map.set(x, json[x] as Package);
    });

    const result: OutdatedPackage[] = [];
    map.forEach((value: Package, key: string) => {
        result.push({
            name: key,
            current: value.current,
            wanted: value.wanted,
            latest: value.latest,
            homepage: value.homepage,
        });
    });

    return result;
}
