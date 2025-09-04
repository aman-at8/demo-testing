const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent, deleteStudent } = require("./students-service");
const { ApiError } = require("../../utils");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll, page = 1, limit = 10 } = req.query;
    
    // Validate query parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    
    const payload = {
        name: name?.trim(),
        className: className?.trim(),
        section: section?.trim(),
        roll: roll ? parseInt(roll) : undefined
    };

    // Remove undefined values
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    try {
        const students = await getAllStudents(payload);
        
        res.status(200).json({
            success: true,
            data: students,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: students.length
            }
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to retrieve students");
    }
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const { reporterId, basicDetails, additionalDetails } = req.body;
    
    // Validate required fields
    if (!reporterId) {
        throw new ApiError(400, "Reporter ID is required");
    }
    
    if (!basicDetails || !basicDetails.name || !basicDetails.email) {
        throw new ApiError(400, "Name and email are required");
    }

    // Sanitize and validate email
    const email = basicDetails.email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Transform data to match database function expectations
    const dbPayload = {
        operationType: "add",
        reporterId: parseInt(reporterId),
        name: basicDetails.name.trim(),
        email: email,
        roleId: 3, // Student role ID
        ...additionalDetails,
        // Map field names to match database function
        class: additionalDetails?.className,
        section: additionalDetails?.sectionName
    };

    // Remove undefined values and original field names to avoid conflicts
    delete dbPayload.className;
    delete dbPayload.sectionName;
    Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);

    // Validate and sanitize additional details if provided
    if (additionalDetails) {
        if (additionalDetails.phone && !/^\+?[1-9]\d{1,14}$/.test(additionalDetails.phone)) {
            throw new ApiError(400, "Invalid phone number format");
        }
        if (additionalDetails.roll && (isNaN(additionalDetails.roll) || additionalDetails.roll <= 0)) {
            throw new ApiError(400, "Roll number must be a positive integer");
        }
    }

    try {
        console.debug({dbPayload});
        const result = await addNewStudent(dbPayload);
        
        res.status(201).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to add student");
    }
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reporterId, basicDetails, additionalDetails } = req.body;
    
    const studentId = parseInt(id);
    if (isNaN(studentId) || studentId <= 0) {
        throw new ApiError(400, "Invalid student ID");
    }
    
    if (!reporterId) {
        throw new ApiError(400, "Reporter ID is required");
    }
    
    if (!basicDetails || !basicDetails.name || !basicDetails.email) {
        throw new ApiError(400, "Name and email are required");
    }

    // Sanitize and validate email
    const email = basicDetails.email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Transform data to match database function expectations
    const dbPayload = {
        operationType: "update",
        reporterId: parseInt(reporterId),
        userId: studentId,
        name: basicDetails.name.trim(),
        email: email,
        roleId: 3, // Student role ID
        ...additionalDetails,
        // Map field names to match database function
        class: additionalDetails?.className,
        section: additionalDetails?.sectionName
    };

    // Remove undefined values and original field names to avoid conflicts
    delete dbPayload.className;
    delete dbPayload.sectionName;
    Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);

    // Validate and sanitize additional details if provided
    if (additionalDetails) {
        if (additionalDetails.phone && !/^\+?[1-9]\d{1,14}$/.test(additionalDetails.phone)) {
            throw new ApiError(400, "Invalid phone number format");
        }
        if (additionalDetails.roll && (isNaN(additionalDetails.roll) || additionalDetails.roll <= 0)) {
            throw new ApiError(400, "Roll number must be a positive integer");
        }
    }

    try {
        const result = await updateStudent(dbPayload);
        
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to update student");
    }
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const studentId = parseInt(id);
    if (isNaN(studentId) || studentId <= 0) {
        throw new ApiError(400, "Invalid student ID");
    }

    try {
        const student = await getStudentDetail(studentId);
        
        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to retrieve student details");
    }
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.debug({id})
    const { status, reviewerId } = req.body;
    
    const studentId = parseInt(id);
    if (isNaN(studentId) || studentId <= 0) {
        throw new ApiError(400, "Invalid student ID");
    }
    
    if (typeof status !== 'boolean') {
        throw new ApiError(400, "Status must be a boolean value");
    }
    
    if (!reviewerId || isNaN(parseInt(reviewerId)) || parseInt(reviewerId) <= 0) {
        throw new ApiError(400, "Valid reviewer ID is required");
    }

    const payload = {
        userId: studentId,
        reviewerId: parseInt(reviewerId),
        status: status
    };

    try {
        const result = await setStudentStatus(payload);
        
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to update student status");
    }
});

const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const studentId = parseInt(id);
    if (isNaN(studentId) || studentId <= 0) {
        throw new ApiError(400, "Invalid student ID");
    }

    try {
        const result = await deleteStudent(studentId);
        
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to delete student");
    }
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent,
};
