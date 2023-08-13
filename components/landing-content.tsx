"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
{
    name: "Guru",
    avatar: "G",
    title: "Software Engineer",
    description: "I'm not only the Founder and President of KnotzGPT Plus+, but I'm also the first ever user!!"

},
{
    name: "Phoenix",
    avatar: "P",
    title: "Cyber Security Specialist",
    description: "If it wasn't for these systems I'd be far behind the curve, thank you KnotzGPT Plus+!"

},
{
    name: "Motion",
    avatar: "M",
    title: "Intergalatic Mastermind",
    description: "Stories will one day be told that this is where it all began."

},
{
    name: "Benson",
    avatar: "B",
    title: "Robotic AI",
    description: "I owe my life to KnotzGPT Plus+ without it my master would have never completed my programming"

}
]

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grib-cols-3 lg:grid-cols-4 gap-4">
               {testimonials.map((item) => (
                <Card key={item.description} className="bg-[#192339] border-none text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-x-2">
                            <div>
                                <p className="text-lg">{item.name}</p>
                                <p className="text-zinc-400 text-sm">{item.title}</p>
                            </div>
                        </CardTitle>
                        <CardContent className="pt-4 px-0">
                            {item.description}
                        </CardContent>
                    </CardHeader>
                </Card>
            ))} 
            </div>
        </div>
    )
}