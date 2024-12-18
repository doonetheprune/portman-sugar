import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";
import {get} from "lodash";
import {Configs} from "./1-fetch-configs";

const createFull = ({openApiOperation, overwrites = []}: TestFile) => {
    console.log(`   -  ${openApiOperation} has ${overwrites.length} Overwrites `);
    return overwrites.map((assignVariable) => {
        return {openApiOperation, ...assignVariable};
    });
};

export const buildOverwrites = (outputFolder: string, tests: TestFile[], {authConfig}: Configs) => {

    let toSave: Array<any> = [];

    //Add overwrites for tests
    tests.forEach((test: TestFile) => {
        toSave = toSave.concat(createFull(test))
    });

    //Add overwrites for auth config
    authConfig.operations.forEach((operation: string) => {
        toSave.push({
            openApiOperation: operation,
            overwriteRequestSecurity: authConfig.overwriteRequestSecurity,
        });
    });

    const jsonOutputPath = `${outputFolder}/5-portman.overwrites.json`;

    writeFileSync(jsonOutputPath, JSON.stringify(toSave, null, 2));

    console.log('   - Overwrites Saved To', jsonOutputPath);

    return jsonOutputPath;
}