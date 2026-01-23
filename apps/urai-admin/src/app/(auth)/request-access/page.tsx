import { Button } from "@/components/ui/button";

export default function RequestAccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Request Access</h1>
          <p className="text-sm text-muted-foreground">You do not have permission to access this page. Please contact an administrator to request access.</p>
        </div>
        <Button onClick={() => alert('Request sent!')}>Request Access</Button>
      </div>
    </div>
  );
}
