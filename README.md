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

### 📁 **Project Organization**

- ✅ Create and manage projects
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

1. Use the "New Project" button in the Projects section
2. Enter a project name and click "Create"
3. Filter tasks by clicking on project buttons
4. Click "All Tasks" to view all tasks

### Task Operations

- **Complete**: Check the checkbox next to any task
- **Edit**: Hover over a task and click the edit icon
- **Delete**: Hover over a task and click the delete icon
- **Subtasks**: Create subtasks by selecting a parent task when creating

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
- **`data.js`**: In-memory data store with sample data

## 🔧 API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create a new project

## 🎨 Design Features

- **Color Palette**: Professional blue primary (#3B82F6) with semantic colors
- **Typography**: Clean hierarchy with proper font weights
- **Spacing**: Consistent 4px/8px grid system
- **Interactive Elements**: Smooth hover effects and transitions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG AA compliant

## 🚧 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time collaboration
- [ ] Task templates
- [ ] Time tracking
- [ ] Calendar integration
- [ ] Export functionality
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Heroicons](https://heroicons.com/) for the beautiful SVG icons
- [TypeScript](https://www.typescriptlang.org/) for type safety

---

**Built with ❤️ using Next.js and Tailwind CSS**
