const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 3 : API dapat menyimpan buku
const addBookFromHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    /* 
    Client tidak melampirkan properti namepada request body. 
    Bila hal ini terjadi, maka server akan merespons dengan
    */

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    /* Client melampirkan nilai properti readPage 
    yang lebih besar dari nilai properti pageCount. 
    Bila hal ini terjadi, maka server akan merespons dengan
    */

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // Bila buku berhasil dimasukkan, server harus mengembalikan respons dengan

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // Bila buku gagal dimasukkan, server harus mengembalikan respons dengan
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);

    return response;
};

// Kriteria 4 : API dapat menampilkan seluruh buku
const getAllBooksFromHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    /*
    ?name : Tampilkan seluruh buku yang mengandung nama berdasarkan nilai 
    yang diberikan pada query ini. Contoh /books?name=”dicoding”, 
    maka akan menampilkan daftar buku yang mengandung nama “dicoding” 
    secara non-case sensitive (tidak peduli besar dan kecil huruf).
    */

    if (name !== undefined) {
        filteredBooks = books.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    /*
    ?reading : Bernilai 0 atau 1. 
    Bila 0, maka tampilkan buku yang sedang tidak dibaca (reading: false). 
    Bila 1, maka tampilkan buku yang sedang dibaca (reading: true). 
    Selain itu, tampilkan buku baik sedang dibaca atau tidak.
    */

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.reading === !!Number(reading),
        );
    }

    /*
    ?finished : Bernilai 0 atau 1. Bila 0, 
    maka tampilkan buku yang sudah belum selesai dibaca (finished: false). 
    Bila 1, maka tampilkan buku yang sudah selesai dibaca (finished: true). 
    Selain itu, tampilkan buku baik yang sudah selesai atau belum dibaca.
    */

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.finished === !!Number(finished),
        );
    }

    // Jika belum terdapat buku yang dimasukkan, server bisa merespons dengan array books kosong.

    if (filteredBooks.length === 0) {
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }

    // Server harus mengembalikan respons dengan: Status Code : 200, Response Body:

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

// Kriteria 5 : API dapat menampilkan detail buku
const getBookByIdFromHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    /*
    Bila buku dengan id yang dilampirkan ditemukan, 
    maka server harus mengembalikan respons dengan:
    */

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    /*
    Bila buku dengan id yang dilampirkan oleh client tidak ditemukan, 
    maka server harus mengembalikan respons dengan:
    */

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Kriteria 6 : API dapat mengubah data buku
const editBookByIdFromHandler = (request, h) => {
    const { id } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    /*
    Client tidak melampirkan properti name pada request body. 
    Bila hal ini terjadi, maka server akan merespons dengan
    */

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    /*
    Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount. 
    Bila hal ini terjadi, maka server akan merespons dengan
    */

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // Bila buku berhasil diperbarui, server harus mengembalikan respons dengan

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    /*
    Id yang dilampirkan oleh client tidak ditemukkan oleh server. 
    Bila hal ini terjadi, maka server akan merespons dengan
    */

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Kriteria 7 : API dapat menghapus buku
const deleteBookByIdFromHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    /*
    Bila id dimiliki oleh salah satu buku, 
    maka buku tersebut harus dihapus dan server mengembalikan respons berikut
    */

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    /*
    Bila id yang dilampirkan tidak dimiliki oleh buku manapun, 
    maka server harus mengembalikan respons berikut
    */

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookFromHandler,
    getAllBooksFromHandler,
    getBookByIdFromHandler,
    editBookByIdFromHandler,
    deleteBookByIdFromHandler,
};
