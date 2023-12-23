const AWS = require('aws-sdk');
exports.uploadToS3 = (data, fileName) => {
    const BUCKET_NAME = 'expensetrackerapp2';
    //Initialize bucket
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {

        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(s3response.Location);
            }
        });
    })
}