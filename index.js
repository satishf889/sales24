const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = async (event) => {
    var body;
    var likes;
    console.log("Event is ", event)
    var body = JSON.parse(event.body)
    console.log("Body recived: ", body)
    var user_info = event.requestContext.authorizer.user
    console.log("User info is :", user_info)
    user_info = JSON.parse(user_info)
    var flag = false
    var ad_username = body.AD_KEY.split("/")[0]

    async function likeCheck1() {
        console.log("LIKED_ADS are:" + user_info.LIKED_ADS)
        if (user_info.LIKED_ADS.length == 0) {
            flag = false
            return;
        }
        console.log("Flag is ", flag)
        user_info.LIKED_ADS.filter((ad) => {
            console.log(ad)
            if (ad == body.AD_KEY) {
                console.log(ad)
                console.log("AD Already liked")
                flag = true
            }
        })
    }
    await likeCheck1()
    if (flag == false) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            statusCode: 400,
            body: "AD is not wishlisted."
        }
    }
    var get_ad_liked_by = {
        TableName: "ADVERTISEMENT",
        Key: {
            "USERNAME": ad_username,
            "AD_KEY": body.AD_KEY
        },
        ProjectionExpression: "LIKED_BY"
    }
    await dynamoDb.get(get_ad_liked_by).promise().
        then(async (res) => {
            console.log(res.Item.LIKED_BY)
            var present_array = res.Item.LIKED_BY
            var position = present_array.indexOf(user_info.USERNAME)
            console.log("Position in AD Table: " + position)
            var update_params = {
                TableName: "ADVERTISEMENT",
                Key: {
                    "USERNAME": ad_username,
                    "AD_KEY": body.AD_KEY
                },
                UpdateExpression: "SET LIKES = LIKES - :p REMOVE LIKED_BY[" + position + "]",
                ExpressionAttributeValues: {
                    ":p": 1,
                },
                ReturnValues: "UPDATED_NEW"
            }
            await dynamoDb.update(update_params).promise().
                then(async (res) => {
                    console.log("Likes after update: " + res.Attributes.LIKES)
                    likes = res.Attributes.LIKES
                    var user_ad_index = user_info.LIKED_ADS.indexOf(body.AD_KEY)
                    console.log("Index in user Liked Ads is: " + user_ad_index)
                    var dislike_ad_user = {
                        TableName: "USER_INFO",
                        Key: {
                            "USERNAME": user_info.USERNAME
                        },
                        UpdateExpression: "REMOVE LIKED_ADS[" + user_ad_index + "]",
                        ReturnValues: "UPDATED_NEW"
                    }
                    await dynamoDb.update(dislike_ad_user).promise()
                        .then((res) => {
                            console.log("User table update response is " + res)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        })

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        statusCode: 200,
        body: JSON.stringify({ likes })
    }
}