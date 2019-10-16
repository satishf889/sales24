const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = async (event) => {
    console.log("Event recived: ", event)
    var user_info = event.requestContext.authorizer.user
    console.log("User info is :", user_info)
    user_info = JSON.parse(user_info)
    event = JSON.parse(event.body)
    var params = {
        Key: {
            USERNAME: user_info.USERNAME,
            AD_KEY: event.AD_KEY,
        },
        ProjectionExpression: 'PRODUCT_CATEGORY,PRODUCT_NAME,DESCRIPTION,PRODUCT_PRICE,PRODUCT_LOCATION,PRODUCT_STATUS,PRODUCT_TIME_POSTED,AD_KEY',
        TableName: 'ADVERTISEMENT',
    }

    const result = await dynamoDb.get(params).promise()
        .then((res) => {
            console.log("Dynamo Response is :", res)
            return res.Item
        })
        .catch((err) => {
            console.log(err)
            return "Something went wrong."
        })

    if (result.length < 1) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            statusCode: 400,
            body: JSON.stringify("No Such Ad found")
        }
    }

    if (result == "Something went wrong.") {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            statusCode: 500,
            body: JSON.stringify(result)
        }
    }
    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};
