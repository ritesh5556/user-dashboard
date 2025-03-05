import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Get all users
export const getUsers = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.status(405).send('Method not allowed');
      return;
    }

    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).send('Internal server error');
  }
});

// Get user by ID
export const getUserById = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.status(405).send('Method not allowed');
      return;
    }

    const userId = req.path.split('/')[1];
    const doc = await db.collection('users').doc(userId).get();

    if (!doc.exists) {
      res.status(404).send('User not found');
      return;
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send('Internal server error');
  }
});

// Create user
export const createUser = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).send('Name and email are required');
      return;
    }

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const userRef = db.collection('users').doc();
    
    await userRef.set({
      name,
      email,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    const doc = await userRef.get();
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal server error');
  }
});

// Update user
export const updateUser = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'PUT') {
      res.status(405).send('Method not allowed');
      return;
    }

    const userId = req.path.split('/')[1];
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

    await userRef.update({
      name,
      email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updatedDoc = await userRef.get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal server error');
  }
});

// Delete user
export const deleteUser = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'DELETE') {
      res.status(405).send('Method not allowed');
      return;
    }

    const userId = req.path.split('/')[1];
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
