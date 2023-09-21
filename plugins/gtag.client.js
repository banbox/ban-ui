/**
 * 谷歌统计
 * https://analytics.google.com/analytics/web/provision/
 */
export default defineNuxtPlugin((nuxtApp) => {
  if(process.env.NODE_ENV !== 'production')return
  const { gtagId } = useRuntimeConfig().public;

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.dataLayer = window.dataLayer || [];

  gtag("js", new Date());
  gtag("config", gtagId);

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
        async: true,
      },
    ],
  });
});