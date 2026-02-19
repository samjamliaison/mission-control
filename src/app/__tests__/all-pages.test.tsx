import { describe, it, expect, vi } from 'vitest'
import { render } from '@/lib/test-utils'

// Mock the UI components
vi.mock('@/components/ui/page-transition', () => ({
  PageTransition: ({ children }: any) => children
}))

vi.mock('@/components/ui/loading-skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className}>Skeleton</div>,
  PageSkeleton: () => <div data-testid="loading">Loading...</div>,
  DashboardSkeleton: () => <div data-testid="dashboard-loading">Dashboard Loading...</div>
}))

// Mock next/dynamic to return components immediately
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<any>, options?: any) => {
    // For all-pages test, we return the mocked components directly
    const MockedComponent = () => {
      // Try to extract the component name from the loader function
      const loaderStr = loader.toString()
      if (loaderStr.includes('dashboard-view')) {
        return <div data-testid="dashboard-view">Dashboard View</div>
      }
      if (loaderStr.includes('tasks-board')) {
        return <div data-testid="tasks-board">Tasks Board</div>
      }
      if (loaderStr.includes('content-pipeline')) {
        return <div data-testid="content-pipeline">Content Pipeline</div>
      }
      if (loaderStr.includes('enhanced-memory-viewer')) {
        return <div data-testid="memory-viewer">Memory Viewer</div>
      }
      if (loaderStr.includes('team-dashboard')) {
        return <div data-testid="team-dashboard">Team Dashboard</div>
      }
      if (loaderStr.includes('isometric-office')) {
        return <div data-testid="office-view">Office View</div>
      }
      // Default fallback
      return <div data-testid="mock-component">Mock Component</div>
    }
    return MockedComponent
  }
}))

// Import pages after mocking
import HomePage from '../page'
import PipelinePage from '../pipeline/page'
import CalendarPage from '../calendar/page'
import MemoryPage from '../memory/page'
import TeamPage from '../team/page'
import OfficePage from '../office/page'

describe('All Pages', () => {
  it('should render home page with dashboard view', () => {
    const { getByTestId } = render(<HomePage />)
    expect(getByTestId('dashboard-view')).toBeInTheDocument()
  })

  it('should render pipeline page with content pipeline', () => {
    const { getByTestId } = render(<PipelinePage />)
    expect(getByTestId('content-pipeline')).toBeInTheDocument()
  })

  it('should render calendar page', () => {
    const { getByTestId } = render(<CalendarPage />)
    expect(getByTestId('calendar-view')).toBeInTheDocument()
  })

  it('should render memory page with memory viewer', () => {
    const { getByTestId } = render(<MemoryPage />)
    expect(getByTestId('memory-viewer')).toBeInTheDocument()
  })

  it('should render team page with team dashboard', () => {
    const { getByTestId } = render(<TeamPage />)
    expect(getByTestId('team-dashboard')).toBeInTheDocument()
  })

  it('should render office page with office view', () => {
    const { getByTestId } = render(<OfficePage />)
    expect(getByTestId('office-view')).toBeInTheDocument()
  })
})