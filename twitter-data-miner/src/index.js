import Twit from 'twit';
import fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { createCSV } from './createCSV.js';
import { uploadDatasetToBucket } from './uploadDatasetToBucket.js';

config();

const s3 = new S3Client({region: process.env.AWS_REGION});

const Bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
});

console.log('Bot iniciado...');

setInterval(() => {
    const fileName = createCSV();

    // make a request to the twitter api and get name of the first 10 topics on the trending list
    Bot.get('trends/place', { id: 23424768 }, function (err, data, response) {
        if (err) {
            console.log(err);
        } else {
            const trends = data[0].trends.slice(0, 10);
            // for each trend, make a request to the tweet api and get the first 10 tweets
            trends.forEach((trend) => {
                Bot.get('search/tweets', { q: trend.name, count: 10 }, function (err, data, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        const tweets = data.statuses;
                        // Save each tweet in a csv file called tweets.csv that have the following collumns: trend, id, tweet
                        tweets.forEach((tweet) => {
                            const textWithNoLineBreak = tweet.text.split('\n').join(' ');
                            const textFinal = textWithNoLineBreak.split('"').join('');
                            fs.appendFile(fileName, `\n${trend.name},${tweet.id},"${textFinal}"`, (err) => {
                                if (err) throw err;
                            });                        
                        });
                    }
                });
            });

            uploadDatasetToBucket(s3, fileName);
        }
    });
}, 10*60*1000);
