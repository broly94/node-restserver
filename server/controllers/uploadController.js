const uploadCtrl = {};
const {
  respuestaError,
  respuestaErrorServer,
} = require("../helpers/respuestas");
const Usuario = require("../models/usuario");
const Producto = require("../models/productos");
const fs = require("fs");
const path = require("path");

uploadCtrl.putUpload = async (req, res) => {
  try {
    //Preguntamos si hay un archivo cargado al hacer la peticion
    if (!req.files) {
      respuestaError(res, 400, "No hay archivos cargados");
    }
    //Tipos se pasará por parametro en la url para que haga match con la carpeta donde se va a subir
    const tipo = req.params.tipo;
    const id = req.params.id;
    const tiposValidos = ["usuarios", "productos"];
    if (tiposValidos.indexOf(tipo) < 0) {
      return res.json({
        ok: false,
        error: `Los tipos válidos son: ${tiposValidos.join(" , ")}`,
      });
    }

    //Archivo
    const archivo = req.files.archivo;
    //Separar el nombre de la extención
    const nombreCortado = archivo.name.split(".");
    //Se obtiene la extención
    let extencion = nombreCortado[nombreCortado.length - 1];
    // Validar Extenciones permitidas
    let extencionesValidas = ["jpg", "png", "gif", "jpeg"];
    //Valída que la extencion del archivo que se va a subir sea igual a la que se declara en el array
    if (extencionesValidas.indexOf(extencion) < 0) {
      return res.json({
        ok: false,
        error: `Las extenciónes válidas son: ${extencionesValidas.join(" , ")}`,
        ext: extencion,
      });
    }

    //Cambiar el nombre del archivo que se va a subir
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    //Sube el archivo, y se le pasa la direccion donde se va a guardar, carpeta/tipo/nombre_archivo
    await archivo.mv(`uploads/${tipo}/${nombreArchivo}`);
    
    //Funciones para guardar los nombres de las imagenes en la db
    switch (tipo) {
      case "usuarios":
        imagenUsuario(id, res, nombreArchivo);
        break;
      case "productos":
        imagenProducto(id, res, nombreArchivo);
        break
      default:
        respuestaError(res, 400, "No se pudo insertar el archivo, seleccione un tipo")
        break;
    }

  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

// Función para guardar imagen del producto y borrar la imagen anterior
const imagenProducto = async (id, res, nombreArchivo) => {
  try {
    const producto = await Producto.findById(id);
    //console.log(producto)
    if(producto === null) {
      borraArchivo(nombreArchivo, "productos");
      respuestaError(res, 400, "El producto no existe")
    }
    //Primero se borra la imagen que se haya guardado para poder insertar la neuva
    borraArchivo(producto.img, "productos")
    //Una ves borrada a imagen anterior, procedemos a decirle que la img del producto va ser igual al nombre de la nueva imagen
    producto.img = nombreArchivo;
    const nuevoProducto = await producto.save();
    return res.json({
      ok: true,
      producto: nuevoProducto,
      img: producto.img
    })
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
    borraArchivo(nombreArchivo, "productos");
  }
};

// Función para guardar imagen del usuario y borrar la imagen anterior
const imagenUsuario = async (id, res, nombreArchivo) => {
  try {
    const usuario = await Usuario.findById(id);
    if (usuario === null) {
      borraArchivo(nombreArchivo, "usuarios")
      respuestaError(res, 400, "El usuario no existe")
    }
    //Si hay una imagen en la carpeta se borra para isertar una nueva!
    //Esto se hace cuando se quire dejar solamente una imagen, para un usuario, producto, etc.
    //Si el usuario no tiene una imagen insertada, la funcion borrarArchivo pasa de largo y sigue con la ejecución del código.
    borraArchivo(usuario.img, "usuarios");
    
    usuario.img = nombreArchivo;

    const usuarioGuardado = await usuario.save();
    return res.json({
      ok: true,
      usuario: usuarioGuardado,
      img: nombreArchivo,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error,
      message: "Error en el servidor"
    })
    return borraArchivo(nombreArchivo, "usuarios")
  }
};

//Borrar si el archivo existe
const borraArchivo = (nombreImagen, tipo) => {
  //Guardamos el path donde esta la imagen guardada.
  let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
  //Verificamos si la imagen existe
  if (fs.existsSync(pathImagen)) {
    //Si existe la imagen se borra
    fs.unlinkSync(pathImagen);
  }
};

module.exports = uploadCtrl;
