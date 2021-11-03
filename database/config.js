const mongoose = require('mongoose');


const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('BD online =)  =) ')


    } catch (error) {
        console.log(error);
        throw new Error('Erron en la Conexión DB ');
    }
};


module.exports = {
    dbConnection

};