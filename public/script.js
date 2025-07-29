
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const scrapeBtn = document.getElementById('scrape-btn');
    const videoContainer = document.getElementById('video-container');

    scrapeBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a TikTok username.');
            return;
        }

        videoContainer.innerHTML = '<p>Scraping...</p>';

        try {
            const response = await fetch(`/.netlify/functions/scrape/${username}`);
            const videos = await response.json();

            if (videos.error) {
                videoContainer.innerHTML = `<p>${videos.error}</p>`;
                return;
            }

            videoContainer.innerHTML = '';

            videos.forEach(video => {
                const card = document.createElement('div');
                card.className = 'video-card';

                const img = document.createElement('img');
                img.src = video.img;
                card.appendChild(img);

                const link = document.createElement('a');
                link.href = video.link;
                link.textContent = 'Watch on TikTok';
                link.target = '_blank';
                card.appendChild(link);

                videoContainer.appendChild(card);
            });
        } catch (error) {
            videoContainer.innerHTML = '<p>Failed to fetch videos. Please try again later.</p>';
            console.error(error);
        }
    });
});
