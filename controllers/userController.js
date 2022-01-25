const getUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};

const addUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};
const getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};

export { getUser, getSingleUser, addUser, updateUser, deleteUser };
