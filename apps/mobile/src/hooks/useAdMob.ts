import { useEffect, useState } from 'react';
import MobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export function useAdMob() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        MobileAds().setRequestConfiguration({
          maxAdContentRating: MaxAdContentRating.PG,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        });
        setReady(true);
      })
      .catch(() => setReady(true)); // 실패해도 앱 진행
  }, []);

  return ready;
}
