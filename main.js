document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards-container');
    const imageViewContainer = document.querySelector('.fullscreen-container');

    if (cardsContainer) {
        handleCardsPage();
    }

    if (imageViewContainer) {
        handleImageViewPage();
    }
});

function handleCardsPage() {
    const cards = document.querySelectorAll('.card');
    const viewedImages = JSON.parse(sessionStorage.getItem('viewedImages')) || [];

    if (viewedImages.length >= 2) {
        const thirdCard = document.querySelector('.card[data-card="3"]');
        if (thirdCard) {
            thirdCard.classList.remove('disabled');
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('disabled')) {
                const cardNumber = card.getAttribute('data-card');
                const cardElement = card;
                cardElement.classList.add('is-flipped');

                setTimeout(() => {
                    document.body.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = `image-view.html?image=${cardNumber}`;
                    }, 300);
                }, 800);
            }
        });
    });
}

function handleImageViewPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const imageNumber = urlParams.get('image');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const imageText = document.getElementById('image-text');
    const nextButton = document.getElementById('next-button');
    const preImageMessageContainer = document.getElementById('pre-image-message');
    const preImageMessage = preImageMessageContainer.querySelector('h2');

    const messages = {
        '1': "Tere saath long drive pe jata hu aur tujhe aise sote hue imagine karta hu aur uss moment ko wohi pause kar ke tujhe waise hi sote hue dekhta hu n feel karta hu...",
        '2': "Aise hi tujhe raat ko sone se pehle ready karta hua dekhta hu aur hone ke baad tu mujhe aise smile deti hai jaise tune puri duniya jeet li ho...",
        '3': "Yeh toh woh imagination hai joh me baar baar sochta hu ki hum harr function me jaane se pehle ek aisi mirror selfie nikalte hai..."
    };

    // Get and update viewed images
    let viewedImages = JSON.parse(sessionStorage.getItem('viewedImages')) || [];
    if (!viewedImages.includes(imageNumber)) {
        viewedImages.push(imageNumber);
        sessionStorage.setItem('viewedImages', JSON.stringify(viewedImages));
    }

    const showImage = () => {
        preImageMessageContainer.style.display = 'none';
        fullscreenImage.src = `./image${imageNumber}.jpeg`;
        fullscreenImage.style.opacity = 0;

        // Smooth fade in of the image
        setTimeout(() => {
            fullscreenImage.style.transition = 'opacity 1.5s ease-in-out';
            fullscreenImage.style.opacity = 1;
        }, 100);

        setTimeout(() => {
            fullscreenImage.style.transition = 'opacity 2s ease-in-out';
            fullscreenImage.style.opacity = 0.3;
            imageText.textContent = messages[imageNumber];
            imageText.style.opacity = 1;
            nextButton.style.display = 'block';
            nextButton.style.opacity = 1;
        }, 2000);
    };

    // Show image 3 with pre-message, others immediately
    if (imageNumber === '3') {
        preImageMessage.textContent = "Aur yeh joh mere dil ke sab se paas hai...";
        preImageMessageContainer.style.display = 'flex';
        setTimeout(showImage, 5000);
    } else {
        showImage();
    }

    // Handle next button click
    nextButton.addEventListener('click', () => {
        // Re-read viewed images from storage to get latest state
        const currentViewedImages = JSON.parse(sessionStorage.getItem('viewedImages')) || [];
        let nextImageNumber;

        if (imageNumber === '1') {
            nextImageNumber = '2';
        } else if (imageNumber === '2') {
            // Check if both card 1 and card 2 have been viewed
            if (currentViewedImages.includes('1') && currentViewedImages.includes('2')) {
                nextImageNumber = '3';
            } else {
                nextImageNumber = '1';
            }
        } else if (imageNumber === '3') {
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = 'end.html';
            }, 600);
            return;
        }

        // Fade out elements before transition
        imageText.style.opacity = '0';
        nextButton.style.opacity = '0';
        fullscreenImage.style.opacity = '0';

        document.body.classList.add('page-exit');
        setTimeout(() => {
            window.location.href = `image-view.html?image=${nextImageNumber}`;
        }, 600);
    });
}
