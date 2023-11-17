const proxy = require('http-proxy-middleware')


module.exports = function(app) {
    app.use(
      '/webapi', // You can specify a specific path here.
      createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
      })
    );
  };