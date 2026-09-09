/** @paper-design/shaders-react@0.0.80 */
import { PulsingBorder } from '@paper-design/shaders-react';

/**
 * from Paper
 * https://app.paper.design/file/01KY5DQR7CXMCSZ64EV67DEJ49/01K4GP58P8JRM8PGBP0586VKYV/9G-0
 * on Sep 9, 2026
 */
export default function CardWithBorder({ children }) {
  return (
    <div style={{ 
      position: 'relative', 
      width: '400px',   // Задай потрібні розміри твого блоку/картки
      height: '300px', 
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#121212',
      boxSizing: 'border-box'
    }}>
      {/* Шейдер тепер працює чітко як рамка навколо цього конкретного блоку */}
      <PulsingBorder 
        speed={1} 
        roundness={0.15} 
        thickness={0.06}  // Тонка, чітка лінія рамки
        softness={0.3}    // Невеликий спад для об'єму, але без розмиття
        intensity={0.4} 
        bloom={0.2} 
        spots={4} 
        spotSize={0.4} 
        pulse={0.3} 
        smoke={0.2} 
        smokeSize={0.5} 
        scale={1} 
        rotation={0} 
        aspectRatio="auto" 
        colors={[
          '#444444', 
          '#999999', 
          '#FFFFFF'  
        ]} 
        colorBack="#00000000" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%', 
          width: '100%',
          pointerEvents: 'none',
          zIndex: 1
          // Блюр і transform scale повністю прибрані
        }} 
      />

      {/* Контент всередині цієї рамки */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        width: '100%', 
        height: '100%', 
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        {children}
      </div>
    </div>
  );
}