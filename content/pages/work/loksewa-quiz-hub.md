---
layout: project.njk
title: Loksewa Quiz Hub
description: Nationwide exam preparation platform delivering adaptive quizzes and mentor analytics.
summary: Nationwide exam preparation platform delivering adaptive quizzes and mentor analytics.
order: 1
featured: true
tech:
  - FastAPI
  - SQLAlchemy
  - Postgres
  - Redis
  - Vue
links:
  live: https://loksewaquizhub.com
  repo: https://github.com/example/loksewa-quiz-hub
---
<section>
  <p>Loksewa Quiz Hub empowers civil service candidates with a focused study environment. I architected the backend using FastAPI with async SQLAlchemy sessions, ensuring each quiz request round-trips in under 120 ms even during peak exam seasons.</p>
  <p>The platform personalizes recommendations through a rules engine backed by Redis streams. Mentor dashboards surface real-time performance signals so coaches can intervene with targeted study plans.</p>
  <p>My role covered delivery from schema design to deployment automation with Docker and GitHub Actions. We now serve 50k+ monthly learners with 99.95% uptime.</p>
</section>
