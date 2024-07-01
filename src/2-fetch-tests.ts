import {Configs} from "./1-fetch-configs";
import {readdirSync, readFileSync, statSync} from "fs";
import path from "path";

export interface TestFile {
    file: string;
    openApiOperation: string;
    openApiOperationId: string;
    assignVariables: Array<{[key: string]: unknown}>;
    contentTests: {
        responseHeaderTests: unknown
        responseBodyTests: unknown
    };
    variations: Array<{[key: string]: unknown}>;
    overwrites: Array<{[key: string]: unknown}>;
}

function walkDir(dir: string, callback: (file: string) => {}) {
    readdirSync(dir).forEach((file) => {
        const dirPath = path.join(dir, file);
        const isDirectory = statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, file));
        }
    });
}


export const fetchTests = (testFolder: string, testFileSuffix: string, configs: Configs) => {
    const tests:TestFile[]  = [];

    walkDir(testFolder, (file: string) => {
        if (file.includes(testFileSuffix)) {
            const { openApiOperation, openApiOperationId, assignVariables, contentTests, variations, overwrites } = JSON.parse(
                readFileSync(file).toString('utf-8')
            );

            tests.push({
                file,
                openApiOperation,
                openApiOperationId,
                assignVariables,
                contentTests,
                variations,
                overwrites
            })

            console.log(`   -  Found Test (${file}): ${openApiOperation} `);
        }
        return false;
    });

    return tests;
}