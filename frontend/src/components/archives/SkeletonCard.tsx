'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCard = () => (
  <Card className="h-full overflow-hidden bg-white border border-sage-200">
    <Skeleton className="w-full h-48 bg-sage-100" />
    <CardContent className="p-5">
      <Skeleton className="h-6 w-3/4 mb-3 bg-sage-100" />
      <Skeleton className="h-4 w-1/2 mb-3 bg-sage-100" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 bg-sage-100" />
        <Skeleton className="h-6 w-16 bg-sage-100" />
        <Skeleton className="h-6 w-16 bg-sage-100" />
      </div>
    </CardContent>
    <CardFooter className="p-5 pt-0">
      <Skeleton className="h-5 w-32 bg-sage-100" />
    </CardFooter>
  </Card>
);