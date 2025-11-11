# Design System Engineer Intern - Take-Home Assignment

> 💡 **Getting Started:** Click the "Use this template" button above to create your own repository from this template, then follow the instructions below.

## 📋 About This Assignment

Welcome! This is a take-home assignment for the **Design System Engineer Intern** position at Workwize.

The goal of this assignment is to assess your understanding of:

- React and TypeScript fundamentals
- Component-driven development
- UI/UX sensibility and attention to detail
- Ability to work with existing codebases
- Code quality and best practices

## 🎯 The Role

As a **Design System Engineer Intern**, you'll be building and maintaining reusable UI components using **Shadcn**, creating a component library that supports multiple teams, and ensuring design consistency across our products.

### Key Responsibilities:

- Develop and maintain Shadcn-based UI components
- Create and maintain Storybook documentation
- Ensure components are accessible, responsive, and scalable
- Support engineering teams with reusable components
- Collaborate with designers and engineers

## 🚀 Your Assignment

You've been provided with a **Todo App** built with React, TypeScript, Material-UI, and React Query. Your task is to improve and extend this application while demonstrating your skills in component development and design systems thinking.

### Part 1: Component Refactoring (Required)

**Objective:** Improve the existing components with better design patterns and reusability.

**Tasks:**

1. **Refactor the `TodoItem` component** to be more flexible and reusable:
   - Extract the checkbox and delete button into separate, reusable components
   - Add prop types for better type safety and documentation
   - Consider accessibility (ARIA labels, keyboard navigation)
   - Add hover states and transitions for better UX

2. **Create a generic `Card` component** that can be used across the app:
   - Extract the common card styling from `TodoItem`
   - Make it flexible enough to be used in different contexts
   - Add variants (e.g., elevated, outlined, flat)
   - Include proper TypeScript types

3. **Improve the `SearchDialog`**:
   - Add keyboard shortcuts hint (e.g., "Press ESC to close")
   - Improve empty states and loading states
   - Add better error handling
   - Consider accessibility (focus management, screen reader support)

### Part 2: New Feature Implementation (Required)

**Objective:** Add a new feature that demonstrates your ability to build complete functionality.

**Task:** Implement a **"Todo Categories"** feature:

1. Add the ability to assign categories/tags to todos
2. Create a category selector component (dropdown, chips, or similar)
3. Add filtering by category
4. Store categories in the todo data structure
5. Update the API calls to support categories
6. Style it consistently with the existing design

**Requirements:**

- Use TypeScript throughout
- Maintain the existing optimistic updates pattern
- Follow the existing code style (Prettier/ESLint)
- Ensure the UI is responsive and accessible

### Part 3: Design System Documentation (Required)

**Objective:** Show your understanding of design systems and documentation.

**Task:** Create a `DESIGN_SYSTEM.md` file that documents:

1. **Component Inventory:**
   - List all reusable components in the app
   - Describe their purpose and when to use them
   - Include props documentation

2. **Design Tokens:**
   - Document the color palette (from the theme)
   - Document spacing scale
   - Document typography scale
   - Explain the theming approach (light/dark mode)

3. **Component Guidelines:**
   - Best practices for creating new components
   - Naming conventions
   - File structure conventions
   - Accessibility guidelines

4. **Future Improvements:**
   - What would you improve if you had more time?
   - What components are missing?
   - How would you organize a larger component library?

### Part 4: Bonus Challenges (Optional)

These are **optional** but will help you stand out:

1. **Add Storybook:**
   - Set up Storybook for the project
   - Create stories for at least 3 components
   - Include different variants and states

2. **Implement Drag-and-Drop:**
   - Allow reordering todos by dragging
   - Maintain optimistic updates during drag operations
   - Add visual feedback during drag

3. **Add Unit Tests:**
   - Write tests for at least 2 components
   - Test user interactions
   - Test edge cases

4. **Performance Optimization:**
   - Identify and fix any performance issues
   - Implement virtualization for long todo lists
   - Add loading skeletons

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Run linting:**

   ```bash
   npm run lint
   ```

4. **Format code:**

   ```bash
   npm run format
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

### Project Structure

```
src/
├── components/         # UI components
│   ├── Alert.tsx
│   ├── Header.tsx
│   ├── SearchDialog.tsx
│   ├── TodoInput.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   └── index.ts
├── hooks/             # React Query hooks and API
│   ├── todoApi.ts    # API functions
│   ├── todoSchema.ts # Zod schemas
│   ├── useTodos.ts   # React Query hooks
│   └── index.ts
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
├── ThemeContext.tsx  # Theme provider (light/dark mode)
└── theme.ts          # Material-UI theme configuration
```

### Key Technologies

- **React 17** - UI library
- **TypeScript** - Type safety
- **Material-UI v4** - Component library
- **React Query (TanStack Query)** - Server state management
- **Zod** - Schema validation
- **Vite** - Build tool
- **Prettier** - Code formatting
- **ESLint** - Code linting

### API

The app uses a backend API at `https://todo-placeholder.tlaurentiu.net`

#### Todo Endpoints

**`GET /todos`** - Fetch all todos

Query parameters:

- `completed` (boolean, optional): Filter by completion status
- `search` (string, optional): Search in todo titles (fuzzy search)
- `category` (string, optional): Filter by category ID
- `categories` (string, optional): Comma-separated category IDs (OR filter)

Response:

```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Complete project proposal",
    "completed": false,
    "categories": [{ "id": "work", "name": "Work", "color": "#3b82f6" }]
  }
]
```

**`GET /todos/:id`** - Fetch a single todo

Response:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Complete project proposal",
  "completed": false,
  "categories": [{ "id": "work", "name": "Work", "color": "#3b82f6" }]
}
```

**`POST /todos`** - Create a new todo

Request body:

```json
{
  "userId": 1,
  "title": "New todo",
  "completed": false,
  "categories": ["work", "urgent"]
}
```

Response: Created todo object with generated ID

**`PATCH /todos/:id`** - Update a todo

Request body (all fields optional):

```json
{
  "title": "Updated title",
  "completed": true,
  "categories": ["personal"]
}
```

Response: Updated todo object

**`DELETE /todos/:id`** - Delete a todo

Response: `204 No Content`

#### Category Endpoints

**`GET /categories`** - Fetch all categories

Query parameters:

- `search` (string, optional): Filter categories by name

Response:

```json
[
  { "id": "work", "name": "Work", "color": "#3b82f6" },
  { "id": "personal", "name": "Personal", "color": "#10b981" },
  { "id": "urgent", "name": "Urgent", "color": "#ef4444" }
]
```

**`POST /categories`** - Create a new category

Request body:

```json
{
  "name": "Shopping",
  "color": "#f59e0b"
}
```

Response: Created category object with generated ID

**Note:** All category endpoints are fully functional and ready to use!

## 📦 Submission Guidelines

### How to Get Started

1. **Use This Template:**
   - Click the **"Use this template"** button at the top of this repository
   - Create a new repository in your own GitHub account
   - Name it something like `design-system-assignment-yourname`
   - Make it **private** and add [@turculaurentiu91](https://github.com/turculaurentiu91) and [@gumacs92](https://github.com/orgs/goworkwize/people/gumacs92) to the project so we can review it.

2. **Set Up Locally:**
   - Clone your new repository to your local machine
   - Install dependencies: `npm install`
   - Start the dev server: `npm run dev`
   - Verify everything works before starting

3. **Make Your Changes:**
   - Implement the required features
   - Commit your changes regularly with clear, descriptive commit messages
   - Push your commits to your repository

4. **Documentation:**
   - Complete the `DESIGN_SYSTEM.md` file
   - Update this README if needed with setup instructions for new features
   - Add inline code comments where helpful

### What to Submit

Once you've completed the assignment:

1. **Ensure Your Repository:**
   - Is **public** and accessible
   - Has all your commits pushed
   - Has the latest code and documentation
   - Includes a completed `DESIGN_SYSTEM.md` file

2. **Create a Summary:**
   - Add a section at the top of this README (or in the repo description) with:
     - Your name
     - Brief summary of what you implemented
     - Any assumptions you made
     - What you would improve with more time
     - Estimated time spent on the assignment

3. **Submit to Hiring Manager:**
   - Communicate back to the hiering manager you are in contact with
   - Include the link to your GitHub repository
   - In the email, briefly introduce your work and any highlights you'd like us to focus on

### Evaluation Criteria

We'll evaluate your submission based on:

1. **Code Quality (30%):**
   - Clean, readable, and maintainable code
   - Proper TypeScript usage
   - Consistent code style (follows Prettier/ESLint)
   - Good component structure and organization

2. **Functionality (25%):**
   - All required features work correctly
   - No critical bugs
   - Proper error handling
   - Edge cases considered

3. **Design & UX (20%):**
   - Visually consistent with existing design
   - Good attention to detail
   - Responsive design
   - Smooth interactions and transitions

4. **Design Systems Thinking (15%):**
   - Component reusability
   - Clear props and APIs
   - Good documentation
   - Understanding of design tokens and patterns

5. **Accessibility (10%):**
   - Keyboard navigation
   - Screen reader support (ARIA labels)
   - Color contrast
   - Focus management

### Time Expectation

We expect this assignment to take **4-6 hours**. Don't spend more than **8 hours** on it.

If you run out of time:

- Focus on completing the required parts first
- Document what you would do with more time
- Quality over quantity - we prefer well-done core features over rushed bonus features

## 💡 Tips for Success

1. **Read the existing code first** - Understand the patterns and conventions used
2. **Start with the required tasks** - Bonus features are optional
3. **Test your changes** - Make sure everything still works
4. **Think reusability** - Consider how components could be used elsewhere
5. **Document your decisions** - Explain why you made certain choices
6. **Keep it simple** - Don't over-engineer, but don't under-engineer either
7. **Ask questions** - If anything is unclear, reach out to us

## 📞 Questions?

If you have any questions about the assignment, please reach out to:

**For technical questions:**  
**Laurentiu Turcu** - Senior Engineer  
Email: [laurentiu@goworkwize.com](mailto:laurentiu@goworkwize.com)

**For general questions or submission:**  
**Mohammad Mahabadi** - Engineering Manager  
Email: [mohammad.mahabadi@goworkwize.com](mailto:mohammad.mahabadi@goworkwize.com)

## 🙏 Thank You

Thank you for taking the time to complete this assignment. We're excited to see your work and learn more about your approach to component development and design systems!

Good luck! 🚀

---

**Note:** This is a real codebase used for evaluation purposes. All code will be reviewed confidentially and used solely for assessing your candidacy for the internship position.
