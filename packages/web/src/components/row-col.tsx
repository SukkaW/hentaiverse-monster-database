import clsx from 'clsx';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Row(props: Props) {
  return <div {...props} className={clsx('md:flex', props.className)}>{props.children}</div>;
}

export function Col(props: Props) {
  return <div {...props} className={clsx('block flex-1 m-3', props.className)}>{props.children}</div>;
}
