import { Router } from "express";
import aircraftRoute from './aircraftRoute';

const router = Router();
router.use('/aircraft', aircraftRoute);

export default router;