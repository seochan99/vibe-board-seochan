'use client';

import { ComponentType } from 'react';
import { useRouter } from 'next/navigation';

export function withRouter<P extends object>(
  Component: ComponentType<P>
) {
  return function WithRouterComponent(props: P) {
    const router = useRouter();
    
    return <Component {...props} router={router} />;
  };
} 