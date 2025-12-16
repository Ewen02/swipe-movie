"use client"

import { useState } from "react"
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Textarea,
  Spinner,
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,
  RatingBadge,
  VoteCountBadge,
  AgreementBadge,
  ReleaseDateBadge,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useToast,
  Toaster,
} from "@swipe-movie/ui"
import {
  Heart,
  Star,
  Zap,
  Film,
  Users,
  Play,
  Moon,
  Sun,
  Check,
  ArrowRight,
  AlertCircle,
  Info,
  Mail,
  Lock,
  Search,
  MoreVertical,
  Settings,
  User,
  LogOut,
  Trash,
  ChevronDown,
  Bell,
  Layout,
  List,
} from "lucide-react"
import Link from "next/link"

export default function DesignSystemShowcase() {
  const [isDark, setIsDark] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast, toasts, dismiss } = useToast()

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster toasts={toasts} dismiss={dismiss} />

        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Design System
                </h1>
                <p className="text-sm text-muted-foreground">
                  Swipe Movie UI Components
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/design/liquid-glass">
                  <Button variant="outline" size="sm">
                    Liquid Glass
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDark(!isDark)}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 space-y-16">
          {/* Buttons Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Buttons
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default">Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Sizes</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon"><Heart className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">With Icons</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button>
                        <Play className="w-4 h-4" />
                        Watch Now
                      </Button>
                      <Button variant="secondary">
                        <Users className="w-4 h-4" />
                        Create Room
                      </Button>
                      <Button variant="outline">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">States</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button disabled>Disabled</Button>
                      <Button disabled>
                        <Spinner className="w-4 h-4" />
                        Loading...
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Badges
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Standard Badges</h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Movie-specific Badges</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <RatingBadge rating={8.5} variant="card" />
                      <RatingBadge rating={9.2} variant="topMatch" />
                      <VoteCountBadge voteCount={5} />
                      <VoteCountBadge voteCount={3} variant="large" />
                      <AgreementBadge voteCount={4} totalMembers={5} />
                      <ReleaseDateBadge releaseDate="2024-03-15" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>A simple card component</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards are used to group related content and actions.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Learn More</Button>
                </CardFooter>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>Feature Card</CardTitle>
                  <CardDescription>Highlighted feature</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Real-time sync
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Unlimited rooms
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Movies Swiped</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,543</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +20% from last month
                  </p>
                  <Progress value={66} className="mt-4" />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tabs Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              Tabs
            </h2>
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Overview Tab</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the overview content. Tabs help organize content into separate views.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Analytics Tab</h4>
                      <p className="text-sm text-muted-foreground">
                        View your analytics and metrics here.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Settings Tab</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure your preferences and settings.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Select & Dropdown Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ChevronDown className="w-5 h-5 text-primary" />
              Select & Dropdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="scifi">Sci-Fi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dropdown Menu</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Options
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dialog & AlertDialog Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              Dialog & AlertDialog
            </h2>
            <Card>
              <CardContent className="pt-6 flex flex-wrap gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new room</DialogTitle>
                      <DialogDescription>
                        Set up a new movie swiping session with your friends.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="room-name">Room Name</Label>
                        <Input id="room-name" placeholder="Movie Night" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsDialogOpen(false)}>Create Room</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </section>

          {/* Accordion Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              Accordion
            </h2>
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is Swipe Movie?</AccordionTrigger>
                    <AccordionContent>
                      Swipe Movie is a collaborative movie selection app that helps groups
                      decide what to watch together by swiping through movie suggestions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How does matching work?</AccordionTrigger>
                    <AccordionContent>
                      When all members of a room swipe right on the same movie, it becomes
                      a match! The movie with the most votes appears at the top.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it free to use?</AccordionTrigger>
                    <AccordionContent>
                      Yes! Swipe Movie offers a free tier with basic features. Premium
                      plans unlock additional features like unlimited rooms and filters.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Table Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              Table
            </h2>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Votes</TableHead>
                      <TableHead className="text-right">Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Inception</TableCell>
                      <TableCell>8.8</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell className="text-right">2010</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">The Dark Knight</TableCell>
                      <TableCell>9.0</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell className="text-right">2008</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Interstellar</TableCell>
                      <TableCell>8.6</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="text-right">2014</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Toast Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Toast Notifications
            </h2>
            <Card>
              <CardContent className="pt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "Default notification", description: "This is a default toast message." })}
                >
                  Default Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "Success!", description: "Your action was successful.", type: "success" })}
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "Error", description: "Something went wrong.", type: "error" })}
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "Warning", description: "Please be careful.", type: "warning" })}
                >
                  Warning Toast
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Forms Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Form Elements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" placeholder="email@example.com" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="Enter password" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="search" placeholder="Search movies..." className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled">Disabled</Label>
                    <Input id="disabled" placeholder="Disabled input" disabled />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Textarea</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (disabled)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      disabled
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Alerts Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Alerts
            </h2>
            <div className="space-y-4">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is a default alert for general information.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Loading States Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Loading States
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Spinner</h3>
                    <div className="flex items-center gap-6">
                      <Spinner className="w-4 h-4" />
                      <Spinner className="w-6 h-6" />
                      <Spinner className="w-8 h-8" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Skeleton</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                      <Skeleton className="h-[125px] w-full rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Progress</h3>
                    <div className="space-y-4">
                      <Progress value={25} />
                      <Progress value={50} />
                      <Progress value={75} />
                      <Progress value={100} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Avatar Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Avatars
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">SM</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Color Palette Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Color Palette
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg bg-primary" />
                    <p className="text-xs font-medium">Primary</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg bg-accent" />
                    <p className="text-xs font-medium">Accent</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg bg-secondary" />
                    <p className="text-xs font-medium">Secondary</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg bg-muted" />
                    <p className="text-xs font-medium">Muted</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg bg-destructive" />
                    <p className="text-xs font-medium">Destructive</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg border bg-card" />
                    <p className="text-xs font-medium">Card</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-8 mt-16">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            <p>Swipe Movie Design System</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
