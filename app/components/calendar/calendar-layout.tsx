
'use client'

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Calendar,
  Plus,
  Settings,
  Search,
  Download,
  Upload,
  Sun,
  Moon,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
} from "lucide-react"
import { useTheme } from "next-themes"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface CalendarLayoutProps {
  children: React.ReactNode
}

export function CalendarLayout({ children }: CalendarLayoutProps) {
  const { data: session } = useSession() || {}
  const { theme, setTheme } = useTheme()
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')

  const user = session?.user
  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` 
    : user?.email?.charAt(0).toUpperCase() || 'U'

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground">Modern Calendar</h1>
                  <p className="text-xs text-muted-foreground">Din personliga kalender</p>
                </div>
              </div>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center bg-muted/50 rounded-lg p-1">
                <Button
                  variant={currentView === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('month')}
                  className="h-8"
                >
                  <Grid3x3 className="w-4 h-4 mr-1" />
                  Månad
                </Button>
                <Button
                  variant={currentView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('week')}
                  className="h-8"
                >
                  <List className="w-4 h-4 mr-1" />
                  Vecka
                </Button>
                <Button
                  variant={currentView === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('day')}
                  className="h-8"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Dag
                </Button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="w-4 h-4" />
              </Button>

              {/* Import/Export */}
              <div className="hidden sm:flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Add Event */}
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Ny händelse</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.name || 'Användare'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "Ljust tema" : "Mörkt tema"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Inställningar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logga ut</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6">
          {/* Calendar Navigation */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">December 2024</h2>
                  <p className="text-sm text-muted-foreground">Idag är 30 december</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  12 händelser denna månad
                </Badge>
                <Button variant="outline" size="sm">
                  Idag
                </Button>
              </div>
            </div>
          </Card>

          {/* Calendar Content */}
          {children}
        </div>
      </main>
    </div>
  )
}
