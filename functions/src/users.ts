import * as express from 'express';
import * as admin from 'firebase-admin';

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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
