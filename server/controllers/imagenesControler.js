const imgCtrl = {}
const path = require('path');
const fs = require('fs');
const {  respuestaErrorServer } = require('../helpers/respuestas');

imgCtrl.getImagenes = (req, res) => {
    try {
        const { tipo, img } = req.params;
        const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
        if(fs.existsSync(pathImg)) {
            res.sendFile(pathImg);
        } else {
            const noImg = path.resolve(__dirname, '../assets/img/no-image.jpg');
            res.sendFile(noImg);
        }
        
        return;
    } catch (error) {
        respuestaErrorServer(res, error, 400, "Error en el servidor");
    }
}

module.exports = imgCtrl;