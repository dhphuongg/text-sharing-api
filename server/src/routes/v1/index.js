const router = require("express").Router();

const publicRouter = require("./public.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const { authorize } = require("../../middlewares");
const { constants } = require("../../constants");

router.use("/public", publicRouter);
router.use("/auth", authRouter);
router.use("/user", authorize([constants.role.user]), userRouter);

module.exports = router;
