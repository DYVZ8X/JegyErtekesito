import { Router, Request, Response } from 'express';
import { Order } from '../model/Orders';

const router = Router();
// Új rendelés létrehozása
router.post('/orders', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send('Not logged in');
  }

  const { event, ticketCategory, price, seatNumber } = req.body;

  try {
    const order = new Order({
      user: req.user,
      event,
      ticketCategory,
      price,
      seatNumber,
      date: new Date()
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the save of an order');
  }
});

// Saját rendelések
router.get('/orders/mine', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send('Not logged in');
  }

  try {
    const orders = await Order.find({ user: req.user }).populate('event');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the query of an order');
  }
});

// Összes rendelés adminnak
router.get('/orders', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !(req.user as any).permission || (req.user as any).permission !== 'admin') {
    return res.status(403).send('You dont have permission to see this');
  }

  try {
    const orders = await Order.find().populate('event').populate('user', 'email nickname');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the query of orders');
  }
});

// Rendelés törlése
router.delete('/orders/:id', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send('Not logged in');
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    if (order.user.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).send('You dont have permission to delete this order');
    }

    await order.deleteOne();
    res.status(200).send('Order deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the deletion of an order');
  }
});

export default router;
