#!/usr/bin/env node
/**
 * Root application startup file for cPanel Node.js Selector (Passenger)
 * and cPanel Web Apps (Podman container).
 */
import('./scripts/start-prod.mjs').catch((err) => {
  console.error('Failed to start production server:', err);
  process.exit(1);
});

