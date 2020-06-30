require('./config/config');
const app = require('./app');
require('./config/database');
const port = app.get("port");

const main = async () => {
  await app.listen(port);
  console.log(`Server en localhost:${port}`)
}

main();