const Hapi = require("@hapi/hapi");
require("dotenv").config();

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["http://localhost:4200"],
        credentials: true,
      },
    },
  });

  await server.register(require('@hapi/cookie'));

  server.state('token', {
    isHttpOnly: true,
    isSecure: process.env.NODE_ENV === 'production',   
    isSameSite: 'Lax',                                 
    path: '/',
    ttl: 24 * 60 * 60 * 1000,                          
    encoding: 'none'
  });

  // Register routes
  server.route(productRoutes);
  server.route(authRoutes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
