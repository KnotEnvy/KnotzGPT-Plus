"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null
    }
    return(
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden">
                        <HamburgerMenuIcon />
                    </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
export default MobileSidebar;