declare module '@typebot.io/react' {
  import { FC } from 'react';

  interface BubbleThemeButton {
    backgroundColor?: string;
    customIconSrc?: string;
  }

  interface BubbleTheme {
    button?: BubbleThemeButton;
  }

  interface BubblePreviewMessage {
    message: string;
    autoShowDelay?: number;
  }

  interface BubbleProps {
    typebot: string;
    apiHost?: string;
    previewMessage?: BubblePreviewMessage;
    theme?: BubbleTheme;
  }

  export const Bubble: FC<BubbleProps>;
}
