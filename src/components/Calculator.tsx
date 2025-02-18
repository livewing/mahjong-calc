import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdNavigateNext } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { useBoundingClientRect } from '../hooks/dom';
import { generateResult } from '../lib/result';
import { compareRules } from '../lib/rule';
import { HandOptions } from './HandOptions';
import { InputGlance } from './InputGlance';
import { Result } from './Result';
import { ResultGlance } from './ResultGlance';
import { TableSettings } from './TableSettings';
import { Button } from './ui/Button';
import { ConfigItem } from './ui/ConfigItem';
import { TileInput } from './ui/TileInput';

export const Calculator: FC = () => {
  const [ruleRef, ruleRect] = useBoundingClientRect<HTMLDivElement>();
  const [tableRef, tableRect] = useBoundingClientRect<HTMLDivElement>();
  const [handOptionsRef, handOptionsRect] =
    useBoundingClientRect<HTMLDivElement>();
  const [{ currentRule, savedRules, table, input, handOptions }, dispatch] =
    useStore();
  const { t } = useTranslation();

  const ruleName =
    Object.entries(savedRules).find(([, r]) =>
      compareRules(r, currentRule)
    )?.[0] ?? t('settings.untitled-rule');

  const result = generateResult(table, input, handOptions, currentRule);

  return (
    <>
      <div className="flex flex-col gap-2 p-2 pr-[max(0.5rem,env(safe-area-inset-right))] pl-[max(0.5rem,env(safe-area-inset-left))] md:mx-auto md:flex-row md:gap-8 lg:container">
        <div className="flex flex-col gap-2 md:basis-1/2 lg:basis-2/5">
          <ConfigItem label={t('settings.rule')}>
            <Button
              onClick={() => {
                dispatch({ type: 'set-current-settings-tab', payload: 'rule' });
                dispatch({ type: 'set-current-screen', payload: 'settings' });
              }}
            >
              <div className="flex flex-1 items-center justify-between">
                <div className="flex-1">{ruleName}</div>
                <MdNavigateNext />
              </div>
            </Button>
          </ConfigItem>
          <div
            ref={ruleRef}
            className="border-t border-neutral-300 dark:border-neutral-700"
          />
          <TableSettings />
          <div
            ref={tableRef}
            className="border-t border-neutral-300 dark:border-neutral-700"
          />
          <TileInput />
          <div className="border-t border-neutral-300 dark:border-neutral-700" />
          <HandOptions />
        </div>
        <div
          ref={handOptionsRef}
          className="border-t border-neutral-300 dark:border-neutral-700 md:hidden"
        />
        <div className="flex-1 md:basis-1/2 lg:basis-3/5">
          <Result result={result} />
        </div>
      </div>
      <InputGlance
        rulePosition={ruleRect?.y}
        tablePosition={tableRect?.y}
        handOptionsPosition={handOptionsRect?.y}
      />
      <ResultGlance result={result} handOptionsPosition={handOptionsRect?.y} />
    </>
  );
};
