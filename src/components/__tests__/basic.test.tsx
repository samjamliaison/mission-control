import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple components test to ensure test setup works
describe('Basic Component Tests', () => {
  it('should render a simple div', () => {
    const SimpleComponent = () => <div data-testid="simple">Hello Mission Control</div>
    render(<SimpleComponent />)
    expect(screen.getByTestId('simple')).toBeInTheDocument()
    expect(screen.getByText('Hello Mission Control')).toBeInTheDocument()
  })

  it('should handle conditional rendering', () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => (
      <div>
        {show && <span data-testid="conditional">Shown</span>}
      </div>
    )
    
    const { rerender } = render(<ConditionalComponent show={false} />)
    expect(screen.queryByTestId('conditional')).not.toBeInTheDocument()
    
    rerender(<ConditionalComponent show={true} />)
    expect(screen.getByTestId('conditional')).toBeInTheDocument()
  })
})