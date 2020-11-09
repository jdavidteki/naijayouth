const express = require('express');
var OAuth = require('oauth');
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var twitter_application_consumer_key = 'Tf8D7ytOYqqxcJtmA6SUS4CPB';  // API Key
var twitter_application_secret = 'n72tXOl7tb3rgWBDfPKDW75elW0qerpwvKseqhYfCVCMKITLLC';  // API Secret
var twitter_user_access_token = '1316251270483791872-HMMmtn3HKCuYJdsPJfmpC69sT9WJw2';  // Access Token
var twitter_user_secret = '9se6hOh9aXe5SsM2rdvIBXYk1XzvtyKSOh9jglsPn01kp';  // Access Token Secret

var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    twitter_application_consumer_key,
    twitter_application_secret,
    '1.0A',
    null,
    'HMAC-SHA1'
);

function commentOnTweet(tweetId){
    var postBody = {
        'status': '"i dey live my life, man dey turn am to shoot on sight, when be say na me dey give them life" took on a deeper meaning these past few days. THEY WILL NOT BREAK US!!!!! #FEM #EndSarsNow #endSARS #ENDBADGOVERNANCE',
        'in_reply_to_status_id':`${tweetId}`,
        'auto_populate_reply_metadata':true
    };

    oauth.post('https://api.twitter.com/1.1/statuses/update.json',
        twitter_user_access_token,  // oauth_token (user access token)
        twitter_user_secret,  // oauth_secret (user secret)
        postBody,
        '',  // post content type ?
        function(err, data, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        });
}

function retweetPost(tweetId){
    oauth.post(`https://api.twitter.com/1.1/statuses/retweet/${tweetId}.json`,
        twitter_user_access_token,  // oauth_token (user access token)
        twitter_user_secret,  // oauth_secret (user secret)
        '',  // post content type ?
        function(err, data, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        });
}

app.get('/api/twitter/', (req, res) => {
    var myHeaders = {
        "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAFy%2BJQEAAAAAHkCos35zjt3StBWnB27b2F7wrE8%3DSxpmL1gP5bVQdqb23p1sACXTiB11iRWlEbbksNffa7dka4S2oI",
        "Cookie": "personalization_id=\"v1_qiQArmZ/y3JsO175QYRe7w==\"; guest_id=v1%3A160473433260155152"
    }

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("https://api.twitter.com/2/tweets/search/recent?query=endsars", requestOptions)
    .then(response => response.json())
    .then(result => {
        for (i = 0; i < result.data.length; i++) {
            retweetPost(result.data[i].id)
            commentOnTweet(result.data[i].id)
        }
        res.send(result)
    })
    .catch(error => console.log('error', error));

})

console.log("Twitter server running on port 5000");
app.listen(5000);