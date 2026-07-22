# Frontend Architecture - Pharmaceutical QMS Complaint Intake System

## System Overview

The frontend is a React-based Single Page Application (SPA) with a two-column layout for complaint intake and AI-powered extraction.

```
┌─────────────────────────────────────────────────────┐
│         Complaint Intake System (App.tsx)           │
├────────────────────┬────────────────────────────────┤
│                    │                                │
│  LEFT COLUMN       │    RIGHT COLUMN               │
│  (Complaint Form)  │    (AI Assistant Panel)       │
│                    │                                │
│ ┌──────────────┐   │ ┌──────────────────────────┐ │
│ │ Origin &     │   │ │ File Upload Zone         │ │
│ │ Customer     │   │ └──────────────────────────┘ │
│ ├──────────────┤   │ ┌──────────────────────────┐ │
│ │ Product &    │   │ │ Text Input Area          │ │
│ │ Batch        │   │ └──────────────────────────┘ │
│ ├──────────────┤   │ ┌──────────────────────────┐ │
│ │ Complaint    │   │ │ Extraction Progress      │ │
│ │ Details      │   │ └──────────────────────────┘ │
│ ├──────────────┤   │ ┌──────────────────────────┐ │
│ │ Assessment   │   │ │ Chat Component           │ │
│ ├──────────────┤   │ └──────────────────────────┘ │
│ │ Actions      │   │                              │
│ │ (Save/Reset) │   │                              │
│ └──────────────┘   │                              │
│                    │                              │
└────────────────────┴────────────────────────────────┘
```

## Component Hierarchy

```
App
└── Provider (Redux)
    └── ComplaintIntakeSystem (Main Container)
        ├── ComplaintIntakeForm (Left Column)
        │   ├── OriginCustomerSection
        │   ├── ProductBatchSection
        │   ├── ComplaintDetailsSection
        │   ├── AssessmentSection
        │   └── FormActions (Buttons)
        │
        └── AIAssistantPanel (Right Column)
            ├── FileUploadZone
            ├── TextInputArea
            ├── ExtractionProgress
            └── ChatComponent
                └── Chat Messages Display
```

## Data Flow

### Complaint Form Data Flow

```
User Input
    ↓
FormInput/FormSelect/FormTextArea Component
    ↓
updateField Action
    ↓
Redux complaintSlice
    ↓
Store State
    ↓
Component Re-render
    ↓
Form Display Update
```

### Extraction Data Flow

```
File Upload / Text Paste
    ↓
useFileUpload Hook
    ↓
uploadStart → uploadProgress → extractionSuccess
    ↓
Redux extractionSlice
    ↓
ExtractionProgress Component Updates
    ↓
When Complete: populateFormFromExtraction
    ↓
Redux complaintSlice
    ↓
Form Fields Auto-Populate
```

### Chat Interaction Flow

```
User Message
    ↓
ChatComponent (addMessage)
    ↓
Redux chatSlice
    ↓
Display User Message
    ↓
Generate AI Response (Mock)
    ↓
addMessage (Assistant Response)
    ↓
Redux chatSlice
    ↓
Display Assistant Message
```

## State Management Architecture

### Redux Store Structure

```
store
├── complaint (complaintSlice)
│   ├── form: ComplaintFormData
│   ├── isLoading: boolean
│   └── error: string | null
│
├── extraction (extractionSlice)
│   ├── isExtracting: boolean
│   ├── progress: number (0-100)
│   ├── status: 'idle' | 'uploading' | 'extracting' | 'completed' | 'error'
│   ├── error: string | null
│   ├── extractedText: string | null
│   └── uploadedFileName: string | null
│
└── chat (chatSlice)
    ├── messages: ChatMessage[]
    ├── isLoading: boolean
    └── error: string | null
```

### Redux Slices

#### complaintSlice
- **Actions**: 
  - `updateFormField` - Update single form field
  - `populateFormFromExtraction` - Populate from AI extraction
  - `resetForm` - Clear all fields
  - `setFormLoading` - Set loading state
  - `setFormError` - Set error message
  - `saveComplaintStart/Success/Error` - Save operations

#### extractionSlice
- **Actions**:
  - `uploadStart` - File upload started
  - `uploadProgress` - Upload progress update
  - `extractionStart/Progress/Success/Error` - Extraction workflow
  - `pasteTextSuccess` - Text paste completed
  - `resetExtraction` - Clear extraction state
  - `clearError` - Clear error message

#### chatSlice
- **Actions**:
  - `addMessage` - Add chat message
  - `setLoading` - Set loading state
  - `setError` - Set error
  - `clearChat` - Clear all messages
  - `updateLastMessage` - Update last message

## Custom Hooks

### useComplaintForm
Returns form state and actions:
```typescript
{
  form: ComplaintFormData,
  isLoading: boolean,
  error: string | null,
  updateField: (field, value) => void,
  populateFromExtraction: (data) => void,
  reset: () => void,
  setError: (error) => void,
  validate: () => ValidationResult
}
```

### useFileUpload
Returns file upload state and handlers:
```typescript
{
  extraction: ExtractionState,
  handleFileUpload: (file) => Promise<string>,
  handleTextPaste: (text) => Promise<string>,
  reset: () => void
}
```

## Component Communication

### Parent-Child Communication
- Props drilling minimized with Redux
- Components read state directly from Redux
- Actions dispatched for state updates

### Sibling Communication
- Both form and AI panel read/write to shared Redux store
- AI extraction populates form via Redux action
- Form state accessible in AI panel if needed

### Cross-Component Effects
- File upload triggers extraction
- Successful extraction populates form
- Chat can reference complaint context

## Form Validation Strategy

### Client-Side Validation
1. **Real-time field validation** - As user types
2. **On-submit validation** - Before saving
3. **Cross-field validation** - Date logic (expiry > mfg)
4. **Error display** - Field-level error messages

### Validation Rules
```typescript
- originSource: required
- productName: required
- batchNumber: required
- complaintType: required
- complaintDate: required, valid date
- description: required, max 2000 chars
- mfgDate: valid date
- expiryDate: valid date, after mfgDate
```

## Styling Architecture

### Tailwind CSS
- Component-level utility classes
- Custom config with Inter font
- Extended spacing, colors, animations
- Dark mode ready (not implemented)

### Component Styling Approach
- Inline Tailwind classes (no CSS files for components)
- CSS modules not used (Tailwind sufficient)
- Custom CSS only for:
  - Global styles
  - Animations
  - Scrollbar styling
  - Print styles

### Design System
- Color palette: Blue primary, Slate secondary, Gray scale
- Spacing: 4px grid system
- Typography: Inter font family
- Border radius: Consistent 6px-12px
- Shadows: Tailwind defaults
- Transitions: 200-300ms ease

## Type Safety

### TypeScript Configuration
- Strict mode enabled
- All components typed
- Redux slice types inferred from createSlice
- Custom type definitions in `types/index.ts`

### Key Types
```typescript
ComplaintFormData    // Form data structure
ChatMessage          // Chat message with role and timestamp
ExtractionStatus     // File/text extraction state
SeverityLevel        // 'Low' | 'Medium' | 'High' | 'Critical'
PriorityLevel        // 'Low' | 'Normal' | 'High'
```

## Performance Considerations

### Optimization Techniques
1. **Redux Selectors** - Memoized state selection
2. **Component Memoization** - React.memo for expensive components
3. **Event Handler Memoization** - useCallback for stable references
4. **Lazy Loading** - Can add React.lazy for code splitting
5. **Image Optimization** - SVG icons instead of images

### Rendering Efficiency
- Form components only re-render when their specific fields change
- Chat messages don't cause form re-renders
- Extraction progress doesn't affect form
- No unnecessary component mounts/unmounts

## Accessibility Features

### Form Accessibility
- `<label>` associated with `<input>` via `htmlFor`
- `aria-invalid` on form fields with errors
- `aria-describedby` linking errors to fields
- Semantic HTML structure
- Keyboard navigation support

### Chat Accessibility
- Proper heading hierarchy
- Focus management in message list
- Screen reader friendly messages
- Alt text for icons (via aria-label)

## Error Handling

### Error Scenarios
1. **Form Validation Errors** - Display inline
2. **File Upload Errors** - File size, type validation
3. **Extraction Errors** - Network, parsing issues
4. **Chat Errors** - API failures, timeouts
5. **Redux Errors** - Caught and logged

### Error Display
- Inline field errors (red text)
- Section-level error banners
- Toast notifications (can be added)
- Retry options for recoverable errors

## Testing Strategy

### Unit Tests (To Be Implemented)
- Redux slices and reducers
- Utility functions (validation, helpers)
- Custom hooks (useComplaintForm, useFileUpload)
- Components with mock Redux

### Integration Tests (To Be Implemented)
- Form submission flow
- File extraction workflow
- Chat interaction
- Redux integration

### E2E Tests (To Be Implemented)
- Complete user journey
- Two-column interaction
- Data persistence
- API integration

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Needed
- None for modern JavaScript features
- Tailwind handles CSS browser prefixes

## Deployment Considerations

### Build Process
```bash
npm run build
# Creates optimized production build
# Output: build/ directory
```

### Environment Variables
```env
REACT_APP_API_URL=http://api.example.com
REACT_APP_API_TIMEOUT=30000
```

### Performance Metrics
- Bundle size: ~350KB (gzipped ~90KB)
- First contentful paint: <1s
- Interaction to paint: <100ms
- Lighthouse score targets: >90

## Future Architecture Improvements

1. **Code Splitting** - Lazy load components
2. **State Persistence** - LocalStorage for draft saves
3. **Offline Support** - Service Worker / PWA
4. **Real-time Updates** - WebSocket integration
5. **Advanced Caching** - Redux persist + Redux Saga
6. **Error Tracking** - Sentry integration
7. **Analytics** - Google Analytics / custom events
8. **Internationalization** - i18n for multiple languages
9. **Dark Mode** - Theme switching system
10. **Mobile Responsive** - Mobile-first design updates

## Debugging

### Redux DevTools
- Install Redux DevTools browser extension
- View state changes in timeline
- Time-travel debugging
- Action history

### React DevTools
- Component tree inspection
- Prop and state viewing
- Performance profiling
- Hook debugging

### Console Logging
- All Redux actions logged in development
- Form submission details logged
- Error stack traces provided

## Performance Monitoring

### Key Metrics
- React render time
- Redux action dispatch time
- API response time
- Component re-render frequency

### Tools
- React Profiler DevTools
- Chrome Performance tab
- Redux DevTools time-travel debugging

---

This architecture provides a solid foundation for scalable, maintainable complaint intake functionality with excellent separation of concerns and type safety.
