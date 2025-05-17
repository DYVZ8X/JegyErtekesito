import { Router, Request, Response } from 'express';
import { Cart } from '../model/Cart';

const router = Router();

// Kosár lekérése
router.get('/cart', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) return res.status(401).send('Not logged in');
  try {
    const cart = await Cart.findOne({ user: req.user }).populate('items.event');
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Could not retrieve cart');
  }
});

// Elem hozzáadása a kosárhoz
router.post('/cart', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) return res.status(401).send('Not logged in');

  const { event, ticketCategory, price, seatNumber } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user });

    const newItem = { event, ticketCategory, price, seatNumber };

    if (!cart) {
      cart = new Cart({ user: req.user, items: [newItem] });
    } else {
      cart.items.push(newItem);
      cart.updatedAt = new Date();
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Could not add to cart');
  }
});

router.delete('/cart/:itemId', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).send('Cart not found');

    // 🔍 Keresd meg az elemet ID alapján
    const itemIndex = cart.items.findIndex(item => (item as any)._id?.toString() === itemId);
    if (itemIndex === -1) return res.status(404).send('Item not found in cart');

    // 🗑️ Töröld ki az elemet
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


// Kosár kiürítése (opcionális)
router.delete('/cart', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) return res.status(401).send('Not logged in');

  try {
    await Cart.findOneAndDelete({ user: req.user });
    res.status(200).send('Cart cleared');
  } catch (error) {
    console.error(error);
    res.status(500).send('Could not clear cart');
  }
});

export default router;
