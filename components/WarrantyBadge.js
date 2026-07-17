const GOLD = '#C5A028';

// 5 stars spread ±40° from 12-o'clock at r=72 from center (100,100)
const STAR_POS = [
    { x: 53.7,  y: 49.9 },  // -130° from x-axis
    { x: 75.4,  y: 32.4 },  // -110°
    { x: 100,   y: 28   },  // -90° (top)
    { x: 124.6, y: 32.4 },  // -70°
    { x: 146.3, y: 49.9 },  // -50°
];

export default function WarrantyBadge({ size = 80 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Up to 5-year workmanship warranty seal"
            style={{ flexShrink: 0 }}
        >
            <defs>
                {/* Clockwise from left-middle to right-middle → passes through bottom */}
                <path id="wbArc" d="M 31,100 A 69,69 0 0,1 169,100" fill="none" />
            </defs>

            {/* Outer ring */}
            <circle cx="100" cy="100" r="94" fill="none" stroke={GOLD} strokeWidth="3" />
            {/* Inner ring */}
            <circle cx="100" cy="100" r="85" fill="none" stroke={GOLD} strokeWidth="1.5" />

            {/* 5 stars */}
            {STAR_POS.map((pos, i) => (
                <text
                    key={i}
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fill={GOLD}
                    fontFamily="serif"
                >
                    ★
                </text>
            ))}

            {/* UP TO — horizontal rules + text */}
            <line x1="20"  y1="53" x2="65"  y2="53" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
            <text
                x="100" y="57"
                textAnchor="middle"
                fontSize="13"
                fill={GOLD}
                fontFamily="'Barlow Condensed','Barlow',sans-serif"
                fontWeight="700"
                letterSpacing="3"
            >
                UP TO
            </text>
            <line x1="135" y1="53" x2="180" y2="53" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />

            {/* 5-YEAR — dominant center text */}
            <text
                x="100" y="92"
                textAnchor="middle"
                fontSize="51"
                fill={GOLD}
                fontFamily="'Barlow Condensed','Barlow',sans-serif"
                fontWeight="700"
                letterSpacing="-0.5"
            >
                5-YEARS
            </text>

            {/* Shield */}
            <path
                d="M100,128 C93,126 89,120.5 89,115 L89,109 L100,106 L111,109 L111,115 C111,120.5 107,126 100,128 Z"
                fill="none"
                stroke={GOLD}
                strokeWidth="2"
            />
            {/* Checkmark inside shield */}
            <path
                d="M95,117 L99,121.5 L106.5,113"
                fill="none"
                stroke={GOLD}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dashes flanking shield */}
            <line x1="20"  y1="117" x2="78"  y2="117" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="122" y1="117" x2="180" y2="117" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />

            {/* WORKMANSHIP WARRANTY curved along bottom */}
            <text
                fontSize="10.5"
                fill={GOLD}
                fontFamily="'Barlow Condensed','Barlow',sans-serif"
                fontWeight="700"
                letterSpacing="2"
                textAnchor="middle"
            >
                <textPath href="#wbArc" startOffset="50%">
                    WORKMANSHIP WARRANTY
                </textPath>
            </text>
        </svg>
    );
}
