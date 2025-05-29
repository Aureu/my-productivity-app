# 🚀 My Productivity App

A modern, feature-rich task management application built with Next.js 15, TypeScript, and Tailwind CSS. This app helps you organize your tasks, manage projects, and boost your productivity with a clean, intuitive interface.

![Productivity App Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=My+Productivity+App)

## ✨ Features

### 📋 **Task Management**

- ✅ Create, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Rich task details (title, description, due date, priority)
- ✅ Task priorities with color-coded badges (High 🔴, Medium 🟡, Low 🟢)
- ✅ Due date tracking with overdue indicators
- ✅ Hierarchical subtasks with visual nesting
- ✅ Expand/collapse parent tasks to show/hide subtasks
- ✅ Direct subtask creation from parent tasks
- ✅ Automatic parent task inheritance for subtasks

### 📁 **Project Organization**

- ✅ Create and manage projects
- ✅ Edit project names inline
- ✅ Delete projects with task handling options
- ✅ Assign tasks to projects
- ✅ Filter tasks by project
- ✅ Project-based task organization

### 🔄 **Recurring Tasks**

- ✅ Daily, weekly, and monthly recurrence patterns
- ✅ Flexible recurrence rules (specific days, dates)
- ✅ Visual recurrence indicators

### 🔔 **Smart Reminders**

- ✅ Due date notifications
- ✅ Overdue task alerts
- ✅ Today's tasks highlighting

### 🎨 **Modern UI/UX**

- ✅ Clean, professional design with Tailwind CSS
- ✅ Responsive layout for all devices
- ✅ Smooth animations and hover effects
- ✅ Intuitive modal-based forms
- ✅ Accessibility-compliant design

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: Heroicons (SVG)
- **Data Storage**: In-memory (for demo purposes)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/my-productivity-app.git
   cd my-productivity-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action!

## 📖 Usage

### Creating Tasks

1. Click the "Add New Task" button
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Due Date** (optional)
   - **Priority** (None, Low, Medium, High)
   - **Project** (optional)
   - **Parent Task** (for subtasks)
   - **Recurrence** (None, Daily, Weekly, Monthly)
3. Click "Create Task"

### Managing Projects

1. **Create Projects**: Use the "New Project" button in the Projects section
2. **Edit Projects**:
   - Hover over any project button to reveal edit/delete icons
   - Click the edit icon (pencil) to rename the project inline
   - Press Enter to save or Escape to cancel
3. **Delete Projects**:
   - Hover over any project button and click the delete icon (trash)
   - If the project contains tasks, you'll be prompted to choose:
     - **Keep tasks**: Unassign tasks from the project (tasks remain)
     - **Delete tasks**: Remove all tasks along with the project
   - Empty projects can be deleted immediately
4. **Filter by Project**: Click on any project button to view only its tasks
5. **View All Tasks**: Click "All Tasks" to see tasks from all projects

### Task Operations

- **Complete**: Check the checkbox next to any task
- **Edit**: Hover over a task and click the edit icon
- **Delete**: Hover over a task and click the delete icon
- **Create Subtask**: Hover over a parent task and click the plus icon
- **Expand/Collapse**: Click the arrow icon next to parent tasks to show/hide subtasks
- **Subtasks**: Create subtasks by selecting a parent task when creating or using the direct creation button

## 📁 Project Structure

```
my-productivity-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── projects/
│   │   │   │   └── route.js
│   │   │   └── tasks/
│   │   │       ├── route.js
│   │   │       └── [taskId]/
│   │   │           └── route.js
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ProjectDeleteModal.tsx
│   │   ├── ProjectList.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskItem.tsx
│   ├── lib/
│   │   └── data.js
│   └── types/
│       └── index.ts
├── public/
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Key Components

- **`page.tsx`**: Main application page with task and project management
- **`TaskItem.tsx`**: Individual task display with actions and metadata
- **`TaskForm.tsx`**: Modal form for creating and editing tasks
- **`ProjectList.tsx`**: Project management and filtering interface
- **`ProjectDeleteModal.tsx`**: Confirmation modal for project deletion with task handling
- **`data.js`**: In-memory data store with sample data

## 🔧 API Endpoints

### Tasks

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Projects

- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a specific project
- `PUT /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project
  - Query parameter: `handleTasks=delete|unassign` - How to handle associated tasks
