import {existsSync, mkdirSync, readFileSync, writeFileSync} from "fs";
import {merge} from "lodash";

export interface GatherConfigsReturnType {
    configs: Configs;
    configLocations: ConfigPaths;
}

export interface ConfigPaths {
    [key: string]: string | undefined

    postmanConfig?: string;
    portmanCliConfig?: string;
    portmanTestConfig?: string;
    authConfig?: string;
    contractTests?: string;
    fuzzingTests?: string;
}

export interface Configs {
    [key: string]: any;

    postmanConfig?: any;
    portmanCliConfig?: any;
    portmanTestConfig?: any;
    authConfig?: any;
    contractTests?: any;
    fuzzingTests?: any;
}

const loadJsonFile = (filePath: string | undefined): any => { // Consider specifying a more detailed type instead of any
    try {
        if (!filePath) {
            throw new Error('File Path Is Missing')
        }
        return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error reading file at ${filePath}: ${error}`);
        return {};
    }
};

const getConfigurations = (defaultPaths: ConfigPaths, customConfigs: ConfigPaths, configsToExclude?: string): Configs => {
    const configs: Configs = {};
    const excludes = configsToExclude ? configsToExclude.split(',') : [];
    Object.keys(defaultPaths).forEach(key => {
        let config = {};
        if (!excludes.includes(key)) {
            //Default config not excluded
            config = loadJsonFile(defaultPaths[key]);
        }
        if (customConfigs[key]) {
            //Load custom config
            const inputtedConfig = loadJsonFile(customConfigs[key] as string);
            config = merge(config || {}, inputtedConfig);
        }
        configs[key] = config;
    });
    return configs;
};

const writeMergedConfigs = (configs: Configs, generatedFolder: string) => {
    const configLocations: ConfigPaths = {};
    Object.keys(configs).forEach(key => {
        const path = `${generatedFolder}/config.${key}.json`
        writeFileSync(path, JSON.stringify(configs[key], null, 2));
        configLocations[key] = path;
    });
    return configLocations;
};

export const gatherConfigs = (generatedFolder: string, customConfigs: ConfigPaths, configsToExclude?: string): GatherConfigsReturnType => {
    const defaultPaths: ConfigPaths = {
        postmanConfig: './default/postman.config.json',
        portmanCliConfig: './default/portman.cli.config.json',
        portmanTestConfig: './default/portman.test.config.json',
        authConfig: './default/auth.config.json',
        contractTests: './default/testConfig/contract.tests.json',
        fuzzingTests: './default/testConfig/fuzzing.tests.json'
    };

    console.log('   - Load/Merge Configs');
    const configs = getConfigurations(defaultPaths, customConfigs, configsToExclude);

    console.log('   - Write Merged Configs');
    const configLocations = writeMergedConfigs(configs, generatedFolder);

    return {configs, configLocations}
}