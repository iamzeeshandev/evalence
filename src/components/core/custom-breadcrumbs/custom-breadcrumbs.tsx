// components/core/breadcrumb/CustomBreadcrumbs.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomBreadcrumbsProps } from './types';

export function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast = true,
  className,
  headingClassName,
  breadcrumbsClassName,
  actionClassName,
  moreLinkClassName,
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1]?.name;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center">
        <div className="flex-grow">
          {heading && (
            <h1 className={cn('text-2xl font-semibold mb-2', headingClassName)}>{heading}</h1>
          )}

          {links.length > 0 && (
            <nav className={cn('flex items-center space-x-2', breadcrumbsClassName)}>
              {links.map((link, index) => {
                const isLast = index === links.length - 1;
                const isDisabled = isLast && activeLast;

                return (
                  <div key={link.name} className="flex items-center">
                    {link.href && !isDisabled ? (
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm font-medium transition-colors hover:text-primary',
                          isLast ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {link.icon && <span className="mr-1">{link.icon}</span>}
                        {link.name}
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isLast ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {link.icon && <span className="mr-1">{link.icon}</span>}
                        {link.name}
                      </span>
                    )}
                    {!isLast && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
                  </div>
                );
              })}
            </nav>
          )}
        </div>

        {action && <div className={cn('flex-shrink-0', actionClassName)}>{action}</div>}
      </div>

      {moreLink && moreLink.length > 0 && (
        <div className={cn('flex flex-wrap gap-2', moreLinkClassName)}>
          {moreLink.map(href => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              {href}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
