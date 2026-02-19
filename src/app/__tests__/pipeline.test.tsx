import { describe, it, expect, vi } from 'vitest'
import { render } from '@/lib/test-utils'
import PipelinePage from '../pipeline/page'

// Mock dynamic imports to return the components immediately
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<any>, options?: any) => {
    // Directly return the component synchronously for tests
    const MockedContentPipeline = () => <div data-testid="content-pipeline">Content Pipeline</div>
    return MockedContentPipeline
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

// Mock the ContentPipeline component
vi.mock('@/components/pipeline/content-pipeline', () => ({
  ContentPipeline: () => <div data-testid="content-pipeline">Content Pipeline</div>
}))

describe('Pipeline Page', () => {
  it('should render the content pipeline', () => {
    const { getByTestId } = render(<PipelinePage />)
    expect(getByTestId('content-pipeline')).toBeInTheDocument()
  })
})