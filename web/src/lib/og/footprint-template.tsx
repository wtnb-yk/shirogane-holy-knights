import { OG } from './base-template';

type FootprintOgData = {
  year: number;
  activeDays: number;
  maxStreak: number;
  totalChecks: number;
};

export function FootprintOgTemplate({ data }: { data: FootprintOgData }) {
  const stats = [
    { label: '視聴記録', value: data.activeDays, unit: '日' },
    { label: '最長連続', value: data.maxStreak, unit: '日' },
    { label: '視聴本数', value: data.totalChecks, unit: '本' },
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
        background: OG.cream50,
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
                i === 0 ? OG.gold400 : `rgba(200,162,76,${0.3 - i * 0.1})`,
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
                i === 0 ? OG.gold400 : `rgba(200,162,76,${0.3 - i * 0.1})`,
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
          marginBottom: 40,
        }}
      >
        <div style={{ fontSize: 24, color: '#BBB4B8' }}>&#9876;</div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: OG.gold500,
            textTransform: 'uppercase' as const,
            marginTop: 6,
          }}
        >
          Footprint
        </div>
        <div
          style={{
            width: 36,
            height: 2,
            background: OG.gold400,
            borderRadius: 1,
            margin: '10px 0',
          }}
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: OG.dark800,
            letterSpacing: '0.04em',
            lineHeight: 1.3,
            textAlign: 'center',
          }}
        >
          {`団員のあしあと ${data.year}`}
        </div>
      </div>

      {/* 統計 */}
      <div
        style={{
          display: 'flex',
          gap: 16,
        }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              width: 220,
              background: OG.cream100,
              border: `1px solid #E2E2E6`,
              borderRadius: 12,
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#6A7380',
                letterSpacing: '0.04em',
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontFamily: OG.fontDisplay,
                  fontSize: 40,
                  fontWeight: 700,
                  color: OG.gold500,
                  lineHeight: 1.1,
                }}
              >
                {item.value}
              </span>
              <span style={{ fontSize: 14, color: '#6A7380' }}>
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          fontSize: 11,
          color: OG.navy300,
        }}
      >
        だんいんログ &mdash; 白銀ノエル非公式ファンサイト
      </div>
    </div>
  );
}
