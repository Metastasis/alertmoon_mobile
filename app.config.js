export default (parent = {}) => {
  // We gracefully destruct these parameters to avoid "undefined" errors:
  const {config = {}} = parent;
  const {env = {}} = process || {};

  const {
    // This is the URL of your deployment. In our case we use the ORY Demo
    // environment
    KRATOS_URL = 'https://peaceful-johnson-6ddzaeik3v.projects.oryapis.com',

    // We use sentry.io for error tracing. This helps us identify errors
    // in the distributed packages. You can remove this.
    // SENTRY_DSN = "https://aaa@333.ingest.sentry.io/5530799",
  } = env;

  return {
    ...config,
    extra: {
      kratosUrl: KRATOS_URL,
      // sentryDsn: SENTRY_DSN,
    },
  };
};
