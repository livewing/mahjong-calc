import type { AppConfig } from '../config';
import type { HandOptions, Meld } from '../input';
import type { Rule } from '../rule';
import type { Table } from '../table';
import type { Tile } from '../tile';
import type { AppState } from './state';

interface A<T extends string, P> {
  type: T;
  payload: P;
}

export type Action =
  | A<'set-current-screen', AppState['currentScreen']>
  | A<'set-current-scoring-table-tab', AppState['currentScoringTableTab']>
  | A<'set-current-settings-tab', AppState['currentSettingsTab']>
  | A<'set-app-config', AppConfig>
  | A<'set-current-rule', Rule>
  | A<'set-table', Table>
  | A<'set-input', AppState['input']>
  | A<'set-input-random', 5 | 8 | 11 | 14 | 'chinitsu'>
  | A<'set-input-focus', AppState['inputFocus']>
  | A<'remove-hand-tile', number>
  | A<'remove-dora-tile', number>
  | A<'add-meld', Meld>
  | A<'update-meld', { i: number; meld: Meld }>
  | A<'remove-meld', number>
  | A<'toggle-current-meld-red', null>
  | A<'clear-input', null>
  | A<'click-tile-keyboard', Tile>
  | A<'set-hand-options', HandOptions>
  | A<'delete-saved-rule', string>
  | A<'save-current-rule', string>;
