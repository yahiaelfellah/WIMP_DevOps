
const FlowProvider = require("./provider/flow.provider");

exports.routesConfig = (app) => {

    app.get('/flow', [
        FlowProvider.listExpress
    ]);
    app.get('/flow/:userId', [
        FlowProvider.getByIdExpress
    ]);
    // app.put('/flow/:flowId', [
    //     FlowProvider.putById
    // ]);

    // app.delete('/flow/:flowId', [
    //     FlowProvider.removeById
    // ]);
};
