const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');

AWS.config.update({ region: 'us-east-1' });  // Update to your region
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Configure S3
const s3 = new AWS.S3();
const BUCKET_NAME = 'dog-daycare-uploads';  // Replace with your S3 bucket name

// Configure multer for file upload to a temporary 'uploads/' directory
const upload = multer({ dest: 'uploads/' });  // Temp location for uploaded files

// Function to upload files to S3
const uploadToS3 = (file) => {
  const fileContent = fs.readFileSync(file.path);
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,  // Unique file name
    Body: fileContent,
  };

  return s3.upload(params).promise();
};

// Controller function for adding a pet
const addPet = async (req, res) => {
  const { name, breed, sex, vaccineExpirationDates, notes, clientId } = req.body;  // Read form fields from the request
  const files = req.files;  // Get uploaded files

  try {
    // Upload documents to S3 and get URLs
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToS3(file);
        fs.unlinkSync(file.path);  // Remove file from server after upload
        return result.Location;  // Return S3 URL
      })
    );

    // Store pet information with S3 document URLs in DynamoDB
    const params = {
      TableName: 'Pets',
      Item: {
        petId: Date.now().toString(),
        clientId,
        name,
        breed,
        sex,
        vaccineExpirationDates,
        notes,
        documents: uploadedFiles,  // Store S3 URLs
      },
    };

    await dynamodb.put(params).promise();
    res.status(201).json({ message: 'Pet added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Could not add pet', details: error.message });
  }
};

module.exports = { addPet, upload };
