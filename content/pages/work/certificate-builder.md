---
layout: project.njk
title: Certificate Builder
description: Automated certificate generation pipeline for training cohorts with bilingual templates.
summary: Automated certificate generation pipeline for training cohorts with bilingual templates.
order: 2
featured: true
tech:
  - Python
  - WeasyPrint
  - PostgreSQL
  - Netlify Functions
links:
  live: https://certificates.example.com
  repo: https://github.com/example/certificate-builder
---
<section>
  <p>This internal tool removes the manual spreadsheet grind from issuing certificates. Organizers upload attendee CSV files, choose a template, and receive signed PDFs within minutes.</p>
  <p>I designed the template DSL so content teams can localize into Nepali and English without touching code. Render jobs run through a queue that batches PDF generation, reducing infrastructure costs by 40% compared to our previous Lambda-based flow.</p>
  <p>The system integrates with SendGrid for delivery and maintains an audit trail so administrators can reissue documents safely.</p>
</section>
