const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = async (event) => {
    console.log("Event recived: ", event)
    event = JSON.parse(event.body)
    console.log(event)
    var params;
    if (event != null) {
        params = {
            ExpressionAttributeValues: { ":status": "Active" },
            KeyConditionExpression: "PRODUCT_STATUS=:status",
            ProjectionExpression: 'PRODUCT_NAME,PRODUCT_DESCRIPTION,AD_KEY,PRODUCT_PRICE,PRODUCT_LOCATION,S3_LOCATION,LIKES',
            TableName: 'ADVERTISEMENT',
            IndexName: 'PRODUCT_STATUS-PRODUCT_CATEGORY-index',
            ScanIndexForward: false,
            ExclusiveStartKey: event.lastScannedIndex,
            Limit: 10
        }
    }
    else {
        params = {
            ExpressionAttributeValues: { ":status": "Active" },
            KeyConditionExpression: "PRODUCT_STATUS=:status",
            ProjectionExpression: 'PRODUCT_NAME,PRODUCT_DESCRIPTION,AD_KEY,PRODUCT_PRICE,PRODUCT_LOCATION,S3_LOCATION,LIKES',
            TableName: 'ADVERTISEMENT',
            IndexName: 'PRODUCT_STATUS-PRODUCT_CATEGORY-index',
            ScanIndexForward: false,
            Limit: 10
        }
    }
    const result = await dynamoDb.query(params).promise()
        .then((res) => {
            console.log("Dynamo Response is :", res)
            return res
        })
        .catch((err) => {
            console.log(err)
            return "Something went wrong."
        })

    if (result == "Something went wrong.") {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            statusCode: 400,
            body: JSON.stringify(result)
        }
    }
    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        statusCode: 200,
        body: JSON.stringify({ "ITEMS": result.Items, "LAST_KEY": result.LastEvaluatedKey }),
    };
    return response;
};
