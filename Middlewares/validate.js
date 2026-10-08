const user = (req, res, next) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password ||
    !req.body.dob ||
    !req.body.phone
  ) {
    return res
      .status(400)
      .json({ message: 'Please provide all the required field.' });
  }
  next();
};

const login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password.' });
  }
  next();
};

//need to look at this first
// const ALLOWED_FIELDS = [
//   'firstName',
//   'lastName',
//   'email',
//   'phone',
//   'bvn',
//   'nin',
//   'dob',
// ];

// export const validateCustomerOnboarding = (req, res, next) => {
//   const incomingFields = Object.keys(req.body);

//   // 1. Check for unexpected fields
//   const invalidFields = incomingFields.filter(
//     (key) => !ALLOWED_FIELDS.includes(key),
//   );

//   if (invalidFields.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: `Invalid fields supplied: ${invalidFields.join(', ')}`,
//     });
//   }

//   // 2. Validate required fields
//   const requiredFields = ['firstName', 'lastName', 'phone', 'bvn'];
//   const missingFields = requiredFields.filter((key) => !req.body[key]);

//   if (missingFields.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: `Missing required fields: ${missingFields.join(', ')}`,
//     });
//   }

//   next();
// };

const update = (req, res, next) => {
  const allowedField = ['firstName', 'lastName', 'email', 'dob', 'phone'];
  const updateFields = Object.keys(req.body);
  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update.' });
  }
  const isInvalidUpdate = updateFields.some(
    (field) => !allowedField.includes(field),
  );
  //const isValidUpdate = updateFields.every((field) => allowedField.includes(field));

  if (isInvalidUpdate) {
    return res
      .status(400)
      .json({ message: 'Request contains invalid fields for update.' });
  }

  const hasEmptyField = updateFields.some(
    (field) =>
      typeof req.body[field] === 'string' && req.body[field].trim() === '',
  );
  if (hasEmptyField) {
    return res
      .status(400)
      .json({ message: 'Fields cannot be empty for update.' });
  }

  next();
};

module.exports = {
  user,
  login,
  update,
};
