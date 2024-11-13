const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use( 
        createProxyMiddleware( {
            target: 'http://localhost:5000',
            changeOrigin: true,
            pathFilter: '/auth/**'
        })
    );

    app.use(
        createProxyMiddleware( {
            target: 'http://localhost:5000',
            changeOrigin: true,
            pathFilter: '/now-playing'
        })
    );
};