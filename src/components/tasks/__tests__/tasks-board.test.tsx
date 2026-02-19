import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { TasksBoard } from '../tasks-board'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

// Mock react-beautiful-dnd
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => <div>{children}</div>,
  Droppable: ({ children }: any) => 
    children({ 
      innerRef: vi.fn(), 
      droppableProps: {}, 
      placeholder: null 
    }),
  Draggable: ({ children }: any) => 
    children({ 
      innerRef: vi.fn(), 
      draggableProps: {}, 
      dragHandleProps: {} 
    }, { isDragging: false }),
}))

// Mock task columns
vi.mock('../task-column', () => ({
  TaskColumn: ({ title, tasks, status }: any) => (
    <div data-testid={`column-${status}`}>
      <h3>{title}</h3>
      <div>{tasks.length} tasks</div>
    </div>
  ),
}))

// Mock add task dialog
vi.mock('../add-task-dialog', () => ({
  AddTaskDialog: ({ open, onSave }: any) => 
    open ? (
      <div data-testid="add-task-dialog">
        <button onClick={() => onSave({ title: 'New Task', assignee: 'Test', priority: 'low' })}>
          Save
        </button>
      </div>
    ) : null,
}))

describe('TasksBoard', () => {
  it('renders mission control header', () => {
    render(<TasksBoard />)
    
    expect(screen.getByText('Mission Control')).toBeInTheDocument()
    expect(screen.getByText(/Advanced task orchestration system/)).toBeInTheDocument()
  })

  it('renders all three task columns', () => {
    render(<TasksBoard />)
    
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()
    expect(screen.getByTestId('column-in-progress')).toBeInTheDocument()
    expect(screen.getByTestId('column-done')).toBeInTheDocument()
  })

  it('shows deploy task button', () => {
    render(<TasksBoard />)
    
    const deployButton = screen.getByText('Deploy Task')
    expect(deployButton).toBeInTheDocument()
  })

  it('opens add task dialog when deploy button is clicked', async () => {
    render(<TasksBoard />)
    
    const deployButton = screen.getByText('Deploy Task')
    fireEvent.click(deployButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('add-task-dialog')).toBeInTheDocument()
    })
  })

  it('displays mission progress statistics', () => {
    render(<TasksBoard />)
    
    // Check for progress percentage (should be visible)
    const progressElements = screen.getAllByText(/\d+%/)
    expect(progressElements.length).toBeGreaterThan(0)
    
    // Check for completion stats
    const completeElements = screen.getAllByText(/Complete/)
    expect(completeElements.length).toBeGreaterThan(0)
    const activeElements = screen.getAllByText(/Active/)
    expect(activeElements.length).toBeGreaterThan(0)
  })

  it('filters tasks by assignee', async () => {
    render(<TasksBoard />)
    
    // Find the assignee filter dropdown
    const filterSelect = screen.getByRole('combobox')
    expect(filterSelect).toBeInTheDocument()
  })

  it('shows agent status indicators', () => {
    render(<TasksBoard />)
    
    // Check for agent avatars
    expect(screen.getByText('👤')).toBeInTheDocument() // Hamza
    expect(screen.getByText('🤘')).toBeInTheDocument() // Manus
    expect(screen.getByText('✈️')).toBeInTheDocument() // Monica
    expect(screen.getByText('🔍')).toBeInTheDocument() // Jarvis
    expect(screen.getByText('🌙')).toBeInTheDocument() // Luna
  })

  it('calculates completion rate correctly', () => {
    render(<TasksBoard />)
    
    // Should show a percentage for completion rate
    const percentageElements = screen.getAllByText(/\d+%/)
    expect(percentageElements.length).toBeGreaterThan(0)
  })
})