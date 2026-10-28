import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUserFromRequest,
  hasModulePermission,
} from '@/lib/server/auth';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';
import {
  getSmtpStatus,
  sendOrbitSupportEmail,
  verifySmtpConnection,
} from '@/lib/server/mailer';
import { SupportTicketRecord } from '@/types/admin';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const status = getSmtpStatus();
  const verify = req.nextUrl.searchParams.get('verify') === '1';
  let connectionCheck: { ok: boolean; message: string } | null = null;
  if (verify) {
    connectionCheck = await verifySmtpConnection();
  }
  return NextResponse.json({
    smtpStatus: status,
    connectionCheck,
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasModulePermission(user, 'support', 'create')) {
      return NextResponse.json(
        { error: 'You do not have permission to submit support requests.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const subject = String(body.subject || '').trim();
    const category = (body.category ||
      'Technical Issue') as SupportTicketRecord['category'];
    const priority = (body.priority ||
      'Normal') as SupportTicketRecord['priority'];
    const message = String(body.message || '').trim();
    const contactEmail = String(body.contactEmail || user.email).trim();
    const contactPhone = String(body.contactPhone || '0913514767').trim();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Please provide both a subject and detailed support message.' },
        { status: 400 }
      );
    }

    const ticketId = `SUP-${Date.now().toString().slice(-6)}`;
    const smtpStatus = getSmtpStatus();

    const mailResult = await sendOrbitSupportEmail({
      ticketId,
      subject,
      category,
      priority,
      message,
      submittedByName: user.fullName,
      submittedByEmail: user.email,
      contactEmail,
      contactPhone,
    });

    const newTicket: SupportTicketRecord = {
      id: ticketId,
      subject,
      category,
      priority,
      message,
      contactEmail,
      contactPhone,
      submittedByName: user.fullName,
      submittedByEmail: user.email,
      recipientEmail: mailResult.recipient || smtpStatus.supportRecipient,
      status: 'Sent to Orbit Support',
      smtpMessageId: mailResult.messageId,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    const db = readDb();
    db.supportTickets = [newTicket, ...db.supportTickets];

    appendAuditLog(db, {
      actorName: user.fullName,
      actorEmail: user.email,
      module: 'support',
      action: 'Submitted support request to Orbit',
      target: `${ticketId} → ${newTicket.recipientEmail}`,
    });

    writeDb(db);

    return NextResponse.json({
      ok: true,
      ticket: newTicket,
      supportTickets: db.supportTickets,
      auditLogs: db.auditLogs,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to send support email via SMTP.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
