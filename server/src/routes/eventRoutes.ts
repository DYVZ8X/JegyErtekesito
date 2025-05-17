import { Router, Request, Response } from 'express';
import { Event } from '../model/Event';
import { Order } from '../model/Orders';
import { Cart } from '../model/Cart';
const router = Router();

// Create event
router.post('/events', async (req: Request, res: Response) => {
  try {
    const { title, date, location, tickets, seats, image } = req.body;

    if (!title || !date || !location || !tickets || !seats) {
      return res.status(400).send('Missing required fields.');
    }

    const newEvent = new Event({
      title,
      date,
      location,
      tickets,
      seats,
      image,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Get all events
router.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Get one event by ID
router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Event not found.');
    res.status(200).json(event);
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

router.get('/events/:id/booked-seats', async (req: Request, res: Response) => {
  const eventId = req.params.id;

  try {
    const orders = await Order.find({ event: eventId });

    const bookedSeats = orders.map(order => order.seatNumber);

    res.status(200).json(bookedSeats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving booked seats');
  }
});

// Update event
router.put('/events/:id', async (req, res) => {
  console.log("lefut");
  if (!req.isAuthenticated() || (req.user as any).permission !== 'admin') {
    return res.status(403).send('You dont have permission to do this');
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).send('Cant find event');
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in updating the event');
  }
});

// Delete event
router.delete('/events/:id', async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || (req.user as any).permission !== 'admin') {
    return res.status(403).send('You don\'t have permission to do this');
  }
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).send('Event not found.');
    await Cart.updateMany({}, { $pull: { items: { event: req.params.id } } });
    res.status(200).json({ message: 'Event and related cart items deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});

export default router;
