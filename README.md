# Four Seasons Moto Rental Website
website : https://4smotos.com
Static rental website for Four Seasons Moto with a customer booking flow, 3D vehicle models, Firebase-backed data features, and an admin dashboard.

## Features

- Customer booking flow from details, duration, vehicle selection, accessories, agreement, and payment.
- Vehicle catalog for motorcycles, ATVs, and jet skis.
- 3D GLB model assets rendered in the frontend.
- Admin dashboard for bookings, bikes, users, accessories, settings, analytics, testimonials, and translations.
- Firebase integration helpers for data loading, sessions, dashboards, testimonials, and inventory.
- Netlify-ready static deployment through `netlify.toml`.
- Responsive mobile-focused CSS and performance helper scripts.

## Project Structure

```text
.
├── index.html
├── user-details.html
├── duration-selection.html
├── bike-selection.html
├── accessories.html
├── agreement.html
├── confirm-booking.html
├── payment.html
├── admin-dashboard/
│   ├── main_admin.html
│   ├── css/
│   └── js/
├── js/
├── favicon_io/
├── netlify.toml
└── *.glb / *.pdf / image assets
```

## Run Locally

This project does not require a build step. Open `index.html` directly in a browser, or run a simple static server from the project root:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deployment

The site is configured for Netlify.

1. Push this repository to GitHub.
2. In Netlify, choose **New site from Git**.
3. Select this repository.
4. Use these settings:
   - Build command: leave empty
   - Publish directory: `.`
5. Deploy.

Netlify will read `netlify.toml` for redirects, headers, and static asset caching.

## Configuration Notes

- Firebase settings are stored in the frontend/admin JavaScript files. Confirm production Firebase rules before going live.
- Email/contact functionality may require EmailJS setup. See `EMAILJS-SETUP.md` and related setup docs.
- Large 3D and media assets are committed with the project, so the repository may take longer to clone.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Three.js / GLB models
- Firebase
- Netlify

## License

Copyright 2026 Four Seasons Moto. All rights reserved.
