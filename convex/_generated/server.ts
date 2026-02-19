// Mock Convex server functions for development
export function query(args: any) {
  return function(handler: any) {
    return { query: true, handler, args }
  }
}

export function mutation(args: any) {
  return function(handler: any) {
    return { mutation: true, handler, args }
  }
}