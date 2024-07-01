import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";
import {cloneDeep, get, over, set} from "lodash";

export const buildFinalPortmanCliConfig = (
    currentConfig: any,
    outputFolder: string,
    collectionName: string,
    openApiFile: string,
    outputFilePath: string,
    testConfigOutputPath: string,
    postmanConfigFile: string
) => {

    const jsonOutputPath = `${outputFolder}/8-portmanCli.config.json`;

    currentConfig = cloneDeep(currentConfig);
    currentConfig['collectionName'] = collectionName;
    currentConfig['local'] = openApiFile;
    currentConfig['output'] = outputFilePath;
    currentConfig['portmanConfigFile'] = testConfigOutputPath;
    currentConfig['postmanConfigFile'] = postmanConfigFile;

    writeFileSync(jsonOutputPath, JSON.stringify(currentConfig, null, 2));

    console.log('   - Portman CLI Config Saved To', jsonOutputPath);

    return jsonOutputPath;
}