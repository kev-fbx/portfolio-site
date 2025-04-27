"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./LoadingSpinner";

const ThreeScene = dynamic(
    () => import("@/components/ThreeScene").then(mod => mod.ThreeScene),
    {
        loading: () => <LoadingSpinner />,
        ssr: false,
    });

export function SceneWrapper() {
    return <ThreeScene />;
};