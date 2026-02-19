import '@testing-library/jest-dom'

// Mock framer-motion to avoid issues with animations in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span', 
    button: 'button',
    h1: 'h1',
    p: 'p',
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))