const express = require("express");
const router = express.Router();
const ProductManager = require("../services/ProductManager");
const productManager = new ProductManager();

const viewsRouter = router;

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", {
      titulo: "Products list",
      products,
      style: "home.css", //specific style file for this page
    });
  } catch (error) {
    console.error("Error getting the products:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      titulo: "Real time products list",
      products,
      style: "realTimeProducts.css", //specific style file for this page
    });
  } catch (error) {
    console.error("Error rendering products in real time:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = viewsRouter;
