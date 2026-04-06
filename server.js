const Hapi = require('@hapi/hapi');
require('dotenv').config();
const productRoutes = require('./routes/products');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: true, 
    },
  });

  // Register routes
  server.route(productRoutes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();