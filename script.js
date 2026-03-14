// Discord Profile Script

// Audio functionality
let backgroundMusic;
let isPlaying = false;
let autoplayAttempts = 0;
const maxAttempts = 8;

// Song rotation system
let currentSongIndex;
const songs = [
    { id: 'background-music', name: 'Song 1' }
    // Only use song1 since song2 and song3 don't exist
];

// Pick random song on page load
function pickRandomSong() {
    currentSongIndex = Math.floor(Math.random() * songs.length);
    const selectedSong = songs[currentSongIndex];
    console.log(`Randomly selected: ${selectedSong.name}`);
    
    // Update backgroundMusic to point to selected song
    backgroundMusic = document.getElementById(selectedSong.id);
    
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3; // Set volume to 30%
        console.log(`Ready to play: ${selectedSong.name}`);
        console.log(`Audio element found: ${selectedSong.id}`);
        console.log(`Audio source: ${backgroundMusic.querySelector('source').src}`);
        console.log(`Audio readyState: ${backgroundMusic.readyState}`);
        console.log(`Audio volume set to: ${backgroundMusic.volume}`);
        console.log(`Audio muted: ${backgroundMusic.muted}`);
    } else {
        console.error(`Audio element NOT found: ${selectedSong.id}`);
        // Fallback to original song
        backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            console.log('Fallback to original song');
            console.log(`Fallback audio source: ${backgroundMusic.querySelector('source').src}`);
            console.log(`Fallback audio readyState: ${backgroundMusic.readyState}`);
        }
    }
}

// Initialize immediately
(function initAudio() {
    // Pick random song first
    pickRandomSong();
    
    if (backgroundMusic) {
        console.log('Audio element found, initializing...');
        
        // Add event listener for when song ends
        backgroundMusic.addEventListener('ended', function() {
            console.log('Song ended, picking new random song...');
            pickRandomSong(); // Pick new random song
            if (backgroundMusic) {
                backgroundMusic.play().catch(error => {
                    console.log('Failed to play new song:', error);
                });
            }
        });
        
        // Try advanced autoplay methods (in case intro doesn't work)
        tryAdvancedAutoplay();
        
        // Initialize intro screen
        initializeIntroScreen();
        
        // Initialize controls
        initializeControls();
        animateVisitorCount();
        
        // Initialize cursor tracking
        initializeCursorSpiral();
    } else {
        console.error('Audio element not found!');
        // Retry after a short delay
        setTimeout(initAudio, 100);
    }
})();

// Intro Screen Functionality
function initializeIntroScreen() {
    const introScreen = document.getElementById('intro-screen');
    
    if (introScreen) {
        let isReady = false;
        
        // DEBUG: Check audio element on page load
        console.log('=== AUDIO DEBUG ===');
        console.log('backgroundMusic element:', backgroundMusic);
        if (backgroundMusic) {
            console.log('Audio src:', backgroundMusic.querySelector('source').src);
            console.log('Audio readyState:', backgroundMusic.readyState);
            console.log('Audio duration:', backgroundMusic.duration);
            console.log('Audio paused:', backgroundMusic.paused);
            console.log('Audio volume:', backgroundMusic.volume);
            console.log('Audio muted:', backgroundMusic.muted);
        }
        
        // Make entire screen clickable (but only when ready)
        introScreen.addEventListener('click', function(e) {
            if (!isReady) {
                console.log('Intro screen not ready yet - text still typing...');
                return; // Don't allow click until text is done
            }
            
            console.log('=== CLICK DEBUG ===');
            console.log('CLICKED - PLAYING MUSIC NOW!');
            
            // DEBUG: Check audio state before playing
            if (backgroundMusic) {
                console.log('Before play - readyState:', backgroundMusic.readyState);
                console.log('Before play - paused:', backgroundMusic.paused);
                console.log('Before play - volume:', backgroundMusic.volume);
                console.log('Before play - muted:', backgroundMusic.muted);
                
                // Try to load first
                backgroundMusic.load();
                
                setTimeout(() => {
                    console.log('After load - readyState:', backgroundMusic.readyState);
                    
                    // UNMUTE and set volume BEFORE playing
                    backgroundMusic.muted = false;
                    backgroundMusic.volume = 0.3;
                    backgroundMusic.currentTime = 0; // Start from beginning
                    
                    console.log('Before play - volume set to:', backgroundMusic.volume);
                    console.log('Before play - muted set to:', backgroundMusic.muted);
                    
                    const playPromise = backgroundMusic.play();
                    console.log('Play promise:', playPromise);
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log('✅ MUSIC PLAYING SUCCESSFULLY!');
                            console.log('After play - paused:', backgroundMusic.paused);
                            console.log('After play - currentTime:', backgroundMusic.currentTime);
                            isPlaying = true;
                        }).catch(error => {
                            console.error('❌ MUSIC PLAY FAILED:', error);
                            console.error('Error name:', error.name);
                            console.error('Error message:', error.message);
                        });
                    }
                }, 500);
            } else {
                console.error('❌ NO BACKGROUND MUSIC ELEMENT FOUND!');
            }
            
            // Hide intro screen but DON'T remove it completely
            introScreen.classList.add('hidden');
            // Keep the intro screen in DOM, just hidden
        });
        
        // Set ready state when typewriter animation completes (4 seconds)
        setTimeout(() => {
            isReady = true;
            introScreen.classList.add('ready');
            console.log('READY TO CLICK!');
        }, 4000);
        
        console.log('Intro screen initialized');
    }
}

// Cursor spiral effect
function initializeCursorSpiral() {
    const cursorSpiral = document.querySelector('.cursor-spiral');
    if (cursorSpiral) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Update CSS variables for mouse position
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        });
        
        console.log('Cursor spiral initialized');
    }
    
    // URL checker for profile picture hover
    const profilePicture = document.querySelector('.profile-picture');
    if (profilePicture) {
        profilePicture.addEventListener('mouseenter', function() {
            console.log('Profile picture hovered - checking URL...');
            checkUrlAndChangeSpiral();
        });
    }
}

// URL checker and spiral color changer
function checkUrlAndChangeSpiral() {
    // Check if the URL contains specific keywords
    const currentUrl = window.location.href;
    const urlLower = currentUrl.toLowerCase();
    
    console.log('Current URL:', currentUrl);
    
    // Check for spiral-related keywords
    if (urlLower.includes('spiral') || urlLower.includes('whirlpool') || urlLower.includes('freepik')) {
        console.log('Spiral keywords detected in URL!');
        
        // Change profile picture border to dark purple spiral
        const profilePicture = document.querySelector('.profile-picture');
        if (profilePicture) {
            profilePicture.style.setProperty('--spiral-color', 'dark-purple');
        }
        
        // Add CSS variable for dark purple spiral
        const style = document.createElement('style');
        style.textContent = `
            .profile-picture::before {
                background: linear-gradient(45deg, #4b0082, #8b5cf6, #4b0082, #8b5cf6) !important;
                animation: rotateBorder 2s linear infinite !important;
            }
        `;
        document.head.appendChild(style);
    } else {
        console.log('No spiral keywords detected in URL');
    }
}

function tryAdvancedAutoplay() {
    // Method 1: Immediate attempt
    attemptAutoplay();
    
    // Method 2: After 100ms
    setTimeout(attemptAutoplay, 100);
    
    // Method 3: After 500ms
    setTimeout(attemptAutoplay, 500);
    
    // Method 4: After 1 second
    setTimeout(attemptAutoplay, 1000);
    
    // Method 5: After 2 seconds with iframe trick
    setTimeout(() => attemptAutoplayWithIframe(), 2000);
    
    // Method 6: After 3 seconds
    setTimeout(attemptAutoplay, 3000);
    
    // Method 7: After 4 seconds with user gesture simulation
    setTimeout(() => attemptAutoplayWithGesture(), 4000);
    
    // Method 8: After 5 seconds
    setTimeout(attemptAutoplay, 5000);
}

function attemptAutoplayWithIframe() {
    if (!backgroundMusic || isPlaying || autoplayAttempts >= maxAttempts) {
        return;
    }
    
    console.log('Trying iframe autoplay trick...');
    
    try {
        const iframe = document.getElementById('audio-iframe');
        if (iframe) {
            // Try to create audio context in iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.body.innerHTML = '<audio id="iframe-audio" style="display:none;"><source src="background-music.mp4.mp3" type="audio/mpeg"></audio>';
            
            const iframeAudio = iframeDoc.getElementById('iframe-audio');
            if (iframeAudio) {
                iframeAudio.play().then(() => {
                    console.log('Iframe audio started, transferring to main audio...');
                    // Now try main audio
                    backgroundMusic.play().then(() => {
                        isPlaying = true;
                        console.log('Main audio started via iframe trick!');
                    }).catch(() => {
                        console.log('Iframe trick failed for main audio');
                    });
                }).catch(() => {
                    console.log('Iframe audio failed');
                });
            }
        }
    } catch (error) {
        console.log('Iframe trick failed:', error.message);
    }
}

function attemptAutoplayWithGesture() {
    if (!backgroundMusic || isPlaying || autoplayAttempts >= maxAttempts) {
        return;
    }
    
    console.log('Trying gesture simulation...');
    
    try {
        // Create a fake user interaction
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        // Dispatch on document
        document.dispatchEvent(event);
        
        // Try to play immediately after
        setTimeout(() => {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                console.log('Audio started via gesture simulation!');
            }).catch(() => {
                console.log('Gesture simulation failed');
            });
        }, 50);
        
    } catch (error) {
        console.log('Gesture simulation failed:', error.message);
    }
}

function attemptAutoplay() {
    if (!backgroundMusic || isPlaying || autoplayAttempts >= maxAttempts) {
        return;
    }
    
    autoplayAttempts++;
    console.log(`Autoplay attempt ${autoplayAttempts}/${maxAttempts}`);
    
    // Try different approaches
    const attempts = [
        // Approach 1: Normal play
        () => backgroundMusic.play(),
        
        // Approach 2: Muted then unmute
        () => {
            backgroundMusic.muted = true;
            return backgroundMusic.play().then(() => {
                setTimeout(() => {
                    backgroundMusic.muted = false;
                    console.log('Unmuted successfully!');
                }, 200);
            });
        },
        
        // Approach 3: Volume 0 then restore
        () => {
            const originalVolume = backgroundMusic.volume;
            backgroundMusic.volume = 0;
            return backgroundMusic.play().then(() => {
                setTimeout(() => {
                    backgroundMusic.volume = originalVolume;
                    console.log('Volume restored!');
                }, 200);
            });
        }
    ];
    
    const approach = attempts[Math.min(autoplayAttempts - 1, attempts.length - 1)];
    
    const playPromise = approach();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Music started successfully!');
            isPlaying = true;
            
        }).catch(error => {
            console.log(`Autoplay attempt ${autoplayAttempts} failed:`, error.message);
            
            // If this is the last attempt, show user prompt
            if (autoplayAttempts >= maxAttempts) {
                console.log('All autoplay attempts failed, showing user prompt');
                showMusicPrompt();
                setupUserInteractionFallback();
            }
        });
    }
}

function setupUserInteractionFallback() {
    // Setup click listener that stays active
    document.addEventListener('click', function handleClick() {
        if (!isPlaying && backgroundMusic) {
            console.log('User click detected, starting music...');
            backgroundMusic.muted = false;
            backgroundMusic.volume = 0.3;
            
            backgroundMusic.play().then(() => {
                isPlaying = true;
                console.log('Music started via user interaction!');
                
                // Remove any prompts
                const prompts = document.querySelectorAll('div[style*="position: fixed"]');
                prompts.forEach(p => p.remove());
                
                // Remove this listener once music is playing
                document.removeEventListener('click', handleClick);
            }).catch(error => {
                console.error('Still failed to play:', error);
            });
        }
    });
    
    // Also setup spacebar listener
    document.addEventListener('keydown', function handleKey(e) {
        if (e.code === 'Space' && !isPlaying && backgroundMusic) {
            e.preventDefault();
            console.log('Spacebar pressed, starting music...');
            backgroundMusic.muted = false;
            backgroundMusic.volume = 0.3;
            
            backgroundMusic.play().then(() => {
                isPlaying = true;
                console.log('Music started via spacebar!');
                
                // Remove any prompts
                const prompts = document.querySelectorAll('div[style*="position: fixed"]');
                prompts.forEach(p => p.remove());
                
                // Remove this listener once music is playing
                document.removeEventListener('keydown', handleKey);
            }).catch(error => {
                console.error('Still failed to play:', error);
            });
        }
    });
}

function showMusicPrompt() {
    const prompt = document.createElement('div');
    prompt.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #f1f5f9;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        border: 1px solid #6366f1;
        z-index: 10000;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
    `;
    
    prompt.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span>🎵</span>
            <span><strong>Click to play music!</strong></span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem; margin-left: auto;">×</button>
        </div>
        <button onclick="startMusic()" 
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; border: none; padding: 0.5rem 1rem; 
                       border-radius: 5px; cursor: pointer; font-weight: 600;">
            Play Music
        </button>
    `;
    
    // Add slide in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(prompt);
}

function startMusic() {
    backgroundMusic.muted = false;
    backgroundMusic.play().then(() => {
        isPlaying = true;
        console.log('Music started by user interaction');
        // Remove the prompt
        const prompts = document.querySelectorAll('div[style*="position: fixed"]');
        prompts.forEach(p => p.remove());
    }).catch(error => {
        console.error('Failed to play music:', error);
    });
}

function initializeControls() {
    // Play Music Button
    const playMusicBtn = document.getElementById('play-music-btn');
    if (playMusicBtn) {
        console.log('Play button found, adding event listeners...');
        
        // Multiple event handlers for browser compatibility
        const handlePlayClick = function(e) {
            console.log('Play button clicked! Browser:', navigator.userAgent);
            e.preventDefault();
            e.stopPropagation();
            
            if (!isPlaying && backgroundMusic) {
                console.log('Starting music...');
                backgroundMusic.muted = false;
                backgroundMusic.volume = 0.3;
                
                // Opera specific: try different play methods
                const playPromise = backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                        console.log('Music started!');
                        
                        // Update button appearance
                        playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> <span class="btn-text">Pause</span>';
                        playMusicBtn.classList.add('playing');
                        
                        // Remove any prompts
                        const prompts = document.querySelectorAll('div[style*="position: fixed"]');
                        prompts.forEach(p => p.remove());
                        
                    }).catch(error => {
                        console.error('Failed to play music:', error);
                        // Opera fallback: try with user interaction
                        if (error.name === 'NotAllowedError') {
                            console.log('Opera: User interaction required, trying alternative...');
                            // Create a user interaction event
                            const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            document.body.dispatchEvent(clickEvent);
                            
                            // Try playing again after interaction
                            setTimeout(() => {
                                backgroundMusic.play().then(() => {
                                    isPlaying = true;
                                    console.log('Music started via Opera fallback!');
                                    playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> <span class="btn-text">Pause</span>';
                                    playMusicBtn.classList.add('playing');
                                }).catch(err => {
                                    console.error('Opera fallback also failed:', err);
                                });
                            }, 100);
                        }
                    });
                }
            } else if (isPlaying && backgroundMusic) {
                console.log('Pausing music...');
                backgroundMusic.pause();
                isPlaying = false;
                
                // Update button appearance
                playMusicBtn.innerHTML = '<i class="fas fa-play"></i> <span class="btn-text">Play</span>';
                playMusicBtn.classList.remove('playing');
            }
        };
        
        // Add multiple event listeners for maximum compatibility
        playMusicBtn.addEventListener('click', handlePlayClick, { passive: false });
        playMusicBtn.addEventListener('mousedown', handlePlayClick, { passive: false });
        playMusicBtn.addEventListener('mouseup', handlePlayClick, { passive: false });
        
        // Touch support for mobile
        playMusicBtn.addEventListener('touchend', function(e) {
            console.log('Play button touched!');
            e.preventDefault();
            handlePlayClick(e);
        }, { passive: false });
        
        console.log('Event listeners added to play button');
    } else {
        console.error('Play button not found!');
    }
    
    // Volume Control
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.querySelector('.volume-icon');
    
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        backgroundMusic.volume = volume;
        
        // Update volume icon based on level
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down volume-icon';
        } else {
            volumeIcon.className = 'fas fa-volume-up volume-icon';
        }
    });
    
    // Transparency Control
    const transparencySlider = document.getElementById('transparency-slider');
    const profileCard = document.querySelector('.profile-card');
    
    transparencySlider.addEventListener('input', function() {
        const opacity = this.value / 100;
        profileCard.style.opacity = 0.3 + (opacity * 0.7); // Min 0.3, Max 1.0
    });
    
    // Results Button
    const resultsButton = document.getElementById('results-button');
    let showingResults = false;
    
    resultsButton.addEventListener('click', function() {
        if (!showingResults) {
            showResults();
            this.textContent = 'Back to Profile';
            showingResults = true;
        } else {
            hideResults();
            this.textContent = 'View Results';
            showingResults = false;
        }
    });
}

function showResults() {
    const profileCard = document.querySelector('.profile-card');
    
    // Create skills section
    const skillsHTML = `
        <div class="skills-section">
            <h3 style="color: #fff; margin-bottom: 15px; font-size: 18px;">Programming Skills</h3>
            <div class="skill-item" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff;">C++</span>
                    <span style="color: #43b581;">10000000000%</span>
                </div>
                <div style="background: #202225; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: 100%; animation: fillBar 2s ease-out;"></div>
                </div>
            </div>
            <div class="skill-item" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff;">TypeScript</span>
                    <span style="color: #43b581;">60%</span>
                </div>
                <div style="background: #202225; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #3b82f6, #06b6d4); height: 100%; width: 60%; animation: fillBar 2s ease-out;"></div>
                </div>
            </div>
            <div class="skill-item" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff;">Python</span>
                    <span style="color: #43b581;">20%</span>
                </div>
                <div style="background: #202225; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #10b981, #84cc16); height: 100%; width: 20%; animation: fillBar 2s ease-out;"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fillBar {
            from { width: 0; }
        }
    `;
    document.head.appendChild(style);
    
    profileCard.innerHTML = skillsHTML;
}

function hideResults() {
    // Restore original profile card content
    const profileCard = document.querySelector('.profile-card');
    profileCard.innerHTML = `
        <div class="profile-header">
            <div class="profile-picture">
                <img src="https://cdn.discordapp.com/attachments/1300281383813386343/1482147068100481315/IMG_0564.jpg?ex=69b5e485&is=69b49305&hm=d0562c2456ff071afaa7cf27a441d196a46bda22cf65c7f5a04e90a1ee25e96a&" alt="Profile Picture" class="profile-img">
                <div class="status-indicator do not disturb"></div>
            </div>
            <div class="profile-info">
                <h1 class="username">Spiral<span class="discriminant">7uk</span></h1>
                <p class="status-message">я люблю Иисуса и Бога, и они оба любят тебя</p>
                    <p class="status-message-english">i love jesus and god and they both love you to</p>
                <div class="badges">
                    <span class="badge">&lt;/&gt;</span>
                </div>
            </div>
        </div>
        
        <div class="social-links">
            <a href="https://discord.com/users/7uk._." target="_blank" class="social-link">
                <i class="fab fa-discord"></i>
            </a>
        </div>
        
        <div class="stats">
            <div class="view-count">
                <i class="fas fa-eye"></i>
                <span id="visitor-count">125,755</span>
            </div>
        </div>
    `;
    
    // Reinitialize visitor count animation
    animateVisitorCount();
}

function animateVisitorCount() {
    const visitorCount = document.getElementById('visitor-count');
    let count = 125755;
    
    // Simulate visitor count increasing
    setInterval(() => {
        count += Math.floor(Math.random() * 3);
        visitorCount.textContent = count.toLocaleString();
    }, 30000); // Update every 30 seconds
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'M' to toggle music
    if (e.key === 'm' || e.key === 'M') {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
        } else {
            backgroundMusic.play();
            isPlaying = true;
        }
    }
    
    // Press 'R' to toggle results
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('results-button').click();
    }
    
    // Press 'V' to toggle volume mute
    if (e.key === 'v' || e.key === 'V') {
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider.value > 0) {
            volumeSlider.dataset.previousVolume = volumeSlider.value;
            volumeSlider.value = 0;
        } else {
            volumeSlider.value = volumeSlider.dataset.previousVolume || 30;
        }
        volumeSlider.dispatchEvent(new Event('input'));
    }
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const profileCard = document.querySelector('.profile-card');
    const rect = profileCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const angle = Math.atan2(y, x);
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 200;
    
    if (distance < maxDistance) {
        const intensity = 1 - (distance / maxDistance);
        const rotateX = (y / rect.height) * 10 * intensity;
        const rotateY = (x / rect.width) * 10 * intensity;
        
        profileCard.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    } else {
        profileCard.style.transform = '';
    }
});

console.log('🎮 Discord Profile initialized successfully!');
