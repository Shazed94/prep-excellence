# Active Module Implementation Summary

## Overview

Updated the SAT Practice exam flow to use the `activeModule` data from the revised API response. The system now properly handles module-based question rendering and navigation flow.

## Key Changes

### 1. State Management

**Before:**

```tsx
const [currentSectionProgressId, setCurrentSectionProgressId] = useState("");
const [currentModuleId, setCurrentModuleId] = useState("");
```

**After:**

```tsx
const [activeModule, setActiveModule] = useState<any>(null);
```

### 2. Questions Mapping

The questions are now built from `activeModule` instead of iterating through all sections and modules:

```tsx
const questions: Question[] = useMemo(() => {
  if (!activeModule?.module) return [];

  let qNum = 1;
  const qs: Question[] = [];
  const module = activeModule.module;
  const usedSet = activeModule.usedQuestionSet || "SET_ONE";

  const qbs =
    usedSet === "SET_ONE" ? module.questionsSetOne : module.questionsSetTwo;
  const sortedQbs = [...qbs].sort((a, b) => a.orderIndex - b.orderIndex);

  for (const qb of sortedQbs) {
    qs.push({
      id: qb.id,
      questionNumber: qNum++,
      text: qb.content,
      options: [...qb.options]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((o) => ({
          id: o.id,
          label: String.fromCharCode(65 + o.orderIndex),
          text: o.content,
        })),
      moduleId: module.id,
    });
  }

  return qs;
}, [activeModule]);
```

### 3. Navigation Flow

The updated navigation flow follows this sequence:

```
Question 1 → Question 2 → ... → Last Question → Check Your Work → Break Page → Complete
```

**handleNext Logic:**

- If on "check-work" page → Navigate to "break" page
- If not the last question → Navigate to next question
- If last question → Navigate to "check-work" page

### 4. Timer Management

Timer now uses `activeModule.sectionProgress` data:

```tsx
useEffect(() => {
  if (!showPreview && activeModule?.sectionProgress) {
    const sectionProg = activeModule.sectionProgress;
    if (sectionProg.startedAt) {
      const started = new Date(sectionProg.startedAt).getTime();
      const elapsed = (Date.now() - started) / 1000;
      const remaining = sectionProg.section.duration * 60 - elapsed;
      setTimeRemaining(Math.max(0, Math.floor(remaining)));
    } else {
      setTimeRemaining(sectionProg.section.duration * 60);
    }
  }
}, [activeModule, showPreview]);
```

### 5. Header Display

Section and module names are now pulled from activeModule:

```tsx
<h1 className="text-2xl font-semibold">
  {activeModule.sectionProgress.section.name} - {activeModule.module.name}
</h1>
```

### 6. API Response Handling

When creating an attempt, the activeModule is extracted and stored:

```tsx
onSuccess: (response) => {
  setAttempt(response);
  setActiveModule(response.data.activeModule);
  setShowPreview(false);
};
```

## API Response Structure Expected

```json
{
  "success": true,
  "data": {
    "attempt": { ... },
    "activeModule": {
      "id": "...",
      "moduleId": "...",
      "status": "IN_PROGRESS",
      "usedQuestionSet": "SET_ONE",
      "module": {
        "id": "...",
        "name": "Module 1 basic",
        "questionsSetOne": [...],
        "questionsSetTwo": [...]
      },
      "sectionProgress": {
        "id": "...",
        "section": {
          "id": "...",
          "name": "Section 1",
          "duration": 5
        }
      }
    }
  }
}
```

## Flow Diagram

```
Start Test
    ↓
Preview Page (Select Test Type)
    ↓
First Question of Module
    ↓
Navigate through questions (Next/Back)
    ↓
Last Question of Module
    ↓
Check Your Work Page
    ↓
Break Page (90 seconds countdown)
    ↓
Resume/Complete
```

## Backend Integration Notes

1. **Resume Functionality**: When resuming, the backend should return the same structure with the current activeModule
2. **Next Module**: After break, the backend should provide the next module in the activeModule field
3. **Module Completion**: The backend should track when a module is completed and provide the next one

## Testing Checklist

- [ ] Questions render correctly from activeModule
- [ ] Navigation works: Next button advances through questions
- [ ] Last question triggers "Check Your Work" page
- [ ] "Check Your Work" page shows correct summary
- [ ] Clicking Next on "Check Your Work" goes to Break page
- [ ] Break page countdown works (90 seconds)
- [ ] Timer displays correctly based on section duration
- [ ] Section and Module names display in header
- [ ] Answer selection persists across navigation
- [ ] Mark for review works correctly
- [ ] Strikethrough feature works
- [ ] Back button disabled on first question
- [ ] Time auto-triggers break when reaching 0

## Future Enhancements

1. Add API call to fetch next module after break
2. Handle multiple modules per section
3. Add progress saving to backend
4. Implement answer submission on module completion
5. Add scoring calculation
