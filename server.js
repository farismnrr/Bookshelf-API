const Hapi = require('@hapi/hapi');
const routes = require('./src/routes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 9000,
        host: '0.0.0.0', // Menggunakan host '0.0.0.0' agar dapat diakses dari luar
        routes: {
            cors: true,
            validate: {
                failAction: async (request, h, err) => {
                    throw err;
                },
            },
        },
    });

    server.route(routes);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Server connected';
        },
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
