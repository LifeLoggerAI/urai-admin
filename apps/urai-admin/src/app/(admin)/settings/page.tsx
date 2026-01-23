import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsPage = () => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>App Config</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Environment: Staging</p>
          <p>Build: 1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
