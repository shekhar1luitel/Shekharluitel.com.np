---
layout: note.njk
title: FastAPI deployment playbook
date: 2024-10-03
tags:
  - python
  - fastapi
  - devops
description: A checklist for shipping FastAPI services with observability, migrations, and zero-downtime deploys.
excerpt: A checklist for shipping FastAPI services with observability, migrations, and zero-downtime deploys.
---
<p>FastAPI helps me iterate quickly, but production is where quality shines. This is the checklist I run through before flipping DNS.</p>
<h2>Shape the app</h2>
<ol>
  <li>Structure routers by domain to keep imports predictable.</li>
  <li>Document dependency graphs so background tasks and API consumers remain in sync.</li>
  <li>Use Pydantic models for both request validation and response serialization.</li>
</ol>
<h2>Operational guardrails</h2>
<p>I pair <code>uvicorn</code> workers behind <code>gunicorn</code> with a <code>--graceful-timeout</code> safety net. Alembic migrations ship inside the container but run as a pre-start job. Prometheus metrics and Sentry traces feed a Grafana board so we catch regressions fast.</p>
<pre><code class="language-bash">$ alembic upgrade head
$ uvicorn app.main:app --proxy-headers --forwarded-allow-ips="*"
</code></pre>
<p>Finally, I lean on blue-green deployments with health checks to ensure connections drain before swap.</p>
