const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });  // Update region as per your setup
const dynamodb = new AWS.DynamoDB.DocumentClient();

const addClient = async (req, res) => {
  const { name, email, mailingAddress, phoneNumber, vetName, vetNumber } = req.body;

  const params = {
    TableName: 'Clients',
    Item: {
      clientId: Date.now().toString(),  // Simple unique ID
      name,
      email,
      mailingAddress,
      phoneNumber,
      vetName,
      vetNumber,
    },
  };

  try {
    await dynamodb.put(params).promise();
    res.status(201).json({ message: 'Client added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Could not add client', details: error.message });
  }
};

// Function to get all clients
const getAllClients = async (req, res) => {
  const params = {
    TableName: 'Clients'
  };

  try {
    const data = await dynamodb.scan(params).promise();
    res.status(200).json(data.Items);  // Return all clients
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve clients', details: error.message });
  }
};

module.exports = { addClient, getAllClients };

