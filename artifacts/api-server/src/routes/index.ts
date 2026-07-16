import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notificationsRouter from "./notifications";
import setupRouter from "./setup";

const router: IRouter = Router();

router.use(healthRouter);
router.use(notificationsRouter);
router.use(setupRouter);

export default router;
