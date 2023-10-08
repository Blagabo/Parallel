import type { ReactNode } from 'react';
import ModelCard from '@/components/model-card'

import { MainHeader } from '../MainHeader';

interface Props {
  children: ReactNode;
}

export function DefaultLayout ({ children }: Props) {
  return (
    <>
      <MainHeader />
      <ModelCard modelName={"/covid_19.glb"} />
      {children}
    </>
  );
}
