const express = require("express");
const { registerUser,loginUser,addTask,addRole, addDepartment, getAllUser, getRole, getDepartment, getAllTask, assignTask, getRoleTask, removeRoleTask, getSpecificTask, editTask, editUserDetail, changePassword,} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// Post Route
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/loginUser").post(loginUser);
router.route("/registerUser").post(registerUser);
router.route("/addDepartment").post(addDepartment)
router.route("/addRole").post(addRole);
router.route("/addTask").post(addTask);
router.route("/AssignRoleTask").post(assignTask);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get Route
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/getAllUser/:roleName").get(getAllUser);
router.route("/getRole/:roleName").get(getRole);
router.route("/getDepartment").get(getDepartment);
router.route("/getAllTask").get(getAllTask);
router.route("/getRoleTask/:role_id").get(getRoleTask);
router.route("/getSpecificTask/:role_id").get(getSpecificTask);




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get delete
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/removeTaskFromRole").post(removeRoleTask);

//////////////////////////////////////////////////////////////////////////////////////////////
router.route("/editTask").put(editTask);
router.route("/editUserDetail").put(editUserDetail);
router.route("/changePassword").put(changePassword);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
