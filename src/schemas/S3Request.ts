export interface S3Request {
    name: string,
    image: string,
    folderName: string,
    bucketName: string,
}

export interface File {
    file: Buffer;
    name: string;
}
export interface FileS3 {
    Location: string;
}
