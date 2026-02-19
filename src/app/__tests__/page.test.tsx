import { describe, it, expect, vi } from 'vitest'
import { render } from '@/lib/test-utils'
import Home from '../page'

// Mock dynamic imports to return the components immediately
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<any>, options?: any) => {
    // Directly return the component synchronously for tests
    const MockedTasksBoard = () => <div data-testid="tasks-board">Tasks Board</div>
    return MockedTasksBoard
  }
}))

// Mock UI components
vi.mock('@/components/ui/page-transition', () => ({
  PageTransition: ({ children }: any) => children
}))

vi.mock('@/components/ui/loading-skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className}>Skeleton</div>,
  PageSkeleton: () => <div data-testid="loading">Loading...</div>,
  DashboardSkeleton: () => <div data-testid="dashboard-loading">Dashboard Loading...</div>
}))

// Mock the TasksBoard component
vi.mock('@/components/tasks/tasks-board', () => ({
  TasksBoard: () => <div data-testid="tasks-board">Tasks Board</div>
}))

describe('Home Page', () => {
  it('should render the tasks board', () => {
    const { getByTestId } = render(<Home />)
    expect(getByTestId('tasks-board')).toBeInTheDocument()
  })
})