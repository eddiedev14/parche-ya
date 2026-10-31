import { Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";

import { ExplorePage, MapPage, MyPlansPage } from "@/pages";
import { TAB_ITEMS } from "@/shared/helpers/constants";
import { ROUTES } from "./routes";

const TabsLayout = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path={ROUTES.explore} element={<ExplorePage />} />
      <Route path={ROUTES.map} element={<MapPage />} />
      <Route path={ROUTES.myPlans} element={<MyPlansPage />} />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      {TAB_ITEMS.map((item) => (
        <IonTabButton key={item.route} tab={item.route} href={item.route}>
          <IonIcon icon={item.icon} aria-hidden="true" />
          <IonLabel>{item.label}</IonLabel>
        </IonTabButton>
      ))}
    </IonTabBar>
  </IonTabs>
);

export default TabsLayout;
