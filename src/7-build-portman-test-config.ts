import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";
import {cloneDeep, get, over, set} from "lodash";

export const buildFinalPortmanConfig = (
    currentConfig: any,
    outputFolder: string,
    contractTests: string|undefined,
    variationTests: string,
    assignVariables: string,
    overwrites: string,
    contentTestsOutputFile: string,
    usePostmanEnvForVariables: boolean
) => {

    const jsonOutputPath = `${outputFolder}/7-portman.test.config.json`;

    const genRef = (ref: string|undefined) => {
        return {'$ref': ref}
    }

    currentConfig = cloneDeep(currentConfig);
    set(currentConfig, 'tests.contractTests', genRef(contractTests))
    set(currentConfig, 'tests.variationTests', genRef(variationTests))
    set(currentConfig, 'assignVariables', genRef(assignVariables))
    set(currentConfig, 'overwrites', genRef(overwrites))
    set(currentConfig, 'tests.contentTests', genRef(contentTestsOutputFile))

    if (usePostmanEnvForVariables) {
        const portmanReplacements = get(currentConfig, 'globals.portmanReplacements', []);
        portmanReplacements.push({
            searchFor: 'pm.collectionVariables.set(',
            replaceWith: 'pm.environment.set('
        })

        set(currentConfig, 'globals.portmanReplacements.', portmanReplacements)
    }

    writeFileSync(jsonOutputPath, JSON.stringify(currentConfig, null, 2));

    console.log('   - Overwrites Saved To', jsonOutputPath);

    return jsonOutputPath;
}