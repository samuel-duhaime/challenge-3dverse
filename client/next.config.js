const { readFileSync } = require('fs');
const { PHASE_PRODUCTION_SERVER } = require('next/constants');

const packageJSON = JSON.parse(readFileSync('./package.json', 'utf8'));

const APP_NAME = packageJSON.name;
const APP_REPOSITORY_URL = packageJSON.repository.url.replace(/git\+|\.git/gi, '');
const APP_VERSION = packageJSON.version;

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = phase => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    [
      ['APP_NAME', APP_NAME],
      ['APP_REPOSITORY_URL', APP_REPOSITORY_URL],
      ['APP_VERSION', APP_VERSION],
      ['TZ', process.env.TZ],
    ].forEach(([name, value]) => {
      if (!value) throw new Error(`${name} is not defined`);
    });
  }

  return {
    env: {
      APP_NAME,
      APP_REPOSITORY_URL,
      APP_VERSION,
    },
    experimental: {
      appDir: true,
    },
    reactStrictMode: true,
    swcMinify: true,
  };
};
