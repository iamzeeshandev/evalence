'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  content: ReactNode;
}

interface GenericTabsProps {
  defaultValue?: string;
  tabs: TabItem[];
  triggerClassName?: string;
  listClassName?: string;
  contentClassName?: string;
  onValueChange?: (value: string) => void;
}

export function GenericTabs({
  defaultValue,
  tabs,
  listClassName,
  triggerClassName,
  contentClassName,
  onValueChange,
}: GenericTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <Tabs onValueChange={onValueChange} defaultValue={defaultTab} className="mt-2 w-full">
      <TabsList
        className={cn(
          'bg-muted border-border flex h-12 w-full rounded-t-lg border-b p-0',
          listClassName,
        )}
      >
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-t-lg border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all duration-200',
              'data-[state=active]:border-b-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
              'data-[state=active]:rounded-t-lg data-[state=active]:border-b-2',
              'hover:bg-primary/5 hover:text-primary/80',
              tab.value === 'pending' &&
                'data-[state=active]:border-b-yellow-400 data-[state=active]:bg-[#fff6e5] data-[state=active]:text-[#9e5f00]',
              tab.value === 'booked' &&
                'data-[state=active]:border-b-blue-800 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800',
              tab.value === 'worked' &&
                'data-[state=active]:border-b-green-800 data-[state=active]:bg-green-100 data-[state=active]:text-green-800',
              tab.value === 'cancelled' &&
                'data-[state=active]:border-b-red-800 data-[state=active]:bg-red-100 data-[state=active]:text-red-800',
              tab.value === 'declined' &&
                'data-[state=active]:border-b-purple-800 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800',
              tab.value === 'not_assigned' &&
                'data-[state=active]:border-b-pink-700 data-[state=active]:bg-[#ffe0eb] data-[state=active]:text-pink-700',
              tab.value === 'timed_out' &&
                'data-[state=active]:border-b-[#065958] data-[state=active]:bg-[#81f7f5] data-[state=active]:text-[#065958]',
              tab.value === 'not_attended' &&
                'data-[state=active]:border-b-[#1072ff] data-[state=active]:bg-[#dbeaff] data-[state=active]:text-[#1072ff]',
              tab.value === 'invitations' &&
                'data-[state=active]:border-[#91e9e6] data-[state=active]:bg-[#91e9e6] data-[state=active]:text-[#156664]',

              triggerClassName,
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="bg-primary/20 text-primary ml-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={`content-${tab.value}`} value={tab.value} className={contentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
