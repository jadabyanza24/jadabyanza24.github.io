'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import LandscapeScene from './LandscapeScene';

const pdfPath = '/JadAbyanzaFauzan_Portfolio_Academy.pdf';
const cvPath = '/JadAbyanzaFauzan_CV_Academy.pdf';

const projects = [
    {
        id: 'clarity-ai',
        color: 'blue',
        year: '2025',
        title: 'ClarityAI',
        subtitle: 'Medical Decision Support System',
        role: 'Project Leader',
        type: 'Class assignment, group',
        summary: 'A real-time machine learning tool designed to identify Acne Vulgaris and provide triage recommendations for self-care or doctor referral.',
        detailLabel: 'Design and build notes',
        details: [
            'I focused on the core algorithm and model refinement for real-time multi-class classification instead of spending the project window on a flashy front end.',
            "Streamlit made it possible to deploy a functional prototype quickly and demonstrate the model's triage behavior in real time. The project taught me how rapid prototyping can validate complex ML logic under strict processing constraints."
        ],
        images: [
            { src: '/assets/clarity-ai.png', alt: 'ClarityAI real-time acne detection and triage dashboard', width: 730, height: 451 }
        ],
        link: 'https://github.com/jadabyanza24/ClarityAI',
        linkLabel: 'View ClarityAI on GitHub'
    },
    {
        id: 'lost-findings',
        color: 'green',
        year: '2026',
        title: 'LostFindings',
        subtitle: 'Community Item Recovery App',
        role: 'Project Leader, UI/UX Designer, Mobile App Developer',
        type: 'Class assignment, group',
        summary: 'A community-driven mobile application for reporting, tracking, and recovering lost items.',
        detailLabel: 'Design and build notes',
        details: [
            'The interface stays calm and approachable because users may already be stressed when reporting a missing item.',
            'I built the front end with React Native and Expo, then integrated Supabase for real-time data. The project connected my visual design decisions with state management and back-end integration.'
        ],
        images: [
            { src: '/assets/lost-findings-home.png', alt: 'LostFindings home screen showing recent lost and found items', width: 534, height: 1093 },
            { src: '/assets/lost-findings-chat.png', alt: 'LostFindings chat list screen', width: 534, height: 1093 },
            { src: '/assets/lost-findings-detail.png', alt: 'LostFindings item detail and claim screen', width: 534, height: 1093 }
        ],
        link: 'https://github.com/jadabyanza24/LostFindings',
        linkLabel: 'View LostFindings on GitHub'
    },
    {
        id: 'dozzie',
        color: 'coral',
        year: '2025',
        title: 'Dozzie',
        subtitle: 'AI-Driven Student Productivity & Wellness Planner',
        role: 'UI/UX Designer and Interaction Conceptor',
        type: 'Class assignment, group',
        summary: 'A smart scheduling concept that balances academic workload with healthy sleep cycles by allocating time for studying, sleeping, and relaxing.',
        detailLabel: 'Design decisions',
        details: [
            'I designed the input flow so students can add deadlines and estimated workloads without adding more pressure to academic planning.',
            'A strong visual hierarchy makes the AI-generated schedule easier to read. This project deepened my understanding of HCI and communicating complex scheduling decisions in a transparent, actionable way.'
        ],
        images: [
            { src: '/assets/dozzie-dashboard.png', alt: 'Dozzie productivity and sleep dashboard', width: 576, height: 1136 },
            { src: '/assets/dozzie-splash.png', alt: 'Dozzie app launch screen', width: 576, height: 1135 }
        ],
        link: 'https://drive.google.com/file/d/1pdLIDeO89AcbxFOX51nVltnyxVlaSabh/view?usp=sharing',
        linkLabel: 'Open the Dozzie presentation'
    },
    {
        id: 'volumemate',
        color: 'yellow',
        year: '2026',
        title: 'VolumeMate',
        subtitle: 'Smart Procurement System',
        role: 'UI/UX Designer',
        type: 'Hackathon project, group',
        summary: 'A fertilizer procurement concept for agricultural cooperative admins, using AI-based predictions and collective buying to support purchasing decisions.',
        detailLabel: 'Design decisions',
        details: [
            'The interface simplifies AI recommendations and supplier price tiers into a high-contrast dashboard for rural cooperative admins with varied technical literacy.',
            'I designed Borong Bareng for pooled orders and an exportable audit log for financial reporting. The project showed how interface decisions can connect technical features with procurement outcomes.'
        ],
        images: [
            { src: '/assets/volumemate-dashboard.png', alt: 'VolumeMate procurement dashboard with demand prediction and active pools', width: 554, height: 1136 },
            { src: '/assets/volumemate-group-buying.png', alt: 'VolumeMate Borong Bareng group purchasing screen', width: 556, height: 1136 }
        ],
        link: 'https://drive.google.com/file/d/1m2m6UHduOUSH2gYlrLa823zPD2xasfkG/view?usp=sharing',
        linkLabel: 'Open the VolumeMate presentation'
    }
];

const organizationExperience = [
    {
        period: 'Feb 2026 to Present',
        title: 'General Manager of Commission 3',
        place: 'HIMTI BINUS University',
        detail: 'Research and Development',
        featured: true,
        image: { src: '/assets/gm-v2.webp', alt: 'General Manager of Commission 3 activities at HIMTI BINUS University' }
    },
    {
        period: 'Apr 2026 to Jun 2026',
        title: 'Staff of Design and Documentation, LDKCP 2026',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/ldkcp.webp', alt: 'Design and documentation team at LDKCP 2026' }
    },
    {
        period: 'Mar 2026 to Apr 2026',
        title: 'Design and Documentation Coordinator, HIMTI Farewell 2026',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/farewell.webp', alt: 'Design and documentation team at HIMTI Farewell 2026' }
    },
    {
        period: 'Mar 2025 to Feb 2026',
        title: 'Activist of Creative and Design, Commission 3',
        place: 'HIMTI BINUS University'
    },
    {
        period: 'May 2025 to Jan 2026',
        title: 'Design and Documentation Coordinator, HISHOT 2025',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/hishot.webp', alt: 'Design and documentation team at HISHOT 2025' }
    },
    {
        period: 'Nov 2025 to Dec 2025',
        title: 'Design and Documentation Coordinator, HILET 2026',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/hilet.webp', alt: 'Design and documentation team at HILET 2026' }
    },
    {
        period: 'Sep 2025 to Oct 2025',
        title: 'Design and Documentation Vice Coordinator, SESVENT 2025',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/sesvent.webp', alt: 'Design and documentation team at SESVENT 2025' }
    },
    {
        period: 'Jul 2025 to Oct 2025',
        title: 'Design and Documentation Coordinator, PKM HIMTI 2025',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/pkm-v2.webp', alt: 'Design and documentation team at PKM HIMTI 2025' }
    },
    {
        period: 'Jul 2025 to Sep 2025',
        title: 'Staff of Design and Documentation, HIMTI Workshop x NVIDIA 2025',
        place: 'HIMTI BINUS University',
        image: { src: '/assets/nvidia.webp', alt: 'Design and documentation team at HIMTI Workshop with NVIDIA 2025' }
    },
    {
        period: 'Jul 2024 to Aug 2024',
        title: 'Staff of PDD Desa Binaan',
        place: 'BEM FMIPA UNS',
        image: { src: '/assets/desa-binaan-v2.webp', alt: 'PDD team activities at Desa Binaan', position: 'center 65%' }
    },
    {
        period: 'May 2024 to Aug 2024',
        title: 'Staff of Riset dan Data',
        place: 'BEM FMIPA UNS',
        detail: 'Data Visualization',
        image: { src: '/assets/riset-data-v2.webp', alt: 'Research and data team activities at BEM FMIPA UNS' }
    },
    {
        period: 'Mar 2024 to Aug 2024',
        title: 'Staff of Media and Branding',
        place: 'HIMASTA UNS',
        detail: 'Video Production and Photography',
        image: { src: '/assets/media-branding-v2.webp', alt: 'Media and branding team activities at HIMASTA UNS' }
    }
];

const volunteerExperience = [
    {
        period: 'Jul 2026 to Sep 2026',
        title: 'Freshmen Leader B30',
        place: 'BINUS University @Alam Sutera',
        image: { src: '/assets/freshmen-leader-v2.webp', alt: 'Jad serving as Freshmen Leader B30 at BINUS Alam Sutera' }
    },
    {
        period: 'May 2026',
        title: 'Documentation Volunteer Coordinator',
        place: 'CODEAVOUR International 7.0',
        image: { src: '/assets/codeavour.webp', alt: 'Documentation volunteer team at CODEAVOUR International 7.0' }
    },
    {
        period: 'Jun 2024 to Jul 2024',
        title: 'Educator Volunteer',
        place: 'UNICEF Indonesia',
        detail: 'Lombok, Indonesia',
        image: { src: '/assets/lombok.webp', alt: 'Educator volunteer activities in Lombok with UNICEF Indonesia' }
    }
];

const timelineMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const timelineDate = (period) => {
    const [month, year] = period.split(' ');
    return Number(year) * 12 + timelineMonths.indexOf(month);
};

const timelineEntries = [
    ...organizationExperience.map((item) => ({ ...item, category: 'Organization' })),
    ...volunteerExperience.map((item) => ({ ...item, category: 'Volunteer' })),
].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || timelineDate(b.period) - timelineDate(a.period));

function ProjectMockupStage({ project }) {
    const repeatedImages = Array.from({ length: 6 }, (_, index) => project.images[index % project.images.length]);

    return (
        <div className="mockup-marquee" aria-label={`Interface mockups for ${project.title}`}>
            {[0, 1].map((row) => (
                <div className={`mockup-track${row === 1 ? ' mockup-track-reverse' : ''}`} key={row}>
                    {[0, 1].map((set) => (
                        <div className="mockup-set" key={set} aria-hidden={set === 1}>
                            {repeatedImages.map((image, index) => {
                                const phone = image.height / image.width > 1.35;
                                const showAlt = row === 0 && set === 0 && index < project.images.length;
                                return (
                                    <div className={`mockup-tile ${phone ? 'mockup-phone' : 'mockup-desktop'}`} key={`${image.src}-${index}`}>
                                        <Image src={image.src} alt={showAlt ? image.alt : ''} width={image.width} height={image.height} sizes={phone ? '(max-width: 520px) 42vw, 220px' : '(max-width: 520px) 78vw, 440px'} loading="eager" unoptimized />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function SectionDecor({ tone = 'dark' }) {
    return (
        <div className={`section-decor section-decor-${tone}`} aria-hidden="true">
            <div className="terrain-lines"><i /><i /><i /><i /></div>
        </div>
    );
}

function ProjectDialog({ project, dialogRef, onClose, onRequestClose }) {
    if (!project) return <dialog ref={dialogRef} className="project-dialog" onClose={onClose} />;

    const titleId = `${project.id}-dialog-title`;

    return (
        <dialog ref={dialogRef} className={`project-dialog project-${project.color}`} aria-labelledby={titleId} onClose={onClose} onCancel={(event) => {
            event.preventDefault();
            onRequestClose();
        }} onClick={(event) => {
            if (event.target === dialogRef.current) onRequestClose();
        }}>
            <div className="project-dialog-bar">
                <span>{project.year} / {project.type}</span>
                <button type="button" onClick={onRequestClose}>Close</button>
            </div>
            <div className="project-dialog-grid">
                <div className="project-dialog-visual">
                    <ProjectMockupStage project={project} />
                </div>
                <div className="project-dialog-copy">
                <h2 id={titleId}>{project.title}</h2>
                <p className="project-subtitle">{project.subtitle}</p>
                <dl className="project-meta">
                    <div><dt>Role</dt><dd>{project.role}</dd></div>
                    <div><dt>Type</dt><dd>{project.type}</dd></div>
                </dl>
                <p className="project-summary">{project.summary}</p>
                <div className="project-detail">
                    <h3>{project.detailLabel}</h3>
                    {project.details.map((detail) => <p key={detail}>{detail}</p>)}
                </div>
                <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel}</a>
                </div>
            </div>
        </dialog>
    );
}

export default function Portfolio() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [catEnabled, setCatEnabled] = useState(false);
    const [catLocked, setCatLocked] = useState(false);
    const [catPromptNeeded, setCatPromptNeeded] = useState(false);
    const [openingComplete, setOpeningComplete] = useState(false);
    const [sceneEnabled, setSceneEnabled] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalLines, setTerminalLines] = useState([{ role: 'assistant', text: 'Hi, I’m Jad’s portfolio assistant. Ask me about his projects, skills, or experience.' }]);
    const menuButtonRef = useRef(null);
    const projectDialogRef = useRef(null);
    const projectTriggerRef = useRef(null);
    const projectClosingRef = useRef(false);
    const terminalDialog = useRef(null);
    const terminalInputRef = useRef(null);
    const terminalOutputRef = useRef(null);
    const terminalHistoryRef = useRef([]);
    const terminalHistoryIndexRef = useRef(-1);
    const openingRef = useRef(null);
    const catPromptRef = useRef(null);

    useEffect(() => {
        if (!('scrollRestoration' in window.history)) return;

        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
        const resetScroll = () => {
            if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        };

        resetScroll();
        const frame = requestAnimationFrame(resetScroll);
        window.addEventListener('pageshow', resetScroll);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('pageshow', resetScroll);
            window.history.scrollRestoration = previous;
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle('menu-open', menuOpen);
        return () => document.body.classList.remove('menu-open');
    }, [menuOpen]);

    useEffect(() => {
        document.body.classList.toggle('cat-off', !catEnabled);
    }, [catEnabled]);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        try {
            const preference = window.localStorage.getItem('jad-cat-companion');
            if (preference === 'on') setCatEnabled(true);
            else if (preference !== 'off') setCatPromptNeeded(true);
        } catch {
            setCatPromptNeeded(true);
        }
    }, []);

    useEffect(() => {
        if (openingComplete && catPromptNeeded && !catPromptRef.current?.open) catPromptRef.current?.showModal();
    }, [openingComplete, catPromptNeeded]);

    useEffect(() => {
        try {
            if (window.localStorage.getItem('jad-3d-scene') === 'off') setSceneEnabled(false);
        } catch {
            // Storage can be unavailable in private browsing; the toggle still works for this visit.
        }
    }, []);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches) {
            setCatEnabled(false);
            setCatLocked(true);
        }

        const closeMenu = () => {
            if (window.innerWidth > 780) setMenuOpen(false);
        };
        const closeMenuWithEscape = (event) => {
            if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
                setMenuOpen(false);
                requestAnimationFrame(() => menuButtonRef.current?.focus());
            }
        };

        window.addEventListener('resize', closeMenu);
        document.addEventListener('keydown', closeMenuWithEscape);
        return () => {
            window.removeEventListener('resize', closeMenu);
            document.removeEventListener('keydown', closeMenuWithEscape);
        };
    }, []);

    useEffect(() => {
        if (terminalOutputRef.current) terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }, [terminalLines]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        const media = gsap.matchMedia();

        media.add({
            animate: '(prefers-reduced-motion: no-preference)',
            desktop: '(min-width: 781px)'
        }, (context) => {
            if (!context.conditions.animate) return;

            gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.75 })
                .from('.site-header', { yPercent: -100, duration: 0.55 })
                .from('.hero h1 span', { yPercent: 90, autoAlpha: 0, duration: 0.75, stagger: 0.08 }, '-=0.2')
                .from('.hero-lead, .hero-actions', { y: 30, autoAlpha: 0, duration: 0.55, stagger: 0.1 }, '-=0.35')
                .from('.portrait-wrap', { x: 80, rotation: 8, autoAlpha: 0, duration: 0.8 }, '-=0.75')
                .from('.hero-stamp', { scale: 0, rotation: -20, duration: 0.45, ease: 'back.out(1.8)' }, '-=0.35')
                .from('.focus-strip span', { y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, '-=0.25');

            const timelineSection = document.querySelector('.timeline');
            const timelineTrack = document.querySelector('.timeline-track');
            const timelineViewport = document.querySelector('.timeline-track-wrap');
            const timelineCat = document.querySelector('.timeline-cat');
            if (context.conditions.desktop && timelineSection && timelineTrack && timelineViewport) {
                const distance = () => Math.max(0, timelineTrack.scrollWidth - timelineViewport.clientWidth);
                const catFrames = {
                    forward: ['-192px 0px', '-192px -64px'],
                    backward: ['-256px -128px', '-256px -192px']
                };

                const horizontalTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: timelineSection,
                        start: 'top top+=70',
                        end: () => `+=${Math.max(distance(), window.innerWidth * 0.75)}`,
                        pin: true,
                        scrub: 0.65,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            if (!timelineCat) return;
                            const direction = self.direction > 0 ? 'forward' : 'backward';
                            timelineCat.style.backgroundPosition = catFrames[direction][Math.floor(self.progress * 80) % 2];
                        }
                    }
                });

                horizontalTimeline.to(timelineTrack, { x: () => -distance(), ease: 'none' }, 0);
                if (timelineCat) {
                    horizontalTimeline.fromTo(timelineCat,
                        { x: 8 },
                        { x: () => Math.max(8, timelineViewport.clientWidth - 72), ease: 'none' },
                        0
                    );
                }

                timelineTrack.querySelectorAll('.timeline-item').forEach((item) => {
                    gsap.fromTo(item,
                        { autoAlpha: 0.2, y: 18, scale: 0.97 },
                        {
                            autoAlpha: 1,
                            y: 0,
                            scale: 1,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: item,
                                containerAnimation: horizontalTimeline,
                                start: 'left 92%',
                                end: 'left 72%',
                                scrub: true
                            }
                        }
                    );
                });
            } else if (timelineTrack) {
                gsap.from(timelineTrack.querySelectorAll('.timeline-item'), {
                    autoAlpha: 0,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: timelineTrack, start: 'top 86%', once: true }
                });
            }

            gsap.from('.project-button', {
                autoAlpha: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.project-menu', start: 'top 78%', once: true }
            });

            gsap.from('.about-heading', {
                x: -80,
                rotation: -2,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.about', start: 'top 72%', once: true }
            });
            gsap.from('.about-copy', {
                x: 60,
                autoAlpha: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.about', start: 'top 65%', once: true }
            });
            gsap.from('.contact h2', {
                y: 48,
                autoAlpha: 0,
                duration: 1,
                ease: 'power4.inOut',
                scrollTrigger: { trigger: '.contact', start: 'top 65%', once: true }
            });
        });

        return () => media.revert();
    }, []);

    useEffect(() => {
        const opening = openingRef.current;
        if (!opening) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(opening, { display: 'none' });
            setOpeningComplete(true);
            return;
        }

        document.body.classList.add('opening-active');
        const timeline = gsap.timeline({ onComplete: () => {
            document.body.classList.remove('opening-active');
            setOpeningComplete(true);
        } })
            .fromTo(opening.querySelector('span'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' })
            .to(opening.querySelector('span'), { autoAlpha: 0, y: -12, duration: 0.28, ease: 'power2.in' }, '+=0.16')
            .to(opening, { yPercent: -100, duration: 0.72, ease: 'power4.inOut' }, '-=0.08')
            .set(opening, { display: 'none' });

        return () => {
            timeline.kill();
            document.body.classList.remove('opening-active');
        };
    }, []);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleAnchor = (event) => {
            const anchor = event.target.closest('a[href^="#"]');
            if (!anchor) return;

            const hash = anchor.getAttribute('href');
            const target = hash === '#top' ? document.documentElement : document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            setMenuOpen(false);
            const offset = document.querySelector('.site-header')?.offsetHeight || 0;
            const focusTarget = () => {
                if (!anchor.classList.contains('skip-link')) return;
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            };

            if (reducedMotion.matches) {
                window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: 'auto' });
                focusTarget();
            } else {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: offset },
                    duration: 0.9,
                    ease: 'power3.inOut',
                    overwrite: 'auto',
                    onComplete: focusTarget,
                });
            }

            window.history.replaceState(null, '', hash);
        };

        document.addEventListener('click', handleAnchor);
        return () => {
            document.removeEventListener('click', handleAnchor);
            gsap.killTweensOf(window);
        };
    }, []);

    function openTerminal() {
        terminalDialog.current?.showModal();
        requestAnimationFrame(() => terminalInputRef.current?.focus());
    }

    function toggleScene() {
        setSceneEnabled((enabled) => {
            const next = !enabled;
            try {
                window.localStorage.setItem('jad-3d-scene', next ? 'on' : 'off');
            } catch {
                // Keep the in-memory preference when storage is unavailable.
            }
            return next;
        });
    }

    function setCatPreference(enabled) {
        setCatEnabled(enabled);
        setCatPromptNeeded(false);
        try {
            window.localStorage.setItem('jad-cat-companion', enabled ? 'on' : 'off');
        } catch {
            // Keep the choice for this visit when storage is unavailable.
        }
        if (catPromptRef.current?.open) catPromptRef.current.close();
    }

    function openProject(project, trigger) {
        projectTriggerRef.current = trigger;
        flushSync(() => setSelectedProject(project));

        const dialog = projectDialogRef.current;
        if (!dialog) return;
        dialog.showModal();
        dialog.scrollTo({ top: 0 });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        gsap.fromTo(dialog,
            { autoAlpha: 0, y: 12, scale: 0.975 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
        );
    }

    function closeProjectDialog() {
        const dialog = projectDialogRef.current;
        if (!dialog?.open || projectClosingRef.current) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            dialog.close();
            return;
        }

        projectClosingRef.current = true;
        dialog.classList.add('is-closing');
        gsap.killTweensOf(dialog);
        gsap.to(dialog, {
            autoAlpha: 0,
            y: 10,
            scale: 0.985,
            duration: 0.22,
            ease: 'power2.in',
            onComplete: () => dialog.close(),
        });
    }

    function finishProjectDialog() {
        projectClosingRef.current = false;
        projectDialogRef.current?.classList.remove('is-closing');
        gsap.set(projectDialogRef.current, { clearProps: 'transform,opacity,visibility' });
        setSelectedProject(null);
        projectTriggerRef.current?.focus();
    }

    function addTerminalLine(text, role = 'assistant') {
        setTerminalLines((lines) => [...lines, { role, text }]);
    }

    function runTerminalCommand(event) {
        event.preventDefault();
        const rawCommand = terminalInput.trim();
        const command = rawCommand.toLowerCase().replace(/^\//, '');
        if (!command) return;

        terminalHistoryRef.current = [...terminalHistoryRef.current.filter((entry) => entry !== rawCommand), rawCommand];
        terminalHistoryIndexRef.current = terminalHistoryRef.current.length;
        setTerminalInput('');
        if (command === 'clear') {
            setTerminalLines([]);
            return;
        }

        addTerminalLine(rawCommand, 'user');
        const matchedProject = projects.find((project) => command.includes(project.title.toLowerCase()));
        const navigationTarget = /(?:open|go|buka|lihat|liat).*(project|proyek)/.test(command) ? 'projects'
            : /(?:open|go|buka|lihat|liat).*timeline/.test(command) ? 'timeline'
            : /(?:open|go|buka|lihat|liat).*(contact|kontak)/.test(command) ? 'contact'
            : null;
        if (command === 'help' || /bisa apa|what can you do/.test(command)) addTerminalLine('You can ask about Jad, his skills, experience, contact details, or a project by name. Say “open projects”, “open timeline”, or “open contact” to navigate.');
        else if (/^(hi|hello|hey|halo|hai)\b/.test(command)) addTerminalLine('Hi! What would you like to know about Jad?');
        else if (matchedProject) addTerminalLine(`${matchedProject.title} is ${matchedProject.subtitle.toLowerCase()}. Jad worked as ${matchedProject.role}. ${matchedProject.summary}`);
        else if (/about|whoami|siapa|tentang jad/.test(command)) addTerminalLine('Jad is an AI-focused Computer Science student at BINUS University who works across machine learning, UI/UX, software design, and data analytics.');
        else if (/skills?|keahlian|kemampuan/.test(command)) addTerminalLine('Jad’s core areas are UI/UX, machine learning, software design, and data analytics.');
        else if (navigationTarget) {
            addTerminalLine(`Opening ${navigationTarget}.`);
            terminalDialog.current?.close();
            document.querySelector(navigationTarget === 'projects' ? '#work' : `#${navigationTarget}`)?.scrollIntoView({ behavior: catLocked ? 'auto' : 'smooth' });
        }
        else if (/projects?|proyek/.test(command) && !/^(open|go|buka)/.test(command)) addTerminalLine(`Jad’s featured projects are ${projects.map((project) => project.title).join(', ')}. Ask me about any project by name.`);
        else if (/experience|pengalaman|organisasi|volunteer/.test(command)) addTerminalLine('Jad has led research and design work at HIMTI BINUS and contributed to organization and volunteer programs since 2024. Say “open timeline” to see the full record.');
        else if (/contact|kontak|email|linkedin/.test(command) && !/^(open|go|buka)/.test(command)) addTerminalLine('You can reach Jad at jad.fauzan@binus.ac.id or through LinkedIn in the contact section.');
        else if (/pdf|portfolio(?:nya)?|portofolio(?:nya)?/.test(command)) {
            const view = /lihat|liat|view|open|buka/.test(command);
            addTerminalLine(view ? 'Opening the academic portfolio PDF.' : 'Downloading the academic portfolio PDF.');
            if (view) {
                window.open(pdfPath, '_blank', 'noopener,noreferrer');
                return;
            }
            const link = document.createElement('a');
            link.href = pdfPath;
            link.download = '';
            link.click();
        } else if (/(?:cv|resume)(?:nya)?/.test(command)) {
            const view = /lihat|liat|view|open|buka/.test(command);
            addTerminalLine(view ? 'Opening Jad’s CV.' : 'Downloading Jad’s CV.');
            if (view) {
                window.open(cvPath, '_blank', 'noopener,noreferrer');
                return;
            }
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = '';
            link.click();
        } else if (/^(cat|kucing)$/.test(command)) {
            if (catLocked) addTerminalLine('Pixel cat is paused because reduced motion is enabled.');
            else {
                setCatPreference(!catEnabled);
                addTerminalLine(`Pixel cat turned ${catEnabled ? 'off' : 'on'}.`);
            }
        } else if (/^(scene|3d)$/.test(command)) {
            toggleScene();
            addTerminalLine(`3D scene turned ${sceneEnabled ? 'off' : 'on'}.`);
        } else if (/^(date|time|tanggal|waktu)$/.test(command)) addTerminalLine(new Date().toLocaleString());
        else if (command.startsWith('echo ')) addTerminalLine(rawCommand.slice(rawCommand.indexOf(' ') + 1));
        else addTerminalLine('I don’t know that yet. Try asking about Jad’s projects, skills, experience, or contact details.');
    }

    function browseTerminalHistory(event) {
        if (!['ArrowUp', 'ArrowDown'].includes(event.key) || terminalHistoryRef.current.length === 0) return;
        event.preventDefault();
        const lastIndex = terminalHistoryRef.current.length - 1;
        terminalHistoryIndexRef.current = event.key === 'ArrowUp'
            ? Math.max(0, terminalHistoryIndexRef.current - 1)
            : Math.min(lastIndex + 1, terminalHistoryIndexRef.current + 1);
        setTerminalInput(terminalHistoryIndexRef.current > lastIndex ? '' : terminalHistoryRef.current[terminalHistoryIndexRef.current]);
    }

    return (
        <>
            <div ref={openingRef} className="opening-screen" aria-hidden="true"><span>Jad Abyanza Fauzan</span></div>
            <dialog ref={catPromptRef} className="cat-prompt" aria-labelledby="cat-prompt-title" onCancel={(event) => {
                event.preventDefault();
                setCatPreference(false);
            }}>
                <div className="cat-prompt-visual" aria-hidden="true" />
                <div className="cat-prompt-copy">
                    <p className="cat-prompt-kicker">A small question before you begin</p>
                    <h2 id="cat-prompt-title">Would you like a friend while you explore my website?</h2>
                    <div className="cat-prompt-actions">
                        <button className="button button-primary" type="button" onClick={() => setCatPreference(true)}>Definitely</button>
                        <button className="button button-secondary" type="button" onClick={() => setCatPreference(false)}>No, I’m okay</button>
                    </div>
                </div>
            </dialog>
            <LandscapeScene enabled={sceneEnabled} />
            <a className="skip-link" href="#work">Skip to projects</a>

            <header className="site-header">
                <button ref={menuButtonRef} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Close' : 'Menu'}</button>
                <nav id="primary-nav" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation" onClick={() => setMenuOpen(false)}>
                    <a href="#timeline">Timeline</a>
                    <a href="#work">Work</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <a className="nav-download" href={pdfPath} download>PDF</a>
                </nav>
                <div className="header-tools" aria-label="Page tools">
                    <button className="tool-button" type="button" onClick={openTerminal}>Assistant</button>
                    <button className="tool-button" type="button" aria-pressed={sceneEnabled} onClick={toggleScene}>3D: {sceneEnabled ? 'on' : 'off'}</button>
                    <button className="tool-button" type="button" aria-pressed={catEnabled} disabled={catLocked} onClick={() => setCatPreference(!catEnabled)}>{catLocked ? 'Cat: paused' : `Cat: ${catEnabled ? 'on' : 'off'}`}</button>
                </div>
            </header>

            <main id="main-content">
                <section id="top" className="hero" aria-labelledby="hero-title">
                    <div className="hero-copy">
                        <p className="hero-kicker">Creative technologist · Tangerang, Indonesia</p>
                        <h1 id="hero-title"><span>Jad</span><span>Abyanza</span><span>Fauzan</span></h1>
                        <p className="hero-lead">I build practical AI systems and shape the interfaces people use to understand them.</p>
                        <div className="hero-actions">
                            <a className="button button-primary" href={pdfPath} download>Download portfolio PDF</a>
                            <a className="button button-secondary" href={cvPath} download>Download CV</a>
                            <a className="text-link" href="#work">See selected projects</a>
                        </div>
                    </div>

                    <div className="portrait-wrap" aria-label="Portrait of Jad Abyanza Fauzan">
                        <div className="portrait-frame">
                            <Image src="/assets/jad-portrait.png" alt="Portrait of Jad Abyanza Fauzan wearing a blue shirt" width={407} height={542} priority sizes="(max-width: 780px) 86vw, 430px" />
                        </div>
                        <p className="portrait-note">Computer Science student<br />BINUS University</p>
                    </div>
                    <div className="hero-stamp" aria-hidden="true">AI<br />×<br />UX</div>
                    <div className="focus-strip" aria-label="Areas of focus">
                        <span>Machine learning</span><span>UI/UX design</span><span>Software design</span><span>Data analytics</span>
                    </div>
                </section>

                <section id="timeline" className="timeline" aria-labelledby="timeline-title">
                    <SectionDecor />
                    <div className="timeline-heading">
                        <h2 id="timeline-title">The route<br />so far.</h2>
                        <p>Organization roles and volunteer work in one chronological record.</p>
                    </div>
                    <div className="timeline-track-wrap" aria-label="Experience timeline, newest to oldest">
                        <span className="timeline-cat" aria-hidden="true" />
                        <ol className="timeline-track">
                            {timelineEntries.map((item) => (
                                <li className={`timeline-item${item.image ? '' : ' timeline-item-text-only'}`} data-category={item.category} key={`${item.period}-${item.title}`}>
                                    {item.image && (
                                        <div className="timeline-image">
                                            <div className="timeline-image-sharp">
                                                <Image src={item.image.src} alt={item.image.alt} fill unoptimized loading="eager" sizes="(max-width: 780px) 82vw, 360px" style={item.image.position ? { objectPosition: item.image.position } : undefined} />
                                            </div>
                                        </div>
                                    )}
                                    {!item.image && (
                                        <div className="timeline-text-visual" aria-hidden="true">
                                            <span>Creative</span><strong>&amp;</strong><span>Design</span>
                                        </div>
                                    )}
                                    <p className="timeline-category">{item.category}</p>
                                    <div className="timeline-item-copy">
                                        <p className="timeline-period">{item.period}</p>
                                        <div className="timeline-item-details">
                                            <h3>{item.title}</h3>
                                            <p className="timeline-place">{item.place}</p>
                                            {item.detail && <p>{item.detail}</p>}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section id="work" className="work-section" aria-labelledby="work-title">
                    <SectionDecor />
                    <div className="work-intro">
                        <div><h2 id="work-title">Projects</h2></div>
                        <p>A selection of machine learning, mobile product, and interface work.</p>
                    </div>

                    <div className="project-menu" aria-label="Selected projects">
                        {projects.map((project, index) => (
                            <button key={project.id} className={`project-button project-${project.color}`} type="button" onClick={(event) => openProject(project, event.currentTarget)}>
                                <Image className="project-card-image" src={project.images[0].src} alt="" fill unoptimized sizes="(max-width: 520px) 82vw, (max-width: 1100px) 44vw, 31vw" />
                                <span className="project-card-number" aria-hidden="true">0{index + 1}</span>
                                <span className="project-button-action">View case</span>
                                <span className="project-button-copy">
                                    <span className="project-button-year">{project.year}</span>
                                    <strong>{project.title}</strong>
                                    <small>{project.subtitle}</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section id="about" className="about" aria-labelledby="about-title">
                    <SectionDecor />
                    <div className="about-heading"><h2 id="about-title">I work between the model and the person.</h2></div>
                    <div className="about-copy">
                        <p>I am an AI-focused Computer Science student at BINUS University and General Manager of R&amp;D at HIMTI BINUS.</p>
                        <p>My work combines efficient machine learning models with intuitive mobile and web interfaces to create practical technology for communities.</p>
                        <dl className="about-notes">
                            <div><dt>Based in</dt><dd>Tangerang, Indonesia</dd></div>
                            <div><dt>Studying</dt><dd>Computer Science at BINUS University</dd></div>
                            <div><dt>Working across</dt><dd>AI systems and product interfaces</dd></div>
                        </dl>
                        <ul className="skill-list" aria-label="Core areas"><li>UI/UX</li><li>Machine learning</li><li>Software design</li><li>Data analytics</li></ul>
                    </div>
                </section>

                <section id="contact" className="contact" aria-labelledby="contact-title">
                    <SectionDecor tone="light" />
                    <h2 id="contact-title">Put me on the team.</h2>
                    <div className="contact-actions">
                        <a className="button button-light" href="mailto:jad.fauzan@binus.ac.id">Email Jad</a>
                        <a className="button button-outline" href="https://www.linkedin.com/in/jad-abyanza-fauzan-8b26ba288/" target="_blank" rel="noopener noreferrer">Open LinkedIn</a>
                    </div>
                    <div className="contact-notes"><span>Tangerang, Indonesia</span><span>AI systems · Product design · Software</span></div>
                </section>
            </main>

            <footer><p>Jad Abyanza Fauzan</p><a href="#top">Back to top</a></footer>

            <ProjectDialog project={selectedProject} dialogRef={projectDialogRef} onClose={finishProjectDialog} onRequestClose={closeProjectDialog} />

            <dialog ref={terminalDialog} aria-labelledby="terminal-title" onClick={(event) => {
                if (event.target === terminalDialog.current) terminalDialog.current.close();
            }}>
                <div className="terminal-bar">
                    <h2 id="terminal-title">Jad portfolio assistant</h2>
                    <button type="button" aria-label="Close assistant" onClick={() => terminalDialog.current?.close()}>Close</button>
                </div>
                <div ref={terminalOutputRef} className="terminal-output" role="log" aria-live="polite">
                    {terminalLines.map((line, index) => <p className={`terminal-message terminal-message-${line.role}`} key={`${line.text}-${index}`}>{line.text}</p>)}
                </div>
                <form className="terminal-form" onSubmit={runTerminalCommand}>
                    <label htmlFor="terminal-input">You</label>
                    <input ref={terminalInputRef} id="terminal-input" name="command" type="text" autoComplete="off" spellCheck="false" placeholder="Ask about Jad…" aria-describedby="terminal-hint" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} onKeyDown={browseTerminalHistory} />
                    <button type="submit">Send</button>
                </form>
                <p id="terminal-hint" className="terminal-hint">Ask naturally · Use ↑ and ↓ for message history</p>
            </dialog>

            <Script src="/oneko.js" data-cat="/assets/oneko.gif" data-persist-position="true" strategy="afterInteractive" />
        </>
    );
}
