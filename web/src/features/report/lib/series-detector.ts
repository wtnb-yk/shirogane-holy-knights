/**
 * 配信タイトルからゲーム/シリーズ名を抽出する
 *
 * タイトルの【...】パターンからゲーム名を取り出す。
 * 所属・カテゴリ・イベント等の非ゲーム括弧は除外リストでフィルタする。
 */

const EXCLUDE_PATTERNS = [
  /ホロライブ/,
  /hololive/i,
  /白銀ノエル/,
  /不知火フレア/,
  /宝鐘マリン/,
  /兎田ぺこら/,
  /雪花ラミィ/,
  /天音かなた/,
  /癒月ちょこ/,
  /^#/, // イベントハッシュタグ（#ホロ新春ゲーム祭 等）
  /雑談/,
  /ASMR/i,
  /メンバー限定/,
  /メンバー雑談/,
  /応援枠/,
  /朝活/,
  /晩酌/,
  /歌枠/,
  /新衣装/,
  /お披露目/,
  /誕生日/,
  /生誕/,
  /記念/,
  /カウントダウン/,
  /ビジネス/,
  /怒りマーク/,
];

/**
 * タイトルから【...】を全て抽出し、ゲーム名と判定されるものを返す
 */
export function extractSeriesName(title: string): string | null {
  const brackets = title.match(/【([^】]+)】/g);
  if (!brackets) return null;

  for (const bracket of brackets) {
    const inner = bracket.slice(1, -1); // 【】を除去

    // 除外パターンに該当したらスキップ
    if (EXCLUDE_PATTERNS.some((p) => p.test(inner))) continue;

    // エピソード番号のプレフィックスを除去（"#07 " 等は title 側にあるが念のため）
    return inner.replace(/^#?\d+\s*/, '').trim() || null;
  }

  return null;
}
