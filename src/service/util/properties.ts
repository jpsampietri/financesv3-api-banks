import { readFileSync } from "node:fs";
import { getProperties } from "properties-file";

export class Properties {

    static #instance: Properties;
    properties: any;

    private constructor() {
        this.loadProperties();
    }

    private loadProperties() {
        let propFilePath: string;
        if ( process.env['TEST'] ) {
            console.log('Loading test properties');
            propFilePath = './testSettings.prop';
        } else {
            console.log('Loading properties');
            propFilePath = './settings.prop';
        }

        const propFile = readFileSync(propFilePath);
        this.properties = getProperties(propFile);
    }

    public static get instance(): Properties{
        if (!this.#instance) {
            this.#instance = new Properties();
        }
        return this.#instance;
    }

    public getProperty(key: string) {
        return this.properties[key];
    }
}