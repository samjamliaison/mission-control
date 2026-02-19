import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

// Mock all the main components
vi.mock('@/components/tasks/tasks-board', () => ({
  TasksBoard: () => <div data-testid="tasks-board">Tasks Board</div>
}))

vi.mock('@/components/pipeline/content-pipeline', () => ({
  ContentPipeline: () => <div data-testid="content-pipeline">Content Pipeline</div>
}))

vi.mock('@/components/calendar/calendar-view', () => ({
  CalendarView: () => <div data-testid="calendar-view">Calendar View</div>
}))

vi.mock('@/components/memory/memory-viewer', () => ({
  MemoryViewer: () => <div data-testid="memory-viewer">Memory Viewer</div>
}))

vi.mock('@/components/team/team-dashboard', () => ({
  TeamDashboard: () => <div data-testid="team-dashboard">Team Dashboard</div>
}))

vi.mock('@/components/office/office-view', () => ({
  OfficeView: () => <div data-testid="office-view">Office View</div>
}))

// Import pages after mocking
import HomePage from '../page'
import PipelinePage from '../pipeline/page'
import CalendarPage from '../calendar/page'
import MemoryPage from '../memory/page'
import TeamPage from '../team/page'
import OfficePage from '../office/page'

describe('All Pages', () => {
  it('should render home page with tasks board', () => {
    const { getByTestId } = render(<HomePage />)
    expect(getByTestId('tasks-board')).toBeInTheDocument()
  })

  it('should render pipeline page with content pipeline', () => {
    const { getByTestId } = render(<PipelinePage />)
    expect(getByTestId('content-pipeline')).toBeInTheDocument()
  })

  it('should render calendar page with calendar view', () => {
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