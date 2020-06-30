const respuestaErrorServer = (resp, error, status = 400, mensaje) => {
    return resp.status(status).json({
        ok: false,
        error,
        mensaje
    })
}

const respuestaError = (resp, status = 400, mensaje) => {
  return resp.status(status).json({
    ok: false,
    mensaje,
  });
};


module.exports = {
  respuestaErrorServer,
  respuestaError,
};