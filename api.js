const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
require("dotenv").config();

const toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: "2017-09-21",
  
});

const toneParams = {
  'tone_input': { 'text': text },
  'content_type': 'application/json',
  headers: {
    "Custom-Header": "{header_value}"
  }
};


toneAnalyzer.tone(toneParams,
  (err, tone) => err ? console.log(err) || console.log(JSON.stringify(tone, null, 2));
);

// const text = 'Team, I know that times are tough! Product sales have been disappointing for the past three quarters. We have a competitive product, but we need to do a better job of selling it!'
const text = 'SHUT UP! I do not want to hear what you have to say'

