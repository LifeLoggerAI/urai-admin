
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/with-auth-api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { jobsPaused } = req.body;

  if (typeof jobsPaused !== 'boolean') {
    return res.status(400).json({ message: 'Invalid jobsPaused value' });
  }

  try {
    // In a real application, you would store this value in a database
    // or a configuration management system.
    // For this example, we'll just log it to the console.
    console.log(`Jobs paused status set to: ${jobsPaused}`);

    // You might also want to write to an audit log here.

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAdminAuth(handler);
