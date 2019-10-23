const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = async (event) => {
    console.log("Event is ", event)
    var body = JSON.parse(event.body)
    console.log("Body recived: ", body)
    var username = body.AD_KEY.split("/")[0]
    var productDetail;
    var response

    var params = {
        TableName: "ADVERTISEMENT",
        Key: {
            "USERNAME": username,
            "AD_KEY": body.AD_KEY
        },
        ProjectionExpression: 'PRODUCT_BRAND,PRODUCT_CATEGORY,PRODUCT_NAME,PRODUCT_DESCRIPTION,PRODUCT_PRICE,PRODUCT_LOCATION,PRODUCT_STATUS,PRODUCT_TIME_POSTED,AD_KEY,S3_LOCATION',
    }
    await dynamoDb.get(params).promise()
        .then(async (res) => {
            console.log("Response after search is: ", res)
            if (res.Item) {
                productDetail = res.Item
                var update_params = {
                    TableName: "ADVERTISEMENT",
                    Key: {
                        "USERNAME": username,
                        "AD_KEY": body.AD_KEY
                    },
                    UpdateExpression: "SET PRODUCT_VIEWS = PRODUCT_VIEWS + :p",
                    ExpressionAttributeValues: {
                        ":p": 1,
                    },
                    ReturnValues: "UPDATED_NEW"
                }
            }
            else {
                return response = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                    },
                    statusCode: 400,
                    body: JSON.stringify("failed")
                }
            }
            console.log("Updated params for ad table are: ", update_params)
            await dynamoDb.update(update_params).promise()
                .then((res) => {
                    console.log("Response after update is: ", res)
                    if (res.Attributes) {
                        return {
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Content-Type": "application/json",
                            },
                            statusCode: 200,
                            body: JSON.stringify({ productDetail })
                        }
                    }
                }).catch((err) => {
                    console.log("Error is: ", err)
                    return {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        },
                        statusCode: 500,
                        body: "failed"
                    }
                })
        }).catch((err) => {
            console.log("Error is: ", err)
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                statusCode: 400,
                body: "failed"
            }
        })
};
