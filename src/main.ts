import { OutdatedPackage, toOutdatedPackages } from "./json";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as os from "os";
import { ExecOptions } from "@actions/exec/lib/interfaces";

interface Option {
    readonly executeDirectories: string[] | null;
    readonly depth: number | null;
    readonly outputTextStyle: "short" | "long";
}

async function getOption(): Promise<Option> {
    let executeDirectories: string[] | null = core
        .getInput("execute_directories")
        .split(os.EOL)
        .map(x => x.trim());
    if (executeDirectories.length == 1 && executeDirectories[0].length == 0) {
        executeDirectories = null;
    }

    let depth: number | null = parseInt(core.getInput("depth"));
    if (isNaN(depth)) {
        depth = null;
    }

    const outputTextStyle = core.getInput("output_text_style");

    return {
        executeDirectories: executeDirectories,
        depth: depth,
        outputTextStyle: outputTextStyle == "long" ? "long" : "short"
    };
}

async function checkEnvironment() {
    await io.which("npm", true);
}

async function executeOutdated(
    executeDirectory: string | null,
    option: Option
): Promise<OutdatedPackage[]> {
    const execOption: ExecOptions = { failOnStdErr: true };
    if (executeDirectory != null) {
        execOption.cwd = executeDirectory;
    }

    let stdout = "";
    execOption.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString();
        }
    };

    const args = ["--long", "--json"];
    if (option.depth != null) {
        args.push(`--depath=${option.depth}`);
    }

    await exec.exec("npm outdated", args, execOption);

    return toOutdatedPackages(stdout);
}

function convertToOutputText(
    outdatedPackages: OutdatedPackage[],
    option: Option
): string {
    if (option.outputTextStyle == "long") {
        let result = "";
        for (const outdatedPackage of outdatedPackages) {
            if (0 < result.length) {
                result += os.EOL;
            }
            result += `${outdatedPackage.name}: new version ${outdatedPackage.latest}`;
        }
        return result;
    } else {
        let result = "";
        for (const outdatedPackage of outdatedPackages) {
            if (0 < result.length) {
                result += os.EOL;
            }
            result += `${outdatedPackage.name}: new version ${outdatedPackage.latest}, see ${outdatedPackage.homepage}`;
        }
        return result;
    }
}

async function run() {
    try {
        await checkEnvironment();
        const option = await getOption();

        const result: OutdatedPackage[] = [];
        if (option.executeDirectories == null) {
            const packages = await executeOutdated(null, option);
            packages.forEach(x => result.push(x));
        } else {
            for (const executeDirectory of option.executeDirectories) {
                const packages = await executeOutdated(
                    executeDirectory,
                    option
                );
                packages.forEach(x => result.push(x));
            }
        }

        const outputText = convertToOutputText(result, option);
        core.setOutput("has_npm_update", result.length == 0 ? "false" : "true");
        core.setOutput("npm_update_text", outputText);
        core.setOutput("npm_update_json", JSON.stringify(result));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
