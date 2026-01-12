'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleGoogleLogin = async () => {
      try {
          await signInWithGoogle();
          router.push('/admin/dashboard');
      } catch (err: any) {
          setError(err.message);
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">URAI Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span class="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span class="bg-background px-2 text-muted-foreground">Or continue with</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>Sign In with Google</Button>
        </CardContent>
      </Card>
    </div>
  );
}
