import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import PipelinePage from '../pipeline/page'

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