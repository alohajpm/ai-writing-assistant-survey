# AI Writing Assistant Survey

A comprehensive survey application for configuring AI writing assistant preferences including tone, style, audience, and content preferences.

## Features

- **Multi-step Survey**: 7 interactive steps including welcome, tone selection, style preferences, audience targeting, content types, additional preferences, and summary
- **Dynamic Sample Generation**: Real-time email sample that adapts based on user's selected preferences
- **AI Prompt Export**: Generates ready-to-use prompts that can be copied directly into any AI writing tool
- **Interactive UI**: Progress tracking, smooth animations, and responsive design
- **In-memory Storage**: Fast data persistence during the survey session

## Survey Steps

1. **Welcome**: Introduction and overview of the survey
2. **Tone Selection**: Choose from Professional, Conversational, Creative, or Analytical writing tones
3. **Style Preferences**: Configure sentence length, vocabulary complexity, formality level, and use of examples
4. **Audience Targeting**: Select target audiences (colleagues, customers, general public, executives, students, technical experts)
5. **Content Types**: Choose content types (emails, reports, marketing, social media, blog articles, presentations)
6. **Additional Preferences**: Set personality traits, formatting preferences, industry context, and custom instructions
7. **Summary**: Review preferences with dynamic sample output and download AI prompt

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alohajpm/ai-writing-assistant-survey.git
cd ai-writing-assistant-survey
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── survey/     # Survey-specific components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # In-memory storage implementation
│   └── vite.ts           # Vite development server setup
├── shared/                # Shared types and schemas
│   └── schema.ts         # Zod schemas and TypeScript types
└── package.json
```

## API Endpoints

- `GET /api/survey/:sessionId` - Retrieve survey response by session ID
- `POST /api/survey` - Create new survey response
- `PUT /api/survey/:sessionId` - Update existing survey response
- `DELETE /api/survey/:sessionId` - Delete survey response

## Features in Detail

### Dynamic Sample Generation

The survey generates a personalized email sample that changes based on:
- **Tone**: Affects greeting style and overall language approach
- **Formality**: Changes from "Hey!" to "Dear" and adjusts language formality
- **Sentence Length**: Varies from short, punchy sentences to detailed explanations
- **Vocabulary**: Ranges from simple, clear language to advanced terminology
- **Examples**: Adjusts the level of detail in explanations and examples

### AI Prompt Export

The exported prompt includes:
- Comprehensive writing style instructions
- Target audience specifications
- Content type optimizations
- Personality trait guidelines
- Formatting preferences
- Custom instructions
- Industry context

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

No environment variables are required for basic functionality. The application uses in-memory storage by default.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help with the survey application, please open an issue on GitHub.