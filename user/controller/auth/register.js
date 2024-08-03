const { body, validationResult } = require("express-validator");
const Users = require("../models/user/users");
const Roles = require("../models/user/roles");
const bcrypt = require("bcrypt");
const path = require("path");



const register = async (req, res) => {
  try {
    // Validate and normalize the email field
    await body("email").isEmail().normalizeEmail().run(req);

    // Check if the 'firstName' field has a minimum length of 3 characters
    await body("firstName").isLength({ min: 3 }).run(req);

    // Check if the 'lastName' field has a minimum length of 3 characters
    await body("lastName").isLength({ min: 3 }).run(req);

    // Check if the 'username' field has a minimum length of 4 characters
    await body("username").isLength({ min: 4 }).run(req);

    // Check if the 'password' field has a minimum length of 6 characters
    await body("password").isLength({ min: 6 }).run(req);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure values from the request body
    const { email, firstName, lastName, password } = req.body;

    // Check if the email is already registered in the database
    const isEmailRegistered = await Users.findOne({
      where: {
        email: email,
      },
    });

    const isUsernameRegistered = await Users.findOne({
      where: {
        username: username,
      },
    });

    if (isEmailRegistered) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (isUsernameRegistered) {
      return res.status(402).json({ error: "Username has been registered" });
    }

   
    // Initialize an empty array for user roles
    let roles = [];

    // If 'role' is provided, query the database for role information
    if (role) {
      roles = await Roles.findAll({
        where: {
          role: Array.isArray(role) ? role : [role],
        },
      });
    }

    // Query the database for the default user role ('user')
    let defaultRole = await Roles.findOne({
      where: {
        role: "user",
      },
    });

    // Hash the user's password for storage
    const hashedPassword = await bcrypt.hash(password, 10);

    //const result = await cloudinary.uploader.upload(req.file.path, { folder: "artsMarket" });

    // Create a new user in the database
    const user = await Users.create({
      email,
      first_name: firstName,
      last_name: lastName,
      username,
      password: hashedPassword,
      registrationToken,
      registrationTimestamp,
      image: `${baseUrl}/${path.join(
        "Images",
        "blank-profile-picture-gab6c06e5a_1920.png"
      )}`,
      cover_photo: `${baseUrl}/${path.join(
        "Images",
        "blank-profile-picture-gab6c06e5a_1920.png"
      )}`,
    });


    // Set the user's roles based on the retrieved roles or defaultRole
    await user.setRoles(roles.length > 0 ? roles : [defaultRole]);

    // Retrieve the user's roles and extract role names
    const userRole = await user.getRoles();
    const roleNames = userRole.map((role) => role.role);


    await user.save();

    // Send a registration link to the user's email (commented out)
    // await sendRegistrationLinkToEmail(email, registrationToken, registrationTimestamp);

    // Send a success response
    res.json({
      message: "User created successfully and registration link sent to email",
    });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  register,
};