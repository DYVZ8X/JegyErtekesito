// routes/eventRoutes.ts
import { Router, Request, Response } from 'express';
import { Event } from '../model/Event';

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

// Update event
router.put('/events/:id', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).send('Event not found.');
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Delete event
router.delete('/events/:id', async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).send('Event not found.');
    res.status(200).send('Event deleted successfully.');
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

export default router;
