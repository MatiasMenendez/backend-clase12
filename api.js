class Api {
    constructor(products) {
        this.products = products;
    }

    getProducts(req, res) {
        res.json({products: this.products});
    }

    postProduct(req, res) {
        const productNew = req.body;

        if (productNew.title && productNew.price && productNew.thumbnail && Object.keys(productNew).length === 3) {
            const longitud = this.products.length;
            longitud ? productNew.id = this.products[longitud - 1].id + 1 : productNew.id = 1 ;
            this.products.push(productNew);
            res.redirect(301, '/')
        } else {
            return res.status(400).send({ error: "Wrong params" });
        }
    }

}

module.exports = Api;