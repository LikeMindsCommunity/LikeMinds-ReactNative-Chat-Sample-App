import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Linking, Platform} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import store from './store';
import notifee from '@notifee/react-native';
import {getRoute} from './notifications/routes';
import * as RootNavigation from './RootNavigation';
import {parseDeepLink} from './components/ParseDeepLink';
import {DeepLinkRequest} from './components/ParseDeepLink/models';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {setupPlayer} from './audio';
import SwitchComponent from './navigation/SwitchComponent';
import {Credentials} from './credentials';
import {RealmProvider} from '@realm/react';
import {UserSchemaRO} from './db/schemas/UserSchema';

function LMChatApp(): JSX.Element {
  //To navigate onPress notification while android app is in background state / quit state.
  useEffect(() => {
    async function bootstrap() {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        let routes = getRoute(initialNotification?.notification?.data?.route);
        setTimeout(() => {
          RootNavigation.navigate(routes.route, routes.params);
        }, 1000);
      }
    }
    bootstrap();
  }, []);

  // to initialise track player
  useEffect(() => {
    async function setup() {
      await setupPlayer();
    }
    setup();
  }, []);

  return (
    <RealmProvider schema={[UserSchemaRO]}>
      <GestureHandlerRootView style={{flex: 1}}>
        <ReduxProvider store={store}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <SwitchComponent />
          </KeyboardAvoidingView>
        </ReduxProvider>
      </GestureHandlerRootView>
    </RealmProvider>
  );
}

export default LMChatApp;