const express =require('express');

const MedicineController = require('../../controllers/medicine-controller');
const HospitalController = require('../../controllers/hospital-controller');


const router = express.Router();

router.post('/medicine',MedicineController.create);
router.delete('/medicine/:id',MedicineController.destroy);
router.get('/medicine/:id',MedicineController.get);
router.get('/medicine', MedicineController.getAll);
router.patch('/medicine/:id',MedicineController.update);

router.post(
    '/signup', 
    HospitalController.create
);
router.post(
    '/signin',
    HospitalController.signIn
);

router.get(
    '/isAuthenticated',
    HospitalController.isAuthenticated
);


module.exports = router;