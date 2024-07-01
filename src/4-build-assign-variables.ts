import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";
import {get} from "lodash";

const createFull = ({openApiOperation, assignVariables}:TestFile) => {
    const collectionVariablesCount = get(assignVariables, '0.collectionVariables.length', 0);
    console.log(`   -  ${openApiOperation} has ${collectionVariablesCount} Collection Variables `);
    return assignVariables.map((assignVariable) => {
        return { openApiOperation, ...assignVariable };
    });
};

export const buildAssignVariables = (outputFolder: string, tests: TestFile[]) => {

    let toSave: Array<any> = [];

    tests.forEach((test: TestFile) => {
        toSave = toSave.concat(createFull(test))
    });

    const jsonOutputPath = `${outputFolder}/4-portman.assignVariables.json`;

    writeFileSync(jsonOutputPath, JSON.stringify(toSave, null, 2));

    console.log('   - Assign Variables Saved To', jsonOutputPath);

    return jsonOutputPath;
}