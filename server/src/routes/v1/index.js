const router = require("express").Router();

const publicRouter = require("./public.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const followRouter = require("./follow.route");
const { authorize } = require("../../middlewares");
const { constants } = require("../../constants");

router.use("/public", publicRouter);
router.use("/auth", authRouter);
router.use("/user", authorize([constants.role.user]), userRouter);
router.use("/follow", authorize([constants.role.user]), followRouter);

module.exports = router;
