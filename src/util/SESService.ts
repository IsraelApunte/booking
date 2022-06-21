/* eslint-disable require-jsdoc */
require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import * as aws from 'aws-sdk';
import {Attachment} from 'nodemailer/lib/mailer';
import {createTransport} from 'nodemailer';
import {create, CreateOptions} from 'html-pdf';
import {SESRequest} from '../schemas/SESRequest';
const ses = new aws.SES({region: 'us-east-1'});
process.env.PATH = `${process.env.PATH}:/opt`;
process.env.FONTCONFIG_PATH = '/opt';
process.env.LD_LIBRARY_PATH = '/opt';

/**
 * TestPdfBuffer
 */
// export async function testPdfBuffer() {
//   const html = `<h1>This is a example to convert html to pdf</h1><br /><b>{{template}}</b>`;
//   const file = await exportHtmlToPdf(html);
//   console.log('FILE?? ', file);
//   return file;
// }

// const exportHtmlToPdf = (html: string) => {
//   return new Promise((resolve, reject) => {
//     create(html, {
//       format: 'Letter',
//       orientation: 'portrait',
//       phantomPath: '/opt/phantomjs_linux-x86_64',
//     }).toBuffer((err, buffer) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(buffer);
//       }
//     });
//   });
// };

export const sendEmail = async (emailRequest: SESRequest) => {
  let response: any;
  try {
    const config: CreateOptions = {
      'format': 'A4',
      'orientation': 'portrait',
      'type': 'pdf',
      'phantomPath': '/opt/phantomjs_linux-x86_64',
    };
    const attachment: Attachment[] = <Attachment[]>emailRequest.attachments;
    const sendTransportEmail = new Promise((resolve, reject) => {
      create(attachment[0]['content'] as string, config).toBuffer(async function(err, res) {
        if (err) {
          reject(err);
        } else {
          emailRequest.subject =
            // eslint-disable-next-line max-len
            `${process.env.LAMBDA_ENV !== 'prod' ? process.env.LAMBDA_ENV === 'dev' ? 'Desarrollo -' : 'Pruebas -' : ''}${emailRequest.subject}`;
          const transporter = createTransport({
            SES: ses,
          });
          const mailOptions = {
            from: emailRequest.from,
            subject: emailRequest.subject,
            html: `Orden generada <b>#${emailRequest.documentNumber}</b>,
                    fecha y hora de emisión ${emailRequest.emissionDate}, documento no válido como factura`,
            to: emailRequest.to,
            attachments: [{
              filename: attachment[0]['filename'],
              content: res,
            }],
          };
          const resp = await transporter.sendMail(mailOptions);
          resolve(resp);
        }
      });
    });
    response = await sendTransportEmail;
    delete response.raw;
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// eslint-disable-next-line require-jsdoc
export const sendEmailC = async (emailRequest: SESRequest) => {
  try {
    emailRequest.subject =
            // eslint-disable-next-line max-len
            `${process.env.LAMBDA_ENV !== 'prod' ? process.env.LAMBDA_ENV === 'dev' ? 'Desarrollo -' : 'Pruebas -' : ''}${emailRequest.subject}`;
    const params = {
      Destination: {
        ToAddresses: emailRequest.to,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailRequest.html,
          },
        },
        Subject: {Charset: 'UTF-8', Data: emailRequest.subject},
      },
      Source: `${emailRequest.from}`,
    };
    return await ses.sendEmail(params).promise();
  } catch (_error) {
    console.error(_error);
    throw _error;
  }
};

