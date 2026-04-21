type Props = {
  value: string;
  unit: string;
  label: string;
};

export function StatCell({ value, unit, label }: Props) {
  return (
    <div className="p-sm bg-page rounded-sm">
      <div className="font-display text-lg font-semibold text-heading leading-none">
        {value}
        <span className="text-3xs font-normal text-subtle">{unit}</span>
      </div>
      <div className="font-mono text-4xs text-subtle mt-2xs">{label}</div>
    </div>
  );
}
