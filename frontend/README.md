# Pharmaceutical QMS - AI-Powered Complaint Intake Frontend

A modern, enterprise-grade React frontend for the Pharmaceutical Quality Management System (QMS) Complaint Intake module.

## Features

✨ **Two-Column Layout**
- Left: Comprehensive complaint form with 4 sections
- Right: AI-powered complaint extraction and chat interface

🧠 **AI Integration**
- Document upload (PDF, DOCX, TXT, EML)
- Drag-and-drop file handling
- Text paste for email/document content
- Real-time extraction progress indicator
- AI chat for complaint analysis

📋 **Complaint Form**
- Origin & Customer Details
- Product & Batch Identification
- Complaint Details with full description
- Initial Assessment & Priority
- Real-time validation
- Auto-populated from AI extraction

🎨 **Modern UI/UX**
- Enterprise healthcare design
- Tailwind CSS styling
- Google Inter font family
- Responsive layout
- Accessibility features (ARIA labels)
- Loading states and animations

⚙️ **State Management**
- Redux Toolkit for predictable state management
- Separate slices for complaint, extraction, and chat
- Custom hooks for form and file handling
- Type-safe Redux setup

## Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── ComplaintIntakeSystem.tsx    # Main system component
│   │   ├── ComplaintIntakeForm.tsx      # Form component
│   │   ├── AIAssistantPanel.tsx         # AI panel component
│   │   ├── FileUploadZone.tsx           # Drag-drop file upload
│   │   ├── TextInputArea.tsx            # Text paste area
│   │   ├── ExtractionProgress.tsx       # Progress indicator
│   │   ├── ChatComponent.tsx            # AI chat interface
│   │   ├── OriginCustomerSection.tsx    # Form section 1
│   │   ├── ProductBatchSection.tsx      # Form section 2
│   │   ├── ComplaintDetailsSection.tsx  # Form section 3
│   │   ├── AssessmentSection.tsx        # Form section 4
│   │   ├── FormInput.tsx                # Input component
│   │   ├── FormSelect.tsx               # Select component
│   │   └── FormTextArea.tsx             # TextArea component
│   │
│   ├── redux/                # Redux store and slices
│   │   ├── store.ts          # Store configuration
│   │   └── slices/
│   │       ├── complaintSlice.ts        # Complaint state
│   │       ├── extractionSlice.ts       # Extraction state
│   │       └── chatSlice.ts             # Chat state
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useComplaintForm.ts          # Form hook
│   │   └── useFileUpload.ts             # File upload hook
│   │
│   ├── utils/                # Utility functions
│   │   ├── validation.ts     # Form validation
│   │   └── formHelpers.ts    # Form helpers
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts          # Type definitions
│   │
│   ├── styles/               # Global styles
│   │   └── index.css         # Tailwind + custom CSS
│   │
│   ├── App.tsx               # App component
│   ├── index.tsx             # Entry point
│   └── index.css             # Global styles
│
├── public/
│   └── index.html            # HTML template
│
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
└── README.md                 # This file
```

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Opens http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory

## Components Overview

### Main System (`ComplaintIntakeSystem`)
- Two-column layout container
- Manages overall structure
- Responsive at 1024px breakpoint

### Complaint Form (`ComplaintIntakeForm`)
- 4-section form with validation
- Real-time error display
- Auto-reset and save functionality
- Placeholder text: "Awaiting AI extraction..."

### AI Assistant Panel (`AIAssistantPanel`)
- File upload with drag-and-drop
- Text paste area
- Extraction progress indicator
- AI chat interface
- Tabs for extraction and chat

### Form Sections
1. **OriginCustomerSection** - Complaint source and customer name
2. **ProductBatchSection** - Product details and batch information
3. **ComplaintDetailsSection** - Complaint type, date, and description
4. **AssessmentSection** - Severity and priority assessment

### Input Components
- **FormInput** - Text, date, email inputs
- **FormSelect** - Dropdown selections
- **FormTextArea** - Multi-line text input

### AI Components
- **FileUploadZone** - Drag-drop file upload (PDF, DOCX, TXT, EML)
- **TextInputArea** - Paste complaint text/email
- **ExtractionProgress** - Visual progress indicator (0-100%)
- **ChatComponent** - AI-powered conversation interface

## Redux State Structure

### Complaint State
```typescript
{
  form: ComplaintFormData,
  isLoading: boolean,
  error: string | null
}
```

### Extraction State
```typescript
{
  isExtracting: boolean,
  progress: number,        // 0-100
  status: 'idle' | 'uploading' | 'extracting' | 'completed' | 'error',
  error: string | null,
  extractedText: string | null,
  uploadedFileName: string | null
}
```

### Chat State
```typescript
{
  messages: ChatMessage[],
  isLoading: boolean,
  error: string | null
}
```

## Styling

### Tailwind CSS
- Custom Inter font configuration
- Extended color palette
- Custom component classes
- Responsive utilities

### Theme
- Primary: Blue (#2563eb)
- Secondary: Slate (#64748b)
- Backgrounds: Gray scale (50-950)

### Custom Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.form-control` - Form input/select style
- `.badge-critical`, `.badge-high`, etc. - Status badges

## Form Validation

The form includes client-side validation for:
- Required fields (origin source, product name, batch number, etc.)
- Date format and logic (expiry after mfg date)
- Text length limits (description max 2000 chars)
- Field-specific error messages

## Type Safety

Full TypeScript support with:
- Strict mode enabled
- Redux type inference
- Component prop types
- State type definitions
- Custom hooks with proper typing

## Accessibility

- ARIA labels on form inputs
- Semantic HTML structure
- Focus management
- Keyboard navigation support
- Error messages linked to inputs

## Performance Optimizations

- React memoization on components
- Redux selector optimization
- Lazy loading of components (can be added)
- CSS-in-JS minimization
- Tree-shaking with Tailwind

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## API Integration

Ready to connect to backend API at:
- Extract endpoint: `POST /api/extract`
- Complaints endpoint: `POST /api/complaints`
- Chat endpoint: `POST /api/chat`

Update API URLs in:
- `src/utils/validation.ts` - API configuration
- `src/hooks/useFileUpload.ts` - File upload API calls
- `src/components/ChatComponent.tsx` - Chat API calls

## Environment Variables

Create `.env` file in frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run eject    # Eject from create-react-app
```

## Dependencies

- **react** - UI library
- **react-redux** - State management
- **@reduxjs/toolkit** - Redux utilities
- **tailwindcss** - CSS framework
- **date-fns** - Date utilities
- **axios** - HTTP client (for API calls)
- **classnames** - Utility for conditional classes

## Development Dependencies

- **typescript** - Type checking
- **react-scripts** - Build scripts
- **@types/react** - React type definitions
- **@types/node** - Node type definitions

## Best Practices

1. **Component Structure** - Keep components focused and reusable
2. **State Management** - Use Redux for shared state, local state for UI
3. **Type Safety** - Always use TypeScript types
4. **Validation** - Validate on client and server
5. **Accessibility** - Use semantic HTML and ARIA labels
6. **Performance** - Use React.memo for expensive components
7. **Error Handling** - Provide user-friendly error messages
8. **Testing** - Write tests for critical functionality

## Future Enhancements

- [ ] File preview before extraction
- [ ] Batch complaint upload
- [ ] Export complaints to PDF/CSV
- [ ] Complaint history timeline
- [ ] Advanced filtering and search
- [ ] Real-time collaboration
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA) features

## Troubleshooting

### Port 3000 already in use
```bash
PORT=3001 npm run dev
```

### Node modules issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not loading
```bash
npm run build
npm run dev
```

### Redux DevTools
Install Redux DevTools browser extension for debugging state changes

## Support

For issues or questions:
1. Check component documentation in code
2. Review Redux slices for state management
3. Check validation utilities for form rules
4. Review API integration in hooks

## License

Proprietary - Pharmaceutical QMS Project

## Version

Frontend Version: 1.0.0
Built: July 22, 2026

---

**Ready to build incredible complaint management systems!** 🚀
