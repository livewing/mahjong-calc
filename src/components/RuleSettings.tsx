import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck, MdDelete, MdMenu, MdSave } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { compareRules } from '../lib/rule';
import { Dropdown } from './ui/Dropdown';
import { RuleEditor } from './ui/RuleEditor';

export const RuleSettings: FC = () => {
  const [{ currentRule, savedRules }, dispatch] = useStore();
  const [openPresetMenu, setOpenPresetMenu] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const { t } = useTranslation();

  const ruleName = Object.entries(savedRules).find(([, r]) =>
    compareRules(r, currentRule)
  )?.[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Dropdown
          label={
            <div className="p-1">
              <MdMenu />
            </div>
          }
          open={openPresetMenu}
          onSetOpen={setOpenPresetMenu}
        >
          <div className="flex flex-col py-1">
            {Object.keys(savedRules).length === 0 && (
              <div className="flex gap-2 items-center p-2">
                <MdCheck className="invisible" />
                <div className="text-neutral-500 select-none">
                  {t('settings.empty')}
                </div>
              </div>
            )}
            {Object.entries(savedRules)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, rule]) => (
                <div key={name} className="flex">
                  <button
                    className="group peer flex overflow-hidden flex-1 gap-2 items-center p-2 hover:text-white hover:bg-blue-500"
                    onClick={() => {
                      dispatch({ type: 'set-current-rule', payload: rule });
                      setOpenPresetMenu(false);
                    }}
                  >
                    <MdCheck
                      className={
                        name === ruleName
                          ? 'visible text-blue-600 dark:text-blue-400 group-hover:text-white'
                          : 'invisible'
                      }
                    />
                    <div className="flex-1 text-left truncate" title={name}>
                      {name}
                    </div>
                  </button>
                  <button
                    className="flex justify-center items-center px-3 hover:text-white peer-hover:text-white hover:bg-red-500 peer-hover:bg-blue-500"
                    onClick={() =>
                      dispatch({ type: 'delete-saved-rule', payload: name })
                    }
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            {typeof ruleName === 'undefined' && (
              <>
                <div className="my-1 border-t border-neutral-300 dark:border-neutral-700" />
                <div className="flex gap-2 items-center px-2">
                  <MdCheck className="invisible" />
                  <div className="pt-1 text-sm text-neutral-500 select-none">
                    {t(
                      typeof savedRules[newRuleName] === 'undefined'
                        ? 'settings.save-as'
                        : 'settings.overwrite-save'
                    )}
                  </div>
                </div>
                <div className="group flex gap-2 items-center p-2">
                  <MdCheck className="invisible" />
                  <input
                    type="text"
                    size={1}
                    placeholder={t('settings.name')}
                    className="p-1 w-full bg-white dark:bg-black rounded-md border border-neutral-300 dark:border-neutral-700 transition"
                    onInput={e => setNewRuleName(e.currentTarget.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newRuleName.length !== 0) {
                        dispatch({
                          type: 'save-current-rule',
                          payload: newRuleName
                        });
                        setNewRuleName('');
                        e.preventDefault();
                      }
                    }}
                  />
                  <button
                    className="flex justify-center items-center p-2 hover:text-white disabled:hover:text-neutral-500 disabled:text-neutral-500 hover:bg-blue-500 disabled:hover:bg-transparent rounded-md"
                    disabled={newRuleName.length === 0}
                    onClick={() => {
                      dispatch({
                        type: 'save-current-rule',
                        payload: newRuleName
                      });
                      setNewRuleName('');
                    }}
                  >
                    <MdSave />
                  </button>
                </div>
              </>
            )}
          </div>
        </Dropdown>
        <div
          className="font-bold truncate"
          title={ruleName ?? t('settings.untitled-rule')}
        >
          {ruleName ?? t('settings.untitled-rule')}
        </div>
      </div>
      <div className="border-t border-neutral-300 dark:border-neutral-700" />
      <RuleEditor
        rule={currentRule}
        onChange={rule => dispatch({ type: 'set-current-rule', payload: rule })}
      />
    </div>
  );
};
