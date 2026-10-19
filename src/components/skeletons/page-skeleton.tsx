import { BreadcrumbSkeleton } from "@/components/skeletons/skeleton-primitives";
import MainLayout from "@/layouts/main-layout";
import { JSX, ReactNode } from "react";

interface SkeletonPageProps {
  label: string;
  children: ReactNode;
  className?: string;
  breadcrumbWidth?: string;
  containerClassName?: string;
}

// Shared loading page shell: MainLayout + optional breadcrumb + a container
// section with an accessible loading label.
export const SkeletonPage = ({
  label,
  children,
  className = "pt-6 pb-12 md:pt-10 md:pb-20",
  breadcrumbWidth,
  containerClassName = "container px-4",
}: SkeletonPageProps): JSX.Element => (
  <MainLayout>
    {breadcrumbWidth && <BreadcrumbSkeleton width={breadcrumbWidth} />}
    <section className={`${containerClassName} ${className}`} aria-label={label}>
      {children}
    </section>
  </MainLayout>
);
