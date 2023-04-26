const slack_url = ''; //enter your Slack Webhook
const base = ''; //enter your Help Center Base URL, e.g. support.internalnote.com/hc

export default {
  async fetch(request, env) {
    const { url } = request;
      const article = await request.json();
      console.log(article);
      var article_id = article.detail.id;
      var article_title = article.event.title;
      var locale = article.event.locale;

      var full_url = `${base}${locale}/articles/${article_id}`
      var slack = await postToSlack(full_url,article_title);
      return new Response('article posted to Slack');
  }
}

async function postToSlack(full_url,article_title){
  var message = JSON.stringify({
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "New article published on our Help Center"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": article_title
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Article",
            "emoji": true
          },
          "value": "article",
          "url": full_url,
          "action_id": "button-action"
        }
      }
    ]
  });

  const init = {
    body: message,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  };
  
  const response = await fetch(slack_url, init);
  return response;
}
