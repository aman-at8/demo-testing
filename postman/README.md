# Student Management API - Postman Testing Guide

This directory contains Postman collection and environment files for testing the Student Management API endpoints.

## Files Included

1. **Student_Management_API.postman_collection.json** - Complete collection of API requests
2. **Student_Management_Environment.postman_environment.json** - Environment variables
3. **README.md** - This guide

## Setup Instructions

### 1. Import Files to Postman

1. Open Postman
2. Click "Import" button
3. Select both JSON files:
   - `Student_Management_API.postman_collection.json`
   - `Student_Management_Environment.postman_environment.json`
4. Click "Import"

### 2. Set Environment

1. In the top-right corner of Postman, select "Student Management Environment"
2. Verify the environment variables are loaded correctly

### 3. Start Backend Server

Make sure your backend server is running:
```bash
cd backend
npm start
```

Server should be running on `http://localhost:5007`

## Testing Workflow

### Step 1: Authentication (CRITICAL!)
**IMPORTANT:** You MUST login first to get both authentication cookies AND CSRF token.

1. Go to **Authentication** folder
2. Run **Login** request first
3. Check the console - you should see "CSRF Token extracted and saved"
4. Verify in Environment that `csrfToken` variable is populated
5. All subsequent requests will automatically include the CSRF token

### Step 2: Test CRUD Operations

The collection is organized into these sections:

#### **Students CRUD**
- **Get All Students** - Retrieve all students
- **Get All Students with Filters** - Test pagination and filtering
- **Create New Student** - Add a new student with full details
- **Create Student - Minimal Data** - Add student with required fields only
- **Get Student by ID** - Retrieve specific student details
- **Update Student** - Modify student information
- **Change Student Status** - Activate/deactivate student accounts
- **Delete Student** - Soft delete (deactivate) student

#### **Validation Tests**
- **Invalid Email Format** - Test email validation
- **Missing Required Fields** - Test required field validation
- **Invalid Phone Number** - Test phone format validation
- **Invalid Student ID** - Test ID parameter validation
- **Non-existent Student** - Test 404 error handling

## Important Notes

### Authentication & Security
- All student endpoints require authentication AND CSRF tokens
- **ALWAYS LOGIN FIRST** - This extracts the CSRF token automatically
- CSRF tokens are handled automatically via pre-request scripts
- The login response sets both authentication cookies and CSRF token

### Student ID Variable
- Update the `studentId` environment variable with actual student IDs from your database
- You can get valid student IDs by running "Get All Students" first

### Expected Status Codes
- **200 OK** - Successful GET, PUT, POST operations
- **201 Created** - Successful student creation
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Authentication required
- **404 Not Found** - Student not found
- **500 Internal Server Error** - Server errors

## Sample Request Bodies

### Create Student (Full Details)
```json
{
    "operationType": "add",
    "reporterId": 1,
    "basicDetails": {
        "name": "John Doe",
        "email": "john.doe@student.com",
        "roleId": 3
    },
    "additionalDetails": {
        "gender": "Male",
        "phone": "+1234567890",
        "dob": "2005-01-15",
        "className": "Grade 10",
        "sectionName": "A",
        "roll": 101,
        "fatherName": "Robert Doe",
        "fatherPhone": "+1234567891",
        "currentAddress": "123 Main St, City, State"
    }
}
```

### Update Student Status
```json
{
    "status": true,
    "reviewerId": 1
}
```

## Testing Tips

1. **Run in Order**: Start with Login, then test CRUD operations
2. **Check Response Body**: Verify the response structure and data
3. **Test Validation**: Use the validation tests to ensure error handling works
4. **Update Variables**: Modify environment variables as needed for your setup
5. **Monitor Logs**: Check server console for any backend errors

## Troubleshooting

### Common Issues

1. **400 "Invalid csrf token"** 
   - **Solution**: Run Login request first to extract CSRF token
   - Check Postman Console for "CSRF Token extracted and saved" message
   - Verify `csrfToken` environment variable is populated
   - Ensure pre-request script is adding `X-CSRF-Token` header

2. **403 "Forbidden. CSRF token mismatch"**
   - **Solution**: Login again to get fresh CSRF token
   - CSRF tokens expire with access tokens
   - Check that the correct CSRF token is being sent

3. **401 Unauthorized**
   - **Solution**: Run Login request first
   - Check if authentication cookies are being sent
   - Verify cookies haven't expired

4. **400 Validation Error**
   - **Solution**: Check request body format
   - Ensure required fields are included
   - Check field types match schema requirements

5. **404 Student Not Found**
   - **Solution**: Update studentId environment variable with valid ID
   - Run "Get All Students" to find valid IDs

6. **500 Server Error**
   - **Solution**: Check backend server logs
   - Ensure database is running and connected

### Database Setup
Make sure you have:
1. PostgreSQL database created and running
2. Database schema loaded from `seed_db/tables.sql`
3. Sample data loaded from `seed_db/seed-db.sql`

## Environment Variables Reference

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `http://localhost:5007/api/v1` | API base URL |
| `studentId` | `4` | Student ID for testing (update as needed) |
| `userId` | (auto-set) | Current user ID from login |
| `adminEmail` | `admin@school-admin.com` | Admin login email |
| `adminPassword` | `3OU4zn3q6Zh9` | Admin login password |

Happy Testing! 🚀