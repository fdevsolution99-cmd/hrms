import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

// Add new employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      joiningDate,
      gender,
      mobilenumber,
      designation,
      department,
      password,
      role,
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await newUser.save();

    // Save employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      joiningDate,
      gender,
      mobilenumber,
      designation,
      department,
    });

    await newEmployee.save();

    // === Send Welcome Email ===
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p>Dear ${name},</p>
        
        <p>Greetings from <b>Fdev Solutions Pvt Ltd</b>.</p>
        
        <p>We are pleased to provide you with your official email account credentials.<br/>
        Please find the details below:</p>
        
        <p>
          <b>Email Address (Username):</b> <a href="mailto:${email}" style="color: #0066cc;">${email}</a><br/>
          <b>Temporary Password:</b> ${password}<br/>
          <b>Webmail Login URL:</b> <a href="https://sg2plzcpnl509545.prod.sin2.secureserver.net:2096/webmaillogout.cgi" style="color: #0066cc;">https://sg2plzcpnl509545.prod.sin2.secureserver.net:2096/webmaillogout.cgi</a>
        </p>
        
        <p>Kindly log in using the above credentials and change your password immediately for security purposes.</p>
        
        <p>This email account will be used for all official communication within the organization. Please ensure that you maintain confidentiality and use it responsibly in accordance with company policies.</p>
        
        <p>If you face any issues accessing your account, please contact the IT/HR department at <a href="mailto:hr@fdevsol.com" style="color: #0066cc;">hr@fdevsol.com</a>.</p>
        
        <p>We welcome you to Fdev Solutions Pvt Ltd and wish you success in your role.</p>
        
        <p>Best regards,<br/>
        <b>HR Department</b><br/>
        Fdev Solutions Pvt Ltd<br/>
        Email: <a href="mailto:hr@fdevsol.com" style="color: #0066cc;">hr@fdevsol.com</a><br/>
        Website: <a href="https://www.fdevsol.com" style="color: #0066cc;">www.fdevsol.com</a></p>
      </div>
    `;

    sendEmail(email, "Your Official Email Account Credentials - Fdev Solutions Pvt Ltd", emailHtml);

    return res
      .status(200)
      .json({ success: true, message: "Employee created & Welcome email sent" });
  } catch (error) {
    console.error("Add employee error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error in adding employee" });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Get employees server error" });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    let employee = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Get employee server error" });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, employeeId, dob, gender, mobilenumber, designation, department, role, salary, joiningDate } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update user
    const updatedUserData = { name, email };
    await User.findByIdAndUpdate(user._id, updatedUserData);

    // Update employee
    await Employee.findByIdAndUpdate(id, {
      employeeId,
      dob,
      gender,
      mobilenumber,
      designation,
      department,
      role,
      joiningDate,
    });

    return res.status(200).json({ success: true, message: "Employee updated" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Update employee server error" });
  }
};

// Get employees by department
const fetchEmployeesByDepId = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Get employees by department server error",
    });
  }
};

// Get employee by ID or Name for auto-fetch
const getEmployeeByIdOrName = async (req, res) => {
  try {
    const { employeeId, employeeName } = req.query;

    if (!employeeId && !employeeName) {
      return res.status(400).json({ success: false, error: "Either employeeId or employeeName is required" });
    }

    let employee;
    if (employeeId) {
      employee = await Employee.findOne({ employeeId }).populate('userId', 'name');
    } else if (employeeName) {
      const user = await User.findOne({ name: { $regex: new RegExp(employeeName, 'i') } });
      if (user) {
        employee = await Employee.findOne({ userId: user._id }).populate('userId', 'name');
      }
    }

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    return res.status(200).json({
      success: true,
      employee: {
        employeeId: employee.employeeId,
        name: employee.userId.name
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update employee status
const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be either 'active' or 'inactive'"
      });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    await Employee.findByIdAndUpdate(id, {
      status,
      updatedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: `Employee status updated to ${status}`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Update employee status server error"
    });
  }
};

export {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  updateEmployeeStatus,
  fetchEmployeesByDepId,
  getEmployeeByIdOrName,
};
