"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ViewGridIcon, ChatBubbleIcon, ImageIcon, VideoIcon, SpeakerLoudIcon, CodeIcon, GearIcon  } from "@radix-ui/react-icons"
import { usePathname } from "next/navigation"
import { FreeCounter } from "@/components/free-counter";
const montserrat = Montserrat({ weight: "600", subsets: ["latin"]});

const routes = [
    {
    label: "Dashboard",
    icon: ViewGridIcon,
    href:"/dashboard",
    color:"text-sky-500",
    },
    {
    label: "Conversational AI",
    icon: ChatBubbleIcon,
    href:"/conversation",
    color:"text-violet-500",
    },
    {
    label: "Image Gen AI",
    icon: ImageIcon,
    href:"/image",
    color:"text-pink-700",
    },
    {
    label: "Vid Gen AI",
    icon: VideoIcon,
    href:"/video",
    color:"text-orange-700",
    },
    {
    label: "Music Gen AI",
    icon: SpeakerLoudIcon,
    href:"/music",
    color:"text-emerald-500",
    },
    {
    label: "Code Gen AI",
    icon: CodeIcon,
    href:"/code",
    color:"text-green-700",
    },
    {
    label: "Settings",
    icon: GearIcon,
    href:"/settings",

    },
];

interface SidebarProps {
    apiLimitCount: number;
    isPro: boolean;
};

const Sidebar = ({ 
    apiLimitCount = 0,
    isPro= false,
}: SidebarProps) => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Image 
                            fill
                            alt="Logo"
                            src="/hacklogo.png"
                        />
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>
                        KnotzGPT+
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                        pathname === route.href ? "text-white bg-white/10" : "text-zinc-400")}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}

                            </div>
                        </Link>
                    ))}

                </div>

            </div>
            <FreeCounter 
                isPro={isPro}
                apiLimitCount={apiLimitCount}
            />
        </div>
    )
}

export default Sidebar;