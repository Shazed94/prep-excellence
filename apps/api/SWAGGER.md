# API Documentation with Swagger

## Overview

The PrepExcellence API now includes interactive Swagger/OpenAPI documentation for easy API exploration and testing.

## Accessing the Documentation

### Interactive UI
Visit the Swagger UI at:
```
http://localhost:4000/api-docs
```

### JSON Specification
Get the raw OpenAPI JSON specification at:
```
http://localhost:4000/api-docs.json
```

## Features

- **Interactive Testing**: Test API endpoints directly from the browser
- **Authentication**: Supports JWT Bearer token authentication
- **Request/Response Examples**: See example payloads for all endpoints
- **Schema Validation**: View all request and response schemas
- **Filter & Search**: Explore endpoints by tags (Auth, Users, LMS, etc.)

## Using Authentication

Many endpoints require authentication. To test protected endpoints:

1. **Login**: Use the `/api/v1/auth/login` endpoint to get a token
2. **Authorize**: Click the "Authorize" button at the top right
3. **Enter Token**: Paste your token (without "Bearer" prefix)
4. **Test Endpoints**: All subsequent requests will include the token

Example:
```json
// 1. POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}

// 2. Copy the accessToken from response
// 3. Click "Authorize" and paste token
// 4. Now you can test protected endpoints
```

## Adding Documentation to New Endpoints

Use JSDoc-style comments above route definitions:

```typescript
/**
 * @swagger
 * /api/v1/example:
 *   get:
 *     summary: Brief description
 *     description: Detailed description of what the endpoint does
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/example', controller.handler);
```

## Available Tags

- **Health**: Health check and metrics endpoints
- **Auth**: Authentication and authorization
- **Users**: User management
- **Roles**: Role and permission management
- **Services**: Service management
- **LMS**: Learning Management System
- **Coaching**: Coaching sessions
- **One-to-One**: One-to-one sessions
- **Payments**: Payment processing

## Common Response Schemas

All error responses follow standard formats defined in `src/config/swagger.ts`:

- `UnauthorizedError` (401): Missing or invalid token
- `BadRequestError` (400): Validation errors
- `NotFoundError` (404): Resource not found
- `ServerError` (500): Internal server error

## Configuration

Swagger configuration is located at:
```
src/config/swagger.ts
```

Modify this file to:
- Update API metadata (title, version, description)
- Add/remove server URLs
- Define custom response schemas
- Add security schemes
- Configure tags

## Best Practices

1. **Always document new endpoints** as you create them
2. **Include request examples** for complex payloads
3. **Document all parameters** with types and descriptions
4. **Use standard response schemas** for consistency
5. **Tag endpoints appropriately** for easy navigation
6. **Include authentication requirements** when needed

## Examples

### Example 1: Simple GET endpoint
```typescript
/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [LMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
```

### Example 2: POST with authentication
```typescript
/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - instructorId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Web Development 101
 *               instructorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
```

## Troubleshooting

### Swagger UI not loading
- Check that the server is running
- Verify the port (default: 4000)
- Check browser console for errors

### Endpoints not showing
- Ensure JSDoc comments are properly formatted
- Check that route files are included in `swagger.ts` apis array
- Restart the server after adding new documentation

### Authentication not working
- Make sure to include only the token (not "Bearer token")
- Check token expiration
- Verify the token is valid

## Production Deployment

For production:

1. Update server URLs in `src/config/swagger.ts`
2. Consider adding authentication to `/api-docs` endpoint
3. Optionally disable Swagger in production:
   ```typescript
   if (config.nodeEnv !== 'production') {
     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   }
   ```

## Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)
