const PAGE_ACCESS_TOKEN = "EAAffIp5WuKcBALSa14Oga2H51w5T66TfZBWDLRwcKG19JFPwCzMmlaQT5Wjx3W9iMVXVpkhmSP1FfXFkRj5xYQan3SNfcbmLB3fDATr2quIzTzABWga38mwLlfoG2EfFgVLZCKvoZAobZCwKpy0aFVf2TC3WoX9Y9I5UxRnZBEGvyerlXVVc36APjh9MbZBkwZD";
const VERIFY_TOKEN = "ThisIsASecretThatIOnlyKnow!";

var express = require('express');
var router = express.Router();
var request = require('request');
var chatbotHelper = require('../helpers/chatbot');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat Bot' });
});


// Accepts GET requests at the /webhook endpoint
router.get('/webhook', (req, res) => {
  

  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return res.sendStatus(403);      
    }
  }else {
    // Responds with '403 Forbidden' if verify tokens do not found
       return res.sendStatus(403); 
  }

});


// Accepts POST requests at /webhook endpoint
router.post('/webhook', (req, res, next) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {

        chatbotHelper.handleMessage(sender_psid, webhook_event.message);        

      } else if (webhook_event.postback) {
        
        chatbotHelper.handlePostback(sender_psid, webhook_event.postback);

      }
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});






module.exports = router;
