const { MedicineRepository}= require('../repository/index');
//const { compareTime }= require('../utils/helper');

class MedicineService{
    constructor(){
        //this.airplaneRepository = new AirplaneRepository();
        this.medicineRepository = new MedicineRepository();
    }
    async createMedicine(data){
        try {
            const medicine = await this.medicineRepository.createMedicine(data);
            return medicine;
        } catch (error) {
            console.log("something went wrong at service layer");
            throw {error};
        }
    }

    async getAllMedicineData(data){
        try {
            const medicines = await this.medicineRepository.getAllMedicines(data);
            return medicines;
        } catch (error) {
            console.log("something went wrong at service layer");
            throw {error};
        }
    }

    async getMedicine(medicineId){
        try{
            const flight = await this.medicineRepository.getFlight(medicineId);
            return flight;
        }catch(error){
            console.log("something went wrong at service layer");
            throw {error};
        }
    }
    async updateMedicine(medicineId, data) {
        try {
            const response = await this.medicineRepository.updateMedicine(medicineId, data);
            return response;
        } catch (error) {
            console.log("Something went wrong at service layer");
            throw {error};
        }
    }
    async deleteMedicine(medicineId){
        try{
            const response = this.medicineRepository.deleteMedicine(medicineId);
            return response;
        }catch(error){
            console.log("something went wrong in service layer");
            throw {error};
        }
    }
}
module.exports= MedicineService;