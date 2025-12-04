(function () {
    const root = document.getElementById('fab-menu-root') || (function () {
        const el = document.createElement('div');
        el.id = 'fab-menu-root';
        document.body.appendChild(el);
        return el;
    })();

    root.innerHTML = `
        <div class="fab-container" data-fab>
            <button class="fab-button" aria-label="Open menu" aria-haspopup="menu" aria-expanded="false" aria-controls="fab-menu" id="fab-trigger">
                <span class="fab-icon" aria-hidden="true">☰</span>
            </button>
            <div class="fab-menu" id="fab-menu" role="menu" aria-labelledby="fab-trigger">
                <a href="map.html" role="menuitem" class="fab-item" tabindex="-1">Map</a>
                <a href="profile.html" role="menuitem" class="fab-item" tabindex="-1">Profile</a>
                <a href="room-reviews.html" role="menuitem" class="fab-item" tabindex="-1">Reviews</a>
                <a href="settings.html" role="menuitem" class="fab-item" tabindex="-1">Settings</a>
            </div>
            <div class="fab-backdrop" hidden></div>
        </div>
        `;
        root.querySelector('.fab-container').classList.remove('open');
        const container = root.querySelector('[data-fab]');
        const trigger = root.querySelector('#fab-trigger');
        const menu = root.querySelector('#fab-menu');
        menu.setAttribute('hidden', '');
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        const backdrop = root.querySelector('.fab-backdrop');

        const currentPage = window.location.pathname.split("/").pop();
        items.forEach(item => {
            const href = item.getAttribute("href");
            if (href === currentPage) {
                item.style.display = "none";
            }
        });

        console.log({
            containerClassList: container.classList.value,
            menuHidden: menu.hasAttribute('hidden'),
            backdropHidden: backdrop.hidden
        });

        function openMenu() {
            container.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            menu.removeAttribute('hidden');
            backdrop.hidden = false;

            items[0]?.focus();

            document.addEventListener('focus', focusTrap, true);
            document.addEventListener('keydown', onKeyDown, true);
            document.addEventListener('click', onDocumentClick, true);
        }

        function closeMenu() {
            container.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            menu.setAttribute('hidden', '');
            backdrop.hidden = true;
            trigger.focus();
            document.removeEventListener('focus', focusTrap, true);
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('click', onDocumentClick, true);
        }

        function toggleMenu() {
            const isOpen = container.classList.contains('open');
            if (isOpen) closeMenu(); else openMenu();
        }

        function onKeyDown(e) {
            const isOpen = container.classList.contains('open');
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    closeMenu();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    moveFocus(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    moveFocus(-1);
                    break;
                case 'Home':
                    e.preventDefault();
                    items[0]?.focus();
                    break;
                case 'End':
                    e.preventDefault();
                    items[items.length - 1]?.focus();
                    break;
                default:
                    break;
            }
        }

        function onDocumentClick(e) {
            const isClickInside = container.contains(e.target);
            if (!isClickInside) {
                closeMenu();
            }
        }

        function focusTrap(e) {
            if (!container.classList.contains('open')) return;
            if (!container.contains(e.target)) {
                items[0]?.focus();
            }
        }

        function moveFocus(delta) {
            const index = items.indexOf(document.activeElement);
            const next = (index + delta + items.length) % items.length;
            items[next]?.focus();
        }

        trigger.addEventListener('click', toggleMenu);

        backdrop.addEventListener('click', closeMenu);

        menu.addEventListener('click', function (e) {
            const link = e.target.closest('[role="menuitem"]');
            if (!link) return;
            if (link.dataset.action === 'map-tools') {
                //this will hold map tools
            }
            closeMenu();
        });
})();