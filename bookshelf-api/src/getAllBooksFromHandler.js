const books = require('./books');

// Kriteria 4 : API dapat menampilkan seluruh buku
const getAllBooksFromHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name !== undefined) {
        filteredBooks = books.filter((b) =>
            b.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    if (reading !== undefined) {
        const isReading = !!Number(reading);
        filteredBooks = filteredBooks.filter((b) => b.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = !!Number(finished);
        filteredBooks = filteredBooks.filter((b) => b.finished === isFinished);
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
