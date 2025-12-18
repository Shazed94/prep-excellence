# Blog Component Testing Guide

## Quick Start Testing

### Prerequisites

```bash
# Start the development server
cd /home/sysadmin/Desktop/prepexcellence
pnpm dev
```

## Test Scenarios

### 1. Create New Blog (Happy Path)

**Steps:**

1. Navigate to `/dashboard/content-management/blogs-list`
2. Click "Create Blog" button
3. Fill in all fields:
   - Upload an image (JPG/PNG/WebP, < 5MB)
   - Enter title: "Test Blog Post"
   - Select a category from dropdown
   - Set status to "DRAFT" or "PUBLISHED"
   - Add tags: Type "javascript" and press Enter, Type "tutorial" and press Enter
   - Add content in rich text editor
4. Click "Create Blog"

**Expected Results:**

- ✅ Success toast: "Blog created successfully!"
- ✅ Redirect to blog list
- ✅ New blog appears in the list

### 2. Edit Existing Blog (Main Fix)

**Steps:**

1. Navigate to `/dashboard/content-management/blogs-list`
2. Click "Edit" on any existing blog
3. Observe the form

**Expected Results:**

- ✅ Loading spinner appears briefly
- ✅ Form loads with ALL fields populated:
  - Title field has the blog title
  - **Category dropdown shows the selected category** ← THIS WAS BROKEN
  - Status dropdown shows current status
  - Tags display above input field
  - Image preview shows existing image
  - Rich text editor shows blog content
- ✅ You can modify any field
- ✅ Click "Update Blog" → Success!

### 3. Edit Blog - Change Category

**Steps:**

1. Edit an existing blog
2. Change the category in dropdown
3. Click "Update Blog"

**Expected Results:**

- ✅ Category dropdown has all options
- ✅ Current category is pre-selected
- ✅ Can change to different category
- ✅ Update succeeds
- ✅ Success toast appears

### 4. Edit Blog - Keep Existing Image

**Steps:**

1. Edit an existing blog
2. Don't change the image
3. Modify title or other fields
4. Click "Update Blog"

**Expected Results:**

- ✅ Existing image preview shows
- ✅ Update works without re-uploading image
- ✅ Image remains unchanged in blog list

### 5. Edit Blog - Change Image

**Steps:**

1. Edit an existing blog
2. Click "Remove Image" button
3. Upload a new image
4. Click "Update Blog"

**Expected Results:**

- ✅ Can remove existing image
- ✅ Can upload new image
- ✅ Preview shows new image
- ✅ Update succeeds with new image

### 6. Image Validation Tests

**Test 6a: File Too Large**

1. Try to upload an image > 5MB
   **Expected:** ❌ Error toast: "Image size should not exceed 5MB"

**Test 6b: Wrong File Type**

1. Try to upload a .pdf or .txt file
   **Expected:** ❌ Error toast: "Please select a valid image file"

**Test 6c: Valid Image**

1. Upload JPG/PNG/WebP < 5MB
   **Expected:** ✅ Image preview appears

### 7. Tag Management Tests

**Test 7a: Add Tags**

1. Type "react" in tag input
2. Press Enter
3. Repeat with "typescript"
   **Expected:** ✅ Tags appear as badges above input

**Test 7b: Remove Tags**

1. Click X button on a tag
   **Expected:** ✅ Tag disappears

**Test 7c: Duplicate Tag**

1. Add tag "react"
2. Try to add "react" again
   **Expected:** ❌ Error toast: "Tag already exists"

### 8. Form Validation Tests

**Test 8a: Missing Required Fields (Create)**

1. Try to create blog without image
   **Expected:** ❌ Error toast: "Please select an image"

**Test 8b: Missing Title**

1. Submit form without title
   **Expected:** ❌ Form validation error under title field

**Test 8c: Missing Category**

1. Submit form without selecting category
   **Expected:** ❌ Form validation error under category field

### 9. Loading States

**Test 9a: Create Loading**

1. Click "Create Blog"
2. Observe button
   **Expected:** ✅ Button shows spinner and is disabled

**Test 9b: Update Loading**

1. Click "Update Blog"
2. Observe button
   **Expected:** ✅ Button shows spinner and is disabled

**Test 9c: Page Loading**

1. Navigate to edit page
2. Observe page
   **Expected:** ✅ Full-page spinner while loading

### 10. Cancel Functionality

**Steps:**

1. Start creating/editing a blog
2. Make some changes
3. Click "Cancel"

**Expected Results:**

- ✅ Returns to blog list
- ✅ Changes not saved

## Regression Tests (Make Sure Nothing Broke)

### Blog Categories Page

1. Navigate to `/dashboard/content-management/blog-categories`
2. Create a new category
3. Edit existing category
4. Delete a category
   **Expected:** All operations work smoothly

### Blog List Page

1. View blogs in list
2. Use pagination
3. View a blog (modal)
4. Delete a blog
   **Expected:** All features work correctly

## Browser Testing

Test in multiple browsers:

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

## Responsive Testing

Test at different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Performance Checks

### Network Tab

1. Open DevTools → Network
2. Edit a blog
3. Check requests

**Expected:**

- ✅ Categories fetch happens first
- ✅ Blog fetch happens second (if editId exists)
- ✅ Update request sends proper FormData
- ✅ No unnecessary refetches

### Console

1. Open DevTools → Console
2. Perform any action

**Expected:**

- ✅ No errors
- ✅ No warnings
- ✅ No CORS issues

## Edge Cases to Test

### 1. Network Failure

- Disconnect internet
- Try to create/update blog
  **Expected:** Error toast with meaningful message

### 2. Very Long Title

- Enter 500+ character title
  **Expected:** Validation prevents or handles gracefully

### 3. Special Characters in Tags

- Add tags with special chars: "#react", "@typescript"
  **Expected:** Tags save and display correctly

### 4. Rich Text Editor

- Add bold, italic, lists, links
- Upload images in editor
  **Expected:** All formatting preserved

### 5. Concurrent Edits

- Open same blog in two tabs
- Edit in both
  **Expected:** Last save wins (with proper invalidation)

## Bug Report Template

If you find issues, report with:

```markdown
**Bug:** [Brief description]

**Steps to Reproduce:**

1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**

- Browser: [Chrome 120, etc.]
- OS: [Linux, Windows, macOS]
- Screen Size: [1920x1080]

**Console Errors:**
[Any errors from DevTools console]
```

## Success Criteria

All tests should pass with:

- ✅ No console errors
- ✅ Smooth user experience
- ✅ Proper loading states
- ✅ Clear error messages
- ✅ Data persists correctly
- ✅ UI is responsive
- ✅ No race conditions
- ✅ Category dropdown works in edit mode (MAIN FIX)
- ✅ Blog updates successfully (MAIN FIX)
