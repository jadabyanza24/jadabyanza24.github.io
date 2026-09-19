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
            <body>{children}</body>
        </html>
    );
}
