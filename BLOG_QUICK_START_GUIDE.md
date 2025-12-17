# Blog Management - Quick Start Guide

## 📋 Table of Contents

1. [Navigation Structure](#navigation-structure)
2. [Blog Categories](#blog-categories)
3. [Blog Posts](#blog-posts)
4. [Workflow](#workflow)

---

## 🗂️ Navigation Structure

The blog management system is accessible via the sidebar:

```
Dashboard
└── Content Management
    └── Blogs ▼
        ├── Blog Categories
        ├── All Blogs
        └── Create Blog
```

---

## 📁 Blog Categories

### Purpose

Categories help organize blog posts into logical groups (e.g., "SAT Tips", "College Admissions", "Study Guides").

### Access

**Path**: `/dashboard/content-management/blog-categories`

### Features

- **Create**: Click "Add Category" button → Enter name → Auto-generates slug
- **View**: See all categories with blog count
- **Edit**: Click pencil icon → Modify name
- **Delete**: Click trash icon → Confirm deletion

### UI Elements

```
┌─────────────────────────────────────────────────────┐
│  Blog Categories                    [+ Add Category] │
├─────────────────────────────────────────────────────┤
│  Name          │ Slug         │ Blogs │ Actions     │
├─────────────────────────────────────────────────────┤
│  SAT Tips      │ sat-tips     │   12  │  ✏️  🗑️     │
│  College Guide │ college-guide│    8  │  ✏️  🗑️     │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Blog Posts

### Create New Blog

**Path**: `/dashboard/content-management/create-blog`

#### Form Fields:

1. **Featured Image** (Required)

   - Upload image (JPG, PNG, WebP)
   - Max size: 5MB
   - Shows preview

2. **Title** (Required)

   - 5-200 characters
   - SEO-friendly

3. **Category** (Required)

   - Dropdown of existing categories
   - Must create categories first

4. **Status** (Required)

   - Draft: Hidden from public
   - Published: Visible to public
   - Archived: Hidden but saved

5. **Tags** (Optional)

   - Comma-separated values
   - Example: `SAT, Math, Tips`

6. **Description** (Required)
   - Rich text editor (Jodit)
   - Minimum 50 characters
   - Supports:
     - Text formatting (bold, italic, underline)
     - Links
     - Images
     - Lists
     - Code blocks
     - Tables

### View All Blogs

**Path**: `/dashboard/content-management/blogs-list`

```
┌───────────────────────────────────────────────────────────────────┐
│  Blog Posts                              [+ Create Blog]          │
├───────────────────────────────────────────────────────────────────┤
│  Title              │ Category │ Status    │ Comments │ Actions   │
├───────────────────────────────────────────────────────────────────┤
│  SAT Math Guide     │ SAT Tips │ PUBLISHED │    5     │  ✏️  🗑️  │
│  Study Tips         │ General  │ DRAFT     │    0     │  ✏️  🗑️  │
└───────────────────────────────────────────────────────────────────┘
```

### Edit Blog

1. Go to "All Blogs"
2. Click ✏️ (pencil icon)
3. Modify any fields
4. Click "Update Blog"

### Delete Blog

1. Go to "All Blogs"
2. Click 🗑️ (trash icon)
3. Confirm in dialog
4. Blog is permanently deleted

---

## 🔄 Workflow

### Recommended Order:

```
1. Create Categories
   ↓
2. Create Blog Post
   ↓
3. Upload Image
   ↓
4. Write Content
   ↓
5. Add Tags
   ↓
6. Set Status
   ↓
7. Save as Draft
   ↓
8. Review & Publish
```

### Typical Use Cases:

#### 📌 Use Case 1: New Blog Post

```
1. Click "Content Management > Blogs > Create Blog"
2. Upload featured image
3. Enter title: "10 Tips for SAT Math Success"
4. Select category: "SAT Tips"
5. Write content in editor
6. Add tags: "SAT, Math, Tips, Study"
7. Select status: "Draft"
8. Click "Create Blog"
9. Review the draft
10. Edit and change status to "Published"
```

#### 📌 Use Case 2: Update Existing Blog

```
1. Click "Content Management > Blogs > All Blogs"
2. Find the blog post
3. Click edit icon (✏️)
4. Make changes
5. Click "Update Blog"
```

#### 📌 Use Case 3: Organize Categories

```
1. Click "Content Management > Blogs > Blog Categories"
2. Review existing categories
3. Click "Add Category" to create new ones
4. Edit category names if needed
5. Delete unused categories
```

---

## 🎨 Status Badge Colors

- **DRAFT**: Gray badge - Blog is being worked on
- **PUBLISHED**: Blue badge - Blog is live and visible
- **ARCHIVED**: Outline badge - Blog is hidden but saved

---

## ⚙️ Technical Details

### Image Upload

- Handled via multipart/form-data
- Stored on server
- URL saved in database
- Preview shown before upload

### Rich Text Editor

- Powered by Jodit Editor
- 400px height by default
- Auto-saves content
- Supports HTML formatting

### Tags System

- Input as comma-separated text
- Parsed into array
- Stored as JSON in database
- Used for filtering and search

### Auto-Generated Fields

- **Slug**: Generated from category name or blog title
- **Author**: Automatically set from logged-in user
- **Timestamps**: createdAt, updatedAt automatically tracked

---

## 🚀 Quick Actions

| Action          | Keyboard Shortcut | Button Location              |
| --------------- | ----------------- | ---------------------------- |
| Create Category | -                 | Top right on Categories page |
| Create Blog     | -                 | Top right on All Blogs page  |
| Edit Item       | -                 | Row actions (✏️)             |
| Delete Item     | -                 | Row actions (🗑️)             |

---

## 💡 Tips

1. **Always create categories first** before creating blogs
2. **Use descriptive category names** for better organization
3. **Save as draft** if not ready to publish
4. **Add relevant tags** to improve searchability
5. **Use high-quality images** for better engagement
6. **Preview content** before publishing
7. **Update timestamps** are automatic - no manual tracking needed

---

## 🛠️ Troubleshooting

### Problem: Cannot create blog

- **Solution**: Ensure at least one category exists

### Problem: Image upload fails

- **Solution**: Check file size (max 5MB) and format (JPG, PNG, WebP)

### Problem: Content not saving

- **Solution**: Check minimum character requirements (title: 5, description: 50)

### Problem: Cannot delete category

- **Solution**: Remove all blogs using that category first

---

## 📊 Data Structure

```
BlogCategory
├── id (auto-generated)
├── name (user input)
├── slug (auto-generated from name)
├── createdAt (automatic)
├── updatedAt (automatic)
└── blogs[] (relation)

Blog
├── id (auto-generated)
├── title (user input)
├── categoryId (selected from dropdown)
├── image (file upload)
├── description (rich text)
├── status (DRAFT/PUBLISHED/ARCHIVED)
├── tags[] (comma-separated input)
├── slug (auto-generated from title)
├── authorId (from logged-in user)
├── createdAt (automatic)
├── updatedAt (automatic)
├── publishedAt (set when published)
└── comments[] (relation)
```

---

## 🎯 Best Practices

1. **Naming Conventions**

   - Use clear, descriptive titles
   - Keep category names short and broad
   - Use consistent tag naming

2. **Content Quality**

   - Minimum 50 characters for description
   - Use proper formatting in rich text editor
   - Add relevant images

3. **Organization**

   - Create logical categories
   - Use tags for cross-category topics
   - Archive old content instead of deleting

4. **Publishing Workflow**
   - Always save as draft first
   - Review content before publishing
   - Update status only when ready

---

## 📞 Support

For issues or questions, refer to:

- API Documentation: `/api/docs`
- Schema Files: `apps/api/prisma/schema/services.prisma`
- Validators: `packages/shared-validators/src/services.ts`
