const express = require('express');
const app = express();
const Categorias = require('../models/categorias');
const { verificarToken, verificaAdministrador } = require('../middlewares/autenticacion');

// #######################
// DEVUELVE TODAS LAS CATEGORIAS
// #######################
app.get('/categorias', verificarToken , async (req, res) => {

    try {

        const categorias = await Categorias.find({estado: true}).populate('usuario')
        const totalCategorias = await Categorias.countDocuments({estado: true});
        if(categorias.length === 0){
            return res.status(400).json({
                ok: true,
                message: 'No hay categorías'
            })
        } else {

            return res.json({
              ok: true,
              categorias,
              totalCategorias,
            });

        }

    } catch (error) {

        return res.status(400).json({
            ok: false,
            error
        })

    }

})

// #######################
// DEVUELVE UNA CATEGORIA
// #######################
app.get('/categoria/:id', verificarToken, async (req, res) => {

    try {
        
        const id = req.params.id;
        const categoria = await Categorias.findById({_id: id});
        if(categoria === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'La categoria no existe'
                }
            })
        }
        return res.json({
            ok: true,
            categoria
        })

    } catch (error) {
        
        return res.status(400).json({
          ok: false,
          error,
        });

    }

})

// #######################
// INSERTA CATEGORIAS
// #######################
app.post('/categoria', verificarToken , async (req, res) => {

    try {
        
        let { nombre, estado } = req.body;
        //Desde verificarToken obtenemos id del usuario logeado
        let usuario = req.usuario._id;
        const categoria = new Categorias({
          nombre,
          estado,
          usuario
        });
        const newCategoria = await categoria.save();
        // if(!newCategoria) {
        //     return res.status(400).json({
        //       ok: false,
        //       error,
        //     });
        // }
        return res.json({
          ok: true,
          newCategoria,
        });
        
    } catch (error) {
        
        return res.status(400).json({
          ok: false,
          error,
        });

    }

})

// #######################
// MODIFICAR CATEGORIAS
// #######################
app.put('/categoria/:id', verificarToken ,async (req, res) => {

    try {
        
        const id = req.params.id;
        const body = req.body;
        const modificaCategoria = await Categorias.findByIdAndUpdate({_id: id}, body, {new: true, runValidators: true, context: 'query'});
        return res.json({
            ok: true,
            modificaCategoria
        })

    } catch (error) {

        return res.status(400).json({
          ok: false,
          error
        });
    
    }

})

// #######################
// ELIMINA CATEGORIAS
// #######################
app.delete('/categoria/:id', [verificarToken, verificaAdministrador], async (req, res) => {

    try {
        
        const id = req.params.id;
        await Categorias.findByIdAndRemove({_id: id});
        return res.json({
            ok: true,
            message: 'Categoría eliminada'
        })

    } catch (error) {
        
        return res.status(400).json({
          ok: false,
          error,
        });

    }

})


module.exports = app;