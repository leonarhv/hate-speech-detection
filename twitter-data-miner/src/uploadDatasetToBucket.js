import fs from 'fs';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const uploadDatasetToBucket = async (client, fileName) => {
    // Send the saved file to the aws s3 bucket called daily-trend-tweets
    const params = {
        Bucket: 'daily-trend-tweets',
        Key: fileName,
        Body: fs.createReadStream(fileName),
    };

    const uploadCommand = new PutObjectCommand(params);

    client.send(uploadCommand, (err, data) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data);
        }
    });
}

export { uploadDatasetToBucket };