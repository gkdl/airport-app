import { Platform, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const ANDROID_ID = process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID ?? TestIds.ADAPTIVE_BANNER;
const IOS_ID = process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ?? TestIds.ADAPTIVE_BANNER;
const AD_UNIT_ID = Platform.OS === 'ios' ? IOS_ID : ANDROID_ID;

interface Props {
  size?: BannerAdSize;
}

export function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: Props) {
  return (
    <View className="items-center my-2">
      <BannerAd unitId={AD_UNIT_ID} size={size} requestOptions={{ requestNonPersonalizedAdsOnly: false }} />
    </View>
  );
}
