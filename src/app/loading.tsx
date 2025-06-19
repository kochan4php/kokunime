export default function Loading() {
  return (
    <div>
      {/* Static Loading Shell - Pre-rendered HTML */}
      <div id="static-loader" className="static-loading-container">
        {/* Animated Gradient Background */}
        <div className="static-loading-background">
          <div className="static-gradient-layer-1"></div>
          <div className="static-gradient-layer-2"></div>
          <div className="static-gradient-layer-3"></div>
          <div className="static-gradient-overlay"></div>
        </div>

        {/* Loading Content */}
        <div className="static-loading-content">
          {/* Brand Logo */}
          <div className="static-loading-brand">
            <div className="static-brand-text">
              <span className="static-brand-main">Kokunime</span>
              <span className="static-brand-sub">コクニメ</span>
            </div>
          </div>

          {/* Main Loading Animation */}
          <div className="static-loading-animation-container">
            {/* Orbital Spinner */}
            <div className="static-orbital-spinner">
              <div className="static-orbit static-orbit-1">
                <div className="static-planet static-planet-1"></div>
              </div>
              <div className="static-orbit static-orbit-2">
                <div className="static-planet static-planet-2"></div>
              </div>
              <div className="static-orbit static-orbit-3">
                <div className="static-planet static-planet-3"></div>
              </div>
              <div className="static-central-core"></div>
            </div>

            {/* Pulse Rings */}
            <div className="static-pulse-rings">
              <div className="static-pulse-ring static-ring-1"></div>
              <div className="static-pulse-ring static-ring-2"></div>
              <div className="static-pulse-ring static-ring-3"></div>
            </div>

            {/* Wave Animation */}
            <div className="static-wave-container">
              <div className="static-wave static-wave-1"></div>
              <div className="static-wave static-wave-2"></div>
              <div className="static-wave static-wave-3"></div>
              <div className="static-wave static-wave-4"></div>
              <div className="static-wave static-wave-5"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="static-loading-text">
            <span className="static-loading-label" id="loading-text">
              Loading
            </span>
            {/* <div className="static-loading-progress">
              <div className="static-progress-bar"></div>
            </div> */}
          </div>

          {/* Floating Particles */}
          <div className="static-particles-container">
            <div className="static-particle" style={{ left: '10%', animationDelay: '0s', animationDuration: '4s' }}></div>
            <div className="static-particle" style={{ left: '20%', animationDelay: '0.5s', animationDuration: '5s' }}></div>
            <div className="static-particle" style={{ left: '30%', animationDelay: '1s', animationDuration: '3.5s' }}></div>
            <div className="static-particle" style={{ left: '40%', animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
            <div className="static-particle" style={{ left: '50%', animationDelay: '2s', animationDuration: '6s' }}></div>
            <div className="static-particle" style={{ left: '60%', animationDelay: '2.5s', animationDuration: '3s' }}></div>
            <div className="static-particle" style={{ left: '70%', animationDelay: '3s', animationDuration: '5.5s' }}></div>
            <div className="static-particle" style={{ left: '80%', animationDelay: '3.5s', animationDuration: '4s' }}></div>
            <div className="static-particle" style={{ left: '90%', animationDelay: '4s', animationDuration: '7s' }}></div>
            <div className="static-particle" style={{ left: '15%', animationDelay: '0.2s', animationDuration: '4.2s' }}></div>
            <div className="static-particle" style={{ left: '25%', animationDelay: '0.7s', animationDuration: '5.2s' }}></div>
            <div className="static-particle" style={{ left: '35%', animationDelay: '1.2s', animationDuration: '3.7s' }}></div>
            <div className="static-particle" style={{ left: '45%', animationDelay: '1.7s', animationDuration: '4.7s' }}></div>
            <div className="static-particle" style={{ left: '55%', animationDelay: '2.2s', animationDuration: '6.2s' }}></div>
            <div className="static-particle" style={{ left: '65%', animationDelay: '2.7s', animationDuration: '3.2s' }}></div>
            <div className="static-particle" style={{ left: '75%', animationDelay: '3.2s', animationDuration: '5.7s' }}></div>
            <div className="static-particle" style={{ left: '85%', animationDelay: '3.7s', animationDuration: '4.2s' }}></div>
            <div className="static-particle" style={{ left: '95%', animationDelay: '4.2s', animationDuration: '7.2s' }}></div>
            <div className="static-particle" style={{ left: '5%', animationDelay: '0.3s', animationDuration: '4.3s' }}></div>
            <div className="static-particle" style={{ left: '12%', animationDelay: '0.8s', animationDuration: '5.3s' }}></div>
          </div>
        </div>
      </div>

      {/* Vanilla JavaScript for Loading Management */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                // Loading text animation
                let dotCount = 0;
                const loadingText = document.getElementById('loading-text');
                const dotInterval = setInterval(function() {
                  dotCount = (dotCount + 1) % 4;
                  loadingText.textContent = 'Loading' + '.'.repeat(dotCount);
                }, 500);

                // Hide loader and show app when everything is loaded
                function hideLoader() {
                  const loader = document.getElementById('static-loader');
                  const appContent = document.getElementById('app-content');
                  
                  if (loader && appContent) {
                    // Clear the dot animation
                    clearInterval(dotInterval);
                    
                    // Fade out loader
                    loader.style.transition = 'opacity 0.5s ease-out';
                    loader.style.opacity = '0';
                    
                    setTimeout(function() {
                      loader.style.display = 'none';
                      appContent.style.display = 'block';
                      
                      // Fade in app content
                      appContent.style.opacity = '0';
                      appContent.style.transition = 'opacity 0.3s ease-in';
                      setTimeout(function() {
                        appContent.style.opacity = '1';
                      }, 50);
                    }, 500);
                  }
                }

                // Wait for window load event
                if (document.readyState === 'complete') {
                  // If already loaded, hide immediately
                  setTimeout(hideLoader, 1000);
                } else {
                  // Wait for load event
                  window.addEventListener('load', function() {
                    // Add minimum loading time for better UX
                    setTimeout(hideLoader, 1000);
                  });
                }

                // Fallback: hide after maximum time
                setTimeout(hideLoader, 8000);
              })();
            `,
        }}
      />
    </div>
  );
}
