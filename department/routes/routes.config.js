const DepartmentProvider = require("./controllers/department.provider"); // Import the Department provider

exports.routesConfig = (app) => {
    app.post('/departments', [ // Update the route to /departments
        DepartmentProvider.insert // Use DepartmentProvider.insert
    ]);
    app.get('/departments', [ // Update the route to /departments
        DepartmentProvider.list // Use DepartmentProvider.list
    ]);
    app.get('/departments/:departmentId', [ // Update the route to /departments/:departmentId
        DepartmentProvider.getById // Use DepartmentProvider.getById
    ]);
    app.put('/departments/:departmentId', [ // Update the route to /departments/:departmentId
        DepartmentProvider.putById // Use DepartmentProvider.putById
    ]);

    app.delete('/departments/:departmentId', [ // Update the route to /departments/:departmentId
        DepartmentProvider.removeById // Use DepartmentProvider.removeById
    ]);
};


