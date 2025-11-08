# EngineerDNA Website

Marketing website for [EngineerDNA](https://engineerdna.com) - an open-source engineering metrics platform.

## Live Site
https://engineerdna.com

## Tech Stack
- Astro 4.x (static site generation)
- React 18+ (interactive islands)
- Tailwind CSS 3.x (styling)
- TypeScript

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
git clone <repo-url>
cd site
npm install
```

### Development Server
```bash
npm run dev  # http://localhost:4321
```

### Build
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Quality Checks
```bash
npm run typecheck  # TypeScript validation
npm run lint       # ESLint
npx knip           # Dead code detection
```

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and development guidelines.

## Pages
- `/` - Homepage with hero, problems, value props, plugin overview
- `/how-it-works` - Technical architecture and security model
- `/plugins` - Plugin ecosystem and development
- `/community` - Community resources and contributing

## Components
- Static Astro components for all non-interactive content
- React islands for interactive elements (install button, mobile menu)

## EngineerDNA Application

This is the marketing website. For the actual EngineerDNA desktop application, see [github.com/engineerdna/engineerdna](https://github.com/engineerdna/engineerdna).

## License

Apache 2.0
