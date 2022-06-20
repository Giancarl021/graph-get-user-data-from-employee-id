const GraphInterface = require('graph-interface');

const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tenantId: process.env.TENANT_ID
}; 

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const graph = GraphInterface(credentials, { logger: msg => context.log(msg) });

    if (!credentials.clientId || !credentials.clientSecret || !credentials.tenantId) {
        context.res = {
            status: 500,
            body: {
                error: 'No credentials set in environment'
            }
        };

        return;
    }

    const { id } = (req.query || {});

    let body, status = 200;
    
    try {
        body = (
            (await graph.list(`users?$filter=employeeId eq '${id}'&$select=displayName,mail,employeeId&$top=1`))[0] ||
            { error: 'No user found' }
        );

        if (body.error) status = 400;
    } catch (err) {
        status = 400;
        body = {
            error: err.message
        };
    }

    context.res = { status, body };
}