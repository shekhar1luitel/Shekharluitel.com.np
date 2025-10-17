---
layout: project.njk
title: IRD CBMS Sync
description: Financial data bridge syncing campus bookkeeping with Inland Revenue Department requirements.
summary: Financial data bridge syncing campus bookkeeping with Inland Revenue Department requirements.
order: 3
featured: true
tech:
  - FastAPI
  - SQLAlchemy
  - Celery
  - PostgreSQL
links:
  live: https://ird-sync.example.com
  repo: https://github.com/example/ird-cbms-sync
---
<section>
  <p>Universities in Nepal manage complex ledgers across multiple systems. We built IRD CBMS Sync to translate campus bookkeeping data into formats that comply with Inland Revenue Department audits.</p>
  <p>The service exposes a REST API for uploading ledger batches, then runs validation tasks using Celery workers. It flags anomalies like mismatched VAT categories and posts reconciled entries back to the campus ERP.</p>
  <p>Security was central: data rests in encrypted PostgreSQL tables and requests are signed with rotating API keys. Administrators receive daily compliance summaries via email.</p>
</section>
