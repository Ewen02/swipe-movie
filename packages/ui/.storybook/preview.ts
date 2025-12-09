import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const selectedBackground = context.globals.backgrounds?.value;
      const isDark = selectedBackground === '#0a0a0a' || (!selectedBackground && context.parameters.backgrounds?.default === 'dark');

      React.useEffect(() => {
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }, [isDark]);

      return React.createElement(
        'div',
        { className: isDark ? 'dark p-4' : 'p-4' },
        React.createElement(Story)
      );
    },
  ],
};

export default preview;
