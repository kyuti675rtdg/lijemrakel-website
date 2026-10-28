import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUserFromRequest,
  hasModulePermission,
} from '@/lib/server/auth';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';
import { sendInquiryReplyEmail } from '@/lib/server/mailer';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasModulePermission(user, 'inbox', 'edit')) {
      return NextResponse.json(
        { error: 'You do not have permission to send inbox replies.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const inquiryId = String(body.inquiryId || '').trim();
    const subject = String(body.subject || '').trim();
    const replyBody = String(body.body || '').trim();

    if (!inquiryId || !replyBody) {
      return NextResponse.json(
        { error: 'Inquiry ID and reply message body are required.' },
        { status: 400 }
      );
    }

    const db = readDb();
    const inquiry = db.inquiries.find((i) => i.id === inquiryId);
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry record not found.' },
        { status: 404 }
      );
    }

    const mailResult = await sendInquiryReplyEmail({
      toEmail: inquiry.email,
      recipientName: inquiry.senderName,
      subject: subject || inquiry.subject,
      body: replyBody,
      repliedByName: user.fullName,
      replyToEmail: user.email,
    });

    const replyRecord = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      sentByEmail: user.email,
      sentByName: user.fullName,
      toEmail: inquiry.email,
      subject: subject || `Re: ${inquiry.subject}`,
      body: replyBody,
      messageId: mailResult.messageId,
    };

    inquiry.status = 'replied';
    inquiry.replies = [replyRecord, ...(inquiry.replies || [])];

    appendAuditLog(db, {
      actorName: user.fullName,
      actorEmail: user.email,
      module: 'inbox',
      action: 'Sent SMTP email reply to inquiry',
      target: `${inquiry.senderName} <${inquiry.email}>`,
    });

    writeDb(db);

    return NextResponse.json({
      ok: true,
      messageId: mailResult.messageId,
      inquiries: db.inquiries,
      auditLogs: db.auditLogs,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to send email reply.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
