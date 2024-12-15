const logger = (req, res, next) => {
    console.log(`Consulta realizada a la ruta: ${req.path}`);
    next();
};

module.exports = logger;
