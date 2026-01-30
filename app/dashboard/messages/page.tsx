import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Mail, Calendar, User, MessageSquare, Inbox } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { DeleteMessageButton } from '@/components/dashboard/DeleteMessageButton';

export const revalidate = 0; // Dynamic data

export default async function MessagesPage() {
    const messageList = await db.select().from(messages).orderBy(desc(messages.createdAt));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Messages</h2>
                <Typography.Muted className="text-lg mt-1">View inquiries and contact form submissions.</Typography.Muted>
            </div>

            <div className="grid gap-4">
                {messageList.length === 0 ? (
                    <Card className="p-16 bg-card/50 backdrop-blur-sm border-dashed border-2 border-border/50 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-primary/10">
                            <Inbox className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <Typography.H3>Inbox Empty</Typography.H3>
                            <Typography.Muted>No messages received yet.</Typography.Muted>
                        </div>
                    </Card>
                ) : (
                    messageList.map((msg) => (
                        <Card key={msg.id} className="group border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-foreground leading-tight">
                                                    {msg.name}
                                                </div>
                                                <a href={`mailto:${msg.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {msg.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 self-start md:self-auto">
                                        <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50 text-xs font-medium text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {msg.createdAt ? format(new Date(msg.createdAt), 'PPP p') : 'Unknown Date'}
                                        </div>
                                        <DeleteMessageButton messageId={msg.id} />
                                    </div>
                                </div>

                                <div className="relative pl-6 border-l-2 border-border/50">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    </div>
                                    <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-base font-light">
                                        {msg.message}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
