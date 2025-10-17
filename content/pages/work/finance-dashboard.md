---
layout: project.njk
title: Finance Operations Dashboard
description: Real-time revenue and expense cockpit for private colleges with drill-down reporting.
summary: Real-time revenue and expense cockpit for private colleges with drill-down reporting.
order: 4
featured: false
tech:
  - React
  - FastAPI
  - TimescaleDB
  - Tailwind Charts
links:
  live: https://finance.example.com
  repo: https://github.com/example/finance-dashboard
---
<section>
  <p>The finance dashboard aggregates transactional data from tuition payments, hostel fees, and bookstore sales. I implemented the ingestion API with FastAPI and scheduled tasks that normalize rows into TimescaleDB hypertables for rapid time-series queries.</p>
  <p>Decision makers can slice metrics by campus, program, or cohort, revealing revenue leakage in hours rather than weeks. We prioritized accessible color palettes and descriptive labels to keep the dashboard legible during projector walkthroughs.</p>
</section>
