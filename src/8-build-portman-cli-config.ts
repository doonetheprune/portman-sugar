import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";
import {cloneDeep, get, over, set} from "lodash";
import * as process from "node:process";
import path from "path";

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

    const currentWorkingFolderName = path.basename(process.cwd());

    currentConfig = cloneDeep(currentConfig);
    currentConfig['collectionName'] = collectionName || currentWorkingFolderName;
    currentConfig['local'] = openApiFile;
    currentConfig['output'] = outputFilePath;
    currentConfig['portmanConfigFile'] = testConfigOutputPath;
    currentConfig['postmanConfigFile'] = postmanConfigFile;
    currentConfig['syncPostman']  = !!process.env.POSTMAN_API_KEY;

    writeFileSync(jsonOutputPath, JSON.stringify(currentConfig, null, 2));

    console.log('   - Portman CLI Config Saved To', jsonOutputPath);

    return jsonOutputPath;
}