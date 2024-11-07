import type { Theme } from '@mui/material/styles';

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      sx?: 
        | React.CSSProperties
        | ((theme: Theme) => React.CSSProperties)
        | ReadonlyArray<React.CSSProperties | ((theme: Theme) => React.CSSProperties)>;
    }
  }
}

export {};