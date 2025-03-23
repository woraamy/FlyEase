import { Router } from "express";
import flightRoutes from "./flightRoutes";

const router = Router();

router.use("/flights", flightRoutes)

export default router;