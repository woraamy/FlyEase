import { Router } from "express";
import flightRoutes from "./flightRoutes";
import airportRoutes from "./airportRoutes";

const router = Router();

router.use("/flights", flightRoutes)
router.get("/airports", airportRoutes);

export default router;