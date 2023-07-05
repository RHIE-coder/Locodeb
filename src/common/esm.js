import path from 'path';
import { fileURLToPath } from 'url';

/**
 *  constructor
 *  - metaPath : import.meta.url 
 */
export class ESM {

    #filePath
    #dirPath

    constructor(fileUrl) {
        this.fileUrl = fileUrl; 
        this.#filePath = fileURLToPath(fileUrl);
        this.#dirPath = path.dirname(this.#filePath)
    }

    get dirPath() {
        return this.#dirPath
    }
    
    get filePath() {
        return this.#filePath
    }

    get fileName() {
        return path.basename(this.#filePath);
    }

}

