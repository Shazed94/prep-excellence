import { AdminTabs } from '@/components/admin-sat-tabs/sat-tabs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/question-bank/question-configuration/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Test Configuration
              </h1>
              <p className="text-muted-foreground text-sm max-w-2xl">
                Manage test types, subjects, difficulties, and more. Drag items to reorder them.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTabs />
      </div>
    </main>
}
