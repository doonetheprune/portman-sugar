import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";
import {get} from "lodash";

const createFull = ({openApiOperation, overwrites = []}:TestFile) => {
    console.log(`   -  ${openApiOperation} has ${overwrites.length} Overwrites `);
    return overwrites.map((assignVariable) => {
        return { openApiOperation, ...assignVariable };
    });
};

export const buildOverwrites = (outputFolder: string, tests: TestFile[]) => {

    let toSave: Array<any> = [];

    tests.forEach((test: TestFile) => {
        toSave = toSave.concat(createFull(test))
    });

    const jsonOutputPath = `${outputFolder}/5-portman.overwrites.json`;

    writeFileSync(jsonOutputPath, JSON.stringify(toSave, null, 2));

    console.log('   - Overwrites Saved To', jsonOutputPath);

    return jsonOutputPath;
}