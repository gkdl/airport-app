import { useEffect } from 'react';
import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAppStore } from '../store/appStore';
import { DeviceApi } from '../lib/api';
import { getDeviceId, setDeviceId } from '../lib/storage';

export function useDeviceInit() {
  const { setDeviceId: storeSetDeviceId } = useAppStore();

  useEffect(() => {
    async function init() {
      let deviceId = getDeviceId();
      if (!deviceId) {
        deviceId = Crypto.randomUUID();
        setDeviceId(deviceId);
      }
      storeSetDeviceId(deviceId);

      try {
        await DeviceApi.register({
          deviceId,
          platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
          appVersion: '1.0.0',
        });
      } catch {
        // 서버 연결 실패 시 무시 (오프라인 가능)
      }

      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          const token = await Notifications.getExpoPushTokenAsync();
          await DeviceApi.updatePushToken(deviceId, token.data);
        }
      } catch {
        // FCM 토큰 획득 실패 시 무시
      }
    }
    init();
  }, [storeSetDeviceId]);
}
