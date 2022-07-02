const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const config = require('./utils/config');

http.createServer(app);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
