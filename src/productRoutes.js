import express from 'express';
import ProductManager from './productManager.js'; 

const router = express.Router();
const productManager = new ProductManager('./src/products.json');

// Lista todos los productos
router.get('/', async (req, res) => {
    let { limit } = req.query;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, parseInt(limit)));
        } else {
            res.json(products);
        }
    } catch (err) {
        res.status(500).send('Error al obtener productos');
    }
});

// Obtiene un producto por ID
router.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al obtener el producto');
    }
});

// Añadir un nuevo producto
router.post('/', async (req, res) => {
    try {
        const product = {
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status,
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails
        };
        await productManager.addProduct(product);
        res.status(201).json({ message: 'Producto creado con éxito', data: product });
    } catch (err) {
        res.status(500).send('Error al crear el producto: ' + err.message);
    }
});

// Actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const updatedProduct = req.body;
        await productManager.updateProduct(id, updatedProduct);
        res.status(200).send('Producto actualizado con éxito');
    } catch (err) {
        res.status(500).send('Error al actualizar el producto: ' + err.message);
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        await productManager.deleteProduct(id);
        res.status(200).send('Producto eliminado con éxito');
    } catch (err) {
        res.status(500).send('Error al eliminar el producto: ' + err.message);
    }
});


export default router;