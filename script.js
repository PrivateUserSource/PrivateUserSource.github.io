document.addEventListener('DOMContentLoaded', () => {
    const starCount = 150;
    const stars = document.getElementById('stars');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toggleMusicButton = document.getElementById('toggleMusic');
    const disclaimerText = document.getElementById('disclaimer');
    let musicPlaying = false;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        stars.appendChild(star);

        const flickerRate = Math.random() * 2000 + 1000;
        const flickerInterval = () => {
            setTimeout(() => {
                const flickerAmount = Math.random() * 0.5 + 0.5;
                star.style.opacity = flickerAmount;
                flickerInterval();
            }, flickerRate);
        };

        flickerInterval();

        const animateStar = () => {
            star.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 5}px)`;
            requestAnimationFrame(animateStar);
        };

        animateStar();
    }

    const fadeInMusic = () => {
        if (musicPlaying) return;
        musicPlaying = true;
        backgroundMusic.volume = 0;
        backgroundMusic.play();
        let volume = 0;
        const fadeInInterval = setInterval(() => {
            if (volume < 1) {
                volume += 0.01;
                backgroundMusic.volume = volume;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);
    };

    document.body.addEventListener('click', fadeInMusic);
    document.body.addEventListener('keydown', fadeInMusic);

    toggleMusicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            toggleMusicButton.style.backgroundColor = '#ffffff';
            toggleMusicButton.style.color = '#000000';
        } else {
            backgroundMusic.pause();
            toggleMusicButton.style.backgroundColor = '#000000';
            toggleMusicButton.style.color = '#ffffff';
        }
    });

    const apiUrl = 'https://api.fera.dev';

    disclaimerText.textContent = 'Loading Disclaimer...';

    fetch(`${apiUrl}/disclaimer`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.visitCount !== "null") {
            disclaimerText.textContent = `${data.visitCount}`;
        } else {
            disclaimerText.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching disclaimer:', error);
        disclaimerText.style.display = 'none';
    });
});
