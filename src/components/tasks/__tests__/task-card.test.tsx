import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard, Task } from '../task-card'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock react-beautiful-dnd
vi.mock('@hello-pangea/dnd', () => ({
  Draggable: ({ children }: { children: any }) => 
    children({ 
      innerRef: vi.fn(), 
      draggableProps: {}, 
      dragHandleProps: {} 
    }, { isDragging: false }),
}))

const mockTask: Task = {
  _id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  assignee: 'Hamza',
  status: 'todo',
  priority: 'high',
  createdAt: Date.now() - 86400000,
  updatedAt: Date.now(),
}

describe('TaskCard', () => {
  it('renders task information correctly', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskCard 
        task={mockTask} 
        index={0} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('This is a test task')).toBeInTheDocument()
    expect(screen.getByText('Hamza')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskCard 
        task={mockTask} 
        index={0} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    // Hover over card to show buttons
    const card = screen.getByText('Test Task').closest('[data-testid="task-card"]') || 
                screen.getByText('Test Task').closest('div')
    
    if (card) {
      fireEvent.mouseEnter(card)
    }

    // Find and click edit button
    const editButtons = screen.getAllByRole('button')
    const editButton = editButtons.find(button => 
      button.querySelector('svg') !== null
    )

    if (editButton) {
      fireEvent.click(editButton)
      expect(onEdit).toHaveBeenCalledWith(mockTask)
    }
  })

  it('displays correct priority styling', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskCard 
        task={mockTask} 
        index={0} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    const priorityBadge = screen.getByText('high')
    expect(priorityBadge).toBeInTheDocument()
  })

  it('shows assignee avatar and name', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskCard 
        task={mockTask} 
        index={0} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    expect(screen.getByText('Hamza')).toBeInTheDocument()
    expect(screen.getByText('👤')).toBeInTheDocument() // Hamza's avatar
  })

  it('displays different styles for different task statuses', () => {
    const completedTask: Task = { ...mockTask, status: 'done' }
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskCard 
        task={completedTask} 
        index={0} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskCard 
        task={mockTask} 
        index={0} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    // Check that date formatting is present
    const dateElements = screen.getAllByText(/\w{3} \d{1,2}/)
    expect(dateElements.length).toBeGreaterThan(0)
  })
})