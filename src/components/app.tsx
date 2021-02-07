import React, { useState } from 'react';
import type { FC } from 'react';
import { TileInput } from './ui/tile-input';
import { BEM } from '../lib/bem';
import type { HandConfig, RuleConfig, TableConfig } from '../lib/config';
import { NotifyUpdate } from './notify-update';
import { TableConfigPanel } from './table-config';
import { HandConfigPanel } from './hand-config';
import { Result } from './result';
import { RuleConfigPanel } from './rule-config';
import { EMPTY_INPUT } from '../lib/hand';
import type { HandInput } from '../lib/hand';
import '../styles/index.scss';
import { Header } from './header';
import { Footer } from './footer';

const bem = BEM('app');

export const App: FC = () => {
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    round: 'east',
    seat: 'east',
    continue: 0,
    deposit: 0
  });
  const [handInput, setHandInput] = useState<HandInput>(EMPTY_INPUT);
  const initialHandConfig: HandConfig = {
    dora: 0,
    riichi: 'none',
    ippatsu: false,
    rinshan: false,
    chankan: false,
    last: false,
    blessing: false
  };
  const [handConfig, setHandConfig] = useState(initialHandConfig);
  const [ruleConfig, setRuleConfig] = useState<RuleConfig>({
    countedYakuman: true,
    multipleYakuman: true,
    roundUpMangan: false,
    doubleWindFu: 4,
    kokushi13DoubleYakuman: true,
    suankoTankiDoubleYakuman: true,
    daisushiDoubleYakuman: true,
    pureChurenDoubleYakuman: true
  });
  return (
    <>
      <Header />
      <div className={bem()}>
        <NotifyUpdate />
        <TableConfigPanel value={tableConfig} onChange={setTableConfig} />
        <TileInput onChange={setHandInput} />
        <HandConfigPanel
          value={handConfig}
          tableConfig={tableConfig}
          onChange={setHandConfig}
          onReset={() => setHandConfig(initialHandConfig)}
        />
        <Result
          tableConfig={tableConfig}
          handInput={handInput}
          handConfig={handConfig}
          ruleConfig={ruleConfig}
        />
        <RuleConfigPanel value={ruleConfig} onChange={setRuleConfig} />
      </div>
      <Footer />
    </>
  );
};
