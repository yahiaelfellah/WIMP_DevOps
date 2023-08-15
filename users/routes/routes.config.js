
const IdentityProvider = require("./controllers/identity.provider");

exports.routesConfig = (app) => {
    app.post('/users', [
        IdentityProvider.insert
    ]);
    app.get('/users', [
        IdentityProvider.list
    ]);
    app.get('/users/:userId', [
        IdentityProvider.getById
    ]);
    app.put('/users/:userId', [
        IdentityProvider.putById
    ]);

    app.delete('/users/:userId', [
        IdentityProvider.removeById
    ]);
};

exports.routesAdminConfig = (app) => {
    app.post("/admin",[
        IdentityProvider.insert
    ])
}