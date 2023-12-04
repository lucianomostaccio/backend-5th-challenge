const express = require("express");
const router = express.Router();
const productRouter = require("./product.router.js");
const cartRouter = require("./cart.router.js");

const apiRouter = router;

apiRouter.use("/api/products", productRouter);
apiRouter.use("/api/carts", cartRouter);


module.exports = apiRouter;
