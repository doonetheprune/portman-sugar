import {writeFileSync} from "fs";
import {TestFile} from "./2-fetch-tests";

const createFull = ({openApiOperation, contentTests}:TestFile) => {
    return {
        openApiOperation,
        ...contentTests
    }
};

export const buildContentTests = (outputFolder: string, tests: TestFile[]) => {

    let toSave: Array<any> = [];

    tests.forEach((test: TestFile) => {
        toSave = toSave.concat(createFull(test))
    });

    const jsonOutputPath = `${outputFolder}/6-content.tests.json`;

    writeFileSync(jsonOutputPath, JSON.stringify(toSave, null, 2));

    console.log('   - Content Tests Saved To', jsonOutputPath);

    return jsonOutputPath;
}