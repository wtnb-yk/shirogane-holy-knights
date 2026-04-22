import { OG } from './base-template';
import { type OgReportTheme, GENRE_COLORS } from './report-theme';

type Genre = { name: string; count: number };

type ReportOgData = {
  streamCount: number;
  coverageRate: number;
  weeklyAverage: number;
  maxStreak: number;
  favoriteSongCount: number;
  genres: Genre[];
};

export function ReportOgTemplate({
  data,
  theme: c,
}: {
  data: ReportOgData;
  theme: OgReportTheme;
}) {
  const genreTotal = data.genres.reduce((s, g) => s + g.count, 0);

  const stats = [
    { label: '配信カバー率', value: data.coverageRate, unit: '%' },
    { label: '週あたり平均', value: data.weeklyAverage, unit: '本/週' },
    { label: '連続視聴記録', value: data.maxStreak, unit: '日' },
    { label: 'お気に入り楽曲', value: data.favoriteSongCount, unit: '曲' },
  ];

  return (
    <div
      style={{
        width: OG.width,
        height: OG.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: c.bgStyle,
        fontFamily: OG.fontBody,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 左上装飾 */}
      <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 120 - i * 30,
              background:
                i === 0 ? c.line : `rgba(200,162,76,${0.3 - i * 0.1})`,
              marginLeft: i === 0 ? 60 : 10,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {/* 右下装飾 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 120 - i * 30,
              background:
                i === 0 ? c.line : `rgba(200,162,76,${0.3 - i * 0.1})`,
              marginRight: i === 0 ? 60 : 10,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 24, color: c.icon }}>&#9876;</div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: c.monoLabel,
            textTransform: 'uppercase' as const,
            marginTop: 6,
          }}
        >
          Activity Report
        </div>
        <div
          style={{
            width: 36,
            height: 2,
            background: c.line,
            borderRadius: 1,
            margin: '10px 0',
          }}
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: c.heading,
            letterSpacing: '0.04em',
            lineHeight: 1.3,
            textAlign: 'center',
          }}
        >
          白銀聖騎士団 団員レポート
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          width: 920,
          alignItems: 'flex-start',
        }}
      >
        {/* 左: ジャンル分布 */}
        <GenreSection
          streamCount={data.streamCount}
          genres={data.genres}
          genreTotal={genreTotal}
          theme={c}
        />

        {/* 右: 統計グリッド */}
        <StatsGrid stats={stats} theme={c} />
      </div>

      {/* フッター */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          fontSize: 11,
          color: c.footerText,
        }}
      >
        だんいんログ &mdash; 白銀ノエル非公式ファンサイト
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function GenreSection({
  streamCount,
  genres,
  genreTotal,
  theme: c,
}: {
  streamCount: number;
  genres: Genre[];
  genreTotal: number;
  theme: OgReportTheme;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: OG.fontDisplay,
            fontSize: 48,
            fontWeight: 700,
            color: c.heading,
            lineHeight: 1,
          }}
        >
          {streamCount}
        </span>
        <span style={{ fontSize: 14, color: c.sub }}>本の配信を視聴</span>
      </div>

      {genres.map((g, i) => {
        const pct =
          genreTotal > 0 ? Math.round((g.count / genreTotal) * 100) : 0;
        return (
          <div
            key={g.name}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: GENRE_COLORS[i % GENRE_COLORS.length],
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: c.cellLabel, width: 80 }}>
              {g.name}
            </span>
            <div
              style={{
                flex: 1,
                height: 14,
                background: c.barBg,
                borderRadius: 3,
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: GENRE_COLORS[i % GENRE_COLORS.length],
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                color: c.sub,
                width: 30,
                textAlign: 'right',
              }}
            >
              {g.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StatsGrid({
  stats,
  theme: c,
}: {
  stats: { label: string; value: number; unit: string }[];
  theme: OgReportTheme;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        width: 380,
        flexShrink: 0,
      }}
    >
      {stats.map((item) => (
        <div
          key={item.label}
          style={{
            width: 185,
            background: c.cellBg,
            border: `1px solid ${c.cellBorder}`,
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: c.cellLabel,
              letterSpacing: '0.04em',
            }}
          >
            {item.label}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 3,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontFamily: OG.fontDisplay,
                fontSize: 28,
                fontWeight: 700,
                color: c.accent,
                lineHeight: 1.1,
              }}
            >
              {item.value}
            </span>
            <span style={{ fontSize: 12, color: c.cellLabel }}>
              {item.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
