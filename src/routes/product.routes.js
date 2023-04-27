import { Router } from "express"
import { ProductManager } from "../ProductManager.js"

const productManager = new ProductManager('./productos.txt')
const productRouter = Router() //defino solo las rutas

productRouter.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.send(products)
    } catch (error) {
        res.send(error)
    }

})

productRouter.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id)
        //res.send(product)
        res.render('product', {
            title: product.title,
            description: product.description,
            price: product.price,
            code: product.code,
            stock: product.stock
        })
    } catch (error) {
        res.send(error)
    }

})

productRouter.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body
        await productManager.addProduct({ title, description, price, thumbnail, code, stock })
        res.send("Producto creado")
    } catch (error) {
        res.send(error)
    }
})

productRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const { title, description, price, thumbnail, code, stock } = req.body
        const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock })
        res.send(mensaje)
    } catch (error) {   
        res.send(error)
    }
})

productRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const mensaje = await productManager.deleteProduct(id)
        res.send(mensaje)
    } catch (error) {
        res.send(error)
    }
})

export default productRouter