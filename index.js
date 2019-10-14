const AWS = require('aws-sdk');
//const uuid=require('uuid/v1')
var s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = async (event) => {
    var location;
    var ETAG;
    var s3_upload = false;
    var dynamo_upload = false;
    console.log("Event is ", event)
    var body = JSON.parse(event.body)
    console.log("Body recived: ", body)
    var user_info = event.requestContext.authorizer.user
    console.log("User info is :", user_info)
    user_info = JSON.parse(user_info)
    var encodedImage = body.productImage;
    var ad_number = user_info.TOTAL_AD_POSTED
    ad_number = ad_number + 1
    console.log(encodedImage)
    var decodedImage = Buffer.from(encodedImage, 'base64');
    var AD_KEY = ad_number + ".jpg"
    var filePath = user_info.USERNAME + "/AD" + ad_number + "/" + AD_KEY
    var params = {
        "Body": decodedImage,
        "Bucket": "sale24dev",
        "Key": filePath
    };
    await s3.upload(params).promise().then((res) => {
        console.log("Response is: ", res)
        location = res.Location
        ETAG = res.ETag.replace(/['"]+/g, '')
        s3_upload = true
    })
        .catch((err) => {
            console.log("Error is: ", err)
        })
    if (s3_upload) {
        var datetime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Calcutta'
        });
        console.log("Time is: " + datetime)
        var ad_params = {
            Item: {
                "USERNAME": user_info.USERNAME,
                "S3_LOCATION": location,
                "AD_KEY": filePath,
                ETAG,
                "DESCRIPTION": body.productDescription,
                "LOCATION": body.productLocation,
                "CATEGORY": body.productCategory,
                "PRODUCT_NAME": body.productName,
                "PRICE": body.productPrice,
                "TIME_POSTED": datetime,
                "STATUS": "Active"
            },
            ReturnValues: "ALL_OLD",
            TableName: "ADVERTISEMENT"
        };
        console.log("Params prepared are ", ad_params)
        await dynamoDb.put(ad_params).promise()
            .then((res) => {
                console.log(res)
                console.log("Successful entry in Dynamo")
                dynamo_upload = true
            })
            .catch((err) => {
                console.log("Error is ", err)
            })
    }
    var response;
    if (s3_upload && dynamo_upload) {
        var update_params = {
            TableName: "USER_INFO",
            Key: {
                "USERNAME": user_info.USERNAME
            },
            UpdateExpression: "SET TOTAL_AD_POSTED = TOTAL_AD_POSTED + :p",
            ExpressionAttributeValues: {
                ":p": 1,
            },
            ReturnValues: "UPDATED_NEW"
        }
        console.log("Updated params for user table are: ", update_params)
        await dynamoDb.update(update_params).promise()
            .then((res) => {
                console.log("Update User Info: ", user_info)
            })
            .catch((err) => {
                console.log("Encountered Below Error in updating User Table: ", err)
                return;
            })
        response = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            statusCode: 200,
            body: "AD successfully posted"
        }
    } else {
        response = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            statusCode: 400,
            body: "Failed to post AD"
        }
    }
    console.log("Response is: ", response)
    return response
};