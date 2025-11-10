'use client';

import SystemInfo from '../components/SystemInfo';
import SubmitOrderCount from '../components/SubmitOrderCount';
import ActionButtons from '../components/ActionButtons';
import { Providers } from './providers';
import HomeContent from './HomeContent';

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}