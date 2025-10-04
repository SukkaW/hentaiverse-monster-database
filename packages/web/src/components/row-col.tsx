import { clsx } from 'clsx';

export function Row(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} className={clsx('md:flex', props.className)}>{props.children}</div>;
}

export function Col(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} className={clsx('block flex-1 m-3', props.className)}>{props.children}</div>;
}
