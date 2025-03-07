import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp();
const db = admin.firestore();

// CORS middleware allowing specific origin
const corsHandler = cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] });

// Function to handle preflight CORS (OPTIONS requests)
const handleCorsPreflight = (req: functions.Request, res: functions.Response) => {
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
export const getUsers = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  if (handleCorsPreflight(req, res)) return;

  corsHandler(req, res, async () => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).send('Internal server error');
    }
  });
});

// Get user by ID
export const getUserById = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  if (handleCorsPreflight(req, res)) return;

  corsHandler(req, res, async () => {
    try {
      const userId = req.query.userId as string; // Cast userId to string
      if (!userId) {
        res.status(400).send('User ID is required');
        return;
      }

      const doc = await db.collection('users').doc(userId).get();
      if (!doc.exists) {
        res.status(404).send('User not found');
        return;
      }
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).send('Internal server error');
    }
  });
});

// Create user
export const createUser = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  if (handleCorsPreflight(req, res)) return;

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
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Internal server error');
    }
  });
});

// Update user
export const updateUser = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  if (handleCorsPreflight(req, res)) return;

  corsHandler(req, res, async () => {
    try {
      const userId = req.query.userId as string; // Cast userId to string
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
      res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Internal server error');
    }
  });
});

// Delete user
export const deleteUser = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  if (handleCorsPreflight(req, res)) return;

  corsHandler(req, res, async () => {
    try {
      const userId = req.query.userId as string; // Cast userId to string
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
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal server error');
    }
  });
});
