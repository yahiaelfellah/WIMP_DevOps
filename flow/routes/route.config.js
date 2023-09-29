
const FlowProvider = require("./provider/flow.provider");

exports.routesConfig = (app) => {

    app.get('/flow', [
        FlowProvider.listExpress
    ]);
    app.get('/flow/:userId', [
        FlowProvider.getByIdExpress
    ]);

};
