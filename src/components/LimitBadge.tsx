import { useTranslation } from 'react-i18next';
import { yakumanTupleKey } from '../lib/score';
import type { FC } from 'react';

interface LimitBadgeProps {
  base: number;
}

export const LimitBadge: FC<LimitBadgeProps> = ({ base }) => {
  const { t } = useTranslation();

  if (base < 2000) return null;
  if (base < 3000)
    return (
      <div className="rounded bg-blue-600 px-1 text-sm text-white shadow">
        {t('result.mangan')}
      </div>
    );
  if (base < 4000)
    return (
      <div className="rounded bg-green-600 px-1 text-sm text-white shadow">
        {t('result.haneman')}
      </div>
    );
  if (base < 6000)
    return (
      <div className="rounded bg-orange-600 px-1 text-sm text-white shadow">
        {t('result.baiman')}
      </div>
    );
  if (base < 8000)
    return (
      <div className="rounded bg-red-600 px-1 text-sm text-white shadow">
        {t('result.sambaiman')}
      </div>
    );

  const yakuman = Math.floor(base / 8000);
  return (
    <div className="rounded bg-purple-600 px-1 text-sm text-white shadow">
      {t(yakumanTupleKey(yakuman))}
    </div>
  );
};
