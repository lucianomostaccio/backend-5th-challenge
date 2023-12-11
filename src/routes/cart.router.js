const express = require("express");
const router = express.Router();
const CartManager = require("../dao/services/fs/CartManager");

const cartManager = new CartManager();

// Rutas para manejo de carts

// Agregar un nuevo cart
router.post("/", async (req, res) => {
  try {
    await cartManager.addCart();
    res.status(201).json({ message: "cart added succesfully" });
  } catch (error) {
    console.error("error adding cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener un cart por ID
router.get("/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.pid);
    console.log("cart id:", cartId);
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send("Cart not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Agregar a un cart específico un producto
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const prodId = Number(req.params.pid);
    console.log(
      `You are looking into cart with id:${cartId}, the product with id:${prodId}`
    );

    await cartManager.addProductToCart(cartId, prodId);
    res.json({
      message: "Success. If cart exists, product has been added",
    });
  } catch (error) {
    console.error("Error adding the product in the cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
