const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ["USER_ROLE", "ADMIN_ROLE"],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

//Funciòn para que no se vea el password en la request
usuarioSchema.methods.toJSON= function () {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

// Crea la validación y retorna un error en caso de que un campo requerido falte
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} es requerido'});

module.exports = mongoose.model('Usuario', usuarioSchema);