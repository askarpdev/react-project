# Course Builder

A drag-and-drop course builder that allows instructors to create structured online courses by assembling lessons, quizzes, and multimedia content into organized modules.

## Features

- Interactive sidebar with draggable content blocks (text, video, quiz, assignment)
- Visual course timeline showing module progression
- Rich text editor for lesson content
- Preview mode to see course from student perspective
- Module reordering through drag-and-drop

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Running the App

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to:
- Main app: http://localhost:5173
- Course preview: http://localhost:5173/preview.html

## Development

### Project Structure

```
src/
  ├── components/        # React components
  │   └── CourseBuilder/ # Course builder specific components
  ├── lib/              # Utility functions and configurations
  ├── styles/           # Global styles and theme
  └── types/            # TypeScript type definitions
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_PROJECT_NAME=default-course
```

## Building for Production

```bash
npm run build
# or
yarn build
```

This will:
1. Build only the course preview interface
2. Remove the course builder functionality
3. Create a production-ready bundle in the `dist` directory with index.html as the entry point
4. Optimize assets for production deployment

The built version will only contain the course content viewer, making it suitable for student access. You can deploy the contents of the `dist` directory to any static hosting service.
