const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const User = require("../models/user/userModel");
const bcrypt = require("bcryptjs");
const Task = require("../models/user/taskModel");
const Role = require("../models/user/roleModel");
const RoleTask = require("../models/user/roleTaskModel");
const Department = require("../models/user/departmentModel");
const token=require('../utils/jwtToken')

//Register User
//////////////////////////////////////////////////////////////////////////
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let { name, email, password, phone_no, role_id, designation, status } =
    req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      phone_no,
      role_id,
      designation,
      status,
    });
    if(user){

      res.send({ status:200,
        message: "Add user successfully",
      });
    }else{
      
    res.send({ status:409,
      message: "Failed",
    });
    }
  } catch (error) {
    res.status(409).json({ status:409,
      message: "Failed",
    });
  }
});
///////////////////////////////////////////////////////////////////////////////

// Login User
/////////////////////////////////////////////////////////////////////////////
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email or Password", 400));
  }

  const user = await User.findOne({ email })
    .select("+password")
    .populate("role_id");

  if (!user) {
    res.json({ success: false, message: "Invalid email or password" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const validPass = await bcrypt.compare(req.body.password, user.password);
  // console.log(hashedPassword);
  // console.log(user.password);
  if (!validPass) {
    res.json({ success: false, message: "Invalid email or password" });
  } else if (user.status !== true) {
    res.json({
      success: false,
      message:
        "Your account is inactive. Please contact our admin team at your earliest convenience",
    });
  } else {
    token(user,200,res)
    res.status(200).json({
      success: true,
      user,
      message: "Login Successfully",
    });
  }
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});
////////////////////////////////////////////////////////////////////////////////////

// get all users
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const name = req.params.roleName;
  if (name == "SuperAdmin") {
    const users = await User.find().populate("role_id");
    res.status(200).json({
      success: true,
      users,
    });
  } else {
    const users = await User.find({
      role_id: { $ne: "6539fc65e3d260f027857084" },
    }).populate("role_id");
    res.status(200).json({
      success: true,
      users,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////

// add task
////////////////////////////////////////////////////////////////////////////////////////////////
exports.addTask = catchAsyncErrors(async (req, res, next) => {
  const { name, icon_name, category, description } = req.body;
  console.log(req.body);
  try {
    const task = await Task.create({
      name,
      icon_name,
      category,
      description,
    });

    res.status(200).json({
      message: "Task Add Successfully",
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Task Already Register",
      });
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// add task
////////////////////////////////////////////////////////////////////////////////////////////////
exports.editTask = catchAsyncErrors(async (req, res, next) => {
  const { _id, name, icon_name, category, description } = req.body;
  console.log(req.body);
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      {
        name,
        icon_name,
        category,
        description,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task Add Successfully",
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Task Already Register",
      });
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// get AllTask
////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllTask = catchAsyncErrors(async (req, res, next) => {
  const task = await Task.find();
  console.log(task);
  res.status(200).json({
    task,
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// add role
////////////////////////////////////////////////////////////////////////////////////////////////
exports.addRole = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const role = await Role.create({
      name,
      description,
    });

    res.status(200).json({
      message: "Role Add Successfully",
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Role Already Register",
      });
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// Get role
////////////////////////////////////////////////////////////////////////////////////////////////
exports.getRole = catchAsyncErrors(async (req, res, next) => {
  if (req.params.roleName == "SuperAdmin") {
    const role = await Role.find();
    console.log(role);
    res.status(200).json({
      role,
    });
  } else {
    const role = await Role.find({ name: { $ne: "SuperAdmin" } });
    res.status(200).json({
      role,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// add Department
////////////////////////////////////////////////////////////////////////////////////////////////
exports.addDepartment = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const task = await Department.create({
      name,
      description,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Department Already Register",
      });
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// Get department
////////////////////////////////////////////////////////////////////////////////////////////////
exports.getDepartment = catchAsyncErrors(async (req, res, next) => {
  const department = await Department.find();
  res.status(200).json({
    department,
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// Assign Task To Role
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.assignTask = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const { role_id, task_id } = req.body;
  try {
    const roleTask = await RoleTask.create({
      role_id,
      task_id,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {}
});
////////////////////////////////////////////////////////////////////////////////////////////////////
// Remove Task To Role
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.removeRoleTask = catchAsyncErrors(async (req, res, next) => {
  const { role_id, task_id } = req.body;
  try {
    await RoleTask.deleteOne({ role_id, task_id });
    res.status(200).json({
      success: true,
    });
  } catch (error) {}
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// get Role Task
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.getRoleTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const role_id = req.params.role_id;
    const taskData = await RoleTask.find({ role_id });

    if (taskData.length != 0) {
      res.json(taskData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// get Role Task
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.getSpecificTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const role_id = req.params.role_id;

    const taskData = await RoleTask.find({ role_id }).populate(
      "task_id.task_id"
    );

    if (taskData.length != 0) {
      const taskArray = taskData[0].task_id;
      res.json(taskArray);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// user Role and status update
////////////////////////////////////////////////////////////////////////////////////////////////
exports.editUserDetail = catchAsyncErrors(async (req, res, next) => {
  let { _id, name, email, phone_no } = req.body;
  console.log(req.body);

  const result = await User.updateOne(
    { _id },
    { $set: { name, email, phone_no: parseInt(phone_no, 10) } }
  );

  return res
    .status(200)
    .json({ success: true, message: "User updated successfully" });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// change Password
////////////////////////////////////////////////////////////////////////////////////////////////
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const { _id, currentPassword, newPassword } = req.body;

  // Fetch the user from the database
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the current password provided matches the stored password
  const isPasswordCorrect = await user.checkPassword(currentPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "Current password is incorrect" });
  }

  // Generate a new hash for the new password
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  user.password = newHashedPassword;
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
});
//////////////////////////////////////////////////////////////////////////////////////////////////
