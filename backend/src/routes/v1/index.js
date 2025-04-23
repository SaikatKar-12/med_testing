const express =require('express');

const MedicineController = require('../../controllers/medicine-controller');


const router = express.Router();

router.post('/medicine',MedicineController.create);
router.delete('/medicine/:id',MedicineController.destroy);
router.get('/medicine/:id',MedicineController.get);
router.get('/medicine', MedicineController.getAll);
router.patch('/medicine/:id',MedicineController.update);


module.exports = router;