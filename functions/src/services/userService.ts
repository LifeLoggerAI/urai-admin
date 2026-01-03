import "../firebase";

class UserService {
    private db = require("firebase-admin").firestore();

    async getUser(uid: string) {
        const doc = await this.db.collection('users').doc(uid).get();
        return doc.data();
    }

    async createUser(uid: string, data: any) {
        await this.db.collection('users').doc(uid).set(data);
    }
}

export const userService = new UserService();