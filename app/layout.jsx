import './globals.css';

export const metadata = {
    title: 'Jad Abyanza Fauzan | AI & UI/UX Portfolio',
    description: 'Academic portfolio of Jad Abyanza Fauzan, an AI-focused Computer Science student working across machine learning, UI/UX, and software design.',
};

export const viewport = {
    themeColor: '#173820',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    );
}
