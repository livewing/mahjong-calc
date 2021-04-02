import React from 'react';
import type { FC } from 'react';
import { is_complete_input } from '../lib/hand';
import type { HandInput } from '../lib/hand';
import { Container } from './ui/container';
import type { HandConfig, RuleConfig, TableConfig } from '../lib/config';
import { generate_result } from '../lib/result';
import { HoraItem } from './hora-item';

interface ResultProps {
  tableConfig: TableConfig;
  handInput: HandInput;
  handConfig: HandConfig;
  ruleConfig: RuleConfig;
}

export const Result: FC<ResultProps> = ({
  tableConfig,
  handInput,
  handConfig,
  ruleConfig
}) => {
  const result = is_complete_input(handInput)
    ? generate_result(handInput, tableConfig, handConfig, ruleConfig)
    : void 0;

  if (typeof result === 'undefined') {
    return (
      <Container header="結果: 手牌未入力" modifier="danger">
        <p>牌を入力してください。</p>
      </Container>
    );
  }
  if (!result.tempai) {
    return (
      <Container header="結果: 不聴" modifier="warning">
        <p>面子手: {result.shanten} 向聴</p>
        {typeof result.shantenChitoitsu === 'number' && (
          <p>七対子: {result.shantenChitoitsu} 向聴</p>
        )}
        {typeof result.shantenKokushi === 'number' && (
          <p>国士無双: {result.shantenKokushi} 向聴</p>
        )}
      </Container>
    );
  }
  if (result.hora.length === 0) {
    return (
      <Container header="結果: 不聴" modifier="warning">
        <div>和了牌無し</div>
      </Container>
    );
  }
  return (
    <Container header="結果: 聴牌" modifier="primary">
      {result.hora.map((h, i) => (
        <HoraItem key={i} hora={h} tableConfig={tableConfig} />
      ))}
    </Container>
  );
};
