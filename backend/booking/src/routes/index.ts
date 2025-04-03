import { Router } from "express";
import bookingRoute from './bookingRoute';

const router = Router();
router.use('/booking', bookingRoute);


export default router;