document.addEventListener('DOMContentLoaded', () => {
    const starCount = 150;
    const stars = document.getElementById('stars');
    const visitCountElement = document.getElementById('visitCount');
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

    visitCountElement.textContent = 'Loading Visits...';
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


    fetch(`${apiUrl}/visit-count`)
    .then(response => {
        console.log('Response status:', response.status); // Log status
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); // Log data to inspect it
        visitCountElement.textContent = `Visits: ${data.visitCount}`;
    })
    .catch(error => {
        console.error('Error fetching visit count:', error);
        visitCountElement.textContent = 'Error retrieving visit count';
    });

   // Fetch IP address and increment visit count
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        let ipAddress = data.ip;
        
        // Function to extract IPv4 address from IPv6 if necessary
        const extractIPv4FromIPv6 = (ip) => {
            // Check if the address starts with '::ffff:'
            if (ip.startsWith('::ffff:')) {
                return ip.slice(7); // Remove the '::ffff:' prefix
            }
            return ip; // Return the IP as is if it's already IPv4
        };
        
        // Extract the IPv4 address if needed
        ipAddress = extractIPv4FromIPv6(ipAddress);

        // Make the POST request with the cleaned IPv4 address
        return fetch(`${apiUrl}/increment-visit/${ipAddress}`, { method: 'POST' });
    })
    .catch(error => {
        console.error('Error incrementing visit count:', error);
    });
});
