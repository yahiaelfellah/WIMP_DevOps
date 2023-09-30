
const FlowProvider = require("./provider/flow.provider");

exports.routesConfig = (app) => {

    app.get('/flows', [
        FlowProvider.listExpress
    ]);
    app.get('/flows/:userId', [
        FlowProvider.getByIdExpress
    ]);

};
