/* eslint-disable arrow-body-style */
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
