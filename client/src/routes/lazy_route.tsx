import { lazy, Suspense } from "react";

export function lazyRoute(componentName: string) {
    const LazyElement = lazy(() => import(`../components/${componentName}.tsx`));
    return (
        <Suspense fallback="Loading....">
            <LazyElement />
        </Suspense>
    )
}
