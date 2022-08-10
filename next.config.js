const { withSentryConfig } = require('@sentry/nextjs')

const HOST_MAPPINGS = [
  {
    name: 'descendants',
    hostname: 'staking.ancestors.digital',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
    BASE_CLUSTER: process.env.BASE_CLUSTER,
  },
  async rewrites() {
    return HOST_MAPPINGS.reduce(
      (acc, mapping) =>
        mapping.hostname
          ? [
              ...acc,
              {
                source: '/:path(.*)',
                destination: `/${mapping.name}`,
                has: [
                  {
                    type: 'host',
                    value: mapping.hostname,
                  },
                ],
              },
            ]
          : acc,
      []
    )
  },
  async redirects() {
    return HOST_MAPPINGS.reduce(
      (acc, mapping) =>
        mapping.hostname
          ? [
              ...acc,
              {
                source: '/',
                destination: `/${mapping.name}`,
                permanent: false,
                has: [
                  {
                    type: 'host',
                    value: mapping.hostname,
                  },
                ],
              },
            ]
          : acc,
      []
    )
  },
}

module.exports = nextConfig

/**
module.exports = withSentryConfig(nextConfig, {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  dryRun: process.env.VERCEL_ENV !== "production",

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
})
*/