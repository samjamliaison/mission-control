import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Home from '../page'

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