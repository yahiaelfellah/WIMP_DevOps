const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = require('@grpc-web/proxy');


exports.setupProxies = (app,routes) => {
    routes.forEach(route => {
        if(route.isgRPC){
            app.use(route.url,proxy(route.proxy.target).listen(route.proxy.port))
        } else {
            app.use(route.url,createProxyMiddleware(route.proxy))

        }
    });
}