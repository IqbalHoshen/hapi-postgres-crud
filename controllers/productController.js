const pool = require('../db');

// Get all products
const getProduct = async (request, h) => {
  try {
    const result = await pool.query('SELECT * FROM product ORDER BY oid ASC');
    return h.response(result.rows).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// Get product by ID
const getProductById = async (request, h) => {
  try {
    const id = parseInt(request.params.id);
    const result = await pool.query('SELECT * FROM product WHERE oid = $1', [id]);
    
    if (result.rows.length === 0) {
      return h.response({ message: 'Product not found' }).code(404);
    }
    return h.response(result.rows[0]).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// Create product
const createProduct = async (request, h) => {
  try {
    const { name, quantity, price } = request.payload;
    const result = await pool.query(
      'INSERT INTO product (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
      [name, quantity, price]
    );
    return h.response(result.rows[0]).code(201);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// Update product
const updateProduct = async (request, h) => {
  try {
    const id = parseInt(request.params.id);
    const { name, quantity, price } = request.payload;
    const result = await pool.query(
      'UPDATE product SET name = $1, quantity = $2 , price = $3 WHERE oid = $4 RETURNING *',
      [name, quantity, price, id]
    );
    
    if (result.rows.length === 0) {
      return h.response({ message: 'Product not found' }).code(404);
    }
    return h.response(result.rows[0]).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

// Delete product
const deleteProduct = async (request, h) => {
  try {
    const id = parseInt(request.params.id);
    const result = await pool.query('DELETE FROM product WHERE oid = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return h.response({ message: 'Product not found' }).code(404);
    }
    return h.response({ message: 'Product deleted successfully' }).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};