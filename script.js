const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

document.addEventListener('DOMContentLoaded', () => {
  setupRevealAnimations();
  setupHeroParallax();
  setupFleetNodes();
  setupAiTyping();
  setupSmoothNavigation();
});

/* --------------------------------------------------
   REVEAL ANIMATIONS
-------------------------------------------------- */

function setupRevealAnimations() {
  const targets = document.querySelectorAll(
    '.section-label, .experience-heading, .dashboard-preview, ' +
    '.feature-card, .ai-copy, .ai-window, .business-heading, ' +
    '.business-orbit'
  );

  targets.forEach((element) => {
    element.classList.add('reveal-ready');
  });

  if (prefersReducedMotion) {
    targets.forEach((element) => {
      element.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('revealed');
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  targets.forEach((element) => observer.observe(element));
}

/* --------------------------------------------------
   HERO PARALLAX
-------------------------------------------------- */

function setupHeroParallax() {
  const hero = document.querySelector('.hero');
  const visual = document.querySelector('.hero-visual');

  if (!hero || !visual || prefersReducedMotion) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = null;

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();

    const normalizedX =
      (event.clientX - rect.left) / rect.width - 0.5;

    const normalizedY =
      (event.clientY - rect.top) / rect.height - 0.5;

    targetX = normalizedX * 12;
    targetY = normalizedY * 8;

    if (!animationFrame) {
      animateParallax();
    }
  });

  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;

    if (!animationFrame) {
      animateParallax();
    }
  });

  function animateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    visual.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0)`;

    const finished =
      Math.abs(targetX - currentX) < 0.01 &&
      Math.abs(targetY - currentY) < 0.01;

    if (finished) {
      animationFrame = null;
      return;
    }

    animationFrame = requestAnimationFrame(animateParallax);
  }
}

/* --------------------------------------------------
   FLEET NODE MOTION
-------------------------------------------------- */

function setupFleetNodes() {
  if (prefersReducedMotion) {
    return;
  }

  const nodes = document.querySelectorAll('.vehicle-node');

  nodes.forEach((node, index) => {
    const speed = 0.0007 + index * 0.00016;
    const amplitude = 4 + index * 1.5;
    const phase = index * 1.8;

    let start = null;

    function animate(time) {
      if (start === null) {
        start = time;
      }

      const elapsed = time - start;
      const y = Math.sin(elapsed * speed + phase) * amplitude;
      const x = Math.cos(elapsed * speed * 0.65 + phase) * 1.5;

      node.style.setProperty(
        '--node-motion',
        `translate3d(${x}px, ${y}px, 0)`
      );

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
}

/* --------------------------------------------------
   AI TYPING EFFECT
-------------------------------------------------- */

function setupAiTyping() {
  const line = document.querySelector('.typing-line');

  if (!line || prefersReducedMotion) {
    return;
  }

  let visible = true;

  setInterval(() => {
    visible = !visible;
    line.style.opacity = visible ? '1' : '0.35';
  }, 1800);
}

/* --------------------------------------------------
   SMOOTH NAVIGATION
-------------------------------------------------- */

function setupSmoothNavigation() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
}

/* --------------------------------------------------
   DASHBOARD LIVE COUNTERS
-------------------------------------------------- */

function animateNumber(element, target, suffix = '') {
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min(
      (now - start) / duration,
      1
    );

    const eased =
      1 - Math.pow(1 - progress, 3);

    const value = Math.round(target * eased);

    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function setupDashboardCounters() {
  if (prefersReducedMotion) {
    return;
  }

  const dashboard = document.querySelector('.dashboard-preview');

  if (!dashboard) {
    return;
  }

  const numbers = dashboard.querySelectorAll(
    '.metric-card strong'
  );

  if (numbers.length < 2) {
    return;
  }

  let started = false;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started) {
          return;
        }

        started = true;

        animateNumber(numbers[0], 24);
        animateNumber(numbers[1], 6);

        currentObserver.disconnect();
      });
    },
    {
      threshold: 0.3,
    }
  );

  observer.observe(dashboard);
}

setupDashboardCounters();

/* --------------------------------------------------
   SUBTLE SCROLL DEPTH
-------------------------------------------------- */

if (!prefersReducedMotion) {
  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) {
        return;
      }

      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const siteShell = document.querySelector('.site-shell');

        if (siteShell) {
          siteShell.style.setProperty(
            '--scroll-depth',
            `${scrollY}px`
          );
        }

        ticking = false;
      });
    },
    { passive: true }
  );
}

/* --------------------------------------------------
   FLEET MANAGER INTERACTIVE DEMO
   Local simulation only — no Firebase / production data
-------------------------------------------------- */

const fleetDemoState = {
  role: 'admin',

  cars: [
    {
      id: 'car-001',
      number: 'LEA-2024',
      brand: 'Toyota',
      model: 'Corolla',
      year: '2024',
      color: 'White',
      registration: 'LEA-2024',
      status: 'Available',
    },
    {
      id: 'car-002',
      number: 'LEB-2023',
      brand: 'Honda',
      model: 'Civic',
      year: '2023',
      color: 'Black',
      registration: 'LEB-2023',
      status: 'Rented',
    },
    {
      id: 'car-003',
      number: 'LEC-2022',
      brand: 'Suzuki',
      model: 'Swift',
      year: '2022',
      color: 'Silver',
      registration: 'LEC-2022',
      status: 'Available',
    },
  ],

  rentals: [
    {
      id: 'rent-001',
      customer: 'Ahmed Khan',
      carNumber: 'LEB-2023',
      from: 'Lahore',
      to: 'Islamabad',
      dailyRent: 6500,
      status: 'Active',
    },
  ],

  entries: [
    {
      type: 'Income',
      category: 'Rental',
      amount: 18500,
      date: '2026-10-04',
      description: 'Rental payment',
    },
    {
      type: 'Expense',
      category: 'Maintenance',
      amount: 6500,
      date: '2026-10-03',
      description: 'Routine maintenance',
    },
  ],

  vendors: [
    {
      id: 'vendor-001',
      name: 'City Auto Parts',
      bills: [
        {
          id: 'bill-001',
          amount: 18000,
          paid: 10000,
          description: 'Brake service parts',
        },
      ],
    },
  ],

  workers: [
    {
      id: 'worker-001',
      name: 'Ali Raza',
      email: 'ali@example.com',
      cars: ['LEA-2024'],
    },
    {
      id: 'worker-002',
      name: 'Usman Ahmed',
      email: 'usman@example.com',
      cars: [],
    },
  ],

  device: {
    active: true,
    name: 'Shahzad-PC',
    platform: 'Android',
    status: 'Registered',
  },

  currentModule: 'dashboard',
};

function initFleetInteractiveDemo() {
  const demo = document.querySelector('#fleet-demo');

  if (!demo) {
    return;
  }

  /*
   * Interactive rendering will be attached here in the next demo layer.
   * Keeping initialization isolated prevents the existing cinematic
   * landing-page animations from being affected.
   */
  demo.dataset.interactiveReady = 'true';
}

document.addEventListener(
  'DOMContentLoaded',
  initFleetInteractiveDemo
);

/* --------------------------------------------------
   DEMO NAVIGATION
-------------------------------------------------- */

function setupFleetDemoNavigation() {
  const demo = document.querySelector('#fleet-demo');

  if (!demo) {
    return;
  }

  const sidebarItems = demo.querySelectorAll(
    '[data-demo-module]'
  );

  sidebarItems.forEach((item) => {
    item.addEventListener('click', () => {
      const module = item.dataset.demoModule;

      if (!module) {
        return;
      }

      fleetDemoState.currentModule = module;

      sidebarItems.forEach((sidebarItem) => {
        sidebarItem.classList.toggle(
          'active',
          sidebarItem === item
        );
      });

      demo.dispatchEvent(
        new CustomEvent('fleet-demo-module-change', {
          detail: { module },
        })
      );
    });
  });
}

document.addEventListener(
  'DOMContentLoaded',
  setupFleetDemoNavigation
);

/* --------------------------------------------------
   DEMO SCREEN RENDERER
-------------------------------------------------- */

function setupFleetDemoRenderer() {
  const demo = document.querySelector('#fleet-demo');
  const content = document.querySelector('#fleet-demo-content');

  if (!demo || !content) {
    return;
  }

  function renderModule(module) {
    if (module === 'dashboard') {
      renderDemoDashboard(content);
      return;
    }

    if (module === 'add_car') {
      renderAddCarForm(content);
      return;
    }

    content.innerHTML = `
      <div class="dashboard-heading">
        <div>
          <span>FLEET MANAGER DEMO</span>
          <h3>${formatDemoModuleName(module)}</h3>
        </div>

        <div class="date-pill">
          Demo mode
        </div>
      </div>

      <div class="metric-card" style="margin-top: 16px;">
        <span>Interactive module</span>
        <strong>${formatDemoModuleName(module)}</strong>
        <small>This screen is connected to the local Fleet Manager demo state.</small>
      </div>
    `;
  }

  function handleModuleChange(event) {
    renderModule(event.detail.module);
  }

  demo.addEventListener(
    'fleet-demo-module-change',
    handleModuleChange
  );

  renderModule(fleetDemoState.currentModule);
}

function renderDemoDashboard(content) {
  const totalVehicles = fleetDemoState.cars.length;
  const activeRentals = fleetDemoState.rentals.filter(
    (rental) => rental.status === 'Active'
  ).length;

  const revenue = fleetDemoState.entries
    .filter((entry) => entry.type === 'Income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const expenses = fleetDemoState.entries
    .filter((entry) => entry.type === 'Expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const outstanding = fleetDemoState.vendors.reduce(
    (total, vendor) =>
      total +
      vendor.bills.reduce(
        (vendorTotal, bill) =>
          vendorTotal + Math.max(0, bill.amount - bill.paid),
        0
      ),
    0
  );

  const available = fleetDemoState.cars.filter(
    (car) => car.status === 'Available'
  ).length;

  const rented = fleetDemoState.cars.filter(
    (car) => car.status === 'Rented'
  ).length;

  const maintenance = fleetDemoState.cars.filter(
    (car) => car.status === 'Maintenance'
  ).length;

  content.innerHTML = `
    <div class="dashboard-heading">
      <div>
        <span>GOOD MORNING</span>
        <h3>Fleet overview</h3>
      </div>

      <div class="date-pill">
        Demo mode
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric-card">
        <span>Total vehicles</span>
        <strong>${totalVehicles}</strong>
        <small>Live demo fleet</small>
      </div>

      <div class="metric-card">
        <span>Active rentals</span>
        <strong>${String(activeRentals).padStart(2, '0')}</strong>
        <small>Currently rented</small>
      </div>

      <div class="metric-card">
        <span>Net movement</span>
        <strong>Rs ${formatDemoMoney(revenue - expenses)}</strong>
        <small>Income minus expenses</small>
      </div>

      <div class="metric-card">
        <span>Outstanding</span>
        <strong>Rs ${formatDemoMoney(outstanding)}</strong>
        <small>Vendor balance</small>
      </div>
    </div>

    <div class="dashboard-lower">
      <div class="chart-card">
        <div class="card-heading">
          <div>
            <span>BUSINESS PERFORMANCE</span>
            <strong>Demo financial flow</strong>
          </div>

          <span class="trend">LIVE</span>
        </div>

        <div class="chart">
          <div class="chart-grid"></div>

          <svg viewBox="0 0 600 190" preserveAspectRatio="none">
            <defs>
              <linearGradient id="demoChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#58a6ff" stop-opacity=".35"/>
                <stop offset="100%" stop-color="#58a6ff" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <path
              d="M0 155 C65 145 85 120 135 130 C190 141 210 88 265 105 C315 120 330 65 385 78 C430 90 470 35 510 57 C545 75 565 30 600 20 L600 190 L0 190 Z"
              fill="url(#demoChartFill)"
            />

            <path
              d="M0 155 C65 145 85 120 135 130 C190 141 210 88 265 105 C315 120 330 65 385 78 C430 90 470 35 510 57 C545 75 565 30 600 20"
              fill="none"
              stroke="#58a6ff"
              stroke-width="3"
            />
          </svg>
        </div>
      </div>

      <div class="fleet-card">
        <div class="card-heading">
          <div>
            <span>FLEET STATUS</span>
            <strong>Live vehicles</strong>
          </div>

          <span>${totalVehicles}</span>
        </div>

        <div class="fleet-row">
          <div class="car-dot available"></div>
          <div>
            <strong>Available</strong>
            <span>${available} vehicles</span>
          </div>
          <b>${percentage(available, totalVehicles)}%</b>
        </div>

        <div class="fleet-row">
          <div class="car-dot rented"></div>
          <div>
            <strong>On rental</strong>
            <span>${rented} vehicles</span>
          </div>
          <b>${percentage(rented, totalVehicles)}%</b>
        </div>

        <div class="fleet-row">
          <div class="car-dot service"></div>
          <div>
            <strong>Maintenance</strong>
            <span>${maintenance} vehicles</span>
          </div>
          <b>${percentage(maintenance, totalVehicles)}%</b>
        </div>
      </div>
    </div>
  `;
}

function formatDemoModuleName(module) {
  const names = {
    dashboard: 'Fleet overview',
    cars: 'Car Management',
    rentals: 'Rentals',
    finance: 'Income & Expense',
    reports: 'Reports',
    vendors: 'Vendor Bills & Payments',
    workers: 'Worker Control',
    device: 'Device Management',
    help: 'Help & Support',
  };

  return names[module] || 'Fleet Manager';
}

function formatDemoMoney(value) {
  return Math.max(0, Math.round(value)).toLocaleString('en-PK');
}

function percentage(value, total) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

document.addEventListener(
  'DOMContentLoaded',
  setupFleetDemoRenderer
);

/* --------------------------------------------------
   DEMO: CAR MANAGEMENT + ADD NEW CAR
-------------------------------------------------- */

function renderDemoCars(content) {
  content.innerHTML = `
    <div class="demo-module">

      <div class="demo-toolbar">
        <div class="demo-toolbar-copy">
          <span>CAR MANAGEMENT</span>
          <h3>Fleet vehicles</h3>
        </div>

        <button
          class="demo-action primary"
          type="button"
          data-demo-action="show-add-car">
          + Add New Car
        </button>
      </div>

      <div class="demo-panel">
        <div class="demo-form-heading">
          <span>YOUR DEMO FLEET</span>
          <h4>${fleetDemoState.cars.length} vehicle(s)</h4>
        </div>

        <div class="demo-list">
          ${fleetDemoState.cars.map((car) => `
            <div class="demo-list-item">
              <div class="demo-list-main">
                <strong>${escapeDemoHtml(car.number)}</strong>
                <span>
                  ${escapeDemoHtml(car.brand)}
                  ${escapeDemoHtml(car.model)}
                  · ${escapeDemoHtml(car.year || 'Year not set')}
                  · ${escapeDemoHtml(car.color || 'Color not set')}
                </span>
              </div>

              <span class="demo-status ${car.status.toLowerCase()}">
                ${escapeDemoHtml(car.status)}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="demo-car-form-area"></div>

    </div>
  `;

  const addButton = content.querySelector(
    '[data-demo-action="show-add-car"]'
  );

  if (addButton) {
    addButton.addEventListener('click', () => {
      renderAddCarForm(
        content.querySelector('#demo-car-form-area')
      );
    });
  }
}

function renderAddCarForm(container) {
  if (!container) {
    return;
  }

  const catalog = {
    Toyota: ['Corolla', 'Camry', 'Yaris', 'Prius', 'RAV4', 'Hilux', 'Land Cruiser', 'Fortuner', 'Highlander', 'Crown', 'Supra', 'Other'],
    Honda: ['Civic', 'Accord', 'City', 'Jazz', 'Fit', 'CR-V', 'HR-V', 'Pilot', 'BR-V', 'Other'],
    Suzuki: ['Alto', 'Swift', 'Cultus', 'Wagon R', 'Bolan', 'Every', 'Jimny', 'Vitara', 'Ciaz', 'Other'],
    Nissan: ['Sunny', 'Altima', 'Sentra', 'Maxima', 'Versa', 'X-Trail', 'Qashqai', 'Patrol', 'Navara', 'Other'],
    Mitsubishi: ['Lancer', 'Outlander', 'Pajero', 'ASX', 'Eclipse Cross', 'Triton', 'Attrage', 'Other'],
    Mazda: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-30', 'CX-50', 'CX-60', 'CX-90', 'MX-5', 'Other'],
    Hyundai: ['i10', 'i20', 'Elantra', 'Sonata', 'Accent', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Creta', 'Other'],
    Kia: ['Picanto', 'Rio', 'Cerato', 'Forte', 'K5', 'Sportage', 'Sorento', 'Seltos', 'Carnival', 'Telluride', 'Other'],
    Ford: ['Fiesta', 'Focus', 'Fusion', 'Mustang', 'Escape', 'Explorer', 'Expedition', 'Ranger', 'F-150', 'Bronco', 'Other'],
    Chevrolet: ['Spark', 'Malibu', 'Cruze', 'Impala', 'Camaro', 'Equinox', 'Tahoe', 'Suburban', 'Silverado', 'Other'],
    GMC: ['Terrain', 'Acadia', 'Yukon', 'Sierra', 'Canyon', 'Other'],
    Volkswagen: ['Golf', 'Polo', 'Passat', 'Jetta', 'Tiguan', 'Touareg', 'Taos', 'Other'],
    Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'Other'],
    BMW: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'Other'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'Other'],
    Porsche: ['718 Cayman', '718 Boxster', '911', 'Panamera', 'Macan', 'Cayenne', 'Taycan', 'Other'],
    Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'V60', 'V90', 'Other'],
    Lexus: ['IS', 'ES', 'LS', 'UX', 'NX', 'RX', 'GX', 'LX', 'Other'],
    'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Other'],
    Jaguar: ['XE', 'XF', 'XJ', 'F-PACE', 'E-PACE', 'F-TYPE', 'Other'],
    Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Other'],
    Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Other'],
    Chrysler: ['300', 'Pacifica', 'Voyager', 'Other'],
    Dodge: ['Charger', 'Challenger', 'Durango', 'Hornet', 'Other'],
    Peugeot: ['208', '308', '408', '508', '2008', '3008', '5008', 'Other'],
    Renault: ['Clio', 'Megane', 'Captur', 'Arkana', 'Koleos', 'Duster', 'Other'],
    Fiat: ['500', 'Panda', 'Tipo', 'Punto', 'Doblo', 'Other'],
    Skoda: ['Fabia', 'Octavia', 'Superb', 'Karoq', 'Kodiaq', 'Kamiq', 'Other'],
    SEAT: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Other'],
    MG: ['MG3', 'MG4', 'MG5', 'ZS', 'HS', 'RX5', 'Other'],
    BYD: ['Dolphin', 'Atto 3', 'Seal', 'Han', 'Tang', 'Song', 'Other'],
    Geely: ['Emgrand', 'Coolray', 'Azkarra', 'Monjaro', 'Geometry C', 'Other'],
    Chery: ['Tiggo 4', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6', 'Other'],
    Haval: ['H1', 'H2', 'H6', 'H9', 'Jolion', 'Other'],
    'Great Wall': ['Wingle', 'Poer', 'Cannon', 'Other'],
    Isuzu: ['D-Max', 'MU-X', 'Other'],
    Daihatsu: ['Mira', 'Move', 'Terios', 'Rocky', 'Other'],
    Tata: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Other'],
    Mahindra: ['Thar', 'Scorpio', 'XUV300', 'XUV700', 'Bolero', 'Other'],
    Other: ['Other'],
  };

  const brands = Object.keys(catalog);

  container.innerHTML = `
    <div class="demo-panel demo-add-car-panel">
      <div class="demo-form-heading">
        <div class="demo-form-icon">＋</div>
        <div>
          <span>ADD NEW CAR</span>
          <h4>Vehicle details</h4>
          <p>Add a vehicle to the Fleet Manager demo fleet.</p>
        </div>
      </div>

      <form class="demo-form" id="demo-add-car-form" novalidate>
        <div
          class="demo-feedback"
          id="demo-add-car-feedback"
          aria-live="polite">
        </div>

        <div class="demo-form-grid">

          <div class="demo-field full">
            <label for="demo-car-number">Car Number</label>
            <div class="demo-input-wrap">
              <span class="demo-input-icon">#</span>
              <input
                id="demo-car-number"
                name="carNumber"
                type="text"
                placeholder="ABC-123"
                maxlength="20"
                autocomplete="off"
                autocapitalize="characters"
                required>
            </div>
            <small>Example: ABC-123</small>
          </div>

          <div class="demo-field">
            <label for="demo-car-brand">Car Brand</label>
            <div class="demo-input-wrap">
              <span class="demo-input-icon">◆</span>
              <select id="demo-car-brand" name="brand" required>
                <option value="">Select Brand</option>
                ${brands.map((brand) => `
                  <option value="${escapeDemoHtml(brand)}">
                    ${escapeDemoHtml(brand)}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="demo-field">
            <label for="demo-car-model">Car Model</label>
            <div class="demo-input-wrap">
              <span class="demo-input-icon">◇</span>
              <select id="demo-car-model" name="model" disabled required>
                <option value="">Select Brand First</option>
              </select>
            </div>
          </div>

          <div
            class="demo-field full"
            id="demo-custom-model-field"
            hidden>
            <label for="demo-custom-model">Custom Model</label>
            <div class="demo-input-wrap">
              <span class="demo-input-icon">✎</span>
              <input
                id="demo-custom-model"
                name="customModel"
                type="text"
                placeholder="Enter model name"
                maxlength="50"
                autocomplete="off">
            </div>
          </div>

        </div>

        <div class="demo-form-actions">
          <button
            class="demo-action"
            type="button"
            data-demo-action="cancel-add-car">
            Cancel
          </button>

          <button
            class="demo-action primary"
            type="submit">
            <span>＋</span>
            Add Car
          </button>
        </div>
      </form>
    </div>
  `;

  const form = container.querySelector('#demo-add-car-form');
  const feedback = container.querySelector('#demo-add-car-feedback');
  const carNumberField = container.querySelector('#demo-car-number');
  const brandField = container.querySelector('#demo-car-brand');
  const modelField = container.querySelector('#demo-car-model');
  const customModelField = container.querySelector('#demo-custom-model-field');
  const customModelInput = container.querySelector('#demo-custom-model');

  function updateModels(brand) {
    const models = catalog[brand] || [];

    modelField.innerHTML = brand
      ? `<option value="">Select Model</option>
         ${models.map((model) => `
           <option value="${escapeDemoHtml(model)}">
             ${escapeDemoHtml(model)}
           </option>
         `).join('')}`
      : '<option value="">Select Brand First</option>';

    modelField.disabled = !brand;
    customModelField.hidden = true;
    customModelInput.value = '';
  }

  carNumberField.addEventListener('input', () => {
    const input = carNumberField.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    let letterCount = 0;

    while (
      letterCount < input.length &&
      letterCount < 4 &&
      /[A-Z]/.test(input[letterCount])
    ) {
      letterCount++;
    }

    const letters = input.slice(0, letterCount);
    const digits = input.slice(letterCount);

    carNumberField.value = digits
      ? `${letters}-${digits}`
      : letters;
  });

  brandField.addEventListener('change', () => {
    updateModels(brandField.value);
  });

  modelField.addEventListener('change', () => {
    const isOther = modelField.value === 'Other';

    customModelField.hidden = !isOther;

    if (!isOther) {
      customModelInput.value = '';
    } else {
      customModelInput.focus();
    }
  });

  container
    .querySelector('[data-demo-action="cancel-add-car"]')
    .addEventListener('click', () => {
      container.innerHTML = '';
    });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const carNumber = carNumberField.value.trim().toUpperCase();
    const brand = brandField.value.trim();
    const selectedModel = modelField.value.trim();

    let model = selectedModel;

    if (!carNumber) {
      showDemoFeedback(
        feedback,
        'Enter car number.',
        'error'
      );
      carNumberField.focus();
      return;
    }

    if (!brand) {
      showDemoFeedback(
        feedback,
        'Please select a car brand.',
        'error'
      );
      brandField.focus();
      return;
    }

    if (!selectedModel) {
      showDemoFeedback(
        feedback,
        'Please select a car model.',
        'error'
      );
      modelField.focus();
      return;
    }

    if (selectedModel === 'Other') {
      model = customModelInput.value.trim();

      if (!model) {
        showDemoFeedback(
          feedback,
          'Enter the custom car model.',
          'error'
        );
        customModelInput.focus();
        return;
      }
    }

    const duplicate = fleetDemoState.cars.some(
      (car) =>
        car.number.toLowerCase() === carNumber.toLowerCase()
    );

    if (duplicate) {
      showDemoFeedback(
        feedback,
        `Car ${carNumber} already exists in this demo fleet.`,
        'error'
      );
      carNumberField.focus();
      return;
    }

    const newCar = {
      id: `car-${Date.now()}`,
      number: carNumber,
      brand,
      model,
      year: '',
      color: '',
      registration: carNumber,
      status: 'Available',
    };

    fleetDemoState.cars.push(newCar);

    showDemoFeedback(
      feedback,
      `${carNumber} was added successfully.`,
      'success'
    );

    window.setTimeout(() => {
      renderDemoCars(document.querySelector('#fleet-demo-content'));
    }, 700);
  });
}

function showDemoFeedback(element, message, type) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `demo-feedback show ${type}`;
}

function escapeDemoHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* Connect Car Management to the existing demo renderer. */

const originalFleetDemoModuleChange =
  window.__fleetDemoModuleChangeHandler;

function setupFleetDemoCarModule() {
  const demo = document.querySelector('#fleet-demo');

  if (!demo) {
    return;
  }

  demo.addEventListener(
    'fleet-demo-module-change',
    (event) => {
      if (event.detail.module !== 'cars') {
        return;
      }

      const content = document.querySelector(
        '#fleet-demo-content'
      );

      if (content) {
        renderDemoCars(content);
      }
    }
  );
}

document.addEventListener(
  'DOMContentLoaded',
  setupFleetDemoCarModule
);

/* --------------------------------------------------
   INTRO PRODUCT SHOWCASE
   Website → Android App → Web App
-------------------------------------------------- */

function setupIntroProductShowcase() {
  const showcase = document.querySelector('.intro-showcase');

  if (!showcase) {
    return;
  }

  const slides = showcase.querySelectorAll('.showcase-slide');
  const dots = showcase.querySelectorAll('.showcase-dots i');
  const types = document.querySelectorAll('.intro-type');

  if (slides.length === 0) {
    return;
  }

  let currentIndex = 0;
  let timer = null;

  function showProduct(index) {
    currentIndex = index;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle(
        'active',
        slideIndex === currentIndex
      );
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle(
        'active',
        dotIndex === currentIndex
      );
    });

    types.forEach((type, typeIndex) => {
      type.classList.toggle(
        'active',
        typeIndex === currentIndex
      );
    });
  }

  if (prefersReducedMotion) {
    showProduct(0);
    return;
  }

  function startRotation() {
    if (timer) {
      return;
    }

    timer = setInterval(() => {
      showProduct(
        (currentIndex + 1) % slides.length
      );
    }, 3200);
  }

  function stopRotation() {
    if (!timer) {
      return;
    }

    clearInterval(timer);
    timer = null;
  }

  types.forEach((type, index) => {
    type.addEventListener('click', () => {
      if (index >= slides.length) {
        return;
      }

      showProduct(index);
      stopRotation();
      startRotation();
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (index >= slides.length) {
        return;
      }

      showProduct(index);
      stopRotation();
      startRotation();
    });
  });

  showProduct(0);
  startRotation();
}

document.addEventListener(
  'DOMContentLoaded',
  setupIntroProductShowcase
);

/* --------------------------------------------------
   SMART DISTRIBUTION — WORKFLOW SLIDES
-------------------------------------------------- */

function setupDistributionWorkflow() {
  const section = document.querySelector('.distribution-workflow-section');
  if (!section) return;

  const slides = Array.from(section.querySelectorAll('.workflow-slide'));
  const previous = section.querySelector('.workflow-prev');
  const next = section.querySelector('.workflow-next');
  const progressLabel = section.querySelector('.workflow-progress-label');
  const progressBar = section.querySelector('.workflow-progress-track i');

  if (!slides.length || !previous || !next || !progressLabel || !progressBar) return;

  let current = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let autoTimer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    progressLabel.textContent =
      String(current + 1).padStart(2, '0') + ' / ' +
      String(slides.length).padStart(2, '0');

    progressBar.style.width =
      ((current + 1) / slides.length * 100) + '%';
  }

  function startAutoPlay() {
    if (prefersReducedMotion || autoTimer) return;

    autoTimer = setInterval(() => {
      showSlide(current + 1);
    }, 4200);
  }

  function restartAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    startAutoPlay();
  }

  previous.addEventListener('click', () => {
    showSlide(current - 1);
    restartAutoPlay();
  });

  next.addEventListener('click', () => {
    showSlide(current + 1);
    restartAutoPlay();
  });

  section.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  section.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) {
      showSlide(current + 1);
    } else {
      showSlide(current - 1);
    }

    restartAutoPlay();
  }, { passive: true });

  showSlide(0);
  startAutoPlay();
}

document.addEventListener('DOMContentLoaded', setupDistributionWorkflow);

/* =========================================================
   FLEET MANAGER DEMO — OPENING TRANSITION
   ========================================================= */

