import confetti, { Options } from 'canvas-confetti';

let isConfettiRunning = false;

export const handleConfettiClick = (): void => {
    if (!isConfettiRunning) {
        triggerConfettiQueue();
    }
};

const triggerConfettiQueue = (): void => {
    isConfettiRunning = true;

    const confettiCount = 10;
    const colors: string[] = [
        '#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffdd00',
        '#ff00ff', '#00ffff', '#ff6600', '#6600ff', '#33cc33'
    ];

    const defaults: Options = {
        origin: { y: -3 },
        gravity: 1.1,
        spread: 200,
        scalar: 1.2,
        colors: colors,
        shapes: ['square', 'circle', 'star',]
    };

    for (let i = 0; i < confettiCount; i++) {
        confetti({
            ...defaults,
            origin: {
                x: Math.random(),
                y: 0
            },
            ticks: 1000,
            scalar: Math.random() * 1.5 + 0.5
        });
    }

    setTimeout((): void => {
        isConfettiRunning = false;
    }, 1000);
};
