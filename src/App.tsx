import { useState, useEffect } from 'react'
import { Switch, Route, Router as WouterRouter } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import Home from './pages/home'
import NotFound from './pages/not-found'

// Using Vite's glob import for auto-routing
const pages = import.meta.glob('./pages/**/*.{js,jsx,ts,tsx}')

function Router() {
  const [routes, setRoutes] = useState([] as any[])

  useEffect(() => {
    // Load all page components
    Promise.all(
      Object.entries(pages).map(async ([path, importFunc]) => {
        const module = await importFunc() as any
        
        // Skip the main home and not-found pages as they're imported directly
        if (path.endsWith('/home.tsx') || path.endsWith('/not-found.tsx')) {
          return null
        }
        
        // Convert file path to route path
        // For example: './pages/examples/TaskDashboard.tsx' -> '/examples/taskdashboard'
        const routePath = '/' + path
          .replace(/^.*\/pages\//, '')  // Remove everything before /pages/
          .replace(/\.(js|jsx|ts|tsx)$/, '') // Remove file extension
          .toLowerCase()
          
        return {
          path: routePath,
          component: module.default
        }
      })
    ).then(loadedRoutes => {
      // Filter out null routes (the ones we skipped)
      setRoutes(loadedRoutes.filter(route => route !== null))
    })
  }, [])

  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path}>
            {(params) => <Component {...params} />}
          </Route>
        ))}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  )
}

function App() {
  return <Router />
}

export default App
