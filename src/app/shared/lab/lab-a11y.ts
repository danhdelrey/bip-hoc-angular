import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

/** Globals cho bài luyện Accessibility: các directive tabs không kèm giao diện của @angular/aria. */
export function a11yExtras(): Record<string, unknown> {
  return { Tab, TabContent, TabList, TabPanel, Tabs };
}
