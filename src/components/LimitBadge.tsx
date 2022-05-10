import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { yakumanTupleKey } from '../lib/score';

interface LimitBadgeProps {
  base: number;
}

export const LimitBadge: FC<LimitBadgeProps> = ({ base }) => {
  const { t } = useTranslation();

  if (base < 2000) return null;
  if (base < 3000)
    return (
      <div className="bg-blue-600 text-white text-sm rounded shadow px-1">
        {t('result.mangan')}
      </div>
    );
  if (base < 4000)
    return (
      <div className="bg-green-600 text-white text-sm rounded shadow px-1">
        {t('result.haneman')}
      </div>
    );
  if (base < 6000)
    return (
      <div className="bg-orange-600 text-white text-sm rounded shadow px-1">
        {t('result.baiman')}
      </div>
    );
  if (base < 8000)
    return (
      <div className="bg-red-600 text-white text-sm rounded shadow px-1">
        {t('result.sambaiman')}
      </div>
    );

  const yakuman = Math.floor(base / 8000);
  return (
    <div className="bg-purple-600 text-white text-sm rounded shadow px-1">
      {t(yakumanTupleKey(yakuman))}
    </div>
  );
};
