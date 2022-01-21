const express = require("express");
const router = express.Router();

const saucesCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require('../middleware/multer_config')

router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.updateSauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.get("/", auth, saucesCtrl.getAllSauces);

module.exports = router;
