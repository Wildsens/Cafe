import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
/** @paper-design/shaders-react@0.0.80 */
import { PulsingBorder } from '@paper-design/shaders-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'food' | 'drinks'
  const [hoveredView, setHoveredView] = useState(null); // 'food' | 'drinks' | null
  
  // Автоматичний стан лагів (ставить на паузу при просадці, назад не знімається)
  const [isLagging, setIsLagging] = useState(false);
  
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [reviewsData, setReviewsData] = useState({
    food: [
      {
        name: 'Макар',
        text: 'Мені все сподобалось, особливо горішок!',
        images: ['./Images/back2.png']
      }
    ],
    drinks: [
      {
        name: 'Олена',
        text: 'Найсмачніші коктейлі в місті, атмосфера просто топ!',
        images: []
      }
    ]
  });

  // Автоматичне вимірювання FPS (тільки ставить на паузу при просадці)
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const checkFPS = (now) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = now;

        if (fps < 30) {
          setIsLagging(true);
        }
      }
      animationFrameId = requestAnimationFrame(checkFPS);
    };

    animationFrameId = requestAnimationFrame(checkFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setReviewImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => ({
        id: URL.createObjectURL(file),
        name: file.name
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove].id);
    setReviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const authorName = isAnonymous ? 'Анонімно' : (name.trim() || 'Гість');
    const uploadedImages = imagePreviews.map((item) => item.id);

    const newReview = {
      name: authorName,
      text: reviewText,
      images: uploadedImages
    };

    setReviewsData((prev) => ({
      ...prev,
      [currentView]: [newReview, ...prev[currentView]]
    }));

    setIsSubmitted(true);
  };

  const handleBackToHome = () => {
    imagePreviews.forEach((item) => URL.revokeObjectURL(item.id));
    setCurrentView('home');
    setHoveredView(null);
    setIsSubmitted(false);
    setName('');
    setIsAnonymous(false);
    setReviewText('');
    setReviewImages([]);
    setImagePreviews([]);
  };

  const activeTheme = hoveredView || (currentView !== 'home' ? currentView : 'food');
  
  // Синє оформлення для Drinks, червоне для Food
  const shaderColors = activeTheme === 'food' 
    ? ['#500000', '#D02000', '#A00000', '#FF0000', '#C2493B'] 
    : ['#001133', '#004488', '#002266', '#0066CC', '#2288EE'];

  const isPaused = isLagging;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      minHeight: '100vh', 
      overflowY: 'auto', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: currentView === 'home' ? 'center' : 'flex-start', 
      justifyContent: 'center',
      boxSizing: 'border-box',
      padding: '40px 24px',
      backgroundColor: '#000000'
    }}>

      {/* ІНДИКАТОР СТАНУ */}
      {isLagging && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(20, 20, 25, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.8)',
          padding: '8px 14px',
          borderRadius: '16px',
          fontSize: '0.8rem',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}>
          ⚡ Енергозбереження фону
        </div>
      )}

      {/* ФОНОВИЙ ШАР */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#000000'
      }}>
        <PulsingBorder 
          speed={isPaused ? 0 : 0.18} 
          roundness={0} 
          thickness={0.38} 
          softness={1} 
          intensity={0.45} 
          bloom={0.11} 
          spots={4} 
          spotSize={0.21} 
          pulse={0} 
          smoke={0.12} 
          smokeSize={1} 
          scale={1.13} 
          rotation={360} 
          aspectRatio="auto" 
          colors={shaderColors} 
          colorBack="#000000" 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />
      </div>

      {/* Затемнюючий шар */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(10, 10, 12, 0.75)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* ЕКРАН 1: ГОЛОВНЕ МЕНЮ */}
      {currentView === 'home' && (
        <main style={{ 
          position: 'relative', 
          zIndex: 2, 
          color: '#FFFFFF', 
          padding: '2.5rem',
          textAlign: 'center',
          background: 'rgba(18, 18, 22, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
          maxWidth: '850px',
          width: '100%',
          boxSizing: 'border-box',
          margin: 'auto'
        }}>
          <h1 style={{ 
            fontFamily: '"Oswald", sans-serif',
            fontSize: '3.2rem', 
            marginBottom: '3.5rem', 
            fontWeight: '700',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            color: '#FFFFFF'
          }}>
            Обери заклад
          </h1>

          <div style={{ display: 'flex', gap: '3.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { view: 'food', src: './Images/Family_Food.png', alt: 'Family Food Logo', glowColor: 'rgba(255, 0, 0, 0.4)', borderColor: 'rgba(255, 50, 50, 0.6)' },
              { view: 'drinks', src: './Images/Family_Drinks.png', alt: 'Family Drinks Logo', glowColor: 'rgba(0, 102, 204, 0.4)', borderColor: 'rgba(0, 136, 255, 0.6)' }
            ].map((item, index) => {
              const isHovered = hoveredView === item.view;
              return (
                <div 
                  key={index}
                  onClick={() => setCurrentView(item.view)}
                  onMouseEnter={() => setHoveredView(item.view)}
                  onMouseLeave={() => setHoveredView(null)}
                  style={{
                    background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    border: `1px solid ${isHovered ? item.borderColor : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '280px',
                    height: '280px',
                    boxSizing: 'border-box',
                    transform: isHovered ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered 
                      ? `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px ${item.glowColor}` 
                      : '0 10px 30px rgba(0,0,0,0.4)'
                  }}
                >
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain', 
                      filter: isHovered 
                        ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.7)) brightness(1.1)' 
                        : 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
                      transition: 'filter 0.35s ease'
                    }} 
                  />
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ЕКРАН 2: ВІДГУКИ ТА ФОРМА */}
      {currentView !== 'home' && (
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          width: '100%', 
          maxWidth: '850px', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '24px', 
          boxSizing: 'border-box'
        }}>
          
          {/* ФОРМА ДЛЯ ВІДГУКУ */}
          <main style={{ 
            color: '#FFFFFF', 
            padding: '2.5rem',
            textAlign: 'left',
            background: 'rgba(18, 18, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <button 
                onClick={handleBackToHome}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#E0E0E0',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                ← Назад
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <img 
                src={currentView === 'food' ? './Images/Family_Food.png' : './Images/Family_Drinks.png'} 
                alt="Logo" 
                style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <h1 style={{ 
              fontFamily: '"Oswald", sans-serif',
              fontSize: '1.6rem', 
              marginBottom: '1.2rem', 
              fontWeight: '700',
              textTransform: 'uppercase',
              textAlign: 'center',
              color: '#FFFFFF'
            }}>
              Залишити відгук
            </h1>

            {!isSubmitted ? (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer', 
                    fontSize: '1rem', 
                    color: '#FFFFFF',
                    background: isAnonymous ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    padding: '0.8rem 1.2rem',
                    borderRadius: '14px',
                    border: `1px solid ${isAnonymous ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                    <span>Анонімно</span>
                  </div>

                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: isAnonymous ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'background 0.3s ease'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      background: '#121216',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: isAnonymous ? '23px' : '3px',
                      transition: 'left 0.3s ease'
                    }} />
                  </div>
                </div>

                {!isAnonymous && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Ваше ім'я (необов'язково)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Введіть ваше ім'я..." 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1.2rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Ваш відгук *
                  </label>
                  <textarea 
                    placeholder="Розкажіть про свої враження..." 
                    rows="3"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1.2rem',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Прикріпити фото
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed rgba(255, 255, 255, 0.25)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    marginBottom: imagePreviews.length > 0 ? '8px' : '0'
                  }}>
                    <span>📷 Обрати фото</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImagesChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {imagePreviews.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                      gap: '8px',
                      maxHeight: '130px',
                      overflowY: 'auto',
                      padding: '4px'
                    }}>
                      {imagePreviews.map((preview, index) => (
                        <div key={index} style={{
                          position: 'relative',
                          width: '100%',
                          height: '75px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(0, 0, 0, 0.4)'
                        }}>
                          <img src={preview.id} alt={preview.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(0, 0, 0, 0.8)',
                              border: '1px solid rgba(255,255,255,0.4)',
                              color: '#FFFFFF',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  style={{
                    marginTop: '0.4rem',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Oswald", sans-serif',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))'}
                >
                  Надіслати відгук
                </button>
              </form>
            ) : (
              <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', textAlign: 'center' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                }}>
                  ✓
                </div>
                <h2 style={{ fontFamily: '"Oswald", sans-serif', fontSize: '1.8rem', margin: 0, textTransform: 'uppercase', color: '#FFFFFF' }}>
                  Дякуємо! Готово! 🚀
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: 0 }}>
                  Ваш відгук успішно надіслано.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.8rem 2rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontFamily: '"Oswald", sans-serif',
                    textTransform: 'uppercase'
                  }}
                >
                  Написати ще
                </button>
              </div>
            )}
          </main>

          {/* БЛОК ЗІ СПИСКОМ ВІДГУКІВ */}
          <div style={{
            color: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: '24px',
            background: 'rgba(18, 18, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.8rem'
            }}>
              <h3 style={{ 
                fontFamily: '"Oswald", sans-serif', 
                fontSize: '1.4rem', 
                margin: 0, 
                textTransform: 'uppercase', 
                color: '#FFFFFF',
                letterSpacing: '0.03em' 
              }}>
                Відгуки гостей ({reviewsData[currentView].length})
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                {currentView === 'food' ? 'Family Food' : 'Family Drinks'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}>
              {reviewsData[currentView].map((rev, index) => (
                <div key={index} style={{
                  padding: '1.2rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#FFFFFF' }}>{rev.name}</span>
                  </div>
                  
                  <p style={{ margin: 0, fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                    {rev.text}
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginTop: '0.4rem'
                    }}>
                      {rev.images.map((imgSrc, imgIndex) => (
                        <div key={imgIndex} style={{
                          width: '100%',
                          maxHeight: '260px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: '#000'
                        }}>
                          <img 
                            src={imgSrc} 
                            alt="Фото відгуку" 
                            style={{ width: '100%', height: '100%', maxHeight: '260px', objectFit: 'cover', display: 'block' }} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

// Захист від дублюючого createRoot
const container = document.getElementById('root');
if (!window.__root) {
  window.__root = ReactDOM.createRoot(container);
}

window.__root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);