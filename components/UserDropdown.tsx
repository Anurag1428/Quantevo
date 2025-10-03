"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button";


const UserDropdown = () => {
    const router = useRouter();

    const handleSignOut = async () => {
      router.push("/sign-in")
    }

    const user = { name: "John Doe", email: 'contact@pussy.com' } // Replace with actual user data

  return (
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
      
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>  )
}

export default UserDropdown