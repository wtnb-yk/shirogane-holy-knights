type Props = {
  message?: string;
};

export function NoResults({
  message = '検索条件やタグフィルタを変更してみてください',
}: Props) {
  return (
    <div className="text-center py-3xl">
      <div className="text-[2rem] mb-md opacity-40">&#9876;</div>
      <p className="text-sm text-muted leading-relaxed">
        <strong className="text-heading">該当する配信が見つかりません</strong>
        <br />
        {message}
      </p>
    </div>
  );
}
