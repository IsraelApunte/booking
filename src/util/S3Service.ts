require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {config, S3} from 'aws-sdk';
import {File, FileS3, S3Request} from '../schemas/S3Request';
config.update({region: process.env.REGION});
const s3 = new S3();

/**
   * h
   * @param {fileObject} fileObject
   * @param {contentType} contentType
   * @param {folderS3} folderS3
   * @param {bucketName} bucketName
   * @return {FileS3}
   */
export const saveFiles = (
    fileObject: File,
    contentType: string,
    folderS3: string,
    bucketName: string,
): Promise<FileS3> => {
  return new Promise((resolve, reject) => {
    const params = {
      Body: fileObject.file,
      Bucket: `${bucketName}`,
      Key: `${folderS3}/${fileObject.name}`,
      ACL: 'public-read',
      // ContentEncoding: 'base64',
      ContentType: contentType,
    };
    console.log('S3: ', params);
    s3.upload(
        params,
        function(error: Error, data: FileS3 | PromiseLike<FileS3>) {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        },
    );
  });
};
/**
 * erwer
 * @param {keysFile} keysFile
 * @return {primis}
 */
export const deletFiles = async (keysFile: string[]) => {
  return new Promise((resolve, reject) => {
    // convert array of keys to objects of Key
    const objects = keysFile.map((key) => ({Key: key}));
    const params = {
      Bucket: `${process.env.FILES_BUCKET_NAME}`,
      Delete: {Objects: objects},
    };
    console.log(JSON.stringify(params));
    s3.deleteObjects(params, function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
/**
* dfdf
* @param {S3Request} s3Request
* @return {folderS3}
*/
export const saveImages = async (s3Request: S3Request) => {
  try {
    const arrayimage = s3Request.image.split(',');
    const fileBase64 = Buffer.from(arrayimage[1], 'base64');
    const process = arrayimage[0];
    const fileObject: File = {
      file: fileBase64,
      name: `${s3Request.name}.png`,
    };
    const responseS3 = await saveFiles(
        fileObject,
        process.slice(5, -7),
        s3Request.folderName,
        s3Request.bucketName,
    );
    return responseS3.Location;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

