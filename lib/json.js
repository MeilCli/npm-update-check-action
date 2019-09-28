"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toOutdatedPackages(value) {
    if (value.trim().length == 0) {
        return [];
    }
    const json = JSON.parse(value);
    const map = new Map();
    Object.keys(json).map(x => {
        map.set(x, json[x]);
    });
    const result = [];
    map.forEach((value, key) => {
        result.push({
            name: key,
            current: value.current,
            wanted: value.wanted,
            latest: value.latest,
            homepage: value.homepage
        });
    });
    return result;
}
exports.toOutdatedPackages = toOutdatedPackages;
