import {Configs} from "./1-fetch-configs";
import {readdirSync, readFileSync, statSync, writeFileSync} from "fs";
import path from "path";
import {TestFile} from "./2-fetch-tests";
import {get, set} from "lodash";

interface DefaultValue {
    keyPath: string;
    defaultValue: unknown;
}

const createDefaultKeys = (fuzzingConfig: unknown, contractConfig: unknown): DefaultValue[] => {
    return [
        {
            keyPath: 'fuzzing',
            defaultValue: fuzzingConfig,
        },
        {
            keyPath: 'tests.contractTests',
            defaultValue: contractConfig,
        },
    ]
}


const addDefaultValues = (defaultValues: DefaultValue[], variations: Array<any>) => {
    return variations.map((variation: any) => {
        defaultValues.forEach(({keyPath, defaultValue}) => {
            if (get(variation, keyPath) === true) {
                set(variation, keyPath, defaultValue);
            }
        });
        return variation;
    });
};

const addAssignVariablesToVariation = (variations: Array<any>, assignVariables: Array<any>) => {
    return variations.map((variation: any) => {
        if (variation.assignVariables) {
            variation.assignVariables = assignVariables.concat(variation.assignVariables);
        } else {
            variation.assignVariables = assignVariables;
        }
        return variation;
    });
};

const addOverwritesToVariation = (variations: Array<any>, overwrites: Array<any>) => {
    return variations.map((variation: any) => {
        if (variation.overwrites) {
            variation.overwrites = overwrites.concat(variation.overwrites);
        } else {
            variation.overwrites = overwrites;
        }
        return variation;
    });
};

const createFull = (defaultValues: DefaultValue[], {
                                 openApiOperation,
                                 openApiOperationId,
                                 variations,
                                 assignVariables,
                                 overwrites
                             }: TestFile
) => {
    console.log(`   -  ${openApiOperation} has ${variations.length} Variations `);
    return variations.map((responseVariation: any) => {
        responseVariation.variations = addDefaultValues(defaultValues, responseVariation.variations);

        if (assignVariables) {
            responseVariation.variations = addAssignVariablesToVariation(responseVariation.variations, assignVariables);
        }

        if (overwrites) {
            responseVariation.variations = addOverwritesToVariation(responseVariation.variations, overwrites);
        }

        return {openApiOperation, openApiOperationId, ...responseVariation};
    });
};


export const buildVariations = (outputFolder: string, configs: Configs, tests: TestFile[]) => {
    const defaultValues = createDefaultKeys(configs.fuzzingTests, configs.contractTests);

    let toSave: Array<any> = [];

    tests.forEach((test: TestFile) => {
        toSave = toSave.concat(createFull(defaultValues, test))
    })


    const jsonOutputPath = `${outputFolder}/3-portman.variation.tests.json`;

    writeFileSync(jsonOutputPath, JSON.stringify(toSave, null, 2));

    console.log('   - Variations Saved To', jsonOutputPath);

    return jsonOutputPath;
}