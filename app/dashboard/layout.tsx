import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check admin role
  const isAdmin = user.user_metadata?.role === 'admin' ||
    user.email === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div className="hidden md:block flex-none">
        <DashboardSidebar
          user={{
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
            email: user.email,
          }}
        />
      </div>
      <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-8 w-full">
        <div className="md:hidden mb-6">
          <DashboardSidebar
            user={{
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
              email: user.email,
            }}
            mobile
          />
        </div>
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
