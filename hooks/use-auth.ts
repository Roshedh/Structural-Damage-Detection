"use client"

// Simulated user for demonstration purposes. 
// In a real deployed app, this would use next-auth, clerk, or a custom context.
export const CURRENT_DEMO_USER = { 
  id: "user-1", 
  name: "Alice Engineer", 
  role: "user" // change to "admin" to see all records
}

export function useAuth() {
  return {
    user: CURRENT_DEMO_USER,
    isAuthenticated: true,
  }
}
