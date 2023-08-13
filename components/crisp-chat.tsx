"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("bac3ce3e-0f30-4b7c-aaeb-0d68f3c0ffe8")
    }, [])

    return null
}