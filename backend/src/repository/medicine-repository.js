const {  Medicine }=require('../models/index');
const {Op} = require('sequelize');

class MedicineRepository{
    #createFilter(data){
        let filter={};
        if(data.name){
            filter.name = data.name;
        }
        if(data.status){
            filter.status= data.status;
        }
        // if(data.minPrice && data.maxPrice){
        //     Object.assign(filter, {
        //         [Op.and]:[
        //             {price : {[Op.lte]: data.maxPrice}},
        //             {price:{[Op.gte]:data.minPrice}}
        //         ]
        //     })
        // }
        // if(data.minPrice){
        //     Object.assign(filter,{price:{[Op.gte]:data.minPrice}});
        // }
        // if(data.maxPrice){
        //     Object.assign(filter,{price:{[Op.lte]:data.maxPrice}});
        // }
        return filter;
    }
    async createMedicine(data){
        try {
            const medicine=await Medicine.create(data);
            return medicine;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }
    async deleteMedicine(medicineId){
        try {
            await Medicine.destroy({
                where:{
                    id: medicineId
                }
            });
            return true;
        }
        catch (error) {
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }
    async getMedicine(medicineId){
        try {
            const medicine = await Medicine.findByPk(medicineId);
            return medicine;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async getAllMedicines(filter){
        try {
            const filterObject = this.#createFilter(filter);
            const flight = await Medicine.findAll({
                where: filterObject
            });
            return flight;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async updateMedicine(medicineId, data) {
        try {
           await Medicine.update(data, {
               where: {
                   id: medicineId
               }
           });
           return true;
       } catch (error) {
           console.log("Something went wrong in the repository layer");
           throw {error};
       }
   }

}

module.exports =MedicineRepository;