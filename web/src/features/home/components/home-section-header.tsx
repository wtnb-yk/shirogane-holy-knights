import { Reveal } from '@/components/ui/reveal';

type Props = {
  num: string;
  label: string;
  title: string;
  description: string;
};

export function HomeSectionHeader({ num, label, title, description }: Props) {
  return (
    <Reveal>
      <div className="font-mono text-xs font-normal tracking-wider text-accent-label mb-sm">
        {num} &mdash; {label}
      </div>
      <h2 className="font-display text-2xl font-semibold text-heading leading-[1.3] mb-xs">
        {title}
      </h2>
      <p className="text-sm text-muted max-w-[560px] mb-xl leading-relaxed">
        {description}
      </p>
    </Reveal>
  );
}
