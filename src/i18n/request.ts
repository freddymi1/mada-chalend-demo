import { getUserLocale } from "@/lib/lngService";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: {
      lng: (
        await import(
          `../../messages/${locale}.json`
        )
      ).default,
    },
  };
});
