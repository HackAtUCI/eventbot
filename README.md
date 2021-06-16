# EventBot
Web interface to control a custom Slack App.  

## Local Development

### Getting Setup
- `git clone https://github.com/ChaseC99/eventbot.git`
- `cd eventbot`  
- `npm install`  

### Running the Project
- `npm start`  
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- Input the token for your Slack App on the `/login` page

### Deploying
We use GitHub Pages to deploy our site.  
Make sure you are on the latest version of `master` before running the deploy command.
- `git checkout master`
- `git pull`
- `npm run deploy`