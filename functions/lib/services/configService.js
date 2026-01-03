"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = void 0;
require("../firebase");
class ConfigService {
    constructor() {
        this.db = require("firebase-admin").firestore();
    }
    async getConfig(name) {
        const doc = await this.db.collection('config').doc(name).get();
        return doc.data();
    }
    async setConfig(name, data) {
        await this.db.collection('config').doc(name).set(data);
    }
}
exports.configService = new ConfigService();
//# sourceMappingURL=configService.js.map