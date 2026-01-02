import { Toaster } from '@/components/ui/sonner'
import { Dashboard } from '@/components/Dashboard'

function App() {
  return (
    <>
      <Dashboard />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'rgb(30 41 59)',
            border: '1px solid rgb(51 65 85)',
            color: 'white',
          },
        }}
      />
    </>
  )
}

export default App
