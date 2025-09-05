# ADI Next.js POC

A Next.js 14 proof of concept application with Redux Toolkit for global state management.

## Features

- ⚡ Next.js 14 with App Router
- 🔧 TypeScript for type safety
- 🗃️ Redux Toolkit for state management
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🧩 Modular component architecture

## Project Structure

```
├── app/
│   ├── components/          # Reusable components
│   │   └── Counter.tsx      # Example counter component
│   ├── store/              # Redux store configuration
│   │   ├── slices/         # Redux slices
│   │   │   └── counterSlice.ts
│   │   ├── hooks.ts        # Typed Redux hooks
│   │   └── store.ts        # Store configuration
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── providers.tsx       # Redux provider wrapper
├── components/             # Additional components
├── pages/                  # Pages (if using Pages Router)
├── api/                    # API routes
├── public/                 # Static assets
├── styles/                 # Additional stylesheets
└── types/                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## State Management

This project uses Redux Toolkit for global state management:

### Store Configuration
- **Store**: Configured in `app/store/store.ts`
- **Slices**: Individual feature slices in `app/store/slices/`
- **Hooks**: Typed hooks in `app/store/hooks.ts`

### Example Usage

```typescript
// Using the counter slice
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { increment, decrement } from '../store/slices/counterSlice'

export function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}
```

### Adding New Slices

1. Create a new slice in `app/store/slices/`:
```typescript
import { createSlice } from '@reduxjs/toolkit'

const mySlice = createSlice({
  name: 'myFeature',
  initialState: { /* initial state */ },
  reducers: {
    // your reducers
  },
})

export const { /* actions */ } = mySlice.actions
export default mySlice.reducer
```

2. Add to store configuration:
```typescript
// app/store/store.ts
import myFeatureReducer from './slices/myFeatureSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    myFeature: myFeatureReducer, // Add here
  },
})
```

## Styling

This project uses Tailwind CSS for styling:

- Configuration: `tailwind.config.js`
- Global styles: `app/globals.css`
- Component-specific styles: Use Tailwind classes directly

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)