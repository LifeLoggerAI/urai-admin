
import admin from './firebase-admin';

export const withAuthApi = (handler) => async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = { ...decodedToken, role: userDoc.data().role };

    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
