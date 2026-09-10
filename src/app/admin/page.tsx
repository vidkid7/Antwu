import { redirect } from 'next/navigation';
import { AdminConsole } from '@/components/admin-console';
import { requireAdmin } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/admin/login');
  return <AdminConsole email={admin.email} />;
}
