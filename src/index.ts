#!/usr/bin/env node
import {existsSync, mkdirSync} from 'fs';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {ConfigPaths, gatherConfigs} from "./1-fetch-configs";
import {fetchTests} from "./2-fetch-tests";
import {buildVariations} from "./3-build-variations";
import {buildAssignVariables} from "./4-build-assign-variables";
import {buildOverwrites} from "./5-build-overwrites";
import {buildContentTests} from "./6-content-tests";
import {buildFinalPortmanConfig} from "./7-build-portman-test-config";
import {buildFinalPortmanCliConfig} from "./8-build-portman-cli-config";
import {Portman} from "@apideck/portman/dist/Portman";
import { exec } from 'child_process';


const argv = yargs(hideBin(process.argv))
    .option('testFolder', {
        describe: 'Path to the folder with the tests',
        type: 'string',
        alias: 't'
    })
    .option('collectionName', {
        describe: 'Name of the postman collection',
        type: 'string',
        alias: 'n'
    })
    .option('openApi', {
        describe: 'Path to the folder with the tests',
        type: 'string',
        default: './openapi.yaml',
    })
    .option('output', {
        describe: 'Path to outputted Postman Collection',
        type: 'string',
        default: './postman.collection.json',
        alias: 'o'
    })
    .option('testFileSuffix', {
        describe: 'Suffix used for tests',
        type: 'string',
        default: '.test.json',
        alias: 's'
    })
    .option('postmanConfig', {
        describe: 'Path to the postman configuration JSON file',
        type: 'string',
        alias: 'a'
    })
    .option('portmanCliConfig', {
        describe: 'Path to the portman cli configuration JSON file',
        type: 'string',
        alias: 'a'
    })
    .option('portmanTestConfig', {
        describe: 'Path to the portman test creation configuration JSON file',
        type: 'string',
        alias: 'a'
    })
    .option('authConfig', {
        describe: 'Path to the authentication configuration JSON file',
        type: 'string',
        alias: 'a'
    })
    .option('contractTests', {
        describe: 'Path to the contract tests JSON file',
        type: 'string',
        alias: 'c'
    })
    .option('fuzzingTests', {
        describe: 'Path to the fuzzing tests JSON file',
        type: 'string',
        alias: 'f'
    })
    .option('excludeDefault', {
        describe: 'Comma-separated list to exclude default configs (possible values: authConfig, contractTests, fuzzingTests)',
        type: 'string',
        alias: 'e'
    })
    .option('usePostmanEnvForVariables', {
        describe: 'Test will store variables in the environment instead of the collection',
        type: 'string',
        default: true
    })
    .help()
    .alias('help', 'h')
    .parseSync();

const ensureDirectoryExists = (dir: string) => {
    if (!existsSync(dir)) {
        mkdirSync(dir, {recursive: true});
    }
};

(async () => {
    if (!argv.collectionName) {
        throw new Error("Collection Name is Missing");
    }

    const outputFolder = process.cwd() + '/generated';

    ensureDirectoryExists(outputFolder);

    console.log('[1/9] Gather Configs');
    const {configs, configLocations} = gatherConfigs(outputFolder, argv as ConfigPaths, argv.excludeDefault);

    console.log('[2/9] Fetch Tests');
    const tests = fetchTests(argv.testFolder as string, argv.testFileSuffix, configs);

    console.log('[3/9] Build Variations');
    const variationOutputFile = buildVariations(outputFolder, configs, tests)

    console.log('[4/9] Build Assign Variables');
    const assignVariableOutputFile = buildAssignVariables(outputFolder, tests)

    console.log('[5/5] Build Overwrites');
    const overwritesOutputFile = buildOverwrites(outputFolder, tests)

    console.log('[6/] Build Content Tests');
    const contentTestsOutputFile = buildContentTests(outputFolder, tests)

    console.log('[7/9] Build Final Portman Test Config');
    const testConfigOutputPath = buildFinalPortmanConfig(
        configs.portmanTestConfig,
        outputFolder,
        configLocations.contractTests,
        variationOutputFile,
        assignVariableOutputFile,
        overwritesOutputFile,
        contentTestsOutputFile,
        argv.usePostmanEnvForVariables === true
    )

    console.log('[8/9] Build Final Portman CLI Config');
    const configJsonPath = buildFinalPortmanCliConfig(
        configs.portmanCliConfig,
        outputFolder,
        argv.collectionName,
        argv.openApi,
        argv.output,
        testConfigOutputPath,
        configLocations.postmanConfig ||''
    )

    console.log('[9/9] Run Portman CLI');
    // Define the Portman command
    const command = `portman --trace-deprecation --cliOptionsFile ${configJsonPath}`;

    console.log('Portman Command:', configJsonPath)

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
})();
