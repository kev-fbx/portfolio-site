"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./LoadingSpinner";

const BackgroundScene = dynamic(
    () => import("@/components/BackgroundScene").then(mod => mod.ThreeScene),
    {
        loading: () => <LoadingSpinner />,
        ssr: false,
    });

export function BackgroundSceneWrapper() {
    return <BackgroundScene />;
};