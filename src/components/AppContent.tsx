import type { FC } from 'react';
import { useStore } from '../contexts/store';
import { Calculator } from './Calculator';
import { ScoringTable } from './ScoringTable';
import { Settings } from './Settings';

const AppContent: FC = () => {
  const [{ currentScreen }] = useStore();
  return (
    <div className="relative flex-1 bg-neutral-100 text-neutral-900 transition dark:bg-neutral-900 dark:text-neutral-100">
      {currentScreen === 'main' && <Calculator />}
      {currentScreen === 'scoring-table' && <ScoringTable />}
      {currentScreen === 'settings' && <Settings />}
    </div>
  );
};
export default AppContent;
