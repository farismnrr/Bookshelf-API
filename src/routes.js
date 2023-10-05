const {
    addBookFromHandler,
    getAllBooksFromHandler,
    getBookByIdFromHandler,
    editBookByIdFromHandler,
    deleteBookByIdFromHandler,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookFromHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksFromHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdFromHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookByIdFromHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookByIdFromHandler,
    },
];

module.exports = routes;
