const { z } = require("zod");

const GetAllStudentsSchema = z.object({
    query: z.object({
        name: z.string().optional(),
        className: z.string().optional(),
        section: z.string().optional(),
        roll: z.coerce.number().int().positive().optional(),
        page: z.coerce.number().int().positive().default(1).optional(),
        limit: z.coerce.number().int().positive().max(100).default(10).optional()
    }).optional()
});

const AddStudentSchema = z.object({
    body: z.object({
        operationType: z.literal("add"),
        reporterId: z.number().int().positive("Reporter ID is required"),
        basicDetails: z.object({
            name: z.string().min(1, "Name is required").max(100, "Name too long"),
            email: z.string().email("Invalid email format").max(100, "Email too long"),
            roleId: z.literal(3)
        }),
        additionalDetails: z.object({
            gender: z.enum(["Male", "Female", "Other"]).optional(),
            phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
            dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
            className: z.string().min(1).max(50).optional(),
            sectionName: z.string().min(1).max(50).optional(),
            roll: z.number().int().positive().optional(),
            fatherName: z.string().max(100).optional(),
            fatherPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid father phone number").optional(),
            motherName: z.string().max(100).optional(),
            motherPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid mother phone number").optional(),
            guardianName: z.string().max(100).optional(),
            guardianPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid guardian phone number").optional(),
            relationOfGuardian: z.string().max(50).optional(),
            currentAddress: z.string().max(500).optional(),
            permanentAddress: z.string().max(500).optional(),
            admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid admission date format (YYYY-MM-DD)").optional()
        }).optional()
    })
});

const UpdateStudentSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid student ID")
    }),
    body: z.object({
        operationType: z.literal("update"),
        reporterId: z.number().int().positive("Reporter ID is required"),
        userId: z.number().int().positive("User ID is required"),
        basicDetails: z.object({
            name: z.string().min(1, "Name is required").max(100, "Name too long"),
            email: z.string().email("Invalid email format").max(100, "Email too long"),
            roleId: z.literal(3) // Student role ID
        }),
        additionalDetails: z.object({
            gender: z.enum(["Male", "Female", "Other"]).optional(),
            phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
            dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
            className: z.string().min(1).max(50).optional(),
            sectionName: z.string().min(1).max(50).optional(),
            roll: z.number().int().positive().optional(),
            fatherName: z.string().max(100).optional(),
            fatherPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid father phone number").optional(),
            motherName: z.string().max(100).optional(),
            motherPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid mother phone number").optional(),
            guardianName: z.string().max(100).optional(),
            guardianPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid guardian phone number").optional(),
            relationOfGuardian: z.string().max(50).optional(),
            currentAddress: z.string().max(500).optional(),
            permanentAddress: z.string().max(500).optional(),
            admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid admission date format (YYYY-MM-DD)").optional(),
            systemAccess: z.boolean().optional()
        }).optional()
    })
});

const GetStudentDetailSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid student ID")
    })
});

const StudentStatusSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid student ID")
    }),
    body: z.object({
        status: z.boolean("Status must be a boolean"),
        reviewerId: z.number().int().positive("Reviewer ID is required")
    })
});

const DeleteStudentSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid student ID")
    })
});

module.exports = {
    GetAllStudentsSchema,
    AddStudentSchema,
    UpdateStudentSchema,
    GetStudentDetailSchema,
    StudentStatusSchema,
    DeleteStudentSchema
};