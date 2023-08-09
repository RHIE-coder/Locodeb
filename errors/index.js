class OptimismError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OptimismError';
    }
}


module.exports = {
    OptimismError,
}