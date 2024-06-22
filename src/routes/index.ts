import { Router } from "express";
import { login, register } from "../controllers/authController";
import { authentication } from "../middlewares/authentication";
import {
  getUser,
  updateProfileImage,
  updateUserProfile,
} from "../controllers/profileController";
import { uploadMiddleware } from "../middlewares/upload";
import { getBanners, getServices } from "../controllers/infromationController";
import {
  createTransaction,
  getBalance,
  getTransactions,
  updateBalance,
} from "../controllers/transactionController";

const router = Router();
router.post("/registration", register);
router.post("/login", login);

router.get("/profile", authentication, getUser);
router.put("/profile/update", authentication, updateUserProfile);
router.put(
  "/profile/image",
  authentication,
  uploadMiddleware("profile_image"),
  updateProfileImage
);

router.get("/banner", authentication, getBanners);
router.get("/service", authentication, getServices);

router.get("/balance", authentication, getBalance);
router.post("/topup", authentication, updateBalance);
router.post("/transaction", authentication, createTransaction);
router.get("/transaction/history", authentication, getTransactions);
export default router;
