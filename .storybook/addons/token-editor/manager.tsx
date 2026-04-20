import React from 'react';
import { addons, types } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { TokenEditorPanel } from './TokenEditorPanel';

const ADDON_ID = 'sailwind/token-editor';
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: '🎨 Tokens',
    render: ({ active }) => (
      <AddonPanel active={active ?? false}>
        <TokenEditorPanel />
      </AddonPanel>
    ),
  });
});
