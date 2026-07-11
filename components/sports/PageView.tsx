'use client';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export function PageView({ sport }: { sport: string }) {
  useEffect(() => {
    track('sport_page_view', { sport });
  }, [sport]);
  return null;
}
