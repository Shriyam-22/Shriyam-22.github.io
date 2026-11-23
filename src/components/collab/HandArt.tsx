/**
 * Hand-drawn ink fist with a dark sleeve, drawn in a local 320×320 space.
 * The pivot (150,160) sits in the middle of the fist; strings end at GRIP
 * points tucked behind the curled fingers so they read as held.
 */
export function HandArt() {
  return (
    <g
      className="hand-art"
      fill="none"
      stroke="#111"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#ink-rough)"
    >
      {/* sleeve and shirt cuff */}
      <path d="M58 214 L10 560 L240 560 L168 214 Z" fill="#121212" />
      <path d="M70 250 Q80 300 66 380" stroke="#2c2c2c" strokeWidth="1.4" />
      <path d="M62 206 Q113 196 166 206 L170 230 Q113 220 58 230 Z" fill="#f7f5f0" />
      <path d="M66 224 Q113 215 166 223" strokeWidth="1.2" />
      <circle cx="150" cy="218" r="3" fill="#111" />

      {/* back of the hand */}
      <path d="M66 210 C60 180 56 150 62 124 L172 118 C182 140 178 178 164 210 Z" fill="#f7f5f0" />
      <path d="M158 205 C170 180 175 156 172 126 L164 126 C166 160 160 182 146 206 Z" fill="url(#ink-hatch)" stroke="none" />
      <path d="M96 190 Q112 196 132 190" strokeWidth="1" opacity="0.7" />

      {/* curled fingers */}
      <path d="M74 96 C74 84 98 82 100 96 L100 130 C100 142 76 142 74 130 Z" fill="#f7f5f0" />
      <path d="M100 92 C100 79 126 78 127 92 L127 132 C127 145 101 145 100 132 Z" fill="#f7f5f0" />
      <path d="M127 95 C128 82 152 82 153 96 L153 132 C152 144 128 144 127 132 Z" fill="#f7f5f0" />
      <path d="M153 104 C154 92 174 93 175 106 L174 134 C173 145 154 145 153 134 Z" fill="#f7f5f0" />
      <path d="M80 114 Q87 117 94 114 M106 114 Q113 117 121 114 M133 115 Q140 118 147 115 M158 118 Q164 121 170 118" strokeWidth="1.2" />
      <path d="M94 96 L94 132" strokeWidth="5" stroke="url(#ink-hatch)" />
      <path d="M121 94 L121 134" strokeWidth="5" stroke="url(#ink-hatch)" />
      <path d="M147 97 L147 134" strokeWidth="5" stroke="url(#ink-hatch)" />
      <path d="M169 107 L169 134" strokeWidth="5" stroke="url(#ink-hatch)" />
      {/* knuckle highlights */}
      <path d="M80 90 Q86 87 92 89 M107 86 Q113 83 119 85 M134 89 Q140 86 146 88" stroke="#fff" strokeWidth="1.6" />

      {/* thumb wrapping across */}
      <path
        d="M58 170 C46 150 50 126 70 120 C88 116 104 120 122 126 C132 130 132 146 118 146 C100 146 84 146 74 156 C68 162 66 168 66 176 Z"
        fill="#f7f5f0"
      />
      <path d="M110 128 C118 128 124 132 124 138" strokeWidth="1.3" />
      <path d="M60 150 C56 140 58 132 64 128" strokeWidth="5" stroke="url(#ink-hatch)" />
      <path d="M76 150 Q94 144 116 146" strokeWidth="1.1" />
    </g>
  )
}

export function HandDefs() {
  return (
    <defs>
      <filter id="ink-rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="1.6" />
      </filter>
      <pattern id="ink-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="#111" strokeWidth="0.9" />
      </pattern>
      <filter id="hand-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.16" />
      </filter>
    </defs>
  )
}
