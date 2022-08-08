const postmark = require("postmark");

const serverToken = process.env.POSTMARK_API_KEY;
const client = new postmark.ServerClient(serverToken);

client.sendEmail({
    "From": "mohammedosamamudassir@gmail.com",
    "To": "mohammedosamamudassir123456@gmail.com",
    "Subject": "Test",
    "TextBody": "Hello from me!"
});