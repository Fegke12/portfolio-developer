// ============================================================
// Nova — Portfolio | Main script
// ============================================================
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setYear();
        setupPreloader();
        setupHeader();
        setupBurger();
        setupSmoothScroll();
        setupThemeToggle();
        setupReveal();
        setupProgressBars();
        setupCounters();
        setupFilters();
        setupModal();
        setupContactForm();
        setupToTop();
        setupActiveNav();
    }

    // ---------- Utilities ----------
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // ---------- Year ----------
    function setYear() {
        const y = $('#year');
        if (y) y.textContent = new Date().getFullYear();
    }

    // ---------- Preloader ----------
    function setupPreloader() {
        const p = $('#preloader');
        if (!p) return;
        window.addEventListener('load', () => {
            setTimeout(() => p.classList.add('is-hidden'), 200);
        });
        // Safety fallback
        setTimeout(() => p.classList.add('is-hidden'), 2500);
    }

    // ---------- Header shadow on scroll ----------
    function setupHeader() {
        const header = $('#header');
        if (!header) return;
        const onScroll = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ---------- Burger menu ----------
    function setupBurger() {
        const burger = $('#burger');
        const nav = $('#nav');
        if (!burger || !nav) return;

        const close = () => {
            nav.classList.remove('is-open');
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
        };
        const toggle = () => {
            const open = nav.classList.toggle('is-open');
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        burger.addEventListener('click', toggle);
        $$('.nav__link').forEach(a => a.addEventListener('click', close));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); });
    }

    // ---------- Smooth scroll ----------
    function setupSmoothScroll() {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const id = link.getAttribute('href');
                if (id.length < 2) return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    }

    // ---------- Theme toggle ----------
    function setupThemeToggle() {
        const btn = $('#themeToggle');
        if (!btn) return;
        const saved = localStorage.getItem('nova-theme');
        if (saved) document.documentElement.setAttribute('data-theme', saved);

        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            if (next === 'dark') document.documentElement.removeAttribute('data-theme');
            else document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('nova-theme', next);
        });
    }

    // ---------- Reveal on scroll ----------
    function setupReveal() {
        const els = $$('.reveal');
        if (!('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('is-visible'));
            return;
        }
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        els.forEach(el => io.observe(el));
    }

    // ---------- Progress bars ----------
    function setupProgressBars() {
        const bars = $$('.progress__bar');
        if (!bars.length) return;

        const animate = bar => {
            const v = parseInt(bar.dataset.value, 10) || 0;
            requestAnimationFrame(() => { bar.style.width = v + '%'; });
        };

        if (!('IntersectionObserver' in window)) { bars.forEach(animate); return; }
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        bars.forEach(b => io.observe(b));
    }

    // ---------- Counters ----------
    function setupCounters() {
        const els = $$('[data-counter]');
        if (!els.length) return;

        const run = el => {
            const target = parseInt(el.dataset.counter, 10) || 0;
            const duration = 1400;
            const start = performance.now();
            const step = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + (target >= 30 ? '+' : '');
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
            });
        }, { threshold: 0.4 });
        els.forEach(el => io.observe(el));
    }

    // ---------- Project filters ----------
    function setupFilters() {
        const buttons = $$('.filter');
        const items = $$('.project');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                const f = btn.dataset.filter;
                items.forEach(item => {
                    const match = f === 'all' || item.dataset.category === f;
                    item.classList.toggle('is-hidden', !match);
                });
            });
        });
    }

    // ---------- Modal ----------
    const PROJECT_DATA = {
        shop: {
            title: 'Интернет-магазин',
            tag: 'Веб',
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80',
            desc: 'Каталог товаров с фильтрацией по категориям, корзиной, избранным и адаптивной вёрсткой. Интерфейс оптимизирован под мобильные устройства, скорость загрузки — приоритет.',
            stack: 'HTML, CSS, JavaScript, LocalStorage',
            year: '2024',
            role: 'Frontend Developer',
            link: '#'
        },
        weather: {
            title: 'Приложение погоды',
            tag: 'Приложение',
            image: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=1400&q=80',
            desc: 'SPA-приложение, показывающее актуальную погоду по городу. Данные загружаются с внешнего API, есть автоопределение города и приятные анимации переключения.',
            stack: 'JavaScript, OpenWeather API, CSS Grid',
            year: '2024',
            role: 'Fullstack (Frontend)',
            link: '#'
        },
        dashboard: {
            title: 'Панель управления',
            tag: 'Дашборд',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
            desc: 'Административная панель с графиками, таблицами и виджетами. Тёмная тема, аккуратная типографика, всё гибко перестраивается под любые экраны.',
            stack: 'HTML, CSS, Chart.js, JavaScript',
            year: '2025',
            role: 'UI Developer',
            link: '#'
        },
        landing: {
            title: 'Лендинг стартапа',
            tag: 'Веб',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=80',
            desc: 'Одностраничный сайт для IT-стартапа: hero-блок с анимацией, секции преимуществ, отзывы клиентов и форма заявки с валидацией.',
            stack: 'HTML, SCSS, JavaScript, GSAP',
            year: '2025',
            role: 'Frontend Developer',
            link: '#'
        }
    };

    function setupModal() {
        const modal = $('#modal');
        if (!modal) return;
        const els = {
            image: $('#modalImage'),
            title: $('#modalTitle'),
            desc:  $('#modalDesc'),
            tag:   $('#modalTag'),
            stack: $('#modalStack'),
            year:  $('#modalYear'),
            role:  $('#modalRole'),
            link:  $('#modalLink')
        };

        const open = key => {
            const p = PROJECT_DATA[key];
            if (!p) return;
            els.image.src = p.image; els.image.alt = p.title;
            els.title.textContent = p.title;
            els.desc.textContent = p.desc;
            els.tag.textContent = p.tag;
            els.stack.textContent = p.stack;
            els.year.textContent = p.year;
            els.role.textContent = p.role;
            els.link.href = p.link;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            setTimeout(() => $('.modal__close', modal)?.focus(), 100);
        };
        const close = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        $$('[data-open]').forEach(b => b.addEventListener('click', () => open(b.dataset.open)));
        $$('[data-close]', modal).forEach(el => el.addEventListener('click', close));
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
    }

    // ---------- Contact form ----------
    function setupContactForm() {
        const form = $('#contactForm');
        if (!form) return;

        const setError = (input, msg) => {
            const field = input.closest('.field');
            const err = field.querySelector('.field__error');
            if (msg) {
                field.classList.add('has-error');
                err.textContent = msg;
            } else {
                field.classList.remove('has-error');
                err.textContent = '';
            }
        };

        const validators = {
            name: v => v.trim().length >= 2 ? '' : 'Введите имя (минимум 2 символа)',
            email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Введите корректный email',
            message: v => v.trim().length >= 10 ? '' : 'Сообщение должно быть не короче 10 символов'
        };

        // live-validate on blur
        Object.keys(validators).forEach(name => {
            const input = form.elements[name];
            if (!input) return;
            input.addEventListener('blur', () => setError(input, validators[name](input.value)));
            input.addEventListener('input', () => {
                if (input.closest('.field').classList.contains('has-error')) {
                    setError(input, validators[name](input.value));
                }
            });
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            let ok = true;
            Object.keys(validators).forEach(name => {
                const input = form.elements[name];
                const err = validators[name](input.value);
                setError(input, err);
                if (err) ok = false;
            });
            if (!ok) {
                showToast('Пожалуйста, исправьте ошибки в форме', true);
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Отправка…';

            // Simulated send
            setTimeout(() => {
                showToast('Сообщение отправлено — спасибо!');
                form.reset();
                btn.disabled = false;
                btn.textContent = original;
            }, 900);
        });
    }

    // ---------- Toast ----------
    let toastTimer;
    function showToast(text, isError = false) {
        const toast = $('#toast');
        if (!toast) return;
        toast.textContent = text;
        toast.classList.toggle('is-error', !!isError);
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
    }

    // ---------- To top ----------
    function setupToTop() {
        const btn = $('#toTop');
        if (!btn) return;
        const onScroll = () => {
            btn.classList.toggle('is-visible', window.scrollY > 500);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ---------- Active nav highlight ----------
    function setupActiveNav() {
        const links = $$('.nav__link');
        const sections = links
            .map(l => document.querySelector(l.getAttribute('href')))
            .filter(Boolean);
        if (!sections.length) return;

        const setActive = id => {
            links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
        };

        if (!('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
        sections.forEach(s => io.observe(s));
    }
})();
