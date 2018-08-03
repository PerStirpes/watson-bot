const server = require('./app');
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`> We're live on port ${port}`);
});
