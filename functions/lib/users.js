"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const admin = __importStar(require("firebase-admin"));
const router = express.Router();
// List all users
router.get('/', async (req, res) => {
    try {
        const userRecords = await admin.auth().listUsers();
        const users = userRecords.users.map((user) => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            customClaims: user.customClaims,
        }));
        res.json(users);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Get a user by id
router.get('/:id', async (req, res) => {
    try {
        const userRecord = await admin.auth().getUser(req.params.id);
        res.json({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            customClaims: userRecord.customClaims,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Create a new user
router.post('/', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });
        res.status(201).json(userRecord);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Update a user
router.put('/:id', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        const userRecord = await admin.auth().updateUser(req.params.id, {
            email,
            password,
            displayName,
        });
        res.json(userRecord);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        await admin.auth().deleteUser(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map