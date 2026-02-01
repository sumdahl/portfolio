import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Typography } from '@/components/ui/typography';
import { DataTable } from '@/components/dashboard/messages/data-table';
import { columns } from '@/components/dashboard/messages/columns';
import { DeleteAllDialog } from '@/components/dashboard/messages/delete-all-dialog';

export const revalidate = 0; // Dynamic data

export default async function MessagesPage() {
    const messageList = await db.select().from(messages).orderBy(desc(messages.createdAt));

    // Map DB dates to Date objects for the table
    const formattedMessages = messageList.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
    }));

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Messages</h2>
                    <Typography.Muted className="text-lg mt-1">View inquiries and contact form submissions.</Typography.Muted>
                </div>
                {messageList.length > 0 && <DeleteAllDialog />}
            </div>

            <div className="flex-1">
                <DataTable columns={columns} data={formattedMessages} />
            </div>
        </div>
    );
}
