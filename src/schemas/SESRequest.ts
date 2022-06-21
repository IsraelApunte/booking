import {Attachment} from 'nodemailer/lib/mailer';

export interface SESRequest {
  from: string,
  to: string [],
  subject: string,
  documentNumber: string| null,
  emissionDate?: string| null,
  attachments: Attachment[]| null
  html:string|null
}
