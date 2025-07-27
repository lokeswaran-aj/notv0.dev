# Not V0

An open-source alternative to v0.dev built with Next.js and Vercel's AI SDK. Create full-stack Next.js applications through natural language conversations powered by Claude AI.

## Features

### Currently Available

- **AI-Powered Chat**: Interactive conversations with Claude 3.7 Sonnet with thinking capabilitiess
- **Google OAuth Authentication**: Secure login with Google using Supabase Auth
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS and Shadcn UI
- **Database Integration**: Full Supabase database setup and management

### Planned Features

- **Code Editor**: In-browser code editing with syntax highlighting
- **File Explorer**: Project file management and navigation
- **Terminal**: Integrated terminal for running commands
- **Preview**: Preview your application in real-time with E2B
- **Version Control**: Git integration and project versioning
- **Deployment**: One-click deployment to various platforms

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/)
- **AI**: [Vercel AI SDK 5](https://ai-sdk.dev/)
- **LLM**: [Anthropic Claude](https://www.anthropic.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with Google OAuth
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Components**: [Prompt Kit](https://www.prompt-kit.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Supabase account
- Anthropic API key

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/lokeswaran-aj/notv0.dev.git
cd notv0.dev
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: Environment
NODE_ENV=development
```

### 4. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Authentication → Providers → Google
3. Enable Google provider and configure OAuth credentials
4. Set your site URL and redirect URLs:
   - Site URL: `http://localhost:3000` (development)
   - Redirect URLs: `http://localhost:3000/auth/callback`
5. Link the supabase project with cli and run the migrations

```bash
supabase link --project-ref <project-ref>
supabase migration up
```

### 5. Anthropic API Setup

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add it to your environment variables

### 6. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Start a Conversation**: Type your question or request on the home page
2. **Login**: Use Google OAuth to save your conversations
3. **Chat**: Engage with Claude AI to build applications, ask questions, or get coding help

## Project Structure

```
notv0.dev/
├── app/                   # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (chat)/            # Chat interface routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── chat/              # Chat-related components
│   ├── ui/                # Reusable UI components
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── utils/                 # Utility functions
└── supabase/              # Supabase client configuration
```

## Contributing

We welcome contributions!

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [v0.dev](https://v0.dev) for inspiration
- [Anthropic](https://www.anthropic.com/) for Claude AI
- [Supabase](https://supabase.com/) for backend services
- [Vercel AI SDK](https://ai-sdk.dev/) for the AI SDK

**Built with ❤️ by the Not V0 team**
