import "../firebase";

class ConfigService {
    private db = require("firebase-admin").firestore();

    async getConfig(name: string) {
        const doc = await this.db.collection('config').doc(name).get();
        return doc.data();
    }

    async setConfig(name: string, data: any) {
        await this.db.collection('config').doc(name).set(data);
    }
}

export const configService = new ConfigService();