import AWS from 'aws-sdk'

export default function handler(req, res) {
  AWS.config.update({
    accessKeyId: process.env.APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.APP_AWS_SECRET_KEY,
    region: process.env.APP_AWS_REGION,
    signatureVersion: 'v4',
  })

  const s3 = new AWS.S3({
    accessKeyId: process.env.APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.APP_AWS_SECRET_KEY,
    region: process.env.APP_AWS_REGION,
  })

  s3.createPresignedPost(
    {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key: req.query.file,
      },
      Expires: 60, // seconds
      Conditions: [
        ['content-length-range', 0, 5242880], // 5MB
        ['starts-with', '$Content-Type', 'image/'],
      ],
    },
    (err, signed) => {
      if (err) {
        console.error(err)
        res.status(400).json({ error: err.message })
      }
      return res.status(200).json(signed)
    }
  )
}
