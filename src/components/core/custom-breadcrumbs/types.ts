import { ReactNode } from 'react';

export interface BreadcrumbLink {
  name: string;
  href?: string;
  icon?: ReactNode;
}

export interface CustomBreadcrumbsProps {
  links: BreadcrumbLink[];
  action?: ReactNode;
  heading?: string;
  moreLink?: string[];
  activeLast?: boolean;
  className?: string;
  headingClassName?: string;
  breadcrumbsClassName?: string;
  actionClassName?: string;
  moreLinkClassName?: string;
}
