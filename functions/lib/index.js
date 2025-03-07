"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
admin.initializeApp();
const db = admin.firestore();
// CORS middleware allowing specific origin
const corsHandler = cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
// Function to handle preflight CORS (OPTIONS requests)
const handleCorsPreflight = (req, res) => {
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return true;
    }
    return false;
};
// Get all users
exports.getUsers = functions.https.onRequest((req, res) => {
    if (handleCorsPreflight(req, res))
        return;
    corsHandler(req, res, async () => {
        try {
            const snapshot = await db.collection('users').get();
            const users = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
            res.json(users);
        }
        catch (error) {
            console.error('Error getting users:', error);
            res.status(500).send('Internal server error');
        }
    });
});
// Get user by ID
exports.getUserById = functions.https.onRequest((req, res) => {
    if (handleCorsPreflight(req, res))
        return;
    corsHandler(req, res, async () => {
        try {
            const userId = req.query.userId; // Cast userId to string
            if (!userId) {
                res.status(400).send('User ID is required');
                return;
            }
            const doc = await db.collection('users').doc(userId).get();
            if (!doc.exists) {
                res.status(404).send('User not found');
                return;
            }
            res.json(Object.assign({ id: doc.id }, doc.data()));
        }
        catch (error) {
            console.error('Error getting user:', error);
            res.status(500).send('Internal server error');
        }
    });
});
// Create user
exports.createUser = functions.https.onRequest((req, res) => {
    if (handleCorsPreflight(req, res))
        return;
    corsHandler(req, res, async () => {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                res.status(400).send('Name and email are required');
                return;
            }
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const userRef = db.collection('users').doc();
            await userRef.set({ name, email, createdAt: timestamp, updatedAt: timestamp });
            const doc = await userRef.get();
            res.json(Object.assign({ id: doc.id }, doc.data()));
        }
        catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Internal server error');
        }
    });
});
// Update user
exports.updateUser = functions.https.onRequest((req, res) => {
    if (handleCorsPreflight(req, res))
        return;
    corsHandler(req, res, async () => {
        try {
            const userId = req.query.userId; // Cast userId to string
            if (!userId) {
                res.status(400).send('User ID is required');
                return;
            }
            const { name, email } = req.body;
            if (!name || !email) {
                res.status(400).send('Name and email are required');
                return;
            }
            const userRef = db.collection('users').doc(userId);
            const doc = await userRef.get();
            if (!doc.exists) {
                res.status(404).send('User not found');
                return;
            }
            await userRef.update({ name, email, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
            const updatedDoc = await userRef.get();
            res.json(Object.assign({ id: updatedDoc.id }, updatedDoc.data()));
        }
        catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Internal server error');
        }
    });
});
// Delete user
exports.deleteUser = functions.https.onRequest((req, res) => {
    if (handleCorsPreflight(req, res))
        return;
    corsHandler(req, res, async () => {
        try {
            const userId = req.query.userId; // Cast userId to string
            if (!userId) {
                res.status(400).send('User ID is required');
                return;
            }
            const userRef = db.collection('users').doc(userId);
            const doc = await userRef.get();
            if (!doc.exists) {
                res.status(404).send('User not found');
                return;
            }
            await userRef.delete();
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('Internal server error');
        }
    });
});
//# sourceMappingURL=index.js.map